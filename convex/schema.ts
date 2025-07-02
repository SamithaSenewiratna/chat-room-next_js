import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    email: v.string(),
  })
    .index("by_email", ["email"])
    .index("by_clerkId", ["clerkId"]),

  messages: defineTable({
    body: v.string(),
    author: v.string(), 
    createdAt: v.number(), 
  }).index("by_author", ["author"]),
});
