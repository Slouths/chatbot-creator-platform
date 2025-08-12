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
import { Bot, Sparkles, Wand2, Send, RotateCcw, CheckCircle, Lightbulb, Upload, Globe, FileText, Loader2 } from 'lucide-react'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'
import { useUser } from '@clerk/nextjs'

interface ChatbotCreatorProps {
  onChatbotCreated: () => void
}

export function ChatbotCreator({ onChatbotCreated }: ChatbotCreatorProps) {
  const { } = useUser()
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    personality: '',
    primaryGoal: '',
    targetAudience: '',
    websiteUrl: '',
    companyFiles: [] as File[]
  })
  const [fileUploadStatus, setFileUploadStatus] = useState<string>('')
  const [error, setError] = useState<string>('')

  // Convex mutations
  const createChatbot = useMutation(api.chatbots.create)
  const createChatbotWithFiles = useMutation(api.chatbots.createWithFiles)
  const createKnowledgeBases = useMutation(api.knowledge_bases.createFromFiles)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    setError('')

    try {
      // For now, we'll create a default organization ID
      // In a real app, you'd get this from the user's context
      const organizationId = "default_org" as Id<"organizations"> // This should come from user context
      
      if (formData.companyFiles.length > 0) {
        // Process files and create chatbot with knowledge base
        const fileData = await Promise.all(
          formData.companyFiles.map(async (file) => {
            const content = await readFileContent(file)
            return {
              name: file.name,
              content,
              contentType: getContentType(file.name),
              size: file.size,
              source: 'user_upload',
            }
          })
        )

        // Create knowledge bases first
        await createKnowledgeBases({
          organizationId,
          files: fileData,
        })

        // Create chatbot with knowledge base IDs
        await createChatbotWithFiles({
          organizationId,
          name: formData.name,
          description: formData.description,
          aiModel: "gpt-4" as const,
          personality: {
            tone: formData.personality,
            style: "professional",
            greeting_message: `Hello! I'm ${formData.name}, your AI assistant for ${formData.industry}. How can I help you today?`,
            fallback_message: "I'm sorry, I didn't understand that. Could you please rephrase your question?",
          },
          industry: formData.industry,
          primaryGoal: formData.primaryGoal,
          targetAudience: formData.targetAudience,
          websiteUrl: formData.websiteUrl,
          files: fileData,
        })
      } else {
        // Create chatbot without files
        await createChatbot({
          organizationId,
          name: formData.name,
          description: formData.description,
          aiModel: "gpt-4" as const,
          personality: {
            tone: formData.personality,
            style: "professional",
            greeting_message: `Hello! I'm ${formData.name}, your AI assistant for ${formData.industry}. How can I help you today?`,
            fallback_message: "I'm sorry, I didn't understand that. Could you please rephrase your question?",
          },
          industry: formData.industry,
          primaryGoal: formData.primaryGoal,
          targetAudience: formData.targetAudience,
          websiteUrl: formData.websiteUrl,
        })
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
        industry: '',
        personality: '',
        primaryGoal: '',
        targetAudience: '',
        websiteUrl: '',
        companyFiles: []
      })
      setFileUploadStatus('')
      
      // Notify parent component
      onChatbotCreated()
      
    } catch (err) {
      console.error('Error creating chatbot:', err)
      setError(err instanceof Error ? err.message : 'Failed to create chatbot')
    } finally {
      setIsCreating(false)
    }
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
      targetAudience: '',
      websiteUrl: '',
      companyFiles: []
    })
    setFileUploadStatus('')
    setError('')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const fileArray = Array.from(files)
      setFormData(prev => ({ ...prev, companyFiles: [...prev.companyFiles, ...fileArray] }))
      setFileUploadStatus(`${fileArray.length} file(s) uploaded successfully`)
      setTimeout(() => setFileUploadStatus(''), 3000)
    }
  }

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      companyFiles: prev.companyFiles.filter((_, i) => i !== index)
    }))
  }

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        resolve(content)
      }
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  const getContentType = (filename: string): "pdf" | "text" | "csv" => {
    const ext = filename.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'pdf': return 'pdf'
      case 'csv': return 'csv'
      case 'doc':
      case 'docx':
      case 'txt':
      default: return 'text'
    }
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
    { value: 'professional', label: 'Professional & Formal', icon: '👔' },
    { value: 'friendly', label: 'Friendly & Casual', icon: '😊' },
    { value: 'enthusiastic', label: 'Enthusiastic & Energetic', icon: '🚀' },
    { value: 'empathetic', label: 'Empathetic & Caring', icon: '🤗' },
    { value: 'technical', label: 'Technical & Detailed', icon: '⚙️' },
    { value: 'creative', label: 'Creative & Innovative', icon: '🎨' }
  ]

  const primaryGoals = [
    { value: 'customer-support', label: 'Customer Support', icon: '🎧' },
    { value: 'sales-assistance', label: 'Sales Assistance', icon: '💼' },
    { value: 'lead-generation', label: 'Lead Generation', icon: '🎯' },
    { value: 'product-information', label: 'Product Information', icon: '📋' },
    { value: 'appointment-booking', label: 'Appointment Booking', icon: '📅' },
    { value: 'faq-handling', label: 'FAQ Handling', icon: '❓' }
  ]

  const targetAudiences = [
    { value: 'general-public', label: 'General Public', icon: '👥' },
    { value: 'business-professionals', label: 'Business Professionals', icon: '💼' },
    { value: 'students', label: 'Students', icon: '🎓' },
    { value: 'seniors', label: 'Seniors', icon: '👴' },
    { value: 'tech-savvy', label: 'Tech-Savvy Users', icon: '🤖' },
    { value: 'beginners', label: 'Beginners', icon: '🌱' }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mb-4">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Create Your AI Chatbot
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Build a custom AI chatbot tailored to your business needs. Upload company files and provide context to create a knowledgeable assistant.
          </p>
        </motion.div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {fileUploadStatus && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-800 dark:text-green-200">{fileUploadStatus}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <SlideUp>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Provide the essential details about your chatbot
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Chatbot Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Customer Support Bot"
                    required
                    className="focus:ring-indigo-500/20 focus:border-indigo-500/50 border-slate-300 dark:border-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)} required>
                    <SelectTrigger className="focus:ring-indigo-500/20 focus:border-indigo-500/50 border-slate-300 dark:border-slate-600">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry.value} value={industry.value}>
                          <span className="mr-2">{industry.icon}</span>
                          {industry.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe what your chatbot will do and how it will help your business..."
                  rows={3}
                  required
                  className="focus:ring-indigo-500/20 focus:border-indigo-500/50 border-slate-300 dark:border-slate-600"
                />
              </div>
            </CardContent>
          </Card>
        </SlideUp>

        {/* Company Information */}
        <SlideUp>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                Company Information
              </CardTitle>
              <CardDescription>
                Help the AI understand your company better
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                  placeholder="https://yourcompany.com"
                  className="focus:ring-indigo-500/20 focus:border-indigo-500/50 border-slate-300 dark:border-slate-600"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="companyFiles">Company Files</Label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Upload company documents to give your chatbot knowledge about your business
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="companyFiles"
                  />
                  <label
                    htmlFor="companyFiles"
                    className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Files
                  </label>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Supported: PDF, DOC, DOCX, TXT, CSV (Max 10MB each)
                  </p>
                </div>
                
                {/* File List */}
                {formData.companyFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label>Uploaded Files:</Label>
                    <div className="space-y-2">
                      {formData.companyFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-slate-500" />
                            <span className="text-sm text-slate-700 dark:text-slate-300">{file.name}</span>
                            <span className="text-xs text-slate-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </SlideUp>

        {/* Personality & Behavior */}
        <SlideUp>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-emerald-500" />
                Personality & Behavior
              </CardTitle>
              <CardDescription>
                Define how your chatbot should interact with users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="personality">Personality *</Label>
                  <Select value={formData.personality} onValueChange={(value) => handleInputChange('personality', value)} required>
                    <SelectTrigger className="focus:ring-indigo-500/20 focus:border-indigo-500/50 border-slate-300 dark:border-slate-600">
                      <SelectValue placeholder="Select personality" />
                    </SelectTrigger>
                    <SelectContent>
                      {personalities.map((personality) => (
                        <SelectItem key={personality.value} value={personality.value}>
                          <span className="mr-2">{personality.icon}</span>
                          {personality.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryGoal">Primary Goal *</Label>
                  <Select value={formData.primaryGoal} onValueChange={(value) => handleInputChange('primaryGoal', value)} required>
                    <SelectTrigger className="focus:ring-indigo-500/20 focus:border-indigo-500/50 border-slate-300 dark:border-slate-600">
                      <SelectValue placeholder="Select primary goal" />
                    </SelectTrigger>
                    <SelectContent>
                      {primaryGoals.map((goal) => (
                        <SelectItem key={goal.value} value={goal.value}>
                          <span className="mr-2">{goal.icon}</span>
                          {goal.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience *</Label>
                <Select value={formData.targetAudience} onValueChange={(value) => handleInputChange('targetAudience', value)} required>
                  <SelectTrigger className="focus:ring-indigo-500/20 focus:border-indigo-500/50 border-slate-300 dark:border-slate-600">
                    <SelectValue placeholder="Select target audience" />
                  </SelectTrigger>
                  <SelectContent>
                    {targetAudiences.map((audience) => (
                      <SelectItem key={audience.value} value={audience.value}>
                        <span className="mr-2">{audience.icon}</span>
                        {audience.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </SlideUp>

        {/* Pro Tips */}
        <SlideUp>
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                <Lightbulb className="w-5 h-5 text-blue-500" />
                Pro Tips for Better Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Upload recent company documents to keep your chatbot up-to-date
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Be specific about your industry and target audience for better AI training
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Choose a personality that matches your brand voice and customer expectations
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Provide a clear description to help the AI understand your specific use case
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </SlideUp>

        {/* Action Buttons */}
        <SlideUp>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              type="submit"
              disabled={isCreating}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-8 py-3 text-lg"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Chatbot...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Create Chatbot
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isCreating}
              className="px-8 py-3 text-lg border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset Form
            </Button>
          </div>
        </SlideUp>
      </form>
    </div>
  )
} 