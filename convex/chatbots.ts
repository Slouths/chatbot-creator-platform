import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    organizationId: v.id("organizations"),
    name: v.string(),
    description: v.string(),
    aiModel: v.union(v.literal("gpt-4"), v.literal("claude-3"), v.literal("custom")),
    personality: v.object({
      tone: v.string(),
      style: v.string(),
      greeting_message: v.string(),
      fallback_message: v.string(),
    }),
    industry: v.string(),
    primaryGoal: v.string(),
    targetAudience: v.string(),
    websiteUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check organization limits
    const organization = await ctx.db.get(args.organizationId);
    if (!organization) throw new Error("Organization not found");

    const existingBots = await ctx.db
      .query("chatbots")
      .withIndex("by_organization", (q) => q.eq("organization_id", args.organizationId))
      .collect();

    if (existingBots.length >= organization.settings.max_chatbots && organization.settings.max_chatbots !== -1) {
      throw new Error(`Maximum chatbots limit reached for ${organization.subscription_tier} plan`);
    }

    const chatbotId = await ctx.db.insert("chatbots", {
      organization_id: args.organizationId,
      name: args.name,
      description: args.description,
      ai_model: args.aiModel,
      personality: args.personality,
      knowledge_base_ids: [],
      conversation_flows: {
        nodes: [
          {
            id: "start",
            type: "start",
            data: {},
            position: { x: 250, y: 50 }
          }
        ],
        edges: []
      },
      deployment_settings: {
        website_enabled: false,
        whatsapp_enabled: false,
        messenger_enabled: false,
        instagram_enabled: false,
        widget_color: "#007bff",
        widget_position: "bottom-right",
      },
      is_active: false,
      created_at: Date.now(),
      updated_at: Date.now(),
    });

    // Track analytics event
    await ctx.db.insert("analytics_events", {
      organization_id: args.organizationId,
      chatbot_id: chatbotId,
      event_type: "chatbot_created",
      event_data: {
        name: args.name,
        ai_model: args.aiModel,
        industry: args.industry,
        primary_goal: args.primaryGoal,
        target_audience: args.targetAudience,
        website_url: args.websiteUrl,
      },
      timestamp: Date.now(),
    });

    return chatbotId;
  },
});

export const createWithFiles = mutation({
  args: {
    organizationId: v.id("organizations"),
    name: v.string(),
    description: v.string(),
    aiModel: v.union(v.literal("gpt-4"), v.literal("claude-3"), v.literal("custom")),
    personality: v.object({
      tone: v.string(),
      style: v.string(),
      greeting_message: v.string(),
      fallback_message: v.string(),
    }),
    industry: v.string(),
    primaryGoal: v.string(),
    targetAudience: v.string(),
    websiteUrl: v.optional(v.string()),
    files: v.array(v.object({
      name: v.string(),
      content: v.string(),
      contentType: v.union(v.literal("pdf"), v.literal("text"), v.literal("csv")),
      size: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    // Create the chatbot first
    const chatbotId = await ctx.db.insert("chatbots", {
      organization_id: args.organizationId,
      name: args.name,
      description: args.description,
      ai_model: args.aiModel,
      personality: args.personality,
      knowledge_base_ids: [],
      conversation_flows: {
        nodes: [
          {
            id: "start",
            type: "start",
            data: {},
            position: { x: 250, y: 50 }
          }
        ],
        edges: []
      },
      deployment_settings: {
        website_enabled: false,
        whatsapp_enabled: false,
        messenger_enabled: false,
        instagram_enabled: false,
        widget_color: "#007bff",
        widget_position: "bottom-right",
      },
      is_active: false,
      created_at: Date.now(),
      updated_at: Date.now(),
    });

    // Process and store files as knowledge bases
    const knowledgeBaseIds: Id<"knowledge_bases">[] = [];
    
    for (const file of args.files) {
      // In a real implementation, you'd process the file content
      // and generate embeddings using an AI service
      const knowledgeBaseId = await ctx.db.insert("knowledge_bases", {
        organization_id: args.organizationId,
        name: file.name,
        content_type: file.contentType,
        original_content: file.content,
        processed_content: file.content, // Simplified - would be processed/cleaned content
        embeddings: [], // Would contain actual embeddings
        metadata: {
          file_size: file.size,
          last_updated: Date.now(),
        },
        created_at: Date.now(),
      });
      
      knowledgeBaseIds.push(knowledgeBaseId);
    }

    // Update chatbot with knowledge base IDs
    await ctx.db.patch(chatbotId, {
      knowledge_base_ids: knowledgeBaseIds,
    });

    // Track analytics event
    await ctx.db.insert("analytics_events", {
      organization_id: args.organizationId,
      chatbot_id: chatbotId,
      event_type: "chatbot_created_with_files",
      event_data: {
        name: args.name,
        ai_model: args.aiModel,
        industry: args.industry,
        primary_goal: args.primaryGoal,
        target_audience: args.targetAudience,
        website_url: args.websiteUrl,
        files_count: args.files.length,
        total_size: args.files.reduce((sum, f) => sum + f.size, 0),
      },
      timestamp: Date.now(),
    });

    return { chatbotId, knowledgeBaseIds };
  },
});

export const update = mutation({
  args: {
    id: v.id("chatbots"),
    updates: v.object({
      name: v.optional(v.string()),
      description: v.optional(v.string()),
      personality: v.optional(v.object({
        tone: v.string(),
        style: v.string(),
        greeting_message: v.string(),
        fallback_message: v.string(),
      })),
      is_active: v.optional(v.boolean()),
      deployment_settings: v.optional(v.object({
        website_enabled: v.boolean(),
        whatsapp_enabled: v.boolean(),
        messenger_enabled: v.boolean(),
        instagram_enabled: v.boolean(),
        widget_color: v.string(),
        widget_position: v.string(),
      })),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      ...args.updates,
      updated_at: Date.now(),
    });

    // Track update event
    const chatbot = await ctx.db.get(args.id);
    if (chatbot) {
      await ctx.db.insert("analytics_events", {
        organization_id: chatbot.organization_id,
        chatbot_id: args.id,
        event_type: "chatbot_updated",
        event_data: args.updates,
        timestamp: Date.now(),
      });
    }

    return args.id;
  },
});

export const deleteChatbot = mutation({
  args: { id: v.id("chatbots") },
  handler: async (ctx, args) => {
    const chatbot = await ctx.db.get(args.id);
    if (!chatbot) throw new Error("Chatbot not found");

    // Track deletion event
    await ctx.db.insert("analytics_events", {
      organization_id: chatbot.organization_id,
      chatbot_id: args.id,
      event_type: "chatbot_deleted",
      event_data: {
        name: chatbot.name,
        ai_model: chatbot.ai_model,
      },
      timestamp: Date.now(),
    });

    // Delete related conversations
    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_chatbot", (q) => q.eq("chatbot_id", args.id))
      .collect();

    for (const conversation of conversations) {
      await ctx.db.delete(conversation._id);
    }

    // Delete related knowledge bases
    for (const knowledgeBaseId of chatbot.knowledge_base_ids) {
      await ctx.db.delete(knowledgeBaseId);
    }

    // Delete the chatbot
    await ctx.db.delete(args.id);

    return args.id;
  },
});

export const get = query({
  args: { id: v.id("chatbots") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByOrganization = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chatbots")
      .withIndex("by_organization", (q) => q.eq("organization_id", args.organizationId))
      .order("desc")
      .collect();
  },
});

export const getActiveByOrganization = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chatbots")
      .withIndex("by_organization", (q) => q.eq("organization_id", args.organizationId))
      .filter((q) => q.eq(q.field("is_active"), true))
      .order("desc")
      .collect();
  },
});

export const getStats = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    const chatbots = await ctx.db
      .query("chatbots")
      .withIndex("by_organization", (q) => q.eq("organization_id", args.organizationId))
      .collect();

    // Get conversations for this organization - fetch individually since inArray is not available
    const chatbotIds = chatbots.map(bot => bot._id);
    const conversations: any[] = [];
    
    for (const chatbotId of chatbotIds) {
      const chatbotConversations = await ctx.db
        .query("conversations")
        .withIndex("by_chatbot", (q) => q.eq("chatbot_id", chatbotId))
        .collect();
      conversations.push(...chatbotConversations);
    }

    const now = Date.now();
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);

    const weeklyConversations = conversations.filter(c => c.started_at >= oneWeekAgo);
    const monthlyConversations = conversations.filter(c => c.started_at >= oneMonthAgo);

    const totalSatisfaction = conversations
      .filter(c => c.satisfaction_rating)
      .reduce((sum, c) => sum + (c.satisfaction_rating || 0), 0);
    
    const avgSatisfaction = conversations.filter(c => c.satisfaction_rating).length > 0
      ? totalSatisfaction / conversations.filter(c => c.satisfaction_rating).length
      : 0;

    const platformStats = conversations.reduce((acc, conv) => {
      const platform = conv.platform;
      acc[platform] = (acc[platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalChatbots: chatbots.length,
      activeChatbots: chatbots.filter(bot => bot.is_active).length,
      totalConversations: conversations.length,
      weeklyConversations: weeklyConversations.length,
      monthlyConversations: monthlyConversations.length,
      avgSatisfaction: Math.round(avgSatisfaction * 10) / 10,
      platformDistribution: platformStats,
      recentActivity: conversations
        .sort((a, b) => b.last_message_at - a.last_message_at)
        .slice(0, 10)
        .map(conv => ({
          id: conv._id,
          chatbotId: conv.chatbot_id,
          platform: conv.platform,
          lastMessageAt: conv.last_message_at,
          status: conv.status,
        })),
    };
  },
});