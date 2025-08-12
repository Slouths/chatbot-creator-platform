import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    name: v.string(),
    subscriptionTier: v.union(v.literal("free"), v.literal("pro"), v.literal("enterprise")),
  },
  handler: async (ctx, args) => {
    const settings = getSettingsForTier(args.subscriptionTier);
    
    return await ctx.db.insert("organizations", {
      name: args.name,
      subscription_tier: args.subscriptionTier,
      created_at: Date.now(),
      settings,
    });
  },
});

export const get = query({
  args: { id: v.id("organizations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const addUser = mutation({
  args: {
    organizationId: v.id("organizations"),
    clerkUserId: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("admin"), v.literal("editor"), v.literal("viewer")),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", {
      clerk_user_id: args.clerkUserId,
      organization_id: args.organizationId,
      role: args.role,
      email: args.email,
      name: args.name,
      avatar_url: args.avatarUrl,
      created_at: Date.now(),
      last_active: Date.now(),
    });
  },
});

function getSettingsForTier(tier: "free" | "pro" | "enterprise") {
  switch (tier) {
    case "free":
      return {
        max_chatbots: 1,
        max_conversations_per_month: 100,
        custom_branding: false,
        api_access: false,
      };
    case "pro":
      return {
        max_chatbots: 5,
        max_conversations_per_month: 1000,
        custom_branding: true,
        api_access: true,
      };
    case "enterprise":
      return {
        max_chatbots: -1,
        max_conversations_per_month: -1,
        custom_branding: true,
        api_access: true,
      };
  }
}