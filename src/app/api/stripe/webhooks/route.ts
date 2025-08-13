import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../../../../convex/_generated/api'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = headers()
  const sig = headersList.get('stripe-signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message)
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 })
  }

  console.log(`Received webhook: ${event.type}`)

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription)
        break
      
      case 'customer.subscription.deleted':
        await handleSubscriptionCancellation(event.data.object as Stripe.Subscription)
        break
        
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
        
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break
        
      case 'customer.created':
        await handleCustomerCreated(event.data.object as Stripe.Customer)
        break
        
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string
  const subscriptionId = subscription.id
  const status = subscription.status
  const priceId = subscription.items.data[0]?.price.id
  
  // Map Stripe price IDs to subscription tiers
  const tierMap: Record<string, 'free' | 'pro' | 'enterprise'> = {
    'price_pro_monthly': 'pro',
    'price_pro_yearly': 'pro',
    'price_enterprise_monthly': 'enterprise',
    'price_enterprise_yearly': 'enterprise',
  }
  
  const tier = tierMap[priceId] || 'free'
  
  try {
    // Find organization by Stripe customer ID
    const organizations = await convex.query(api.organizations.list)
    const organization = organizations.find(org => org.stripe_customer_id === customerId)
    
    if (organization) {
      // Update organization subscription
      await convex.mutation(api.organizations.updateSubscription, {
        organizationId: organization._id,
        subscriptionTier: tier,
        stripeSubscriptionId: subscriptionId,
        subscriptionStatus: status,
      })
      
      console.log(`Updated subscription for organization ${organization._id}: ${tier}`)
    } else {
      console.error(`No organization found for customer ${customerId}`)
    }
  } catch (error) {
    console.error('Error updating subscription:', error)
    throw error
  }
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string
  
  try {
    // Find organization by Stripe customer ID
    const organizations = await convex.query(api.organizations.list)
    const organization = organizations.find(org => org.stripe_customer_id === customerId)
    
    if (organization) {
      // Downgrade to free tier
      await convex.mutation(api.organizations.updateSubscription, {
        organizationId: organization._id,
        subscriptionTier: 'free',
        stripeSubscriptionId: null,
        subscriptionStatus: 'canceled',
      })
      
      console.log(`Downgraded organization ${organization._id} to free tier`)
    }
  } catch (error) {
    console.error('Error handling subscription cancellation:', error)
    throw error
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string
  const amount = invoice.amount_paid / 100 // Convert from cents
  const subscriptionId = invoice.subscription as string
  
  try {
    // Find organization by Stripe customer ID
    const organizations = await convex.query(api.organizations.list)
    const organization = organizations.find(org => org.stripe_customer_id === customerId)
    
    if (organization) {
      // Log payment success (you could store billing history here)
      console.log(`Payment succeeded for organization ${organization._id}: $${amount}`)
      
      // You could store this in a billing_history table
      // await convex.mutation(api.billing.recordPayment, {
      //   organizationId: organization._id,
      //   amount,
      //   invoiceId: invoice.id,
      //   status: 'succeeded',
      //   paidAt: new Date(invoice.created * 1000).toISOString(),
      // })
    }
  } catch (error) {
    console.error('Error handling payment success:', error)
    throw error
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string
  const amount = invoice.amount_due / 100
  
  try {
    // Find organization by Stripe customer ID
    const organizations = await convex.query(api.organizations.list)
    const organization = organizations.find(org => org.stripe_customer_id === customerId)
    
    if (organization) {
      console.log(`Payment failed for organization ${organization._id}: $${amount}`)
      
      // You might want to send notification emails, disable features, etc.
      // This is where you'd implement your payment failure logic
    }
  } catch (error) {
    console.error('Error handling payment failure:', error)
    throw error
  }
}

async function handleCustomerCreated(customer: Stripe.Customer) {
  console.log(`New Stripe customer created: ${customer.id}`)
  // Customer data is typically linked during the checkout process
  // This webhook is mainly for logging/analytics
}
