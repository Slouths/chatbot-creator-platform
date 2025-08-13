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

    const { userEmail } = await request.json()

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 }
      )
    }

    // Find the customer by email
    const existingCustomers = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    })

    if (existingCustomers.data.length === 0) {
      return NextResponse.json(
        { error: 'No customer found. Please subscribe to a plan first.' },
        { status: 404 }
      )
    }

    const customer = existingCustomers.data[0]

    // Create customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${request.headers.get('origin')}/dashboard`,
    })

    return NextResponse.json({ url: session.url })

  } catch (error: any) {
    console.error('Error creating portal session:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
