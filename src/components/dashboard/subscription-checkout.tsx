'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder')

interface Plan {
  name: string
  price: number
  priceId: string
  yearlyPriceId?: string
  features: string[]
  popular?: boolean
}

interface SubscriptionCheckoutProps {
  plan: Plan
  billingPeriod: 'monthly' | 'yearly'
  onSuccess?: () => void
  onCancel?: () => void
}

// Payment form component
function CheckoutForm({ plan, billingPeriod, onSuccess, onCancel }: SubscriptionCheckoutProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setError('')

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message || 'An error occurred')
      setIsLoading(false)
      return
    }

    // Confirm payment
    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard?success=true`,
      },
    })

    if (confirmError) {
      setError(confirmError.message || 'Payment failed')
      setIsLoading(false)
    } else {
      onSuccess?.()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Subscribe to {plan.name}
        </h3>
        
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {plan.name} Plan ({billingPeriod})
            </span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              ${billingPeriod === 'yearly' ? (plan.price * 12 * 0.8).toFixed(0) : plan.price}/
              {billingPeriod === 'yearly' ? 'year' : 'month'}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <PaymentElement />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-sm text-red-800 dark:text-red-200">{error}</span>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={!stripe || isLoading}
          className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Subscribe Now
            </>
          )}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="border-slate-300 dark:border-slate-600"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

// Main subscription checkout component
export function SubscriptionCheckout({ plan, billingPeriod, onSuccess, onCancel }: SubscriptionCheckoutProps) {
  const { user } = useUser()
  const [clientSecret, setClientSecret] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      setError('User email not found')
      setIsLoading(false)
      return
    }

    const createSubscription = async () => {
      try {
        const priceId = billingPeriod === 'yearly' ? (plan.yearlyPriceId || plan.priceId) : plan.priceId
        
        const response = await fetch('/api/create-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            priceId,
            userEmail: user.emailAddresses[0].emailAddress,
            planName: plan.name,
          }),
        })

        const data = await response.json()

        if (response.ok) {
          setClientSecret(data.clientSecret)
        } else {
          setError(data.error || 'Failed to create subscription')
        }
      } catch (err) {
        setError('Network error occurred')
        console.error('Subscription creation error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    createSubscription()
  }, [user, plan, billingPeriod])

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
            <span className="text-slate-600 dark:text-slate-400">Setting up subscription...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              className="mt-4"
            >
              Go Back
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  if (!clientSecret) {
    return (
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardContent className="p-6">
          <div className="text-slate-600 dark:text-slate-400">
            Unable to initialize payment. Please try again.
          </div>
        </CardContent>
      </Card>
    )
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#4f46e5',
      colorBackground: '#ffffff',
      colorText: '#1e293b',
      colorDanger: '#ef4444',
      fontFamily: 'system-ui, sans-serif',
    },
  }

  const options = {
    clientSecret,
    appearance,
  }

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-slate-100">
          Complete Your Subscription
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Enter your payment details to activate your {plan.name} plan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm
            plan={plan}
            billingPeriod={billingPeriod}
            onSuccess={onSuccess}
            onCancel={onCancel}
          />
        </Elements>
      </CardContent>
    </Card>
  )
}
