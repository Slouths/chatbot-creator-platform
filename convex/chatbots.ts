import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("chatbots", {
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
      .collect();
  },
});