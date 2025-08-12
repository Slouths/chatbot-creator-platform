'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

import { Badge } from '@/components/ui/badge'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bot, 
  Play, 
  Lightbulb,
  Send,
  User,
  Star,
  Copy,
  Settings
} from 'lucide-react'

const demoExamples = [
  {
    id: '1',
    name: 'E-commerce Assistant',
    industry: 'E-commerce',
    description: '24/7 customer support that handles returns, shipping, and product recommendations',
    features: ['Order tracking', 'Return processing', 'Product recommendations', 'Shipping info'],
    benefits: ['Reduced support tickets by 40%', '24/7 availability', 'Instant responses'],
    demoMessages: [
      { type: 'bot', message: "Hi! I'm your AI shopping assistant. How can I help you today? I can track orders, process returns, or help you find the perfect product!" },
      { type: 'user', message: "I'd like to track my recent order" },
      { type: 'bot', message: "I'd be happy to help you track your order! Could you please provide your order number or the email address used for the purchase?" },
      { type: 'user', message: "My order number is #12345" },
      { type: 'bot', message: "Great! I found your order #12345. Your package is currently in transit and should arrive tomorrow between 2-6 PM. You can track it in real-time using this link. Is there anything else I can help you with?" }
    ],
    icon: '🛍️',
    color: 'from-blue-500 to-cyan-500',
    stats: { satisfaction: 4.8, conversations: '2.1K', conversion: '18%' }
  },
  {
    id: '2',
    name: 'Healthcare Support',
    industry: 'Healthcare',
    description: 'Appointment scheduling and patient support with HIPAA compliance',
    features: ['Appointment booking', 'Symptom assessment', 'Prescription reminders', 'Insurance help'],
    benefits: ['50% faster booking', 'Reduced no-shows', 'Improved patient satisfaction'],
    demoMessages: [
      { type: 'bot', message: "Hello! I'm here to help you with your healthcare needs. I can schedule appointments, answer questions about your visit, or help with insurance queries. What would you like assistance with today?" },
      { type: 'user', message: "I need to schedule a check-up" },
      { type: 'bot', message: "I'd be happy to help you schedule a check-up! Let me check available slots. What type of appointment do you need - general consultation, specialist visit, or routine check-up?" },
      { type: 'user', message: "Just a routine check-up" },
      { type: 'bot', message: "Perfect! I have availability this Friday at 2:30 PM or next Monday at 10:00 AM with Dr. Smith. Which time works better for you?" }
    ],
    icon: '🏥',
    color: 'from-emerald-500 to-teal-500',
    stats: { satisfaction: 4.9, conversations: '1.8K', conversion: '85%' }
  },
  {
    id: '3',
    name: 'Real Estate Agent',
    industry: 'Real Estate',
    description: 'Lead qualification and property inquiries with virtual tours',
    features: ['Property search', 'Virtual tours', 'Mortgage calculator', 'Market insights'],
    benefits: ['60% more qualified leads', 'Faster response times', 'Higher conversion rates'],
    demoMessages: [
      { type: 'bot', message: "Welcome! I'm your personal real estate assistant. I can help you find properties, schedule viewings, or answer questions about the market. What are you looking for today?" },
      { type: 'user', message: "I'm looking for a 3-bedroom house under $500k" },
      { type: 'bot', message: "Excellent! I found 12 properties matching your criteria. Here are the top 3 options in great neighborhoods. Would you like to see photos, schedule a virtual tour, or get more details about any of these?" },
      { type: 'user', message: "Can I see a virtual tour?" },
      { type: 'bot', message: "Absolutely! I can arrange a virtual tour for any of these properties. The virtual tour includes 360° views, detailed floor plans, and neighborhood insights. Which property interests you most?" }
    ],
    icon: '🏠',
    color: 'from-purple-500 to-violet-500',
    stats: { satisfaction: 4.7, conversations: '950', conversion: '24%' }
  }
]

export function DemoShowcase() {
  const [selectedDemo, setSelectedDemo] = useState(demoExamples[0])
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)

  const handleDemoSelect = (demo: typeof demoExamples[0]) => {
    setSelectedDemo(demo)
    setCurrentMessageIndex(0)
    setIsChatOpen(true)
    setIsTyping(false)
  }

  const handleNextMessage = () => {
    if (currentMessageIndex < selectedDemo.demoMessages.length - 1) {
      setIsTyping(true)
      setTimeout(() => {
        setCurrentMessageIndex(currentMessageIndex + 1)
        setIsTyping(false)
      }, 1000)
    }
  }

  const resetDemo = () => {
    setCurrentMessageIndex(0)
    setIsTyping(false)
  }

  const visibleMessages = selectedDemo.demoMessages.slice(0, currentMessageIndex + 1)

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
            <Lightbulb className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <motion.div
              className="absolute inset-0 bg-indigo-500/20 rounded-full blur-sm"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <span className="font-medium text-slate-700 dark:text-slate-300">
            Live Demonstrations
          </span>
        </div>
        
        <h1 className="heading-secondary mb-4">See AI Chatbots in Action</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-balance">
          Explore real-world examples and interact with live demos to see how our chatbots work
        </p>
      </motion.div>

      {/* Demo Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {demoExamples.map((demo, index) => (
          <motion.div
            key={demo.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`glass-card p-6 cursor-pointer group ${
              selectedDemo.id === demo.id ? 'ring-2 ring-indigo-500/50' : ''
            }`}
            onClick={() => handleDemoSelect(demo)}
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${demo.color} shadow-lg group-hover:scale-110 transition-transform`}>
                <span className="text-2xl">{demo.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  {demo.name}
                </h3>
                <Badge variant="outline" className="mt-1 text-xs">
                  {demo.industry}
                </Badge>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
              {demo.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-2 rounded-lg bg-white/50 dark:bg-slate-800/50">
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {demo.stats.satisfaction}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Rating
                </div>
              </div>
              <div className="text-center p-2 rounded-lg bg-white/50 dark:bg-slate-800/50">
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {demo.stats.conversations}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Chats
                </div>
              </div>
              <div className="text-center p-2 rounded-lg bg-white/50 dark:bg-slate-800/50">
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {demo.stats.conversion}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Success
                </div>
              </div>
            </div>

            {/* CTA */}
            <Button 
              className={`w-full ${
                selectedDemo.id === demo.id 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  : 'glass-button border-slate-200 dark:border-slate-700'
              }`}
              size="sm"
            >
              <Play className="w-4 h-4 mr-2" />
              {selectedDemo.id === demo.id ? 'Active Demo' : 'Try Demo'}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Interactive Chat Demo */}
      <AnimatePresence mode="wait">
        {isChatOpen && (
          <motion.div
            key={selectedDemo.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${selectedDemo.color}`}>
                  <span className="text-xl">{selectedDemo.icon}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {selectedDemo.name} Demo
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Interactive chat simulation
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={resetDemo}
                  className="glass-button"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="glass-button"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 min-h-96 relative">
              <div className="space-y-4 mb-4">
                <AnimatePresence>
                  {visibleMessages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.3 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-md p-3 rounded-2xl ${
                        message.type === 'user' 
                          ? 'bg-indigo-500 text-white ml-12' 
                          : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 mr-12 shadow-sm'
                      }`}>
                        <div className="flex items-start gap-2">
                          {message.type === 'bot' && (
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Bot className="w-3 h-3 text-white" />
                            </div>
                          )}
                          <p className="text-sm leading-relaxed">
                            {message.message}
                          </p>
                          {message.type === 'user' && (
                            <div className="w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <User className="w-3 h-3 text-slate-600 dark:text-slate-300" />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white dark:bg-slate-700 p-3 rounded-2xl mr-12 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                        <div className="flex space-x-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full"
                              animate={{ y: [0, -4, 0] }}
                              transition={{ 
                                duration: 0.6, 
                                repeat: Infinity, 
                                delay: i * 0.2 
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Chat Controls */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 glass-card p-3 rounded-xl">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {currentMessageIndex < selectedDemo.demoMessages.length - 1 
                        ? 'Click "Continue" to see the next message'
                        : 'Demo complete! Click "Reset" to start over'
                      }
                    </div>
                  </div>
                  {currentMessageIndex < selectedDemo.demoMessages.length - 1 && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        onClick={handleNextMessage}
                        disabled={isTyping}
                        className="glass-button bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Continue
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Features & Benefits */}
      {isChatOpen && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Features */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Key Features
            </h3>
            <div className="space-y-3">
              {selectedDemo.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Business Benefits
            </h3>
            <div className="space-y-3">
              {selectedDemo.benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <Star className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {benefit}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
} 