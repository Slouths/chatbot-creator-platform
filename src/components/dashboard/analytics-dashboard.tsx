'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { SlideUp } from '@/components/animations/slide-up'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  MessageSquare, 
  Users, 
  Clock, 
  Target,
  Star,
  Activity,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react'

// Mock data - replace with actual Convex queries
const mockAnalytics = {
  overview: {
    totalChatbots: 3,
    activeChatbots: 2,
    totalConversations: 2139,
    avgSatisfaction: 4.7,
    responseTime: '2.3s',
    conversionRate: '12.4%'
  },
  performance: [
    { name: 'Customer Support Bot', conversations: 1247, satisfaction: 4.8, responseTime: '1.2s', conversionRate: '15.2%' },
    { name: 'Sales Assistant', conversations: 892, satisfaction: 4.6, responseTime: '0.8s', conversionRate: '18.7%' },
    { name: 'FAQ Helper', conversations: 0, satisfaction: 0, responseTime: '0s', conversionRate: '0%' }
  ],
  insights: [
    { metric: 'Most Active Hours', value: '2-4 PM EST', trend: 'up', change: '+23%' },
    { metric: 'Top Platform', value: 'WhatsApp', trend: 'up', change: '+45%' },
    { metric: 'Avg Session Length', value: '4.2 min', trend: 'down', change: '-8%' },
    { metric: 'Resolution Rate', value: '89.3%', trend: 'up', change: '+12%' }
  ],
  weeklyTrends: [
    { day: 'Mon', conversations: 320, satisfaction: 4.5 },
    { day: 'Tue', conversations: 410, satisfaction: 4.7 },
    { day: 'Wed', conversations: 380, satisfaction: 4.6 },
    { day: 'Thu', conversations: 450, satisfaction: 4.8 },
    { day: 'Fri', conversations: 390, satisfaction: 4.7 },
    { day: 'Sat', conversations: 189, satisfaction: 4.4 },
    { day: 'Sun', conversations: 210, satisfaction: 4.5 }
  ],
  platforms: [
    { name: 'WhatsApp', conversations: 856, percentage: 40, color: 'from-green-500 to-emerald-500' },
    { name: 'Website', conversations: 641, percentage: 30, color: 'from-blue-500 to-cyan-500' },
    { name: 'Instagram', conversations: 428, percentage: 20, color: 'from-purple-500 to-violet-500' },
    { name: 'Facebook', conversations: 214, percentage: 10, color: 'from-indigo-500 to-blue-500' }
  ]
}

export function AnalyticsDashboard() {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? ArrowUpRight : ArrowDownRight
  }

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-emerald-500' : 'text-red-500'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-3 glass-card px-6 py-3 mb-6">
          <div className="relative">
            <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <motion.div
              className="absolute inset-0 bg-indigo-500/20 rounded-full blur-sm"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <span className="font-medium text-slate-700 dark:text-slate-300">
            Analytics & Insights
          </span>
        </div>
        
        <h1 className="heading-secondary mb-4">Performance Dashboard</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-balance">
          Monitor your chatbot performance, track key metrics, and gain valuable insights
        </p>
      </motion.div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: 'Total Conversations',
            value: formatNumber(mockAnalytics.overview.totalConversations),
            change: '+23%',
            trend: 'up',
            icon: MessageSquare,
            color: 'from-blue-500 to-cyan-500'
          },
          {
            title: 'Average Satisfaction',
            value: mockAnalytics.overview.avgSatisfaction + '/5',
            change: '+0.3',
            trend: 'up',
            icon: Star,
            color: 'from-amber-500 to-orange-500'
          },
          {
            title: 'Response Time',
            value: mockAnalytics.overview.responseTime,
            change: '-0.5s',
            trend: 'up',
            icon: Clock,
            color: 'from-emerald-500 to-teal-500'
          },
          {
            title: 'Conversion Rate',
            value: mockAnalytics.overview.conversionRate,
            change: '+2.1%',
            trend: 'up',
            icon: Target,
            color: 'from-purple-500 to-violet-500'
          },
          {
            title: 'Active Chatbots',
            value: mockAnalytics.overview.activeChatbots.toString(),
            change: '100%',
            trend: 'up',
            icon: Activity,
            color: 'from-green-500 to-emerald-500'
          },
          {
            title: 'Weekly Growth',
            value: '+18.2%',
            change: '+5.1%',
            trend: 'up',
            icon: TrendingUp,
            color: 'from-indigo-500 to-purple-500'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="glass-card p-6 group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-sm font-medium ${getTrendColor(stat.trend)}`}>
                  {stat.change}
                </span>
                {React.createElement(getTrendIcon(stat.trend), {
                  className: `w-4 h-4 ${getTrendColor(stat.trend)}`
                })}
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {stat.title}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Performance by Chatbot */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Chatbot Performance
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Detailed metrics for each of your chatbots
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {mockAnalytics.performance.map((bot, index) => (
            <motion.div
              key={bot.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                  {bot.name}
                </h4>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    {formatNumber(bot.conversations)} conversations
                  </span>
                  <span className="text-amber-600 dark:text-amber-400">
                    ⭐ {bot.satisfaction > 0 ? bot.satisfaction.toFixed(1) : 'N/A'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Response Time</div>
                  <div className="font-medium text-slate-900 dark:text-slate-100">{bot.responseTime}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Conversion</div>
                  <div className="font-medium text-slate-900 dark:text-slate-100">{bot.conversionRate}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">Activity Level</div>
                  <Progress 
                    value={bot.conversations / 15} 
                    className="h-2 bg-slate-200 dark:bg-slate-700"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Platform Distribution
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Conversations by platform
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {mockAnalytics.platforms.map((platform, index) => (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${platform.color}`} />
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {platform.name}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {formatNumber(platform.conversations)} ({platform.percentage}%)
                  </div>
                </div>
                <div className="relative">
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${platform.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${platform.percentage}%` }}
                      transition={{ delay: 1 + index * 0.1, duration: 0.8 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Key Insights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Key Insights
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Important trends and metrics
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {mockAnalytics.insights.map((insight, index) => (
              <motion.div
                key={insight.metric}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-colors"
              >
                <div>
                  <div className="font-medium text-slate-900 dark:text-slate-100">
                    {insight.metric}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {insight.value}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-sm font-medium ${getTrendColor(insight.trend)}`}>
                    {insight.change}
                  </span>
                  {React.createElement(getTrendIcon(insight.trend), {
                    className: `w-4 h-4 ${getTrendColor(insight.trend)}`
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Weekly Trends Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Weekly Trends
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Conversation volume and satisfaction over the past week
            </p>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4">
          {mockAnalytics.weeklyTrends.map((day, index) => {
            const maxConversations = Math.max(...mockAnalytics.weeklyTrends.map(d => d.conversations))
            const height = (day.conversations / maxConversations) * 100
            
            return (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + index * 0.1 }}
                className="text-center"
              >
                <div className="mb-3 relative h-32 flex items-end">
                  <motion.div
                    className="w-full bg-gradient-to-t from-indigo-500 to-purple-600 rounded-t-lg relative group"
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: 1.4 + index * 0.1, duration: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs px-2 py-1 rounded">
                      {day.conversations}
                    </div>
                  </motion.div>
                </div>
                <div className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
                  {day.day}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  ⭐ {day.satisfaction.toFixed(1)}
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
} 