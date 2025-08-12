import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const trackEvent = mutation({
  args: {
    organizationId: v.id("organizations"),
    chatbotId: v.optional(v.id("chatbots")),
    conversationId: v.optional(v.id("conversations")),
    eventType: v.string(),
    eventData: v.object({}),
    userIdentifier: v.optional(v.string()),
    platform: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("analytics_events", {
      organization_id: args.organizationId,
      chatbot_id: args.chatbotId,
      conversation_id: args.conversationId,
      event_type: args.eventType,
      event_data: args.eventData,
      timestamp: Date.now(),
      user_identifier: args.userIdentifier,
      platform: args.platform,
    });
  },
});

export const getOrganizationAnalytics = query({
  args: { 
    organizationId: v.id("organizations"),
    timeRange: v.union(v.literal("7d"), v.literal("30d"), v.literal("90d")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    let startTime: number;
    
    switch (args.timeRange) {
      case "7d":
        startTime = now - (7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startTime = now - (30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startTime = now - (90 * 24 * 60 * 60 * 1000);
        break;
    }

    // Get all events in time range
    const events = await ctx.db
      .query("analytics_events")
      .withIndex("by_organization", (q) => q.eq("organization_id", args.organizationId))
      .filter((q) => q.gte(q.field("timestamp"), startTime))
      .collect();

    // Get chatbots for this organization
    const chatbots = await ctx.db
      .query("chatbots")
      .withIndex("by_organization", (q) => q.eq("organization_id", args.organizationId))
      .collect();

    // Get conversations for this organization
    const chatbotIds = chatbots.map(bot => bot._id);
    const conversations: any[] = [];
    
    // Since inArray is not available, we'll fetch conversations for each chatbot
    for (const chatbotId of chatbotIds) {
      const chatbotConversations = await ctx.db
        .query("conversations")
        .withIndex("by_chatbot", (q) => q.eq("chatbot_id", chatbotId))
        .filter((q) => q.gte(q.field("started_at"), startTime))
        .collect();
      conversations.push(...chatbotConversations);
    }

    // Calculate metrics
    const totalEvents = events.length;
    const totalConversations = conversations.length;
    const totalChatbots = chatbots.length;
    const activeChatbots = chatbots.filter(bot => bot.is_active).length;

    // Event type breakdown
    const eventTypeCounts = events.reduce((acc, event) => {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Platform distribution
    const platformStats = conversations.reduce((acc, conv) => {
      const platform = conv.platform;
      acc[platform] = (acc[platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Daily trends
    const dailyStats = new Map<string, { conversations: number; events: number }>();
    
    for (let i = 0; i < Math.ceil((now - startTime) / (24 * 60 * 60 * 1000)); i++) {
      const date = new Date(startTime + (i * 24 * 60 * 60 * 1000));
      const dateKey = date.toISOString().split('T')[0];
      dailyStats.set(dateKey, { conversations: 0, events: 0 });
    }

    conversations.forEach(conv => {
      const dateKey = new Date(conv.started_at).toISOString().split('T')[0];
      const existing = dailyStats.get(dateKey);
      if (existing) {
        existing.conversations++;
        dailyStats.set(dateKey, existing);
      }
    });

    events.forEach(event => {
      const dateKey = new Date(event.timestamp).toISOString().split('T')[0];
      const existing = dailyStats.get(dateKey);
      if (existing) {
        existing.events++;
        dailyStats.set(dateKey, existing);
      }
    });

    // Satisfaction ratings
    const satisfactionRatings = conversations
      .filter(c => c.satisfaction_rating)
      .map(c => c.satisfaction_rating!);
    
    const avgSatisfaction = satisfactionRatings.length > 0
      ? satisfactionRatings.reduce((sum, rating) => sum + rating, 0) / satisfactionRatings.length
      : 0;

    // Response time analysis
    const responseTimes = conversations
      .filter(c => c.messages.length > 1)
      .map(conv => {
        const userMessage = conv.messages.find((m: any) => m.role === "user");
        const assistantMessage = conv.messages.find((m: any) => m.role === "assistant");
        if (userMessage && assistantMessage) {
          return assistantMessage.timestamp - userMessage.timestamp;
        }
        return 0;
      })
      .filter(time => time > 0);

    const avgResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
      : 0;

    // Top performing chatbots
    const chatbotPerformance = chatbots.map(bot => {
      const botConversations = conversations.filter(c => c.chatbot_id === bot._id);
      const botSatisfaction = botConversations
        .filter(c => c.satisfaction_rating)
        .map(c => c.satisfaction_rating!);
      
      return {
        id: bot._id,
        name: bot.name,
        conversations: botConversations.length,
        avgSatisfaction: botSatisfaction.length > 0
          ? botSatisfaction.reduce((sum, rating) => sum + rating, 0) / botSatisfaction.length
          : 0,
        isActive: bot.is_active,
      };
    }).sort((a, b) => b.conversations - a.conversations);

    return {
      overview: {
        totalEvents,
        totalConversations,
        totalChatbots,
        activeChatbots,
        avgSatisfaction: Math.round(avgSatisfaction * 10) / 10,
        avgResponseTime: Math.round(avgResponseTime / 1000), // Convert to seconds
      },
      trends: {
        dailyStats: Array.from(dailyStats.entries()).map(([date, stats]) => ({
          date,
          conversations: stats.conversations,
          events: stats.events,
        })),
        eventTypeBreakdown: eventTypeCounts,
        platformDistribution: platformStats,
      },
      performance: {
        chatbotPerformance,
        satisfactionDistribution: {
          excellent: satisfactionRatings.filter(r => r >= 4.5).length,
          good: satisfactionRatings.filter(r => r >= 3.5 && r < 4.5).length,
          average: satisfactionRatings.filter(r => r >= 2.5 && r < 3.5).length,
          poor: satisfactionRatings.filter(r => r < 2.5).length,
        },
        responseTimeDistribution: {
          instant: responseTimes.filter(t => t < 1000).length, // < 1 second
          fast: responseTimes.filter(t => t >= 1000 && t < 5000).length, // 1-5 seconds
          normal: responseTimes.filter(t => t >= 5000 && t < 15000).length, // 5-15 seconds
          slow: responseTimes.filter(t => t >= 15000).length, // > 15 seconds
        },
        recentActivity: conversations
          .sort((a, b) => b.last_message_at - a.last_message_at)
          .slice(0, 20)
          .map(conv => ({
            id: conv._id,
            userIdentifier: conv.user_identifier,
            platform: conv.platform,
            messageCount: conv.messages.length,
            startedAt: conv.started_at,
            lastMessageAt: conv.last_message_at,
            status: conv.status,
            satisfactionRating: conv.satisfaction_rating,
          })),
      },
      insights: generateInsights(events, conversations, chatbots, args.timeRange),
    };
  },
});

export const getChatbotAnalytics = query({
  args: { 
    chatbotId: v.id("chatbots"),
    timeRange: v.union(v.literal("7d"), v.literal("30d"), v.literal("90d")),
  },
  handler: async (ctx, args) => {
    const chatbot = await ctx.db.get(args.chatbotId);
    if (!chatbot) throw new Error("Chatbot not found");

    const now = Date.now();
    let startTime: number;
    
    switch (args.timeRange) {
      case "7d":
        startTime = now - (7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startTime = now - (30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startTime = now - (90 * 24 * 60 * 60 * 1000);
        break;
    }

    // Get chatbot-specific events
    const events = await ctx.db
      .query("analytics_events")
      .withIndex("by_chatbot", (q) => q.eq("chatbot_id", args.chatbotId))
      .filter((q) => q.gte(q.field("timestamp"), startTime))
      .collect();

    // Get chatbot conversations
    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_chatbot", (q) => q.eq("chatbot_id", args.chatbotId))
      .filter((q) => q.gte(q.field("started_at"), startTime))
      .collect();

    // Calculate metrics
    const totalConversations = conversations.length;
    const totalMessages = conversations.reduce((sum, conv) => sum + conv.messages.length, 0);
    const uniqueUsers = new Set(conversations.map(c => c.user_identifier)).size;

    // Platform breakdown
    const platformStats = conversations.reduce((acc, conv) => {
      const platform = conv.platform;
      acc[platform] = (acc[platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Hourly activity
    const hourlyActivity = new Array(24).fill(0);
    conversations.forEach(conv => {
      const hour = new Date(conv.started_at).getHours();
      hourlyActivity[hour]++;
    });

    // Conversation flow analysis
    const conversationLengths = conversations.map(c => c.messages.length);
    const avgConversationLength = conversationLengths.length > 0
      ? conversationLengths.reduce((sum, len) => sum + len, 0) / conversationLengths.length
      : 0;

    // Satisfaction analysis
    const satisfactionRatings = conversations
      .filter(c => c.satisfaction_rating)
      .map(c => c.satisfaction_rating!);
    
    const avgSatisfaction = satisfactionRatings.length > 0
      ? satisfactionRatings.reduce((sum, rating) => sum + rating, 0) / satisfactionRatings.length
      : 0;

    // Response time analysis
    const responseTimes = conversations
      .filter(c => c.messages.length > 1)
      .map(conv => {
        const userMessage = conv.messages.find((m: any) => m.role === "user");
        const assistantMessage = conv.messages.find((m: any) => m.role === "assistant");
        if (userMessage && assistantMessage) {
          return assistantMessage.timestamp - userMessage.timestamp;
        }
        return 0;
      })
      .filter(time => time > 0);

    const avgResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
      : 0;

    return {
      overview: {
        name: chatbot.name,
        totalConversations,
        totalMessages,
        uniqueUsers,
        avgSatisfaction: Math.round(avgSatisfaction * 10) / 10,
        avgResponseTime: Math.round(avgResponseTime / 1000),
        avgConversationLength: Math.round(avgConversationLength * 10) / 10,
      },
      trends: {
        hourlyActivity,
        platformDistribution: platformStats,
        conversationLengthDistribution: {
          short: conversationLengths.filter(l => l <= 3).length,
          medium: conversationLengths.filter(l => l > 3 && l <= 10).length,
          long: conversationLengths.filter(l => l > 10).length,
        },
      },
      performance: {
        satisfactionDistribution: {
          excellent: satisfactionRatings.filter(r => r >= 4.5).length,
          good: satisfactionRatings.filter(r => r >= 3.5 && r < 4.5).length,
          average: satisfactionRatings.filter(r => r >= 2.5 && r < 3.5).length,
          poor: satisfactionRatings.filter(r => r < 2.5).length,
        },
        responseTimeDistribution: {
          instant: responseTimes.filter(t => t < 1000).length,
          fast: responseTimes.filter(t => t >= 1000 && t < 5000).length,
          normal: responseTimes.filter(t => t >= 5000 && t < 15000).length,
          slow: responseTimes.filter(t => t >= 15000).length,
        },
      },
      recentActivity: conversations
        .sort((a, b) => b.last_message_at - a.last_message_at)
        .slice(0, 20)
        .map(conv => ({
          id: conv._id,
          userIdentifier: conv.user_identifier,
          platform: conv.platform,
          messageCount: conv.messages.length,
          startedAt: conv.started_at,
          lastMessageAt: conv.last_message_at,
          status: conv.status,
          satisfactionRating: conv.satisfaction_rating,
        })),
    };
  },
});

function generateInsights(
  events: any[],
  conversations: any[],
  chatbots: any[],
  timeRange: string
) {
  const insights = [];

  // Bot creation insights
  const botCreationEvents = events.filter(e => e.event_type === "chatbot_created");
  if (botCreationEvents.length > 0) {
    insights.push({
      type: "success",
      title: "Bot Creation Activity",
      message: `${botCreationEvents.length} new chatbot(s) created in the last ${timeRange}`,
      icon: "🤖",
    });
  }

  // Conversation insights
  if (conversations.length > 0) {
    const avgMessagesPerConversation = conversations.reduce((sum, c) => sum + c.messages.length, 0) / conversations.length;
    
    if (avgMessagesPerConversation > 5) {
      insights.push({
        type: "info",
        title: "Engaging Conversations",
        message: `Users are having detailed conversations with an average of ${Math.round(avgMessagesPerConversation)} messages per chat`,
        icon: "💬",
      });
    }

    const satisfactionRatings = conversations.filter(c => c.satisfaction_rating).map(c => c.satisfaction_rating!);
    if (satisfactionRatings.length > 0) {
      const avgSatisfaction = satisfactionRatings.reduce((sum, r) => sum + r, 0) / satisfactionRatings.length;
      if (avgSatisfaction >= 4.5) {
        insights.push({
          type: "success",
          title: "High Satisfaction",
          message: `Excellent user satisfaction with an average rating of ${Math.round(avgSatisfaction * 10) / 10}/5`,
          icon: "⭐",
        });
      }
    }
  }

  // Platform insights
  const platformCounts = conversations.reduce((acc, c) => {
    acc[c.platform] = (acc[c.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topPlatform = Object.entries(platformCounts).sort(([,a], [,b]) => (b as number) - (a as number))[0];
  if (topPlatform) {
    insights.push({
      type: "info",
      title: "Top Platform",
      message: `${topPlatform[0]} is your most active platform with ${topPlatform[1]} conversations`,
      icon: "📱",
    });
  }

  // Performance insights
  if (chatbots.length > 0) {
    const activeBots = chatbots.filter(b => b.is_active).length;
    const inactiveBots = chatbots.length - activeBots;
    
    if (inactiveBots > 0) {
      insights.push({
        type: "warning",
        title: "Inactive Bots",
        message: `${inactiveBots} chatbot(s) are currently inactive. Consider activating them to increase engagement.`,
        icon: "⚠️",
      });
    }
  }

  return insights;
}
