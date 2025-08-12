'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { SlideUp } from '@/components/animations/slide-up'

import { 
  TrendingUp, 
  MessageSquare, 
  Users, 
  Clock, 
  Target,
  Star,
  Activity,

  Loader2,
  Lightbulb
} from 'lucide-react'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d")
  
  // For now, using a default organization ID - in real app this would come from user context  
  const organizationId = "default_org" as Id<"organizations">
  
  // Fetch real analytics data from Convex
  const analyticsData = useQuery(api.analytics.getOrganizationAnalytics, {
    organizationId,
    timeRange
  })

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }



  const formatTimeRange = (range: string) => {
    switch (range) {
      case "7d": return "Last 7 days"
      case "30d": return "Last 30 days"
      case "90d": return "Last 90 days"
      default: return range
    }
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-slate-400" />
          <p className="text-slate-600 dark:text-slate-400">Loading analytics...</p>
        </div>
      </div>
    )
  }

  const { overview, trends, performance, insights } = analyticsData

  return (
    <div className="space-y-8">
      {/* Header with Time Range Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Analytics & Insights
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {formatTimeRange(timeRange)} • Real-time performance metrics
          </p>
        </div>
        
        <div className="flex gap-2">
          {(["7d", "30d", "90d"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {range === "7d" ? "7D" : range === "30d" ? "30D" : "90D"}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <SlideUp>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm text-emerald-600 font-medium">
                  +{Math.round((overview.totalChatbots / Math.max(overview.totalChatbots - 1, 1)) * 100)}%
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                {overview.totalChatbots}
              </h3>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
                Total Chatbots
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {overview.activeChatbots} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm text-emerald-600 font-medium">
                  +{Math.round((overview.totalConversations / Math.max(overview.totalConversations - 100, 1)) * 100)}%
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                {formatNumber(overview.totalConversations)}
              </h3>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
                Total Conversations
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {timeRange} period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 shadow-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm text-emerald-600 font-medium">
                  +{Math.round((overview.avgSatisfaction / 5) * 100)}%
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                {overview.avgSatisfaction}/5
              </h3>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
                Satisfaction Rate
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customer rating
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm text-emerald-600 font-medium">
                  -{Math.round((overview.avgResponseTime / Math.max(overview.avgResponseTime - 1, 1)) * 100)}%
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                {overview.avgResponseTime}s
              </h3>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
                Response Time
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Average speed
              </p>
            </CardContent>
          </Card>
        </div>
      </SlideUp>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Platform Distribution */}
        <SlideUp>
          <Card>
            <CardHeader>
                          <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Platform Distribution
            </CardTitle>
              <CardDescription>
                Conversations across different platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(trends.platformDistribution).map(([platform, count]) => {
                  const percentage = ((count as number) / overview.totalConversations) * 100
                  const colors = {
                    website: 'from-blue-500 to-cyan-500',
                    whatsapp: 'from-green-500 to-emerald-500',
                    messenger: 'from-blue-600 to-indigo-600',
                    instagram: 'from-purple-500 to-pink-500'
                  }
                  
                  return (
                    <div key={platform} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="capitalize text-slate-700 dark:text-slate-300">
                          {platform}
                        </span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {count as number} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress 
                        value={percentage} 
                        className="h-2"
                        style={{
                          '--progress-color': `linear-gradient(to right, ${colors[platform as keyof typeof colors] || 'from-slate-500 to-slate-600'})`
                        } as React.CSSProperties}
                      />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </SlideUp>

        {/* Top Performing Chatbots */}
        <SlideUp>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-500" />
                Top Performing Chatbots
              </CardTitle>
              <CardDescription>
                Based on conversation volume and satisfaction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performance.chatbotPerformance.slice(0, 5).map((bot, index) => (
                  <div key={bot.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-slate-400 text-white' :
                        index === 2 ? 'bg-amber-600 text-white' :
                        'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {bot.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {bot.conversations} conversations
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {bot.avgSatisfaction.toFixed(1)}
                        </span>
                      </div>
                      <div className={`text-xs ${bot.isActive ? 'text-emerald-600' : 'text-slate-500'}`}>
                        {bot.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </SlideUp>
      </div>

      {/* Daily Trends */}
      <SlideUp>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Daily Trends
            </CardTitle>
            <CardDescription>
              Conversation volume over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2">
              {trends.dailyStats.map((day) => {
                const maxConversations = Math.max(...trends.dailyStats.map(d => d.conversations))
                const height = maxConversations > 0 ? (day.conversations / maxConversations) * 100 : 0
                
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div 
                      className="w-full bg-gradient-to-t from-emerald-500 to-emerald-600 rounded-t-lg transition-all duration-300 hover:from-emerald-600 hover:to-emerald-700"
                      style={{ height: `${height}%` }}
                    />
                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                      {day.conversations}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </SlideUp>

      {/* Insights */}
      <SlideUp>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              AI Insights
            </CardTitle>
            <CardDescription>
              Automated analysis and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    insight.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800' :
                    insight.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800' :
                    'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{insight.icon}</span>
                    <div>
                      <h4 className={`font-medium mb-1 ${
                        insight.type === 'success' ? 'text-emerald-800 dark:text-emerald-200' :
                        insight.type === 'warning' ? 'text-yellow-800 dark:text-yellow-200' :
                        'text-blue-800 dark:text-blue-200'
                      }`}>
                        {insight.title}
                      </h4>
                      <p className={`text-sm ${
                        insight.type === 'success' ? 'text-emerald-700 dark:text-emerald-300' :
                        insight.type === 'warning' ? 'text-yellow-700 dark:text-yellow-300' :
                        'text-blue-700 dark:text-blue-300'
                      }`}>
                        {insight.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </SlideUp>

      {/* Recent Activity */}
      <SlideUp>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-500" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest conversations and events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performance.recentActivity.slice(0, 10).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700">
                      <MessageSquare className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        Conversation #{activity.id.slice(-6)}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(activity.lastMessageAt).toLocaleDateString()} • {activity.platform}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      activity.status === 'active' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                      activity.status === 'resolved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' :
                      activity.status === 'escalated' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </SlideUp>
    </div>
  )
} 