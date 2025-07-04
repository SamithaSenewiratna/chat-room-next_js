import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { request } from "http";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    email: v.string(),
  })
    .index("by_email", ["email"])
    .index("by_clerkId", ["clerkId"]),

  requests: defineTable({
      sender: v.id("users"),
      receiver: v.id("users"),

  }).index("by_receives",["receiver"]),
  
    messages: defineTable({
    body: v.string(),
    author: v.string(), 
    createdAt: v.number(), 
  }).index("by_author", ["author"]),
});
