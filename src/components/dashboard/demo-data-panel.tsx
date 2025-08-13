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

  // Initialize Convex mutations (temporarily disabled to fix React hooks error)
  // const seedDemoData = useMutation(api.seed.seedDemoData)
  // const clearDemoData = useMutation(api.seed.clearDemoData)
  const seedDemoData = null
  const clearDemoData = null

  const handleSeedData = async () => {
    if (!convexConfigured) {
      setLastAction({
        type: 'seed',
        success: false,
        message: 'Convex database is not configured. Please set NEXT_PUBLIC_CONVEX_URL environment variable.'
      })
      return
    }

    if (!seedDemoData) {
      setLastAction({
        type: 'seed',
        success: false,
        message: 'Demo data functionality is temporarily disabled'
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

    if (!clearDemoData) {
      setLastAction({
        type: 'clear',
        success: false,
        message: 'Demo data functionality is temporarily disabled'
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
    <Card className="border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-900 dark:text-indigo-100">
          <Database className="w-5 h-5 text-indigo-600" />
          Demo Data Management
        </CardTitle>
        <CardDescription className="text-indigo-700 dark:text-indigo-300">
          Seed or clear demo data for testing and demonstration purposes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Convex Configuration Warning */}
        {!convexConfigured && (
          <div className="p-4 bg-blue-100/50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <h4 className="font-medium text-blue-900 dark:text-blue-100">
                Database Not Configured
              </h4>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Convex database is not configured. Demo data features require setting the NEXT_PUBLIC_CONVEX_URL environment variable.
            </p>
          </div>
        )}

        {/* Demo Data Info */}
        <div className="p-4 bg-indigo-100/50 dark:bg-indigo-900/30 rounded-lg">
          <h4 className="font-medium text-indigo-900 dark:text-indigo-100 mb-2">
            What gets created:
          </h4>
          <ul className="text-sm text-indigo-800 dark:text-indigo-200 space-y-1">
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
            className="bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
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
            className="border-indigo-300 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-700 dark:text-indigo-300 dark:hover:bg-indigo-900/30 disabled:opacity-50"
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
        <div className="text-xs text-indigo-600 dark:text-indigo-400 text-center">
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
