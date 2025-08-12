import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createConversation = mutation({
  args: {
    chatbotId: v.id("chatbots"),
    userIdentifier: v.string(),
    platform: v.union(
      v.literal("website"),
      v.literal("whatsapp"),
      v.literal("messenger"),
      v.literal("instagram")
    ),
    initialMessage: v.string(),
    context: v.object({
      user_location: v.optional(v.string()),
      user_language: v.optional(v.string()),
      referring_page: v.optional(v.string()),
      session_data: v.object({}),
    }),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const messageId = crypto.randomUUID();

    const conversationId = await ctx.db.insert("conversations", {
      chatbot_id: args.chatbotId,
      user_identifier: args.userIdentifier,
      platform: args.platform,
      messages: [{
        id: messageId,
        role: "user",
        content: args.initialMessage,
        timestamp: now,
      }],
      context: args.context,
      started_at: now,
      last_message_at: now,
      status: "active",
    });

    return { conversationId, messageId };
  },
});

export const addMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    metadata: v.optional(v.object({
      ai_model_used: v.optional(v.string()),
      response_time: v.optional(v.number()),
      confidence_score: v.optional(v.number()),
    })),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new Error("Conversation not found");

    const messageId = crypto.randomUUID();
    const now = Date.now();

    const newMessage = {
      id: messageId,
      role: args.role,
      content: args.content,
      timestamp: now,
      metadata: args.metadata,
    };

    await ctx.db.patch(args.conversationId, {
      messages: [...conversation.messages, newMessage],
      last_message_at: now,
    });

    return messageId;
  },
});

export const getConversation = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.conversationId);
  },
});

export const getActiveConversation = query({
  args: {
    chatbotId: v.id("chatbots"),
    userIdentifier: v.string(),
    platform: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("conversations")
      .withIndex("by_chatbot", (q) => q.eq("chatbot_id", args.chatbotId))
      .filter((q) =>
        q.and(
          q.eq(q.field("user_identifier"), args.userIdentifier),
          q.eq(q.field("platform"), args.platform),
          q.eq(q.field("status"), "active")
        )
      )
      .first();
  },
});