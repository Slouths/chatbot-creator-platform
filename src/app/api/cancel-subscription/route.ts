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

    const { subscriptionId } = await request.json()

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      )
    }

    // Cancel the subscription at the end of the current period
    const deletedSubscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })

    return NextResponse.json({
      subscription: deletedSubscription,
      message: 'Subscription will be canceled at the end of the current billing period',
    })

  } catch (error: any) {
    console.error('Error canceling subscription:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
