import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Server-side Stripe instance
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
})

// This endpoint creates the production-ready subscription products in Stripe
// Call this once to set up your products
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Setting up production-ready subscription products...')
    const results = []

    // Create Starter Plan Product (1 cent for testing)
    const starterProduct = await stripe.products.create({
      name: 'Starter Plan (Test)',
      description: 'Perfect for testing - 1 cent subscription',
      metadata: {
        plan_type: 'starter_test',
        max_chatbots: '1',
        max_conversations: '100',
        features: JSON.stringify([
          '1 chatbot',
          '100 conversations/month',
          'Basic analytics',
          'Email support'
        ])
      }
    })

    // Create Pro Plan Product
    const proProduct = await stripe.products.create({
      name: 'Pro Plan',
      description: 'Perfect for growing businesses',
      metadata: {
        plan_type: 'pro',
        max_chatbots: '10',
        max_conversations: '10000',
        features: JSON.stringify([
          '10 chatbots',
          '10,000 conversations/month',
          'All platforms (WhatsApp, Instagram, Messenger)',
          'Advanced analytics',
          'Custom branding',
          'API access',
          'Priority support',
          '50GB storage'
        ])
      }
    })

    // Create Enterprise Plan Product
    const enterpriseProduct = await stripe.products.create({
      name: 'Enterprise Plan',
      description: 'Advanced features for large organizations',
      metadata: {
        plan_type: 'enterprise',
        max_chatbots: 'unlimited',
        max_conversations: 'unlimited',
        features: JSON.stringify([
          'Unlimited chatbots',
          'Unlimited conversations',
          'All platforms + custom integrations',
          'Advanced analytics + reporting',
          'White-label solution',
          'Full API access',
          'Dedicated support',
          'Unlimited storage',
          'Custom training',
          'SLA guarantee'
        ])
      }
    })

    // Create Starter Plan Prices (1 cent for testing)
    const starterMonthlyPrice = await stripe.prices.create({
      product: starterProduct.id,
      unit_amount: 1, // $0.01 in cents for testing
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      metadata: {
        plan_type: 'starter',
        billing_period: 'monthly'
      }
    })

    const starterYearlyPrice = await stripe.prices.create({
      product: starterProduct.id,
      unit_amount: 10, // $0.10 in cents for testing (10 months price)
      currency: 'usd',
      recurring: {
        interval: 'year',
      },
      metadata: {
        plan_type: 'starter',
        billing_period: 'yearly'
      }
    })

    // Create Pro Plan Prices
    const proMonthlyPrice = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 2900, // $29.00 in cents
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      metadata: {
        plan_type: 'pro',
        billing_period: 'monthly'
      }
    })

    const proYearlyPrice = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 29000, // $290.00 in cents (2 months free)
      currency: 'usd',
      recurring: {
        interval: 'year',
      },
      metadata: {
        plan_type: 'pro',
        billing_period: 'yearly'
      }
    })

    // Create Enterprise Plan Prices
    const enterpriseMonthlyPrice = await stripe.prices.create({
      product: enterpriseProduct.id,
      unit_amount: 9900, // $99.00 in cents
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      metadata: {
        plan_type: 'enterprise',
        billing_period: 'monthly'
      }
    })

    const enterpriseYearlyPrice = await stripe.prices.create({
      product: enterpriseProduct.id,
      unit_amount: 99000, // $990.00 in cents (2 months free)
      currency: 'usd',
      recurring: {
        interval: 'year',
      },
      metadata: {
        plan_type: 'enterprise',
        billing_period: 'yearly'
      }
    })

    results.push({
      product: 'Starter Plan (Test)',
      monthly_price_id: starterMonthlyPrice.id,
      yearly_price_id: starterYearlyPrice.id,
      monthly_amount: '$0.01',
      yearly_amount: '$0.10'
    })

    results.push({
      product: 'Pro Plan',
      monthly_price_id: proMonthlyPrice.id,
      yearly_price_id: proYearlyPrice.id,
      monthly_amount: '$29.00',
      yearly_amount: '$290.00'
    })

    results.push({
      product: 'Enterprise Plan',
      monthly_price_id: enterpriseMonthlyPrice.id,
      yearly_price_id: enterpriseYearlyPrice.id,
      monthly_amount: '$99.00',
      yearly_amount: '$990.00'
    })

    console.log('✅ Production-ready products and prices created successfully!')

    return NextResponse.json({
      success: true,
      message: 'Production-ready subscription products created successfully!',
      products: results,
      price_ids: {
        starter: {
          monthly: starterMonthlyPrice.id,
          yearly: starterYearlyPrice.id
        },
        pro: {
          monthly: proMonthlyPrice.id,
          yearly: proYearlyPrice.id
        },
        enterprise: {
          monthly: enterpriseMonthlyPrice.id,
          yearly: enterpriseYearlyPrice.id
        }
      },
      instructions: [
        '1. Copy the price IDs below',
        '2. Update your pricing component with these real Price IDs',
        '3. Test the subscription flow',
        '4. Set up webhooks in Stripe Dashboard pointing to your /api/stripe/webhooks endpoint',
        '5. Enable Customer Portal in Stripe Dashboard',
        '6. Configure your subscription settings in Stripe Dashboard'
      ]
    })

  } catch (error: any) {
    console.error('Error setting up Stripe products:', error)
    return NextResponse.json(
      { 
        error: error.message,
        details: 'Make sure your Stripe API key is valid and has permission to create products'
      },
      { status: 500 }
    )
  }
}