'use client'

import { useState } from 'react'
import { DashboardHeader } from '@/components/layout/dashboard-header'
import { ChatbotManager } from '@/components/dashboard/chatbot-manager'
import { ChatbotCreator } from '@/components/dashboard/chatbot-creator'
import { motion } from 'framer-motion'

export default function ChatbotsPage() {
  const [showCreator, setShowCreator] = useState(false)

  const handleCreateNew = () => {
    setShowCreator(true)
  }

  const handleChatbotCreated = () => {
    setShowCreator(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />
      
      <div className="pt-16">
        {/* Page Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {showCreator ? 'Create New Chatbot' : 'Manage Chatbots'}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {showCreator 
                  ? 'Build a custom AI chatbot tailored to your business needs' 
                  : 'View and manage all your AI chatbots in one place'}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            key={showCreator ? 'creator' : 'manager'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {showCreator ? (
              <ChatbotCreator onChatbotCreated={handleChatbotCreated} />
            ) : (
              <ChatbotManager onCreateNew={handleCreateNew} />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
} 