import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async ({ db }) => {
    // Grab the most recent messages.
    const messages = await db.query("messages").order("desc").take(100);

    return messages;
  },
});

export const send = mutation({
  args: { body: v.string(), author: v.string() },
  handler: async ({ db }, { body, author }) => {
    // Send a new message.
    await db.insert("messages", { body, author });
  },
});
