import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import Stripe from 'stripe'

// Server-side Stripe instance
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
})

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { priceId, userEmail, planName } = await request.json()

    if (!priceId || !userEmail) {
      return NextResponse.json(
        { error: 'Price ID and user email are required' },
        { status: 400 }
      )
    }

    // Create or get Stripe customer
    let customer
    const existingCustomers = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    })

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0]
    } else {
      customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          clerkUserId: userId,
        },
      })
    }

    // Create subscription with incomplete status
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{
        price: priceId,
      }],
      payment_behavior: 'default_incomplete',
      payment_settings: { 
        save_default_payment_method: 'on_subscription' 
      },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        clerkUserId: userId,
        planName: planName || 'Unknown Plan',
      },
    })

    const paymentIntent = subscription.latest_invoice?.payment_intent as Stripe.PaymentIntent

    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret: paymentIntent?.client_secret,
      customerId: customer.id,
    })

  } catch (error: any) {
    console.error('Error creating subscription:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
