import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const create = mutation({
  args: {
    email: v.string(),
  },
  async handler(ctx, args) {
    // Step 1: Check authentication
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    // Step 2: Prevent sending request to yourself
    if (args.email.trim().toLowerCase() === identity.email?.toLowerCase()) {
      throw new ConvexError("Cannot create request to yourself");
    }

    // Step 3: Get current user
    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    // Step 4: Get receiver by email
    const receiver = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!receiver) {
      throw new ConvexError("Receiver not found");
    }

    // Step 5: Check if current user already sent request to this receiver
    const requestAlreadySent = await ctx.db
      .query("requests")
      .withIndex("by_receives_sender", (q) =>
        q.eq("receiver", receiver._id).eq("sender", currentUser._id)
      )
      .unique();

    if (requestAlreadySent) {
      throw new ConvexError("Request already sent");
    }

    // Step 6: Check if receiver already sent a request to current user
    const requestAlreadyReceived = await ctx.db
      .query("requests")
      .withIndex("by_receives_sender", (q) =>
        q.eq("receiver", currentUser._id).eq("sender", receiver._id)
      )
      .unique();

    if (requestAlreadyReceived) {
      throw new ConvexError("Request already received");
    }

    // Step 7: Create request
    const request = await ctx.db.insert("requests", {
      sender: currentUser._id,
      receiver: receiver._id,
    });

    return request;
  },
});
