'use client'

import React, { Component, ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ConvexErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Convex error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="p-4 bg-yellow-100/50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <h4 className="font-medium text-yellow-900 dark:text-yellow-100">
              Database Connection Issue
            </h4>
          </div>
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Unable to connect to the database. This feature requires a valid Convex configuration.
          </p>
          {this.state.error && (
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-2">
              Error: {this.state.error.message}
            </p>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
