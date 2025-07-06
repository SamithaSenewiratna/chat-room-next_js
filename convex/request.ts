import { ConvexError ,v} from "convex/values";
import { mutation } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const create = mutation({
  args:{
     email:v.string()
  },
  async handler(ctx, args) {
      const identity = await ctx.auth.getUserIdentity()
       if(!identity){
         throw new ConvexError("Unauthorized")
       }
       if(args.email === identity.email){
        throw new ConvexError("Cannot create request to Yourself")
       }

       const currentUser = await 
       getUserByClerkId({
          ctx,clerkId:identity.subject
       })
       if(!currentUser){
         throw new ConvexError("User not found")
       }
       const receiver = await ctx.db.query
        ("users").withIndex("by_email", (q) =>
          q.eq("email", args.email)
        ).unique();

         if(!receiver){
            throw new ConvexError("Receiver not found")
         }
        const requestAlreadySent =  await ctx.db.query("requests")
        .withIndex("by_receives_sender", (q) =>
          q.eq("receiver", receiver._id)
           .eq("sender", currentUser._id)
        ).unique();

        if(requestAlreadySent){
          throw new ConvexError("Request already sent")
        }

        const requestAlreadyReceiver = await ctx.db
        .query("requests")
        .withIndex("by_receives", (q) =>
          q.eq("receiver", currentUser._id)
        //   .eq("sender", receiver._id)
       ); 
       
        if(requestAlreadyReceiver){
          throw new ConvexError("Request already received")
        }

       const request = await ctx.db.insert("requests", {
         sender: currentUser._id,
         receiver: receiver._id,
       });
       return request;
    }
});