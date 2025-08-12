'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { ChatbotCreator } from '@/components/dashboard/chatbot-creator'
import { ChatbotManager } from '@/components/dashboard/chatbot-manager'
import { AnalyticsDashboard } from '@/components/dashboard/analytics-dashboard'
import { DemoShowcase } from '@/components/dashboard/demo-showcase'
import { DashboardHeader } from '@/components/layout/dashboard-header'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Plus, 
  Settings, 
  BarChart3, 
  Lightbulb,
  TrendingUp,
  Users,
  MessageCircle,
  Clock
} from 'lucide-react'

type DashboardTab = 'overview' | 'create' | 'manage' | 'analytics' | 'demo'

export function DashboardLayout() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview')

  const tabs = useMemo(() => [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, color: 'from-blue-500 to-cyan-500' },
    { id: 'create', label: 'Create Bot', icon: Plus, color: 'from-green-500 to-emerald-500' },
    { id: 'manage', label: 'Manage Bots', icon: Settings, color: 'from-purple-500 to-violet-500' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'from-blue-500 to-cyan-500' },
    { id: 'demo', label: 'Examples', icon: Lightbulb, color: 'from-emerald-500 to-teal-500' }
  ], [])

  const handleChatbotCreated = () => {
    setActiveTab('manage')
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'create':
        return <ChatbotCreator onChatbotCreated={handleChatbotCreated} />
      case 'manage':
        return <ChatbotManager onCreateNew={() => setActiveTab('create')} />
      case 'analytics':
        return <AnalyticsDashboard />
      case 'demo':
        return <DemoShowcase />
      default:
        return <OverviewTab onCreateNew={() => setActiveTab('create')} />
    }
  }

  return (
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(135deg, rgb(248 250 252) 0%, rgb(239 246 255 / 0.3) 50%, rgb(238 242 255 / 0.2) 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <DashboardHeader />
      
      {/* Main Content */}
      <div className="pt-20 pb-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 via-blue-50/40 to-indigo-50/80 dark:from-slate-900/80 dark:via-blue-950/40 dark:to-indigo-950/80" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-slate-600 dark:text-slate-400">All systems operational</span>
              </div>
              
              <h1 className="heading-primary mb-4">
                AI Command Center
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-balance">
                Build, deploy, and optimize intelligent chatbots that transform customer interactions
              </p>
            </div>
          </div>
        </div>

        {/* Floating Navigation Tabs */}
        <div className="sticky top-20 z-40 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="glass-card p-2 rounded-2xl">
              <div className="flex flex-wrap justify-center gap-2">
                {tabs.map((tab, index) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as DashboardTab)}
                      className={`relative group flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                        isActive 
                          ? 'text-white shadow-lg' 
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTabBg"
                          className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-xl`}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <div className="relative z-10 flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </div>
                      {/* Hover glow */}
                      {!isActive && (
                        <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`} />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div key={activeTab}>
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

function OverviewTab({ onCreateNew }: { onCreateNew: () => void }) {
  const stats = useMemo(() => [
    {
      title: 'Active Chatbots',
      value: '2',
      change: '+12%',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      description: 'Handling conversations'
    },
    {
      title: 'Total Conversations',
      value: '2,139',
      change: '+23%',
      icon: MessageCircle,
      color: 'from-green-500 to-emerald-500',
      description: 'This week'
    },
    {
      title: 'Satisfaction Rate',
      value: '4.7/5',
      change: '+0.3',
      icon: TrendingUp,
      color: 'from-purple-500 to-violet-500',
      description: 'Customer rating'
    },
    {
      title: 'Response Time',
      value: '1.2s',
      change: '-0.3s',
      icon: Clock,
      color: 'from-blue-500 to-cyan-500',
      description: 'Average speed'
    }
  ], [])

  const quickActions = useMemo(() => [
    {
      title: 'Create New Chatbot',
      description: 'Build a custom AI chatbot in minutes',
      icon: Plus,
      color: 'from-indigo-500 to-purple-600',
      action: onCreateNew
    },
    {
      title: 'View Examples',
      description: 'Explore real-world implementations',
      icon: Lightbulb,
      color: 'from-emerald-500 to-teal-500',
      action: () => {}
    },
    {
      title: 'Analytics Dashboard',
      description: 'Deep dive into performance metrics',
      icon: BarChart3,
      color: 'from-emerald-500 to-teal-500',
      action: () => {}
    }
  ], [onCreateNew])

  const activities = useMemo(() => [
    { icon: '✅', text: 'Customer Support Bot handled 23 inquiries', time: '2h ago', color: 'text-green-500' },
    { icon: '📊', text: 'Sales Assistant qualified 5 new leads', time: '4h ago', color: 'text-blue-500' },
    { icon: '⭐', text: 'Received 5-star rating from customer', time: '6h ago', color: 'text-blue-500' },
    { icon: '🎯', text: 'Conversion rate increased by 12%', time: '1d ago', color: 'text-purple-500' }
  ], [])

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="glass-card p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h2 className="heading-secondary mb-4">
          Welcome to Your AI Command Center
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-balance">
          Orchestrate intelligent conversations that delight customers and drive business growth
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className="group glass-card p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-green-600 font-medium">
                {stat.change}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              {stat.value}
            </h3>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
              {stat.title}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <div
            key={action.title}
            onClick={action.action}
            className="group glass-card p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${action.color} shadow-lg`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  {action.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {action.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Recent Activity</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Latest updates from your chatbots</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors duration-200"
            >
              <div className={`text-xl ${activity.color}`}>
                {activity.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-700 dark:text-slate-300">{activity.text}</p>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 