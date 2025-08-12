'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { Loader2, Database, Trash2, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { ConvexErrorBoundary } from './convex-error-boundary'

function DemoDataPanelContent() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [lastAction, setLastAction] = useState<{
    type: 'seed' | 'clear'
    success: boolean
    message: string
  } | null>(null)

  // Check if Convex is properly configured
  const convexConfigured = process.env.NEXT_PUBLIC_CONVEX_URL !== undefined && 
                          process.env.NEXT_PUBLIC_CONVEX_URL !== "https://demo.convex.dev"

  // Initialize Convex mutations
  const seedDemoData = useMutation(api.seed.seedDemoData)
  const clearDemoData = useMutation(api.seed.clearDemoData)

  const handleSeedData = async () => {
    if (!convexConfigured) {
      setLastAction({
        type: 'seed',
        success: false,
        message: 'Convex database is not configured. Please set NEXT_PUBLIC_CONVEX_URL environment variable.'
      })
      return
    }

    setIsSeeding(true)
    setLastAction(null)
    
    try {
      const result = await seedDemoData({})
      setLastAction({
        type: 'seed',
        success: true,
        message: `Demo data seeded successfully! Created ${result.chatbotsCreated} chatbots and ${result.conversationsCreated} conversations.`
      })
    } catch (error) {
      setLastAction({
        type: 'seed',
        success: false,
        message: error instanceof Error ? error.message : 'Failed to seed demo data'
      })
    } finally {
      setIsSeeding(false)
    }
  }

  const handleClearData = async () => {
    if (!convexConfigured) {
      setLastAction({
        type: 'clear',
        success: false,
        message: 'Convex database is not configured. Please set NEXT_PUBLIC_CONVEX_URL environment variable.'
      })
      return
    }

    if (!confirm('Are you sure you want to clear all demo data? This action cannot be undone.')) {
      return
    }

    setIsClearing(true)
    setLastAction(null)
    
    try {
      await clearDemoData({})
      setLastAction({
        type: 'clear',
        success: true,
        message: 'All demo data cleared successfully!'
      })
    } catch (error) {
      setLastAction({
        type: 'clear',
        success: false,
        message: error instanceof Error ? error.message : 'Failed to clear demo data'
      })
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <Card className="border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-900 dark:text-orange-100">
          <Database className="w-5 h-5 text-orange-600" />
          Demo Data Management
        </CardTitle>
        <CardDescription className="text-orange-700 dark:text-orange-300">
          Seed or clear demo data for testing and demonstration purposes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Convex Configuration Warning */}
        {!convexConfigured && (
          <div className="p-4 bg-yellow-100/50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <h4 className="font-medium text-yellow-900 dark:text-yellow-100">
                Database Not Configured
              </h4>
            </div>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Convex database is not configured. Demo data features require setting the NEXT_PUBLIC_CONVEX_URL environment variable.
            </p>
          </div>
        )}

        {/* Demo Data Info */}
        <div className="p-4 bg-orange-100/50 dark:bg-orange-900/30 rounded-lg">
          <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">
            What gets created:
          </h4>
          <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-1">
            <li>• 1 demo organization (Pro plan)</li>
            <li>• 3 sample chatbots (Customer Support, Sales, FAQ)</li>
            <li>• 85+ sample conversations across different platforms</li>
            <li>• Real analytics data for testing</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleSeedData}
            disabled={isSeeding || isClearing || !convexConfigured}
            className="bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50"
          >
            {isSeeding ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Seeding Data...
              </>
            ) : (
              <>
                <Database className="w-4 h-4 mr-2" />
                Seed Demo Data
              </>
            )}
          </Button>

          <Button
            onClick={handleClearData}
            disabled={isSeeding || isClearing || !convexConfigured}
            variant="outline"
            className="border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-900/30 disabled:opacity-50"
          >
            {isClearing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Clearing Data...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Data
              </>
            )}
          </Button>
        </div>

        {/* Status Messages */}
        {lastAction && (
          <div className={`p-3 rounded-lg border ${
            lastAction.success
              ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-center gap-2">
              {lastAction.success ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm ${
                lastAction.success
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-red-800 dark:text-red-200'
              }`}>
                {lastAction.message}
              </span>
            </div>
          </div>
        )}

        {/* Warning */}
        <div className="text-xs text-orange-600 dark:text-orange-400 text-center">
          ⚠️ Demo data is for testing only. Clear it before using in production.
        </div>
      </CardContent>
    </Card>
  )
}

export function DemoDataPanel() {
  return (
    <ConvexErrorBoundary>
      <DemoDataPanelContent />
    </ConvexErrorBoundary>
  )
}
