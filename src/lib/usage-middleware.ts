import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export interface UsageLimits {
  chatbots: number
  conversations: number
  apiCalls: number
}

export interface UsageCheck {
  allowed: boolean
  reason?: string
  currentUsage?: any
  limits?: UsageLimits
}

// Check if organization can create a new chatbot
export async function checkChatbotCreationLimit(organizationId: Id<"organizations">): Promise<UsageCheck> {
  try {
    const organization = await convex.query(api.organizations.get, { id: organizationId })
    if (!organization) {
      return { allowed: false, reason: 'Organization not found' }
    }

    const usageLimits = await convex.query(api.usage.checkUsageLimits, {
      organizationId,
      plan: organization.subscription_tier
    })

    if (usageLimits.chatbots.exceeded) {
      return {
        allowed: false,
        reason: `Chatbot limit exceeded. Current: ${usageLimits.chatbots.current}, Limit: ${usageLimits.chatbots.limit}`,
        currentUsage: usageLimits,
        limits: {
          chatbots: usageLimits.chatbots.limit,
          conversations: usageLimits.conversations.limit,
          apiCalls: usageLimits.apiCalls.limit,
        }
      }
    }

    return { allowed: true, currentUsage: usageLimits }
  } catch (error) {
    console.error('Error checking chatbot creation limit:', error)
    return { allowed: false, reason: 'Error checking limits' }
  }
}

// Check if organization can start a new conversation
export async function checkConversationLimit(organizationId: Id<"organizations">): Promise<UsageCheck> {
  try {
    const organization = await convex.query(api.organizations.get, { id: organizationId })
    if (!organization) {
      return { allowed: false, reason: 'Organization not found' }
    }

    const usageLimits = await convex.query(api.usage.checkUsageLimits, {
      organizationId,
      plan: organization.subscription_tier
    })

    if (usageLimits.conversations.exceeded) {
      return {
        allowed: false,
        reason: `Conversation limit exceeded. Current: ${usageLimits.conversations.current}, Limit: ${usageLimits.conversations.limit}`,
        currentUsage: usageLimits,
        limits: {
          chatbots: usageLimits.chatbots.limit,
          conversations: usageLimits.conversations.limit,
          apiCalls: usageLimits.apiCalls.limit,
        }
      }
    }

    return { allowed: true, currentUsage: usageLimits }
  } catch (error) {
    console.error('Error checking conversation limit:', error)
    return { allowed: false, reason: 'Error checking limits' }
  }
}

// Check if organization can make an API call
export async function checkApiCallLimit(organizationId: Id<"organizations">): Promise<UsageCheck> {
  try {
    const organization = await convex.query(api.organizations.get, { id: organizationId })
    if (!organization) {
      return { allowed: false, reason: 'Organization not found' }
    }

    const usageLimits = await convex.query(api.usage.checkUsageLimits, {
      organizationId,
      plan: organization.subscription_tier
    })

    if (usageLimits.apiCalls.exceeded) {
      return {
        allowed: false,
        reason: `API call limit exceeded. Current: ${usageLimits.apiCalls.current}, Limit: ${usageLimits.apiCalls.limit}`,
        currentUsage: usageLimits,
        limits: {
          chatbots: usageLimits.chatbots.limit,
          conversations: usageLimits.conversations.limit,
          apiCalls: usageLimits.apiCalls.limit,
        }
      }
    }

    return { allowed: true, currentUsage: usageLimits }
  } catch (error) {
    console.error('Error checking API call limit:', error)
    return { allowed: false, reason: 'Error checking limits' }
  }
}

// Track usage for various actions
export async function trackUsage(
  organizationId: Id<"organizations">,
  type: 'conversation' | 'api_call',
  data: any
): Promise<void> {
  try {
    switch (type) {
      case 'conversation':
        await convex.mutation(api.usage.trackConversation, {
          organizationId,
          chatbotId: data.chatbotId,
          userId: data.userId,
          platform: data.platform,
          messageCount: data.messageCount || 1,
        })
        break
      
      case 'api_call':
        await convex.mutation(api.usage.trackApiCall, {
          organizationId,
          endpoint: data.endpoint,
          method: data.method,
        })
        break
      
      default:
        console.warn(`Unknown usage type: ${type}`)
    }
  } catch (error) {
    console.error('Error tracking usage:', error)
    // Don't throw here - tracking shouldn't break the main flow
  }
}

// Middleware factory for API routes
export function withUsageLimit(
  type: 'chatbot' | 'conversation' | 'api_call',
  handler: (req: NextRequest, usageCheck: UsageCheck) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      // Extract organization ID from request (adjust based on your auth system)
      const organizationId = req.headers.get('x-organization-id') as Id<"organizations">
      
      if (!organizationId) {
        return NextResponse.json(
          { error: 'Organization ID required' },
          { status: 400 }
        )
      }

      let usageCheck: UsageCheck
      
      switch (type) {
        case 'chatbot':
          usageCheck = await checkChatbotCreationLimit(organizationId)
          break
        case 'conversation':
          usageCheck = await checkConversationLimit(organizationId)
          break
        case 'api_call':
          usageCheck = await checkApiCallLimit(organizationId)
          break
        default:
          usageCheck = { allowed: false, reason: 'Unknown usage type' }
      }

      if (!usageCheck.allowed) {
        return NextResponse.json(
          {
            error: 'Usage limit exceeded',
            reason: usageCheck.reason,
            currentUsage: usageCheck.currentUsage,
            limits: usageCheck.limits,
            upgradeRequired: true,
          },
          { status: 429 } // Too Many Requests
        )
      }

      // If allowed, continue with the handler
      const response = await handler(req, usageCheck)
      
      // Track the usage after successful execution
      if (response.status === 200 || response.status === 201) {
        // Extract tracking data from request body if needed
        const body = await req.json().catch(() => ({}))
        await trackUsage(organizationId, type as any, body)
      }
      
      return response
    } catch (error) {
      console.error('Usage middleware error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

// Helper function to get usage warnings
export async function getUsageWarnings(organizationId: Id<"organizations">): Promise<string[]> {
  try {
    const organization = await convex.query(api.organizations.get, { id: organizationId })
    if (!organization) return []

    const usageLimits = await convex.query(api.usage.checkUsageLimits, {
      organizationId,
      plan: organization.subscription_tier
    })

    const warnings: string[] = []
    
    // Check for usage approaching limits (80%+)
    if (usageLimits.chatbots.percentage >= 80) {
      warnings.push(`You're using ${Math.round(usageLimits.chatbots.percentage)}% of your chatbot limit`)
    }
    
    if (usageLimits.conversations.percentage >= 80) {
      warnings.push(`You're using ${Math.round(usageLimits.conversations.percentage)}% of your conversation limit`)
    }
    
    if (usageLimits.apiCalls.percentage >= 80) {
      warnings.push(`You're using ${Math.round(usageLimits.apiCalls.percentage)}% of your API call limit`)
    }

    return warnings
  } catch (error) {
    console.error('Error getting usage warnings:', error)
    return []
  }
}
