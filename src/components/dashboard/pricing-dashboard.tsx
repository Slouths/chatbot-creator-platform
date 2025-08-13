'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { 
  Check, 
  Star, 
  Zap, 
  Shield, 
  CreditCard,
  Crown,
  Sparkles,
  ArrowRight,
  Users,
  MessageCircle,
  Globe,
  BarChart3,
  Headphones,
  Code,
  Rocket
} from 'lucide-react'
import { SlideUp } from '@/components/animations/slide-up'
import { useUser } from '@clerk/nextjs'

// Utility function for price formatting
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

// Production-ready subscription plans configuration
const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null,
    yearlyPriceId: null,
    popular: false,
    description: 'Perfect for getting started',
    features: [
      '2 chatbots',
      '100 conversations/month',
      'Website integration only',
      'Basic analytics',
      'Community support'
    ],
    limits: {
      chatbots: 2,
      conversations: 100,
      storage: '1GB'
    }
  },
  starter: {
    name: 'Starter (Test)',
    price: 0.01, // 1 cent for testing
    yearlyPrice: 0.10,
    priceId: 'price_1RvlHvGY9znxP158BZVnhhgW', // Starter monthly
    yearlyPriceId: 'price_1RvlHwGY9znxP158Y3dpL8bq', // Starter yearly
    popular: false,
    description: 'Testing subscription for 1 cent',
    features: [
      '1 chatbot',
      '100 conversations/month',
      'Basic analytics',
      'Email support'
    ],
    limits: {
      chatbots: 1,
      conversations: 100,
      storage: '1GB'
    }
  },
  pro: {
    name: 'Pro',
    price: 29,
    yearlyPrice: 290, // 2 months free
    priceId: 'price_1RvlHwGY9znxP158c6BCjUjc', // Pro monthly
    yearlyPriceId: 'price_1RvlHwGY9znxP158mt1cv3fw', // Pro yearly
    popular: true,
    description: 'Perfect for growing businesses',
    features: [
      '10 chatbots',
      '10,000 conversations/month',
      'All platforms (WhatsApp, Instagram, Messenger)',
      'Advanced analytics',
      'Custom branding',
      'API access',
      'Priority support',
      '50GB storage'
    ],
    limits: {
      chatbots: 10,
      conversations: 10000,
      storage: '50GB'
    }
  },
  enterprise: {
    name: 'Enterprise',
    price: 99,
    yearlyPrice: 990, // 2 months free
    priceId: 'price_1RvlHwGY9znxP158mtpCrLRW', // Enterprise monthly
    yearlyPriceId: 'price_1RvlHxGY9znxP158XYmAi90h', // Enterprise yearly
    popular: false,
    description: 'Advanced features for large organizations',
    features: [
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
    ],
    limits: {
      chatbots: 'Unlimited',
      conversations: 'Unlimited',
      storage: 'Unlimited'
    }
  }
}

export function PricingDashboard() {
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const handleSubscribe = async (plan: any) => {
    if (!user) {
      // Redirect to sign in
      window.location.href = '/sign-in'
      return
    }

    if (plan.name === 'Free') {
      alert('You are already on the free plan!')
      return
    }

    setIsLoading(plan.name)

    try {
      // Determine which price ID to use based on billing period
      const priceId = billingPeriod === 'yearly' ? plan.yearlyPriceId : plan.priceId
      
      if (!priceId || priceId === 'price_to_be_updated') {
        alert('This plan is not yet configured. Please run the Stripe setup first.')
        return
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: priceId,
          customerEmail: user.emailAddresses?.[0]?.emailAddress,
        }),
      })

      const session = await response.json()

      if (session.url) {
        // Redirect to Stripe Checkout
        window.location.href = session.url
      } else {
        throw new Error(session.error || 'Failed to create checkout session')
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setIsLoading(null)
    }
  }

  const getYearlySavings = (plan: any) => {
    if (!plan.yearlyPrice || !plan.price) return 0
    const monthlyYearly = plan.price * 12
    const savings = monthlyYearly - plan.yearlyPrice
    return Math.round((savings / monthlyYearly) * 100)
  }

  const getPlanIcon = (planKey: string) => {
    switch (planKey) {
      case 'free': return <Zap className="w-6 h-6" />
      case 'starter': return <Rocket className="w-6 h-6" />
      case 'pro': return <Crown className="w-6 h-6" />
      case 'enterprise': return <Shield className="w-6 h-6" />
      default: return <Star className="w-6 h-6" />
    }
  }

  const getPlanGradient = (planKey: string) => {
    switch (planKey) {
      case 'free': return 'from-gray-500 to-slate-600'
      case 'starter': return 'from-green-500 to-emerald-600'
      case 'pro': return 'from-blue-500 to-indigo-600'
      case 'enterprise': return 'from-purple-500 to-indigo-600'
      default: return 'from-gray-500 to-slate-600'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <SlideUp>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
            Choose Your Plan
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Scale your chatbot business with our flexible pricing plans. Start with a 1-cent test subscription.
          </p>
          
          {/* Billing Period Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm ${billingPeriod === 'monthly' ? 'text-slate-900 dark:text-slate-100 font-medium' : 'text-slate-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingPeriod === 'yearly' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${billingPeriod === 'yearly' ? 'text-slate-900 dark:text-slate-100 font-medium' : 'text-slate-500'}`}>
                Yearly
              </span>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Save up to 17%
              </Badge>
            </div>
          </div>
        </div>
      </SlideUp>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(SUBSCRIPTION_PLANS).map(([planKey, plan], index) => (
          <SlideUp key={planKey} delay={index * 0.1}>
            <Card className={`relative h-full flex flex-col ${
              plan.popular 
                ? 'ring-2 ring-blue-500 shadow-xl scale-105' 
                : 'border-slate-200 dark:border-slate-700'
            }`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-3 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-r ${getPlanGradient(planKey)} flex items-center justify-center text-white mb-4`}>
                  {getPlanIcon(planKey)}
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  {plan.description}
                </CardDescription>
                
                <div className="mt-4">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                      {formatPrice(billingPeriod === 'yearly' && plan.yearlyPrice ? plan.yearlyPrice / 12 : plan.price)}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      /month
                    </span>
                  </div>
                  
                  {billingPeriod === 'yearly' && plan.yearlyPrice && (
                    <div className="mt-2">
                      <span className="text-sm text-slate-500">
                        Billed {formatPrice(plan.yearlyPrice)} yearly
                      </span>
                      {getYearlySavings(plan) > 0 && (
                        <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Save {getYearlySavings(plan)}%
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-6">
                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Limits */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">
                    Plan Limits
                  </h4>
                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between">
                      <span>Chatbots:</span>
                      <span className="font-medium">{plan.limits.chatbots}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversations:</span>
                      <span className="font-medium">{plan.limits.conversations.toLocaleString?.() || plan.limits.conversations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Storage:</span>
                      <span className="font-medium">{plan.limits.storage}</span>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-4 mt-auto">
                  <Button
                    onClick={() => handleSubscribe(plan)}
                    disabled={isLoading === plan.name}
                    className={`w-full ${
                      plan.popular
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : planKey === 'free'
                        ? 'bg-gray-600 hover:bg-gray-700 text-white'
                        : 'bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white'
                    }`}
                  >
                    {isLoading === plan.name ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : planKey === 'free' ? (
                      'Current Plan'
                    ) : (
                      <div className="flex items-center gap-2">
                        Subscribe Now
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </SlideUp>
        ))}
      </div>

      {/* Setup Instructions */}
      <SlideUp>
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Ready to Set Up Production Pricing?
                </h3>
                <p className="text-blue-700 dark:text-blue-300 mb-4">
                  Run the Stripe setup to create your production-ready subscription plans with real pricing.
                </p>
                <Button
                  onClick={() => {
                    fetch('/api/setup-stripe-products', { method: 'POST' })
                      .then(res => res.json())
                      .then(data => {
                        console.log('Setup result:', data)
                        alert('Stripe products created! Check the console for Price IDs to update the frontend.')
                      })
                      .catch(err => {
                        console.error('Setup error:', err)
                        alert('Setup failed. Check the console for details.')
                      })
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Run Stripe Setup
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </SlideUp>
    </div>
  )
}