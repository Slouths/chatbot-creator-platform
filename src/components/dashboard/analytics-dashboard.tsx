'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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


export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d")
  
  // Get the first available organization - in real app this would come from user context
  const organizations = useQuery(api.organizations.list)
  const firstOrganization = organizations?.[0]
  
  // Fetch real analytics data from Convex only if we have an organization
  const analyticsData = useQuery(
    api.analytics.getOrganizationAnalytics, 
    firstOrganization ? {
      organizationId: firstOrganization._id,
      timeRange
    } : "skip"
  )

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

  if (!organizations) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-slate-400" />
          <p className="text-slate-600 dark:text-slate-400">Loading organizations...</p>
        </div>
      </div>
    )
  }

  if (!firstOrganization) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Lightbulb className="w-12 h-12 mx-auto mb-4 text-indigo-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            No Analytics Data Available
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            You need to seed demo data to see analytics. Go to the Overview tab and click &quot;Seed Demo Data&quot;.
          </p>
        </div>
      </div>
    )
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
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
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

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
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

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 shadow-lg">
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

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
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
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Platform Distribution
            </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
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
                    instagram: 'from-indigo-500 to-blue-500'
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
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${colors[platform as keyof typeof colors] || 'from-slate-500 to-slate-600'} transition-all duration-300`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </SlideUp>

        {/* Top Performing Chatbots */}
        <SlideUp>
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <Target className="w-5 h-5 text-emerald-500" />
                Top Performing Chatbots
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Based on conversation volume and satisfaction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performance.chatbotPerformance.slice(0, 5).map((bot, index) => (
                  <div key={bot.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-emerald-500 text-white' :
                        index === 1 ? 'bg-blue-500 text-white' :
                        index === 2 ? 'bg-indigo-500 text-white' :
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
                        <Star className="w-4 h-4 text-blue-500 fill-current" />
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
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Daily Trends
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
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
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Lightbulb className="w-5 h-5 text-indigo-500" />
              AI Insights
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
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
                    insight.type === 'warning' ? 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800' :
                    'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{insight.icon}</span>
                    <div>
                      <h4 className={`font-medium mb-1 ${
                        insight.type === 'success' ? 'text-emerald-800 dark:text-emerald-200' :
                        insight.type === 'warning' ? 'text-indigo-800 dark:text-indigo-200' :
                        'text-blue-800 dark:text-blue-200'
                      }`}>
                        {insight.title}
                      </h4>
                      <p className={`text-sm ${
                        insight.type === 'success' ? 'text-emerald-700 dark:text-emerald-300' :
                        insight.type === 'warning' ? 'text-indigo-700 dark:text-indigo-300' :
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
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Activity className="w-5 h-5 text-indigo-500" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
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
                      activity.status === 'escalated' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' :
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