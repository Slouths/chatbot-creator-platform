'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

import { 
  CreditCard, 
  Download, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Users,
  MessageCircle,
  BarChart3,
  Crown,
  Zap,
  DollarSign,

  FileText,
  ExternalLink,
  TrendingUp,
  Plus
} from 'lucide-react'
import { SlideUp } from '@/components/animations/slide-up'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useUser } from '@clerk/nextjs'

// Utility functions
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

const formatDate = (date: any): string => {
  const dateObj = date instanceof Date ? date : new Date(date)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(dateObj)
}

// Mock data - in real app this would come from your backend
const mockBillingData = {
  subscription: {
    plan: 'Pro',
    status: 'active',
    currentPeriodStart: '2024-01-01',
    currentPeriodEnd: '2024-02-01',
    price: 29,
    interval: 'month'
  },
  usage: {
    chatbots: { current: 3, limit: 5 },
    conversations: { current: 742, limit: 1000 },
    apiCalls: { current: 15420, limit: 25000 }
  },
  billingHistory: [
    { id: 1, date: '2024-01-01', amount: 29, status: 'paid', invoice: 'inv_123' },
    { id: 2, date: '2023-12-01', amount: 29, status: 'paid', invoice: 'inv_122' },
    { id: 3, date: '2023-11-01', amount: 29, status: 'paid', invoice: 'inv_121' },
    { id: 4, date: '2023-10-01', amount: 0, status: 'paid', invoice: 'inv_120' }
  ],
  paymentMethod: {
    type: 'card',
    last4: '4242',
    brand: 'visa',
    expMonth: 12,
    expYear: 2025
  }
}

export function BillingDashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useUser()
  const [hasSubscription, setHasSubscription] = useState(false)
  const [subscriptionData, setSubscriptionData] = useState(null)
  
  // Get organizations and usage data from Convex (temporarily disabled)
  // const organizations = useQuery(api.organizations.list)
  // const firstOrganization = organizations?.[0]
  const organizations = null
  const firstOrganization = null

  // Temporarily disable Convex queries to fix React hooks error
  // const usageLimits = useQuery(
  //   api.usage.checkUsageLimits,
  //   firstOrganization ? { 
  //     organizationId: firstOrganization._id, 
  //     plan: firstOrganization.subscription_tier 
  //   } : "skip"
  // )
  const usageLimits = null
  
  // Check if user has a real subscription (replace with actual Stripe check)
  const subscription = hasSubscription ? {
    id: 'sub_test_123',
    status: 'active',
    plan: 'Pro Plan (Test)',
    amount: 1, // 1 cent for testing
    interval: 'month',
    currentPeriodStart: new Date(), // Started today
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Ends in 30 days
    cancelAtPeriodEnd: false
  } : null
  
  const billingHistory = hasSubscription ? [
    {
      id: 'in_test_123',
      date: new Date(), // Today's payment
      amount: 1, // 1 cent
      status: 'paid',
      description: 'Pro Plan (Test) - Monthly',
      invoiceUrl: '#'
    }
  ] : []
  
  const paymentMethod = hasSubscription ? {
    id: 'pm_test_123',
    type: 'card',
    last4: '4242',
    brand: 'visa',
    expMonth: 12,
    expYear: 2025
  } : null
  
  // Use realistic usage data for test subscription
  const usage = hasSubscription ? {
    conversations: {
      current: 47, // Some realistic usage
      limit: 10000,
      percentage: 0.47
    },
    chatbots: {
      current: 2, // User has created 2 chatbots
      limit: 10,
      percentage: 20
    },
    storage: {
      current: 1.2, // 1.2 GB used
      limit: 50,
      percentage: 2.4
    },
    apiCalls: {
      current: 1247, // API calls this month
      limit: 50000,
      percentage: 2.5
    }
  } : {
    conversations: {
      current: 5, // Free tier usage
      limit: 100,
      percentage: 5
    },
    chatbots: {
      current: 1,
      limit: 2,
      percentage: 50
    },
    storage: {
      current: 0.1,
      limit: 1,
      percentage: 10
    },
    apiCalls: {
      current: 23, // Limited API calls for free tier
      limit: 1000,
      percentage: 2.3
    }
  }

  const handleManageSubscription = async () => {
    // If this is a test subscription, show a demo modal instead of calling Stripe
    if (hasSubscription && subscription?.id === 'sub_test_123') {
      alert('🎉 Test Subscription Portal\n\nIn a real environment, this would open the Stripe Customer Portal where users can:\n\n• Update payment methods\n• Change billing address\n• Download invoices\n• Cancel subscription\n• View payment history\n\nYour test subscription is active and working perfectly!')
      return
    }

    setIsLoading(true)
    
    try {
      // Get user email from Clerk
      const userEmail = user?.emailAddresses?.[0]?.emailAddress
      
      if (!userEmail) {
        alert('User email not found. Please make sure you are logged in.')
        return
      }

      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail,
        }),
      })

      const data = await response.json()
      
      if (response.ok && data.url) {
        // Redirect to Stripe Customer Portal
        window.location.href = data.url
      } else {
        console.error('Error creating portal session:', data.error)
        if (data.error?.includes('No customer found') || data.error?.includes('customer')) {
          alert('Please subscribe to a plan first to access the billing portal.')
        } else {
          alert('Unable to open billing portal. Please try again or contact support.')
        }
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Unable to open billing portal. Please try again or contact support.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadInvoice = (invoiceId: string) => {
    // In real app, download invoice PDF
    console.log('Downloading invoice:', invoiceId)
  }

  const handleCancelSubscription = async () => {
    setIsLoading(true)
    
    try {
      // In a real app, you'd get the actual subscription ID from your backend
      const subscriptionId = 'sub_example' // Replace with actual subscription ID
      
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        alert('Subscription cancelled successfully. You will retain access until the end of your billing period.')
      } else {
        console.error('Error cancelling subscription:', data.error)
        alert('Unable to cancel subscription. Please try again or contact support.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Unable to cancel subscription. Please try again or contact support.')
    } finally {
      setIsLoading(false)
    }
  }

  const getUsagePercentage = (current: number, limit: number) => {
    return Math.min((current / limit) * 100, 100)
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 75) return 'text-orange-600'
    return 'text-green-600'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <SlideUp>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Billing & Usage
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Manage your subscription and track your usage
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleManageSubscription}
                disabled={isLoading}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Manage Subscription
                  </>
                )}
              </Button>
              
              <Button
                onClick={() => {
                  // Navigate to pricing section (you can customize this)
                  const pricingSection = document.querySelector('[data-tab="billing"]')
                  if (pricingSection) {
                    pricingSection.scrollIntoView({ behavior: 'smooth' })
                  } else {
                    alert('Visit the Billing tab to choose and subscribe to a plan!')
                  }
                }}
                variant="outline"
                className="border-indigo-300 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-600 dark:text-indigo-300 dark:hover:bg-indigo-900/20"
              >
                <Plus className="w-4 h-4 mr-2" />
                View Plans
              </Button>
            </div>
          </div>
        </SlideUp>
      </div>

      {/* No Subscription Notice */}
      <SlideUp>
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Ready to unlock premium features?
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  You&apos;re currently on the free plan. Subscribe to access unlimited chatbots, advanced analytics, and priority support.
                </p>
                <Button 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                  onClick={() => {
                    // Navigate to pricing section by scrolling down to it
                    const pricingSection = document.querySelector('#pricing-section')
                    if (pricingSection) {
                      pricingSection.scrollIntoView({ behavior: 'smooth' })
                    } else {
                      // If no pricing section found, just scroll down
                      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
                    }
                  }}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Explore Plans
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </SlideUp>

      {/* Pricing Section */}
      <div id="pricing-section">
        <SlideUp>
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-100">
                Choose Your Plan
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Select the perfect plan for your chatbot needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pro Plan */}
                <div className="relative p-6 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-indigo-500 text-white">Most Popular</Badge>
                  </div>
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Pro Plan (Test)</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">$0.01</span>
                      <span className="text-slate-600 dark:text-slate-400">/month</span>
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">Testing price - normally $29/month</p>
                  </div>
                  <ul className="space-y-3 mb-6 text-sm">
                    <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Up to 10 chatbots
                    </li>
                    <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      10,000 conversations/month
                    </li>
                    <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Advanced analytics
                    </li>
                    <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Priority support
                    </li>
                  </ul>
                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                      onClick={() => setHasSubscription(true)}
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Subscribe to Pro (Test)
                    </Button>
                    <p className="text-xs text-slate-500 text-center">
                      Click to simulate subscription for testing
                    </p>
                  </div>
                </div>

                {/* Enterprise Plan */}
                <div className="p-6 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Enterprise</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">$99</span>
                      <span className="text-slate-600 dark:text-slate-400">/month</span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-6 text-sm">
                    <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Unlimited chatbots
                    </li>
                    <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Unlimited conversations
                    </li>
                    <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Custom AI training
                    </li>
                    <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      24/7 dedicated support
                    </li>
                  </ul>
                  <Button 
                    variant="outline"
                    className="w-full border-slate-300 dark:border-slate-600"
                    onClick={() => alert('Enterprise plan setup - Contact sales for custom pricing')}
                  >
                    Contact Sales
                  </Button>
                </div>
              </div>
              
              {hasSubscription && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Test subscription activated!</span>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                    You can now see how the billing dashboard looks for subscribed users.
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-2 border-green-300 text-green-700 hover:bg-green-50 dark:border-green-600 dark:text-green-300"
                    onClick={() => setHasSubscription(false)}
                  >
                    Reset Test
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </SlideUp>
      </div>

      {/* Current Plan - Only show if user has subscription */}
      {hasSubscription && subscription && (
        <SlideUp>
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Crown className="w-5 h-5 text-indigo-500" />
              Current Plan
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Your active subscription details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">Plan</p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    {subscription.plan}
                  </Badge>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">Price</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {formatPrice(subscription.amount)}/{subscription.interval}
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">Current Period</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {/* @ts-ignore */}
                  {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">Next Billing</p>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {/* @ts-ignore */}
                    {formatDate(subscription.currentPeriodEnd)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        </SlideUp>
      )}

      {/* Usage Overview - Only show if user has subscription */}
      {hasSubscription && (
        <SlideUp>
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Usage Overview
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Current usage for this billing period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Chatbots Usage */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Chatbots</span>
                  </div>
                  <span className={`text-sm font-semibold ${getUsageColor(getUsagePercentage(usage.chatbots.current, usage.chatbots.limit))}`}>
                    {usage.chatbots.current} / {usage.chatbots.limit}
                  </span>
                </div>
                <div className="space-y-2">
                  <Progress 
                    value={getUsagePercentage(usage.chatbots.current, usage.chatbots.limit)} 
                    className="h-2"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {usage.chatbots.limit - usage.chatbots.current} remaining
                  </p>
                </div>
              </div>

              {/* Conversations Usage */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Conversations</span>
                  </div>
                  <span className={`text-sm font-semibold ${getUsageColor(getUsagePercentage(usage.conversations.current, usage.conversations.limit))}`}>
                    {usage.conversations.current.toLocaleString()} / {usage.conversations.limit.toLocaleString()}
                  </span>
                </div>
                <div className="space-y-2">
                  <Progress 
                    value={getUsagePercentage(usage.conversations.current, usage.conversations.limit)} 
                    className="h-2"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {(usage.conversations.limit - usage.conversations.current).toLocaleString()} remaining
                  </p>
                </div>
              </div>

              {/* API Calls Usage */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">API Calls</span>
                  </div>
                  <span className={`text-sm font-semibold ${getUsageColor(getUsagePercentage(usage.apiCalls.current, usage.apiCalls.limit))}`}>
                    {usage.apiCalls.current.toLocaleString()} / {usage.apiCalls.limit.toLocaleString()}
                  </span>
                </div>
                <div className="space-y-2">
                  <Progress 
                    value={getUsagePercentage(usage.apiCalls.current, usage.apiCalls.limit)} 
                    className="h-2"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {(usage.apiCalls.limit - usage.apiCalls.current).toLocaleString()} remaining
                  </p>
                </div>
              </div>
            </div>

            {/* Usage Alert */}
            {usage.conversations.current / usage.conversations.limit > 0.8 && (
              <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-orange-800 dark:text-orange-200">
                      Approaching Usage Limit
                    </h4>
                    <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                      You&apos;ve used {Math.round((usage.conversations.current / usage.conversations.limit) * 100)}% of your conversation limit. 
                      Consider upgrading your plan to avoid service interruption.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        </SlideUp>
      )}

      {/* Payment Method - Only show if user has subscription */}
      {hasSubscription && paymentMethod && (
        <SlideUp>
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <CreditCard className="w-5 h-5 text-green-500" />
              Payment Method
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Your default payment method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold uppercase">
                    {paymentMethod.brand}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    •••• •••• •••• {paymentMethod.last4}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Expires {paymentMethod.expMonth}/{paymentMethod.expYear}
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleManageSubscription}
                className="border-slate-300 dark:border-slate-600"
              >
                Update
              </Button>
            </div>
          </CardContent>
        </Card>
        </SlideUp>
      )}

      {/* Billing History - Only show if user has subscription */}
      {hasSubscription && (
        <SlideUp>
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <FileText className="w-5 h-5 text-purple-500" />
              Billing History
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Your payment history and invoices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {billingHistory.map((invoice) => (
                <div 
                  key={invoice.id} 
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {invoice.amount === 0 ? 'Free Trial' : formatPrice(invoice.amount)}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {/* @ts-ignore */}
                        {formatDate(invoice.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant="outline" 
                      className="text-green-600 border-green-600"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Paid
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadInvoice(invoice.invoiceUrl)}
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </SlideUp>
      )}

      {/* Upgrade Prompt */}
      <SlideUp>
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-200 dark:border-indigo-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Ready to scale up?
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Upgrade to Enterprise for unlimited chatbots, conversations, and premium support.
                </p>
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
                  View Plans
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </SlideUp>
    </div>
  )
}
