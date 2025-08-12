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