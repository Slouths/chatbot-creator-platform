'use client'

import { useState, useMemo } from 'react'

import { ChatbotCreator } from '@/components/dashboard/chatbot-creator'
import { ChatbotManager } from '@/components/dashboard/chatbot-manager'
import { AnalyticsDashboard } from '@/components/dashboard/analytics-dashboard'
import { DemoShowcase } from '@/components/dashboard/demo-showcase'
import { DeploymentDashboard } from '@/components/dashboard/deployment-dashboard'
import { BillingDashboard } from '@/components/dashboard/billing-dashboard'
import { StripeSetup } from '@/components/dashboard/stripe-setup'
import { Header } from '@/components/layout/header'
import { motion } from 'framer-motion'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { 
  LayoutDashboard, 
  Plus, 
  Settings, 
  BarChart3, 
  Lightbulb,
  Rocket,
  CreditCard,
  ExternalLink,
  TrendingUp,
  Users,
  MessageCircle,
  Clock,
  Activity
} from 'lucide-react'
import { DemoDataPanel } from './demo-data-panel'

type DashboardTab = 'overview' | 'create' | 'manage' | 'analytics' | 'deploy' | 'billing' | 'setup' | 'demo'

export function DashboardLayout() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview')

  const tabs = useMemo(() => [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, color: 'from-blue-500 to-cyan-500' },
    { id: 'create', label: 'Create Bot', icon: Plus, color: 'from-green-500 to-emerald-500' },
    { id: 'manage', label: 'Manage Bots', icon: Settings, color: 'from-indigo-500 to-blue-500' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'from-blue-500 to-cyan-500' },
    { id: 'deploy', label: 'Deploy', icon: Rocket, color: 'from-emerald-500 to-teal-500' },
    { id: 'billing', label: 'Billing', icon: CreditCard, color: 'from-purple-500 to-indigo-500' },
    { id: 'setup', label: 'Setup', icon: ExternalLink, color: 'from-orange-500 to-red-500' },
    { id: 'demo', label: 'Examples', icon: Lightbulb, color: 'from-indigo-500 to-purple-500' }
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
      case 'deploy':
        return <DeploymentDashboard />
      case 'billing':
        return <BillingDashboard />
      case 'setup':
        return <StripeSetup />
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
      <Header />
      
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

        {/* Navigation Tabs - Fixed under AI Command Center */}
        <div 
          className="relative z-40 backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 border-b border-slate-200/50 dark:border-slate-700/50 shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="glass-card p-2 rounded-2xl">
              <div className="flex flex-wrap justify-center gap-2">
                {tabs.map((tab) => {
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
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-xl`}
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
  // Temporarily disable Convex queries to fix React hooks error
  // const organizations = useQuery(api.organizations.list)
  // const firstOrganization = organizations?.[0]
  
  // const analyticsData = useQuery(
  //   api.analytics.getOrganizationAnalytics, 
  //   firstOrganization ? {
  //     organizationId: firstOrganization._id,
  //     timeRange: "7d" as const
  //   } : "skip"
  // )
  
  const organizations = null
  const firstOrganization = null
  const analyticsData = null

  // Demo data (analytics queries temporarily disabled)
  const stats = [
    {
      title: 'Active Chatbots',
      value: '3',
      change: '+12%',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      description: 'Handling conversations'
    },
    {
      title: 'Total Conversations',
      value: '1,247',
      change: '+23%',
      icon: MessageCircle,
      color: 'from-green-500 to-emerald-500',
      description: 'This week'
    },
    {
      title: 'Satisfaction Rate',
      value: '4.2/5',
      change: '+0.3',
      icon: TrendingUp,
      color: 'from-indigo-500 to-blue-500',
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
  ]



  const activities = [
    { id: 1, icon: '✅', text: 'Customer Support Bot handled 23 inquiries', time: '2h ago', color: 'text-green-500' },
    { id: 2, icon: '📊', text: 'Sales Assistant qualified 5 new leads', time: '4h ago', color: 'text-blue-500' },
    { id: 3, icon: '⭐', text: 'Received 5-star rating from customer', time: '6h ago', color: 'text-blue-500' },
    { id: 4, icon: '🎯', text: 'Conversion rate increased by 12%', time: '1d ago', color: 'text-indigo-500' }
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            AI Command Center
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Welcome to your chatbot management dashboard. Create, monitor, and optimize your AI assistants in one place.
          </p>
        </motion.div>
      </div>

      {/* Demo Data Panel */}
      <DemoDataPanel />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
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

      {/* Recent Activity */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-600">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Recent Activity
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Latest conversations and bot updates
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-3 rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-colors"
            >
              <div className="text-2xl">
                {activity.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {activity.text}
                </p>
              </div>
              <div className="text-xs text-slate-400">
                {activity.time}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
} 