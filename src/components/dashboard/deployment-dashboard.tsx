'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { motion } from 'framer-motion'
import { 
  Globe, 
  MessageCircle, 
  Instagram, 
  Facebook,
  Copy,
  Check,
  ExternalLink,
  Code,
  Smartphone,
  Zap,
  Settings,
  Play,
  AlertCircle,
  ChevronRight,
  Download
} from 'lucide-react'
import { SlideUp } from '@/components/animations/slide-up'

type Platform = 'website' | 'whatsapp' | 'instagram' | 'messenger'
type DeploymentStep = 'setup' | 'configure' | 'deploy' | 'test'

interface ChatbotDeployment {
  id: string
  name: string
  platforms: Platform[]
  status: 'draft' | 'configured' | 'live'
  embedCode?: string
  webhookUrl?: string
  apiKeys?: Record<string, string>
}

export function DeploymentDashboard() {
  const [selectedChatbot, setSelectedChatbot] = useState<ChatbotDeployment | null>(null)
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('website')
  const [currentStep, setCurrentStep] = useState<DeploymentStep>('setup')
  const [copiedCode, setCopiedCode] = useState(false)

  // Mock chatbots - in real app this would come from API
  const chatbots: ChatbotDeployment[] = [
    {
      id: '1',
      name: 'Customer Support Bot',
      platforms: ['website', 'whatsapp'],
      status: 'live',
      embedCode: `<!-- ChatBot Widget -->
<script>
  window.chatbotConfig = {
    botId: 'csb_1234567890',
    apiUrl: 'https://api.chatbotcreator.com',
    theme: 'light',
    position: 'bottom-right',
    primaryColor: '#6366f1'
  };
</script>
<script src="https://cdn.chatbotcreator.com/widget.js" async></script>`,
      webhookUrl: 'https://api.chatbotcreator.com/webhook/csb_1234567890'
    },
    {
      id: '2', 
      name: 'Sales Assistant',
      platforms: ['website'],
      status: 'configured',
      embedCode: `<!-- ChatBot Widget -->
<script>
  window.chatbotConfig = {
    botId: 'sa_0987654321',
    apiUrl: 'https://api.chatbotcreator.com',
    theme: 'light',
    position: 'bottom-right',
    primaryColor: '#10b981'
  };
</script>
<script src="https://cdn.chatbotcreator.com/widget.js" async></script>`
    }
  ]

  const platforms = [
    {
      id: 'website' as Platform,
      name: 'Website Widget',
      icon: Globe,
      description: 'Embed on any website (Wix, WordPress, Shopify, etc.)',
      difficulty: 'Easy',
      time: '5 minutes',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'whatsapp' as Platform,
      name: 'WhatsApp Business',
      icon: MessageCircle,
      description: 'Connect to WhatsApp Business API',
      difficulty: 'Medium',
      time: '15 minutes',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'instagram' as Platform,
      name: 'Instagram DMs',
      icon: Instagram,
      description: 'Respond to Instagram direct messages',
      difficulty: 'Medium',
      time: '10 minutes',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 'messenger' as Platform,
      name: 'Facebook Messenger',
      icon: Facebook,
      description: 'Connect to Facebook Messenger',
      difficulty: 'Medium',
      time: '10 minutes',
      color: 'from-indigo-500 to-blue-500'
    }
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const renderWebsiteDeployment = () => (
    <div className="space-y-6">
      {/* Embed Code */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-500" />
            Embed Code
          </CardTitle>
          <CardDescription>
            Copy and paste this code into your website's HTML
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <pre className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg text-sm overflow-x-auto">
              <code>{selectedChatbot?.embedCode}</code>
            </pre>
            <Button
              onClick={() => copyToClipboard(selectedChatbot?.embedCode || '')}
              className="absolute top-2 right-2"
              size="sm"
              variant="outline"
            >
              {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedCode ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Platform-Specific Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wix Instructions */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900 dark:text-slate-100">Wix Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">1</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Go to your Wix Editor</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">2</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Click "Add" → "Embed Code" → "HTML iframe"</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">3</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Paste the embed code and publish</p>
            </div>
          </CardContent>
        </Card>

        {/* WordPress Instructions */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900 dark:text-slate-100">WordPress Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">1</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Go to WordPress Admin → Appearance → Theme Editor</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">2</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Edit footer.php or header.php</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">3</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Paste code before closing &lt;/body&gt; tag</p>
            </div>
          </CardContent>
        </Card>

        {/* Shopify Instructions */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900 dark:text-slate-100">Shopify Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">1</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Go to Online Store → Themes → Actions → Edit Code</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">2</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Open theme.liquid file</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">3</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Paste code before &lt;/head&gt; and save</p>
            </div>
          </CardContent>
        </Card>

        {/* Custom HTML */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900 dark:text-slate-100">Custom HTML</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">1</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Open your HTML file</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">2</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Paste code before &lt;/body&gt; closing tag</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">3</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Upload and test your website</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Widget */}
      <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
            <Play className="w-5 h-5" />
            Test Your Widget
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-emerald-700 dark:text-emerald-300 mb-4">
            Preview how your chatbot will look on your website
          </p>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Test Page
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderWhatsAppDeployment = () => (
    <div className="space-y-6">
      {/* Requirements */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <AlertCircle className="w-5 h-5" />
            Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-blue-700 dark:text-blue-300">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              WhatsApp Business Account
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              Facebook Business Manager Account
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              Phone number for verification
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Step-by-step setup */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle>WhatsApp Business API Setup</CardTitle>
          <CardDescription>Follow these steps to connect your WhatsApp Business account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-medium">1</div>
            <div className="flex-1">
              <h4 className="font-medium mb-2 text-slate-900 dark:text-slate-100">Create WhatsApp Business Account</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Go to Facebook Business Manager and create a WhatsApp Business account
              </p>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Facebook Business Manager
              </Button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-medium">2</div>
            <div className="flex-1">
              <h4 className="font-medium mb-2 text-slate-900 dark:text-slate-100">Get API Credentials</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Generate your access token and phone number ID
              </p>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="whatsapp-token">Access Token</Label>
                  <Input 
                    id="whatsapp-token" 
                    placeholder="Enter your WhatsApp access token"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone-number-id">Phone Number ID</Label>
                  <Input 
                    id="phone-number-id" 
                    placeholder="Enter your phone number ID"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-medium">3</div>
            <div className="flex-1">
              <h4 className="font-medium mb-2 text-slate-900 dark:text-slate-100">Configure Webhook</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Set up webhook URL to receive messages
              </p>
              <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg">
                <Label className="text-xs text-slate-500">Webhook URL</Label>
                <code className="block font-mono text-sm">{selectedChatbot?.webhookUrl}</code>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-medium">4</div>
            <div className="flex-1">
              <h4 className="font-medium mb-2 text-slate-900 dark:text-slate-100">Test Connection</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Send a test message to verify the connection
              </p>
              <Button>
                <Smartphone className="w-4 h-4 mr-2" />
                Send Test Message
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderInstagramDeployment = () => (
    <div className="space-y-6">
      {/* Requirements */}
      <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
            <AlertCircle className="w-5 h-5" />
            Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-purple-700 dark:text-purple-300">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              Instagram Business Account
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              Facebook Page connected to Instagram
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              Facebook App with Instagram Basic Display API
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Setup steps */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle>Instagram Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-medium">1</div>
            <div className="flex-1">
              <h4 className="font-medium mb-2 text-slate-900 dark:text-slate-100">Convert to Business Account</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Switch your Instagram account to a Business account and connect it to a Facebook Page
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-medium">2</div>
            <div className="flex-1">
              <h4 className="font-medium mb-2 text-slate-900 dark:text-slate-100">Create Facebook App</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Create a Facebook app and enable Instagram Basic Display API
              </p>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Facebook Developers Console
              </Button>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-medium">3</div>
            <div className="flex-1">
              <h4 className="font-medium mb-2 text-slate-900 dark:text-slate-100">Configure Webhook</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Set up webhook to receive Instagram messages
              </p>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="instagram-token">Instagram Access Token</Label>
                  <Input 
                    id="instagram-token" 
                    placeholder="Enter Instagram access token"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderMessengerDeployment = () => (
    <div className="space-y-6">
      {/* Requirements */}
      <Card className="bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-800 dark:text-indigo-200">
            <AlertCircle className="w-5 h-5" />
            Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-indigo-700 dark:text-indigo-300">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              Facebook Page
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              Facebook App
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              Page Admin access
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Setup steps */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle>Facebook Messenger Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-medium">1</div>
            <div className="flex-1">
              <h4 className="font-medium mb-2 text-slate-900 dark:text-slate-100">Create Facebook Page</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Create a Facebook Page for your business if you don't have one
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-medium">2</div>
            <div className="flex-1">
              <h4 className="font-medium mb-2 text-slate-900 dark:text-slate-100">Set Up Facebook App</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Create a Facebook app and add Messenger platform
              </p>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="page-token">Page Access Token</Label>
                  <Input 
                    id="page-token" 
                    placeholder="Enter page access token"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="verify-token">Verify Token</Label>
                  <Input 
                    id="verify-token" 
                    placeholder="Create a verify token"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-medium">3</div>
            <div className="flex-1">
              <h4 className="font-medium mb-2 text-slate-900 dark:text-slate-100">Configure Webhook</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Set up webhook URL for Messenger
              </p>
              <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg">
                <Label className="text-xs text-slate-500">Webhook URL</Label>
                <code className="block font-mono text-sm">{selectedChatbot?.webhookUrl}/messenger</code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderPlatformContent = () => {
    switch (selectedPlatform) {
      case 'website':
        return renderWebsiteDeployment()
      case 'whatsapp':
        return renderWhatsAppDeployment()
      case 'instagram':
        return renderInstagramDeployment()
      case 'messenger':
        return renderMessengerDeployment()
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Deploy Your Chatbots
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Connect your AI chatbots to websites and social platforms
        </p>
      </div>

      {/* Chatbot Selection */}
      <SlideUp>
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle>Select Chatbot to Deploy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chatbots.map((chatbot) => (
                <div
                  key={chatbot.id}
                  onClick={() => setSelectedChatbot(chatbot)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedChatbot?.id === chatbot.id
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{chatbot.name}</h3>
                    <Badge variant={chatbot.status === 'live' ? 'default' : 'secondary'}>
                      {chatbot.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    {chatbot.platforms.map((platform) => {
                      const platformInfo = platforms.find(p => p.id === platform)
                      if (!platformInfo) return null
                      const Icon = platformInfo.icon
                      return (
                        <div key={platform} className="flex items-center gap-1">
                          <Icon className="w-4 h-4" />
                          <span className="text-xs">{platformInfo.name}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </SlideUp>

      {selectedChatbot && (
        <>
          {/* Platform Selection */}
          <SlideUp>
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle>Choose Platform</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">Select where you want to deploy this chatbot</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
                  {platforms.map((platform) => {
                    const Icon = platform.icon
                    return (
                      <motion.div
                        key={platform.id}
                        whileHover={{ y: -2 }}
                        onClick={() => setSelectedPlatform(platform.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all h-full flex flex-col ${
                          selectedPlatform === platform.id
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${platform.color} flex items-center justify-center mb-3`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-medium mb-1 text-slate-900 dark:text-slate-100">{platform.name}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {platform.description}
                        </p>
                        <div className="flex items-center justify-between text-xs mt-auto">
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md font-medium">
                            {platform.difficulty}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">{platform.time}</span>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </SlideUp>

          {/* Deployment Content */}
          <SlideUp>
            {renderPlatformContent()}
          </SlideUp>
        </>
      )}
    </div>
  )
}
