'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SlideUp } from '@/components/animations/slide-up'
import { motion } from 'framer-motion'
import { Bot, Sparkles, Wand2, Send, RotateCcw, CheckCircle, Lightbulb } from 'lucide-react'

interface ChatbotCreatorProps {
  onChatbotCreated: () => void
}

export function ChatbotCreator({ onChatbotCreated }: ChatbotCreatorProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    personality: '',
    primaryGoal: '',
    targetAudience: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)

    // Simulate API call with realistic delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    console.log('Creating chatbot:', formData)

    setIsCreating(false)
    setFormData({
      name: '',
      description: '',
      industry: '',
      personality: '',
      primaryGoal: '',
      targetAudience: ''
    })
    onChatbotCreated()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleReset = () => {
    setFormData({
      name: '',
      description: '',
      industry: '',
      personality: '',
      primaryGoal: '',
      targetAudience: ''
    })
  }

  const industries = [
    { value: 'ecommerce', label: 'E-commerce', icon: '🛍️' },
    { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
    { value: 'finance', label: 'Finance', icon: '💰' },
    { value: 'education', label: 'Education', icon: '📚' },
    { value: 'real-estate', label: 'Real Estate', icon: '🏠' },
    { value: 'technology', label: 'Technology', icon: '💻' },
    { value: 'other', label: 'Other', icon: '🔧' }
  ]

  const personalities = [
    { value: 'professional', label: 'Professional & Formal', description: 'Business-focused and courteous' },
    { value: 'friendly', label: 'Friendly & Casual', description: 'Warm and approachable' },
    { value: 'enthusiastic', label: 'Enthusiastic & Energetic', description: 'Upbeat and motivational' },
    { value: 'helpful', label: 'Helpful & Patient', description: 'Supportive and understanding' },
    { value: 'creative', label: 'Creative & Innovative', description: 'Imaginative and inspiring' }
  ]

  const goals = [
    { value: 'customer-support', label: 'Customer Support', icon: '🎧' },
    { value: 'lead-generation', label: 'Lead Generation', icon: '🎯' },
    { value: 'sales', label: 'Sales & Conversion', icon: '💰' },
    { value: 'appointments', label: 'Appointment Booking', icon: '📅' },
    { value: 'faq', label: 'FAQ & Information', icon: '❓' },
    { value: 'onboarding', label: 'User Onboarding', icon: '👋' }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
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
            AI Chatbot Builder
          </span>
        </div>
        
        <h1 className="heading-secondary mb-4">Create Your Intelligent Assistant</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-balance">
          Build a custom AI chatbot tailored to your business needs in just a few minutes
        </p>
      </motion.div>

      {/* Main Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="glass-card p-8">
            {/* Basic Information */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    Basic Information
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Tell us about your chatbot's identity and purpose
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  className="space-y-3"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Chatbot Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Customer Support Assistant"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="glass-input"
                    required
                  />
                </motion.div>

                <motion.div
                  className="space-y-3"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Label htmlFor="industry" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Industry
                  </Label>
                  <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                    <SelectTrigger className="glass-input">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-slate-200 dark:border-slate-700">
                      {industries.map((industry) => (
                        <SelectItem key={industry.value} value={industry.value}>
                          <div className="flex items-center gap-2">
                            <span>{industry.icon}</span>
                            <span>{industry.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              </div>

              <motion.div
                className="space-y-3 mt-6"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe what your chatbot will do and how it will help your customers..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="glass-input min-h-24"
                  rows={4}
                />
              </motion.div>
            </div>

            {/* Personality & Goals */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-violet-600">
                  <Wand2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    Personality & Goals
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Define how your chatbot should behave and what it should achieve
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  className="space-y-3"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Label htmlFor="personality" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Personality
                  </Label>
                  <Select value={formData.personality} onValueChange={(value) => handleInputChange('personality', value)}>
                    <SelectTrigger className="glass-input">
                      <SelectValue placeholder="Choose personality style" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-slate-200 dark:border-slate-700">
                      {personalities.map((personality) => (
                        <SelectItem key={personality.value} value={personality.value}>
                          <div className="space-y-1">
                            <div className="font-medium">{personality.label}</div>
                            <div className="text-xs text-slate-500">{personality.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>

                <motion.div
                  className="space-y-3"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Label htmlFor="primaryGoal" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Primary Goal
                  </Label>
                  <Select value={formData.primaryGoal} onValueChange={(value) => handleInputChange('primaryGoal', value)}>
                    <SelectTrigger className="glass-input">
                      <SelectValue placeholder="Select main objective" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-slate-200 dark:border-slate-700">
                      {goals.map((goal) => (
                        <SelectItem key={goal.value} value={goal.value}>
                          <div className="flex items-center gap-2">
                            <span>{goal.icon}</span>
                            <span>{goal.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              </div>

              <motion.div
                className="space-y-3 mt-6"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Label htmlFor="targetAudience" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Target Audience
                </Label>
                <Input
                  id="targetAudience"
                  placeholder="e.g., Small business owners, Tech-savvy millennials, etc."
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  className="glass-input"
                />
              </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="glass-button w-full sm:w-auto border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  disabled={isCreating}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  type="submit" 
                  disabled={isCreating || !formData.name}
                  className="glass-button relative overflow-hidden group bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 w-full sm:w-auto min-w-40"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isCreating ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="w-4 h-4" />
                        </motion.div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Create Chatbot
                      </>
                    )}
                  </span>
                </Button>
              </motion.div>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Pro Tips for Better Results
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Be Specific',
              description: 'The more detailed your description, the better your chatbot will understand its role'
            },
            {
              title: 'Define Clear Goals',
              description: 'Choose a primary goal that aligns with your main business objective'
            },
            {
              title: 'Know Your Audience',
              description: 'Understanding your target audience helps create more effective conversations'
            },
            {
              title: 'Test Personality',
              description: 'You can always adjust the personality after creation based on user feedback'
            }
          ].map((tip, index) => (
            <motion.div
              key={index}
              className="p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                {tip.title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {tip.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
} 