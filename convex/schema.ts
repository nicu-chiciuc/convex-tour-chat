import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";

import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  messages: defineTable({
    author: v.optional(v.string()),
    authorId: v.optional(v.id("users")),
    body: v.string(),
  }),

  likes: defineTable({
    liker: v.string(),
    messageId: v.id("messages"),
  }).index("byMessageId", ["messageId"]),
});
