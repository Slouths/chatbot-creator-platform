'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SlideUp } from '@/components/animations/slide-up'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bot, 
  Plus, 
  MoreVertical, 
  Settings, 
  Play, 
  Pause, 
  Trash2, 
  MessageSquare, 
  TrendingUp, 
  Clock,
  Users,
  Sparkles,
  Eye,
  Copy,
  Edit
} from 'lucide-react'

// Mock data - replace with actual Convex queries
const mockChatbots = [
  {
    id: '1',
    name: 'Customer Support Bot',
    description: 'Handles customer inquiries and support tickets',
    industry: 'E-commerce',
    status: 'active',
    conversations: 1247,
    satisfaction: 4.8,
    lastActive: '2 hours ago',
    platform: 'Website',
    responseTime: '1.2s',
    personality: 'Professional'
  },
  {
    id: '2', 
    name: 'Sales Assistant',
    description: 'Qualifies leads and schedules sales calls',
    industry: 'Technology',
    status: 'active',
    conversations: 892,
    satisfaction: 4.6,
    lastActive: '1 hour ago',
    platform: 'WhatsApp',
    responseTime: '0.8s',
    personality: 'Friendly'
  },
  {
    id: '3',
    name: 'FAQ Helper',
    description: 'Answers frequently asked questions',
    industry: 'Healthcare',
    status: 'draft',
    conversations: 0,
    satisfaction: 0,
    lastActive: 'Never',
    platform: 'Instagram',
    responseTime: '0s',
    personality: 'Helpful'
  }
]

interface ChatbotManagerProps {
  onCreateNew: () => void
}

export function ChatbotManager({ onCreateNew }: ChatbotManagerProps) {
  const [chatbots, setChatbots] = useState(mockChatbots)
  const [filter, setFilter] = useState<'all' | 'active' | 'draft' | 'paused'>('all')

  const handleStatusChange = (id: string, newStatus: string) => {
    setChatbots(prev =>
      prev.map(bot =>
        bot.id === id ? { ...bot, status: newStatus } : bot
      )
    )
  }

  const handleDelete = (id: string) => {
    setChatbots(prev => prev.filter(bot => bot.id !== id))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
      case 'draft':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      case 'paused':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="w-3 h-3" />
      case 'draft':
        return <Edit className="w-3 h-3" />
      case 'paused':
        return <Pause className="w-3 h-3" />
      default:
        return null
    }
  }

  const filteredChatbots = filter === 'all' 
    ? chatbots 
    : chatbots.filter(bot => bot.status === filter)

  const stats = {
    total: chatbots.length,
    active: chatbots.filter(bot => bot.status === 'active').length,
    totalConversations: chatbots.reduce((sum, bot) => sum + bot.conversations, 0),
    avgSatisfaction: chatbots.filter(bot => bot.conversations > 0).reduce((sum, bot) => sum + bot.satisfaction, 0) / chatbots.filter(bot => bot.conversations > 0).length || 0
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
            <Bot className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <motion.div
              className="absolute inset-0 bg-indigo-500/20 rounded-full blur-sm"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <span className="font-medium text-slate-700 dark:text-slate-300">
            Chatbot Management
          </span>
        </div>
        
        <h1 className="heading-secondary mb-4">Manage Your AI Assistants</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-balance">
          Monitor, configure, and optimize all your chatbots from one central dashboard
        </p>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { 
            label: 'Total Chatbots', 
            value: stats.total, 
            icon: Bot, 
            color: 'from-blue-500 to-cyan-500',
            change: '+2 this month'
          },
          { 
            label: 'Active Bots', 
            value: stats.active, 
            icon: Play, 
            color: 'from-emerald-500 to-teal-500',
            change: '100% uptime'
          },
          { 
            label: 'Total Conversations', 
            value: stats.totalConversations.toLocaleString(), 
            icon: MessageSquare, 
            color: 'from-purple-500 to-violet-500',
            change: '+23% this week'
          },
          { 
            label: 'Avg Satisfaction', 
            value: stats.avgSatisfaction.toFixed(1) + '/5', 
            icon: TrendingUp, 
            color: 'from-orange-500 to-red-500',
            change: '+0.3 improvement'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              {stat.value}
            </div>
            <div className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
              {stat.label}
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">
              {stat.change}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters and Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row justify-between items-center gap-4"
      >
        <div className="flex gap-2">
          {(['all', 'active', 'draft', 'paused'] as const).map((status) => (
            <motion.button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                filter === status 
                  ? 'bg-indigo-500 text-white shadow-lg' 
                  : 'glass-card hover:bg-white/80 dark:hover:bg-slate-800/80'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </motion.button>
          ))}
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={onCreateNew}
            className="glass-button bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Bot
          </Button>
        </motion.div>
      </motion.div>

      {/* Chatbots Grid */}
      <AnimatePresence mode="wait">
        {filteredChatbots.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card p-12 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 mb-6">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              No {filter !== 'all' ? filter : ''} chatbots found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {filter === 'all' 
                ? "Get started by creating your first AI chatbot"
                : `No chatbots with ${filter} status`
              }
            </p>
            <Button 
              onClick={onCreateNew}
              className="glass-button bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Bot
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {filteredChatbots.map((chatbot, index) => (
              <motion.div
                key={chatbot.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="glass-card p-6 group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                      {chatbot.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                      {chatbot.description}
                    </p>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-card border-slate-200 dark:border-slate-700">
                      <DropdownMenuItem className="hover:bg-white/50 dark:hover:bg-slate-800/50">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-white/50 dark:hover:bg-slate-800/50">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-white/50 dark:hover:bg-slate-800/50">
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      {chatbot.status === 'active' ? (
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(chatbot.id, 'paused')}
                          className="hover:bg-white/50 dark:hover:bg-slate-800/50"
                        >
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(chatbot.id, 'active')}
                          className="hover:bg-white/50 dark:hover:bg-slate-800/50"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Activate
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => handleDelete(chatbot.id)}
                        className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Status and Platform */}
                <div className="flex items-center gap-2 mb-4">
                  <Badge className={`${getStatusColor(chatbot.status)} border-0 gap-1`}>
                    {getStatusIcon(chatbot.status)}
                    {chatbot.status.charAt(0).toUpperCase() + chatbot.status.slice(1)}
                  </Badge>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {chatbot.platform}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-slate-800/50">
                    <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {chatbot.conversations.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      Conversations
                    </div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-slate-800/50">
                    <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {chatbot.satisfaction > 0 ? chatbot.satisfaction.toFixed(1) : '-'}/5
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      Rating
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Industry:</span>
                    <span className="text-slate-900 dark:text-slate-100">{chatbot.industry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Response Time:</span>
                    <span className="text-slate-900 dark:text-slate-100">{chatbot.responseTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Last Active:</span>
                    <span className="text-slate-900 dark:text-slate-100">{chatbot.lastActive}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 