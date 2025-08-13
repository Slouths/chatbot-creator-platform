import { NextRequest, NextResponse } from 'next/server'
import { trackUsage } from '@/lib/usage-middleware'
import { Id } from '../../../../convex/_generated/dataModel'

export async function POST(request: NextRequest) {
  try {
    const { botId, message, sessionId } = await request.json()

    // Validate required fields
    if (!botId || !message || !sessionId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // In a real implementation, you would:
    // 1. Validate the botId exists and is active
    // 2. Retrieve the bot's configuration and knowledge base
    // 3. Process the message through your AI/NLP service
    // 4. Generate an appropriate response
    // 5. Log the conversation for analytics
    // 6. Return the response

    // For demo purposes, we'll simulate different responses
    const responses = getSimulatedResponse(message.toLowerCase(), botId)

    // Track usage if organization ID is provided
    const organizationId = request.headers.get('x-organization-id') as Id<"organizations">
    if (organizationId) {
      try {
        await trackUsage(organizationId, 'conversation', {
          chatbotId: botId,
          userId: sessionId,
          platform: 'website',
          messageCount: 1,
        })
      } catch (error) {
        console.error('Error tracking usage:', error)
        // Don't fail the request if tracking fails
      }
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))

    return NextResponse.json({
      success: true,
      response: responses.text,
      metadata: {
        botId,
        sessionId,
        timestamp: Date.now(),
        processingTime: Math.round(500 + Math.random() * 1000),
        confidence: responses.confidence
      }
    })

  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function getSimulatedResponse(message: string, botId: string) {
  // Simulate different bot personalities based on botId
  const isCustomerSupport = botId.includes('support') || botId.includes('csb')
  const isSales = botId.includes('sales') || botId.includes('sa')
  
  // Common greetings
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    if (isCustomerSupport) {
      return {
        text: "Hello! I'm here to help you with any questions or issues you might have. What can I assist you with today?",
        confidence: 0.95
      }
    } else if (isSales) {
      return {
        text: "Hi there! Welcome! I'm excited to help you find the perfect solution for your needs. What brings you here today?",
        confidence: 0.95
      }
    } else {
      return {
        text: "Hello! Thanks for reaching out. How can I help you today?",
        confidence: 0.95
      }
    }
  }

  // Pricing questions
  if (message.includes('price') || message.includes('cost') || message.includes('pricing')) {
    return {
      text: "Great question! Our pricing starts at $29/month for our basic plan, with more advanced features available in our Pro ($99/month) and Enterprise plans. Would you like me to walk you through the different options?",
      confidence: 0.90
    }
  }

  // Features questions
  if (message.includes('feature') || message.includes('what do') || message.includes('what can')) {
    return {
      text: "Our platform offers AI-powered chatbots, multi-platform deployment (website, WhatsApp, Instagram, Messenger), real-time analytics, and easy integration. What specific features are you most interested in?",
      confidence: 0.88
    }
  }

  // Support questions
  if (message.includes('help') || message.includes('support') || message.includes('problem')) {
    return {
      text: "I'm here to help! Can you tell me more about what you need assistance with? Whether it's setting up your chatbot, integration questions, or troubleshooting an issue, I'm here to guide you through it.",
      confidence: 0.90
    }
  }

  // Integration questions
  if (message.includes('integrate') || message.includes('embed') || message.includes('website')) {
    return {
      text: "Integration is super easy! You just need to copy a small JavaScript snippet and paste it into your website. It works with Wix, WordPress, Shopify, and any custom HTML site. Would you like me to show you the exact steps?",
      confidence: 0.92
    }
  }

  // WhatsApp questions
  if (message.includes('whatsapp') || message.includes('whats app')) {
    return {
      text: "Yes! You can connect your chatbot to WhatsApp Business API. You'll need a WhatsApp Business account and we'll guide you through the setup process step-by-step. It typically takes about 15 minutes to configure.",
      confidence: 0.90
    }
  }

  // Instagram questions
  if (message.includes('instagram') || message.includes('ig')) {
    return {
      text: "Absolutely! We support Instagram Direct Messages through the Instagram Business API. You'll need an Instagram Business account connected to a Facebook Page. Our setup wizard makes the process straightforward.",
      confidence: 0.88
    }
  }

  // Testing questions
  if (message.includes('test') || message.includes('demo') || message.includes('try')) {
    return {
      text: "You're already testing it right now! 😊 This is a live demo of our chatbot widget. You can see how it would work on your own website. Would you like to see more advanced features or learn how to set up your own?",
      confidence: 0.95
    }
  }

  // Goodbye/thanks
  if (message.includes('thank') || message.includes('bye') || message.includes('goodbye')) {
    return {
      text: "You're very welcome! If you have any other questions, feel free to ask anytime. Good luck with your chatbot project! 🚀",
      confidence: 0.95
    }
  }

  // Default response
  const defaultResponses = [
    "That's a great question! While I'm a demo bot with limited capabilities, our full platform can handle much more complex conversations. Would you like to learn more about our features?",
    "I understand you're asking about that topic. Our AI chatbots can be trained on your specific knowledge base to provide detailed answers. Would you like to see how that works?",
    "Thanks for your message! This is a demonstration of our chatbot widget. In a real deployment, the bot would be trained on your specific content and able to provide detailed, relevant responses.",
    "I appreciate your question! Our platform allows you to create chatbots that can handle a wide variety of topics specific to your business. Would you like to learn more about customization options?"
  ]

  return {
    text: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
    confidence: 0.75
  }
}

// Enable CORS for the widget
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
