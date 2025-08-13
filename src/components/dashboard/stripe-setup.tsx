'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Copy, ExternalLink, Loader2 } from 'lucide-react'

export function StripeSetup() {
  const [isLoading, setIsLoading] = useState(false)
  const [setupResults, setSetupResults] = useState<any>(null)
  const [error, setError] = useState<string>('')

  const handleSetupProducts = async () => {
    setIsLoading(true)
    setError('')
    setSetupResults(null)

    try {
      const response = await fetch('/api/setup-stripe-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        setSetupResults(data)
      } else {
        setError(data.error || 'Failed to setup Stripe products')
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Setup error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <ExternalLink className="w-5 h-5 text-indigo-500" />
            Stripe Products Setup
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Set up your subscription products in Stripe to enable payments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!setupResults && !error && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Click the button below to automatically create Pro and Enterprise subscription products in your Stripe account.
                This only needs to be done once.
              </p>
              <Button
                onClick={handleSetupProducts}
                disabled={isLoading}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Products...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Setup Stripe Products
                  </>
                )}
              </Button>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">
                <strong>Error:</strong> {error}
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                Make sure your Stripe API key is valid and you have the necessary permissions.
              </p>
            </div>
          )}

          {setupResults && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium text-green-800 dark:text-green-200">
                  Products created successfully!
                </span>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-slate-900 dark:text-slate-100">
                  Copy these Price IDs to update your pricing:
                </h4>

                {setupResults.products?.map((product: any, index: number) => (
                  <div key={index} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg space-y-3">
                    <h5 className="font-medium text-slate-900 dark:text-slate-100">
                      {product.product}
                    </h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            Monthly ({product.monthly_amount})
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(product.monthly_price_id)}
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                        <code className="block p-2 bg-white dark:bg-slate-800 border rounded text-xs font-mono break-all">
                          {product.monthly_price_id}
                        </code>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            Yearly ({product.yearly_amount})
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(product.yearly_price_id)}
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                        <code className="block p-2 bg-white dark:bg-slate-800 border rounded text-xs font-mono break-all">
                          {product.yearly_price_id}
                        </code>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Next Steps:
                  </h5>
                  <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>1. Copy the Price IDs above</li>
                    <li>2. Update your pricing component with these real Price IDs</li>
                    <li>3. Set up webhooks in your Stripe Dashboard</li>
                    <li>4. Test the subscription flow</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
