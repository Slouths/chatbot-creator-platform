import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seedDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    // Create a demo organization
    const organizationId = await ctx.db.insert("organizations", {
      name: "Demo Company",
      subscription_tier: "pro",
      created_at: Date.now(),
      settings: {
        max_chatbots: 5,
        max_conversations_per_month: 1000,
        custom_branding: true,
        api_access: true,
      },
    });

    // Create demo chatbots
    const chatbot1 = await ctx.db.insert("chatbots", {
      organization_id: organizationId,
      name: "Customer Support Bot",
      description: "AI-powered customer support assistant for handling common inquiries and support tickets",
      ai_model: "gpt-4",
      personality: {
        tone: "professional",
        style: "helpful",
        greeting_message: "Hello! I'm your customer support assistant. How can I help you today?",
        fallback_message: "I'm sorry, I didn't understand that. Could you please rephrase your question?",
      },
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
        website_enabled: true,
        whatsapp_enabled: false,
        messenger_enabled: false,
        instagram_enabled: false,
        widget_color: "#007bff",
        widget_position: "bottom-right",
      },
      is_active: true,
      created_at: Date.now() - (7 * 24 * 60 * 60 * 1000), // 7 days ago
      updated_at: Date.now(),
    });

    const chatbot2 = await ctx.db.insert("chatbots", {
      organization_id: organizationId,
      name: "Sales Assistant",
      description: "Intelligent sales bot that helps qualify leads and provide product information",
      ai_model: "claude-3",
      personality: {
        tone: "enthusiastic",
        style: "persuasive",
        greeting_message: "Hi there! I'm excited to help you find the perfect solution. What brings you here today?",
        fallback_message: "I'd love to help you with that! Could you tell me a bit more about what you're looking for?",
      },
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
        website_enabled: true,
        whatsapp_enabled: true,
        messenger_enabled: false,
        instagram_enabled: false,
        widget_color: "#28a745",
        widget_position: "bottom-right",
      },
      is_active: true,
      created_at: Date.now() - (14 * 24 * 60 * 60 * 1000), // 14 days ago
      updated_at: Date.now(),
    });

    const chatbot3 = await ctx.db.insert("chatbots", {
      organization_id: organizationId,
      name: "FAQ Helper",
      description: "Knowledge base bot that answers frequently asked questions about products and services",
      ai_model: "gpt-4",
      personality: {
        tone: "friendly",
        style: "informative",
        greeting_message: "Hello! I'm here to answer your questions. What would you like to know?",
        fallback_message: "I'm not sure about that specific question. Let me connect you with a human agent who can help.",
      },
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
        website_enabled: true,
        whatsapp_enabled: false,
        messenger_enabled: false,
        instagram_enabled: false,
        widget_color: "#6f42c1",
        widget_position: "bottom-right",
      },
      is_active: false,
      created_at: Date.now() - (21 * 24 * 60 * 60 * 1000), // 21 days ago
      updated_at: Date.now(),
    });

    // Create demo conversations
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    // Customer Support Bot conversations
    for (let i = 0; i < 45; i++) {
      const conversationId = await ctx.db.insert("conversations", {
        chatbot_id: chatbot1,
        user_identifier: `user_${i + 1}`,
        platform: i % 3 === 0 ? "website" : i % 3 === 1 ? "whatsapp" : "messenger",
        messages: [
          {
            id: `msg_${i}_1`,
            role: "user",
            content: i % 3 === 0 ? "How do I reset my password?" : 
                     i % 3 === 1 ? "I can't access my account" : 
                     "Where is my order?",
            timestamp: now - (i * oneDay),
          },
          {
            id: `msg_${i}_2`,
            role: "assistant",
            content: i % 3 === 0 ? "I can help you reset your password. Please visit the login page and click 'Forgot Password'." :
                     i % 3 === 1 ? "I'm sorry to hear that. Let me help you troubleshoot your account access." :
                     "I'd be happy to help you track your order. Could you provide your order number?",
            timestamp: now - (i * oneDay) + 2000,
            metadata: {
              ai_model_used: "gpt-4",
              response_time: 2000,
              confidence_score: 0.9,
            },
          }
        ],
        context: {
          user_location: "United States",
          user_language: "en",
          referring_page: "/support",
          session_data: {},
        },
        started_at: now - (i * oneDay),
        last_message_at: now - (i * oneDay) + 2000,
        status: i % 4 === 0 ? "resolved" : i % 4 === 1 ? "escalated" : "active",
        satisfaction_rating: i % 3 === 0 ? 5 : i % 3 === 1 ? 4 : 3,
        feedback: i % 2 === 0 ? "Very helpful!" : "Good response time",
      });
    }

    // Sales Assistant conversations
    for (let i = 0; i < 32; i++) {
      const conversationId = await ctx.db.insert("conversations", {
        chatbot_id: chatbot2,
        user_identifier: `lead_${i + 1}`,
        platform: i % 2 === 0 ? "website" : "whatsapp",
        messages: [
          {
            id: `msg_sales_${i}_1`,
            role: "user",
            content: i % 2 === 0 ? "Tell me about your pricing plans" : "What features do you offer?",
            timestamp: now - (i * oneDay),
          },
          {
            id: `msg_sales_${i}_2`,
            role: "assistant",
            content: i % 2 === 0 ? "We offer several pricing tiers starting at $29/month. Would you like me to walk you through the options?" :
                     "Our platform includes AI-powered automation, analytics, and multi-channel support. What's most important to you?",
            timestamp: now - (i * oneDay) + 1500,
            metadata: {
              ai_model_used: "claude-3",
              response_time: 1500,
              confidence_score: 0.95,
            },
          }
        ],
        context: {
          user_location: "Canada",
          user_language: "en",
          referring_page: "/pricing",
          session_data: {},
        },
        started_at: now - (i * oneDay),
        last_message_at: now - (i * oneDay) + 1500,
        status: i % 3 === 0 ? "resolved" : "active",
        satisfaction_rating: i % 2 === 0 ? 5 : 4,
        feedback: "Great information!",
      });
    }

    // FAQ Helper conversations (inactive bot, fewer conversations)
    for (let i = 0; i < 8; i++) {
      const conversationId = await ctx.db.insert("conversations", {
        chatbot_id: chatbot3,
        user_identifier: `faq_user_${i + 1}`,
        platform: "website",
        messages: [
          {
            id: `msg_faq_${i}_1`,
            role: "user",
            content: "What are your business hours?",
            timestamp: now - (i * oneDay * 2),
          },
          {
            id: `msg_faq_${i}_2`,
            role: "assistant",
            content: "We're open Monday through Friday, 9 AM to 6 PM EST. We also offer 24/7 online support through our chatbot!",
            timestamp: now - (i * oneDay * 2) + 1000,
            metadata: {
              ai_model_used: "gpt-4",
              response_time: 1000,
              confidence_score: 0.98,
            },
          }
        ],
        context: {
          user_location: "United Kingdom",
          user_language: "en",
          referring_page: "/faq",
          session_data: {},
        },
        started_at: now - (i * oneDay * 2),
        last_message_at: now - (i * oneDay * 2) + 1000,
        status: "resolved",
        satisfaction_rating: 4,
        feedback: "Quick and helpful",
      });
    }

    // Create demo analytics events
    await ctx.db.insert("analytics_events", {
      organization_id: organizationId,
      event_type: "demo_data_seeded",
      event_data: {
        chatbots_created: 3,
        conversations_created: 85,
        total_messages: 170,
      },
      timestamp: now,
    });

    return {
      organizationId,
      chatbotsCreated: 3,
      conversationsCreated: 85,
      message: "Demo data seeded successfully!"
    };
  },
});

export const clearDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    // Get all organizations
    const organizations = await ctx.db.query("organizations").collect();
    
    for (const org of organizations) {
      // Get all chatbots for this organization
      const chatbots = await ctx.db
        .query("chatbots")
        .withIndex("by_organization", (q) => q.eq("organization_id", org._id))
        .collect();

      // Delete all conversations for these chatbots
      for (const chatbot of chatbots) {
        const conversations = await ctx.db
          .query("conversations")
          .withIndex("by_chatbot", (q) => q.eq("chatbot_id", chatbot._id))
          .collect();

        for (const conversation of conversations) {
          await ctx.db.delete(conversation._id);
        }

        // Delete the chatbot
        await ctx.db.delete(chatbot._id);
      }

      // Delete all analytics events
      const events = await ctx.db
        .query("analytics_events")
        .withIndex("by_organization", (q) => q.eq("organization_id", org._id))
        .collect();

      for (const event of events) {
        await ctx.db.delete(event._id);
      }

      // Delete the organization
      await ctx.db.delete(org._id);
    }

    return { message: "All demo data cleared successfully!" };
  },
});
