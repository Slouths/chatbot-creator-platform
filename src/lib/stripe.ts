import Stripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js'

// Server-side Stripe instance - only initialize on server
export const stripe = typeof window === 'undefined' 
  ? new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-06-20',
      typescript: true,
    })
  : null as any

// Client-side Stripe instance
export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
}

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      '1 chatbot',
      '100 conversations/month',
      'Website integration only',
      'Basic analytics',
      'Community support'
    ],
    limits: {
      chatbots: 1,
      conversations: 100,
      platforms: ['website'],
      analytics: 'basic'
    }
  },
  pro: {
    name: 'Pro',
    price: 29,
    priceId: 'price_pro_monthly', // Replace with actual Stripe price ID
    features: [
      '5 chatbots',
      '1,000 conversations/month',
      'All platforms (WhatsApp, Instagram, Messenger)',
      'Advanced analytics',
      'Custom branding',
      'API access',
      'Priority support'
    ],
    limits: {
      chatbots: 5,
      conversations: 1000,
      platforms: ['website', 'whatsapp', 'instagram', 'messenger'],
      analytics: 'advanced'
    }
  },
  enterprise: {
    name: 'Enterprise',
    price: 99,
    priceId: 'price_enterprise_monthly', // Replace with actual Stripe price ID
    features: [
      'Unlimited chatbots',
      'Unlimited conversations',
      'All platforms + custom integrations',
      'Advanced analytics + custom reports',
      'White-label solution',
      'Full API access',
      'Dedicated support',
      'Custom AI model training'
    ],
    limits: {
      chatbots: -1, // Unlimited
      conversations: -1, // Unlimited
      platforms: ['website', 'whatsapp', 'instagram', 'messenger', 'custom'],
      analytics: 'enterprise'
    }
  }
}

// Utility functions
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

export function getPlanByPriceId(priceId: string) {
  return Object.values(SUBSCRIPTION_PLANS).find(plan => plan.priceId === priceId)
}

export async function createCheckoutSession({
  priceId,
  customerId,
  successUrl,
  cancelUrl,
  metadata = {}
}: {
  priceId: string
  customerId?: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer: customerId,
    metadata,
    allow_promotion_codes: true,
    billing_address_collection: 'required',
    automatic_tax: { enabled: true },
  })

  return session
}

export async function createPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session
}

export async function getSubscription(subscriptionId: string) {
  return await stripe.subscriptions.retrieve(subscriptionId)
}

export async function cancelSubscription(subscriptionId: string) {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  })
}

export async function updateSubscription(subscriptionId: string, priceId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  
  return await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: priceId,
      },
    ],
    proration_behavior: 'always_invoice',
  })
}
