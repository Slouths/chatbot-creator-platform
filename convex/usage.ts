import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Track a conversation for usage
export const trackConversation = mutation({
  args: {
    organizationId: v.id("organizations"),
    chatbotId: v.id("chatbots"),
    userId: v.optional(v.string()),
    platform: v.union(v.literal("website"), v.literal("whatsapp"), v.literal("messenger"), v.literal("instagram")),
    messageCount: v.number(),
  },
  handler: async (ctx, args) => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    // Check if usage record exists for this month
    const existingUsage = await ctx.db
      .query("usage")
      .filter((q) => 
        q.and(
          q.eq(q.field("organizationId"), args.organizationId),
          q.eq(q.field("period"), currentMonth)
        )
      )
      .first();

    if (existingUsage) {
      // Update existing usage
      await ctx.db.patch(existingUsage._id, {
        conversations: existingUsage.conversations + 1,
        messages: existingUsage.messages + args.messageCount,
        lastUpdated: now.toISOString(),
      });
    } else {
      // Create new usage record
      await ctx.db.insert("usage", {
        organizationId: args.organizationId,
        period: currentMonth,
        conversations: 1,
        messages: args.messageCount,
        apiCalls: 0,
        createdAt: now.toISOString(),
        lastUpdated: now.toISOString(),
      });
    }

    // Also create a conversation record for analytics
    await ctx.db.insert("conversations", {
      organizationId: args.organizationId,
      chatbotId: args.chatbotId,
      userId: args.userId,
      platform: args.platform,
      messageCount: args.messageCount,
      startTime: now.toISOString(),
      endTime: now.toISOString(),
      satisfaction: null,
      resolved: true,
      tags: [],
    });
  },
});

// Track API usage
export const trackApiCall = mutation({
  args: {
    organizationId: v.id("organizations"),
    endpoint: v.string(),
    method: v.string(),
  },
  handler: async (ctx, args) => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    // Check if usage record exists for this month
    const existingUsage = await ctx.db
      .query("usage")
      .filter((q) => 
        q.and(
          q.eq(q.field("organizationId"), args.organizationId),
          q.eq(q.field("period"), currentMonth)
        )
      )
      .first();

    if (existingUsage) {
      // Update existing usage
      await ctx.db.patch(existingUsage._id, {
        apiCalls: existingUsage.apiCalls + 1,
        lastUpdated: now.toISOString(),
      });
    } else {
      // Create new usage record
      await ctx.db.insert("usage", {
        organizationId: args.organizationId,
        period: currentMonth,
        conversations: 0,
        messages: 0,
        apiCalls: 1,
        createdAt: now.toISOString(),
        lastUpdated: now.toISOString(),
      });
    }
  },
});

// Get current usage for an organization
export const getCurrentUsage = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    const usage = await ctx.db
      .query("usage")
      .filter((q) => 
        q.and(
          q.eq(q.field("organizationId"), args.organizationId),
          q.eq(q.field("period"), currentMonth)
        )
      )
      .first();

    // Get chatbot count
    const chatbots = await ctx.db
      .query("chatbots")
      .filter((q) => q.eq(q.field("organizationId"), args.organizationId))
      .collect();

    return {
      chatbots: chatbots.length,
      conversations: usage?.conversations || 0,
      messages: usage?.messages || 0,
      apiCalls: usage?.apiCalls || 0,
      period: currentMonth,
    };
  },
});

// Get usage history for an organization
export const getUsageHistory = query({
  args: {
    organizationId: v.id("organizations"),
    months: v.optional(v.number()), // Number of months to retrieve (default: 12)
  },
  handler: async (ctx, args) => {
    const months = args.months || 12;
    const now = new Date();
    const history = [];

    for (let i = 0; i < months; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const usage = await ctx.db
        .query("usage")
        .filter((q) => 
          q.and(
            q.eq(q.field("organizationId"), args.organizationId),
            q.eq(q.field("period"), period)
          )
        )
        .first();

      history.push({
        period,
        conversations: usage?.conversations || 0,
        messages: usage?.messages || 0,
        apiCalls: usage?.apiCalls || 0,
      });
    }

    return history.reverse(); // Return oldest first
  },
});

// Check if organization has exceeded limits
export const checkUsageLimits = query({
  args: {
    organizationId: v.id("organizations"),
    plan: v.union(v.literal("free"), v.literal("pro"), v.literal("enterprise")),
  },
  handler: async (ctx, args) => {
    const usage = await getCurrentUsage(ctx, { organizationId: args.organizationId });
    
    const limits = {
      free: {
        chatbots: 1,
        conversations: 100,
        apiCalls: 1000,
      },
      pro: {
        chatbots: 5,
        conversations: 1000,
        apiCalls: 25000,
      },
      enterprise: {
        chatbots: Infinity,
        conversations: Infinity,
        apiCalls: Infinity,
      },
    };

    const planLimits = limits[args.plan];
    
    return {
      chatbots: {
        current: usage.chatbots,
        limit: planLimits.chatbots,
        exceeded: usage.chatbots > planLimits.chatbots,
        percentage: planLimits.chatbots === Infinity ? 0 : (usage.chatbots / planLimits.chatbots) * 100,
      },
      conversations: {
        current: usage.conversations,
        limit: planLimits.conversations,
        exceeded: usage.conversations > planLimits.conversations,
        percentage: planLimits.conversations === Infinity ? 0 : (usage.conversations / planLimits.conversations) * 100,
      },
      apiCalls: {
        current: usage.apiCalls,
        limit: planLimits.apiCalls,
        exceeded: usage.apiCalls > planLimits.apiCalls,
        percentage: planLimits.apiCalls === Infinity ? 0 : (usage.apiCalls / planLimits.apiCalls) * 100,
      },
    };
  },
});

// Reset usage for testing (development only)
export const resetUsage = mutation({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    const existingUsage = await ctx.db
      .query("usage")
      .filter((q) => 
        q.and(
          q.eq(q.field("organizationId"), args.organizationId),
          q.eq(q.field("period"), currentMonth)
        )
      )
      .first();

    if (existingUsage) {
      await ctx.db.patch(existingUsage._id, {
        conversations: 0,
        messages: 0,
        apiCalls: 0,
        lastUpdated: now.toISOString(),
      });
    }
  },
});
