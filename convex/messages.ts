import { api } from "./_generated/api";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    // Grab the most recent messages.
    const messages = await ctx.db.query("messages").order("desc").take(100);

    const messagesWithLikes = await Promise.all(
      messages.map(async (message) => {
        // Find the likes for each message
        const likes = await ctx.db
          .query("likes")
          .withIndex("byMessageId", (q) => q.eq("messageId", message._id))
          .collect();
        // Join the count of likes with the message data
        return {
          ...message,
          likes: likes.length,
        };
      }),
    );

    // Reverse the list so that it's in a chronological order.
    return messagesWithLikes.reverse().map((message) => ({
      ...message,
      // Format smileys
      body: message.body.replaceAll(":)", "😊"),
    }));
  },
});

export const send = mutation({
  args: {
    body: v.string(),
    authorId: v.optional(v.id("users")),
    author: v.optional(v.string()),
  },
  handler: async (ctx, { body, authorId, author }) => {
    if (!author && !authorId) {
      throw new Error("Author or authorId must be provided");
    }

    if (authorId && author) {
      throw new Error("Only one of author or authorId should be provided");
    }

    // Send a new message.
    await ctx.db.insert("messages", { body, authorId, author });

    if (body.startsWith("@ai") && author !== "AI") {
      // Schedule the chat action to run immediately
      await ctx.scheduler.runAfter(0, api.ai.chat, {
        messageBody: body,
      });
    }
  },
});

export const like = mutation({
  args: { liker: v.string(), messageId: v.id("messages") },
  handler: async (ctx, { messageId, liker }) => {
    // Like a message.
    await ctx.db.insert("likes", { messageId, liker });
  },
});
