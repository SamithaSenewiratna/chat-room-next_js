import { HttpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { internal } from "./_generated/api";
import { Webhook } from "svix";

const validatePayload = async (req: Request): Promise<WebhookEvent> => {
  const payload = await req.text();

  const svixHeader = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };

  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  try {
    const event = webhook.verify(payload, svixHeader) as WebhookEvent;
    return event;
  } catch (error) {
    console.error("Webhook verification failed:", error);
    throw new Error("Invalid webhook payload");
  }
};

const handleClerkWebhook = httpAction(async (ctx, req) => {
  let event: WebhookEvent;

  try {
    event = await validatePayload(req);
  } catch {
    return new Response("Could not validate Clerk payload", {
      status: 400,
    });
  }

  switch (event.type) {
    case "user.created": {
      const user = await ctx.runQuery(internal.user.get, {
        clerkId: event.data.id,
      });

      if (user) {
        console.log(`User already exists: ${event.data.id}`);
        break;
      }

      console.log("Creating new user: ", event.data.id);

      await ctx.runMutation(internal.user.create, {
        username: event.data.username || "",
        imageUrl: event.data.image_url || "",
        clerkId: event.data.id,
        email: event.data.email_addresses[0]?.email_address || "",
      });

      break;
    }

    case "user.updated": {
      console.log("Updating user: ", event.data.id);

      await ctx.runMutation(internal.user.create, {
        username: event.data.username || "",
        imageUrl: event.data.image_url || "",
        clerkId: event.data.id,
        email: event.data.email_addresses[0]?.email_address || "",
      });

      break;
    }

    default: {
      console.log("Unsupported Clerk event type:", event.type);
      break;
    }
  }

  return new Response(null, { status: 200 });
});

const http = new HttpRouter();

http.route({
  path: "/clerk-users-webhook", //  fix route name
  method: "POST",
  handler: handleClerkWebhook,
});

export default http; 
