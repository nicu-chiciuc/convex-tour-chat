import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    // Grab the most recent messages.
    const messages = await ctx.db.query("messages").order("desc").take(100);
    
    messages.forEach(message => {
      // replace ':)' with '😊' in message.body
      message.body = message.body.replaceAll(':)', '-');
    })

    // Reverse the list so that it's in a chronological order.
    return messages.reverse();
  },
});

export const send = mutation({
  args: { body: v.string(), author: v.string() },
  handler: async (ctx, { body, author }) => {
    // Send a new message.
    await ctx.db.insert("messages", { body, author });
  },
});

export const like = mutation({
  args: { liker:
    v.string()
     ,messageId: v.id("messages") },
  handler: async (ctx, { messageId, liker }) => {
    // Like a message.
    await ctx.db.insert("likes", { messageId, liker });
  },
});
