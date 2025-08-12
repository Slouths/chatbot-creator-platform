import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  organizations: defineTable({
    name: v.string(),
    subscription_tier: v.union(v.literal("free"), v.literal("pro"), v.literal("enterprise")),
    created_at: v.number(),
    settings: v.object({
      max_chatbots: v.number(),
      max_conversations_per_month: v.number(),
      custom_branding: v.boolean(),
      api_access: v.boolean(),
    }),
    stripe_customer_id: v.optional(v.string()),
    stripe_subscription_id: v.optional(v.string()),
  }).index("by_stripe_customer", ["stripe_customer_id"]),

  users: defineTable({
    clerk_user_id: v.string(),
    organization_id: v.id("organizations"),
    role: v.union(v.literal("admin"), v.literal("editor"), v.literal("viewer")),
    email: v.string(),
    name: v.string(),
    avatar_url: v.optional(v.string()),
    created_at: v.number(),
    last_active: v.number(),
  }).index("by_clerk_user", ["clerk_user_id"])
    .index("by_organization", ["organization_id"]),

  chatbots: defineTable({
    organization_id: v.id("organizations"),
    name: v.string(),
    description: v.string(),
    ai_model: v.union(v.literal("gpt-4"), v.literal("claude-3"), v.literal("custom")),
    personality: v.object({
      tone: v.string(),
      style: v.string(),
      greeting_message: v.string(),
      fallback_message: v.string(),
    }),
    knowledge_base_ids: v.array(v.id("knowledge_bases")),
    conversation_flows: v.object({
      nodes: v.array(v.any()),
      edges: v.array(v.any()),
    }),
    deployment_settings: v.object({
      website_enabled: v.boolean(),
      whatsapp_enabled: v.boolean(),
      messenger_enabled: v.boolean(),
      instagram_enabled: v.boolean(),
      widget_color: v.string(),
      widget_position: v.string(),
    }),
    is_active: v.boolean(),
    created_at: v.number(),
    updated_at: v.number(),
  }).index("by_organization", ["organization_id"])
    .index("by_active", ["is_active"]),

  conversations: defineTable({
    chatbot_id: v.id("chatbots"),
    user_identifier: v.string(),
    platform: v.union(
      v.literal("website"),
      v.literal("whatsapp"),
      v.literal("messenger"),
      v.literal("instagram")
    ),
    messages: v.array(v.object({
      id: v.string(),
      role: v.union(v.literal("user"), v.literal("assistant")),
      content: v.string(),
      timestamp: v.number(),
      metadata: v.optional(v.object({
        ai_model_used: v.optional(v.string()),
        response_time: v.optional(v.number()),
        confidence_score: v.optional(v.number()),
      })),
    })),
    context: v.object({
      user_location: v.optional(v.string()),
      user_language: v.optional(v.string()),
      referring_page: v.optional(v.string()),
      session_data: v.any(),
    }),
    started_at: v.number(),
    last_message_at: v.number(),
    status: v.union(
      v.literal("active"),
      v.literal("resolved"),
      v.literal("escalated"),
      v.literal("abandoned")
    ),
    satisfaction_rating: v.optional(v.number()),
    feedback: v.optional(v.string()),
  }).index("by_chatbot", ["chatbot_id"])
    .index("by_status", ["status"])
    .index("by_platform", ["platform"]),

  knowledge_bases: defineTable({
    organization_id: v.id("organizations"),
    name: v.string(),
    content_type: v.union(v.literal("pdf"), v.literal("url"), v.literal("text"), v.literal("csv")),
    original_content: v.string(),
    processed_content: v.string(),
    embeddings: v.array(v.array(v.number())),
    metadata: v.object({
      file_size: v.optional(v.number()),
      url: v.optional(v.string()),
      last_updated: v.number(),
    }),
    created_at: v.number(),
  }).index("by_organization", ["organization_id"]),

  analytics_events: defineTable({
    organization_id: v.id("organizations"),
    chatbot_id: v.optional(v.id("chatbots")),
    conversation_id: v.optional(v.id("conversations")),
    event_type: v.string(),
    event_data: v.any(),
    timestamp: v.number(),
    user_identifier: v.optional(v.string()),
    platform: v.optional(v.string()),
  }).index("by_organization", ["organization_id"])
    .index("by_chatbot", ["chatbot_id"])
    .index("by_timestamp", ["timestamp"]),

  deployments: defineTable({
    chatbot_id: v.id("chatbots"),
    platform: v.string(),
    config: v.any(),
    status: v.union(
      v.literal("pending"),
      v.literal("deployed"),
      v.literal("failed"),
      v.literal("disabled")
    ),
    deployment_url: v.optional(v.string()),
    webhook_url: v.optional(v.string()),
    last_deployed: v.number(),
    created_at: v.number(),
  }).index("by_chatbot", ["chatbot_id"])
    .index("by_platform", ["platform"]),
});