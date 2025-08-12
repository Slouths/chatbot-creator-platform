import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    organizationId: v.id("organizations"),
    name: v.string(),
    contentType: v.union(v.literal("pdf"), v.literal("text"), v.literal("csv")),
    originalContent: v.string(),
    metadata: v.object({
      fileSize: v.optional(v.number()),
      url: v.optional(v.string()),
      source: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    // In a real implementation, you would:
    // 1. Process the content (clean, extract text, etc.)
    // 2. Generate embeddings using an AI service
    // 3. Store the processed content and embeddings
    
    const processedContent = processContent(args.originalContent, args.contentType);
    const embeddings = await generateEmbeddings(processedContent); // Placeholder

    const knowledgeBaseId = await ctx.db.insert("knowledge_bases", {
      organization_id: args.organizationId,
      name: args.name,
      content_type: args.contentType,
      original_content: args.originalContent,
      processed_content: processedContent,
      embeddings: embeddings,
      metadata: {
        file_size: args.metadata.fileSize,
        url: args.metadata.url,
        last_updated: Date.now(),
      },
      created_at: Date.now(),
    });

    // Track analytics event
    await ctx.db.insert("analytics_events", {
      organization_id: args.organizationId,
      event_type: "knowledge_base_created",
      event_data: {
        name: args.name,
        content_type: args.contentType,
        file_size: args.metadata.fileSize,
      },
      timestamp: Date.now(),
    });

    return knowledgeBaseId;
  },
});

export const createFromFiles = mutation({
  args: {
    organizationId: v.id("organizations"),
    files: v.array(v.object({
      name: v.string(),
      content: v.string(),
      contentType: v.union(v.literal("pdf"), v.literal("text"), v.literal("csv")),
      size: v.number(),
      source: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const knowledgeBaseIds: Id<"knowledge_bases">[] = [];
    
    for (const file of args.files) {
      const processedContent = processContent(file.content, file.contentType);
      const embeddings = await generateEmbeddings(processedContent); // Placeholder

      const knowledgeBaseId = await ctx.db.insert("knowledge_bases", {
        organization_id: args.organizationId,
        name: file.name,
        content_type: file.contentType,
        original_content: file.content,
        processed_content: processedContent,
        embeddings: embeddings,
        metadata: {
          file_size: file.size,
          last_updated: Date.now(),
        },
        created_at: Date.now(),
      });
      
      knowledgeBaseIds.push(knowledgeBaseId);
    }

    // Track analytics event
    await ctx.db.insert("analytics_events", {
      organization_id: args.organizationId,
      event_type: "knowledge_bases_bulk_created",
      event_data: {
        files_count: args.files.length,
        total_size: args.files.reduce((sum, f) => sum + f.size, 0),
        content_types: [...new Set(args.files.map(f => f.contentType))],
      },
      timestamp: Date.now(),
    });

    return knowledgeBaseIds;
  },
});

export const update = mutation({
  args: {
    id: v.id("knowledge_bases"),
    updates: v.object({
      name: v.optional(v.string()),
      originalContent: v.optional(v.string()),
      processedContent: v.optional(v.string()),
      embeddings: v.optional(v.array(v.array(v.number()))),
      metadata: v.optional(v.object({
        fileSize: v.optional(v.number()),
        url: v.optional(v.string()),
        source: v.optional(v.string()),
      })),
    }),
  },
  handler: async (ctx, args) => {
    const knowledgeBase = await ctx.db.get(args.id);
    if (!knowledgeBase) throw new Error("Knowledge base not found");

    const updateData: any = {
      metadata: {
        ...knowledgeBase.metadata,
        last_updated: Date.now(),
      },
    };

    if (args.updates.name) updateData.name = args.updates.name;
    if (args.updates.originalContent) updateData.original_content = args.updates.originalContent;
    if (args.updates.processedContent) updateData.processed_content = args.updates.processedContent;
    if (args.updates.embeddings) updateData.embeddings = args.updates.embeddings;
    if (args.updates.metadata) {
      updateData.metadata = {
        ...updateData.metadata,
        ...args.updates.metadata,
      };
    }

    await ctx.db.patch(args.id, updateData);

    // Track update event
    await ctx.db.insert("analytics_events", {
      organization_id: knowledgeBase.organization_id,
      event_type: "knowledge_base_updated",
      event_data: {
        knowledge_base_id: args.id,
        name: knowledgeBase.name,
        updates: args.updates,
      },
      timestamp: Date.now(),
    });

    return args.id;
  },
});

export const deleteKnowledgeBase = mutation({
  args: { id: v.id("knowledge_bases") },
  handler: async (ctx, args) => {
    const knowledgeBase = await ctx.db.get(args.id);
    if (!knowledgeBase) throw new Error("Knowledge base not found");

    // Track deletion event
    await ctx.db.insert("analytics_events", {
      organization_id: knowledgeBase.organization_id,
      event_type: "knowledge_base_deleted",
      event_data: {
        name: knowledgeBase.name,
        content_type: knowledgeBase.content_type,
        file_size: knowledgeBase.metadata.file_size,
      },
      timestamp: Date.now(),
    });

    // Remove from chatbots that reference this knowledge base
    const chatbots = await ctx.db
      .query("chatbots")
      .withIndex("by_organization", (q) => q.eq("organization_id", knowledgeBase.organization_id))
      .collect();

    for (const chatbot of chatbots) {
      if (chatbot.knowledge_base_ids.includes(args.id)) {
        const updatedIds = chatbot.knowledge_base_ids.filter(id => id !== args.id);
        await ctx.db.patch(chatbot._id, {
          knowledge_base_ids: updatedIds,
        });
      }
    }

    // Delete the knowledge base
    await ctx.db.delete(args.id);

    return args.id;
  },
});

export const get = query({
  args: { id: v.id("knowledge_bases") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByOrganization = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("knowledge_bases")
      .withIndex("by_organization", (q) => q.eq("organization_id", args.organizationId))
      .order("desc")
      .collect();
  },
});

export const search = query({
  args: {
    organizationId: v.id("organizations"),
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // In a real implementation, you would:
    // 1. Generate embeddings for the search query
    // 2. Use vector similarity search to find relevant content
    // 3. Return ranked results
    
    const knowledgeBases = await ctx.db
      .query("knowledge_bases")
      .withIndex("by_organization", (q) => q.eq("organization_id", args.organizationId))
      .collect();

    // Simple text search for now (would be replaced with vector search)
    const results = knowledgeBases
      .filter(kb => 
        kb.name.toLowerCase().includes(args.query.toLowerCase()) ||
        kb.processed_content.toLowerCase().includes(args.query.toLowerCase())
      )
      .map(kb => ({
        id: kb._id,
        name: kb.name,
        contentType: kb.content_type,
        relevance: calculateRelevance(kb, args.query), // Placeholder
        excerpt: extractExcerpt(kb.processed_content, args.query),
        metadata: kb.metadata,
      }))
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, args.limit || 10);

    return results;
  },
});

export const getStats = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    const knowledgeBases = await ctx.db
      .query("knowledge_bases")
      .withIndex("by_organization", (q) => q.eq("organization_id", args.organizationId))
      .collect();

    const totalFiles = knowledgeBases.length;
    const totalSize = knowledgeBases.reduce((sum, kb) => sum + (kb.metadata.file_size || 0), 0);
    
    const contentTypeStats = knowledgeBases.reduce((acc, kb) => {
      acc[kb.content_type] = (acc[kb.content_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentActivity = knowledgeBases
      .sort((a, b) => b.metadata.last_updated - a.metadata.last_updated)
      .slice(0, 10)
      .map(kb => ({
        id: kb._id,
        name: kb.name,
        contentType: kb.content_type,
        lastUpdated: kb.metadata.last_updated,
        fileSize: kb.metadata.file_size,
      }));

    return {
      overview: {
        totalFiles,
        totalSize: formatFileSize(totalSize),
        avgFileSize: totalFiles > 0 ? formatFileSize(totalSize / totalFiles) : "0 B",
      },
      breakdown: {
        contentTypeStats,
        sizeDistribution: {
          small: knowledgeBases.filter(kb => (kb.metadata.file_size || 0) < 1024 * 1024).length, // < 1MB
          medium: knowledgeBases.filter(kb => (kb.metadata.file_size || 0) >= 1024 * 1024 && (kb.metadata.file_size || 0) < 10 * 1024 * 1024).length, // 1MB - 10MB
          large: knowledgeBases.filter(kb => (kb.metadata.file_size || 0) >= 10 * 1024 * 1024).length, // > 10MB
        },
      },
      recentActivity,
    };
  },
});

// Helper functions
function processContent(content: string, contentType: string): string {
  // In a real implementation, this would:
  // - Extract text from PDFs, DOCs, etc.
  // - Clean and normalize the content
  // - Remove formatting, headers, footers
  // - Structure the content for better processing
  
  switch (contentType) {
    case "text":
    case "csv":
      return content.trim();
    case "pdf":
      // Placeholder - would use libraries like pdf-parse, mammoth, etc.
      return content.trim();
    default:
      return content.trim();
  }
}

async function generateEmbeddings(content: string): Promise<number[][]> {
  // In a real implementation, this would:
  // - Split content into chunks
  // - Call an AI service (OpenAI, Cohere, etc.) to generate embeddings
  // - Return the vector embeddings
  
  // Placeholder - returns empty array
  return [];
}

function calculateRelevance(knowledgeBase: any, query: string): number {
  // Placeholder relevance scoring
  // In reality, this would use vector similarity between query and content embeddings
  const queryLower = query.toLowerCase();
  const nameMatch = knowledgeBase.name.toLowerCase().includes(queryLower) ? 0.8 : 0;
  const contentMatch = knowledgeBase.processed_content.toLowerCase().includes(queryLower) ? 0.6 : 0;
  return nameMatch + contentMatch;
}

function extractExcerpt(content: string, query: string, maxLength: number = 200): string {
  const queryLower = query.toLowerCase();
  const index = content.toLowerCase().indexOf(queryLower);
  
  if (index === -1) {
    return content.substring(0, maxLength) + (content.length > maxLength ? "..." : "");
  }
  
  const start = Math.max(0, index - 50);
  const end = Math.min(content.length, index + query.length + 50);
  const excerpt = content.substring(start, end);
  
  return (start > 0 ? "..." : "") + excerpt + (end < content.length ? "..." : "");
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}
