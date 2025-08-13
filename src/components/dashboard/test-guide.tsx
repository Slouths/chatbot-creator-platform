'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CheckCircle, 
  ExternalLink, 
  Play, 
  MessageCircle, 
  Globe, 
  Smartphone,
  Instagram,
  Facebook,
  Copy,
  Check,
  AlertTriangle,
  Info
} from 'lucide-react'
import { SlideUp } from '@/components/animations/slide-up'

export function TestGuide() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [copiedTest, setCopiedTest] = useState(false)

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const copyTestCode = () => {
    const testCode = `<!-- Test HTML Page for ChatBot Widget -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ChatBot Test Page</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 40px;
            background: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .hero {
            text-align: center;
            margin-bottom: 40px;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 40px 0;
        }
        .feature {
            padding: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="hero">
            <h1>Welcome to Our Test Site</h1>
            <p>This page demonstrates our AI chatbot integration. Try clicking the chat button!</p>
        </div>
        
        <div class="features">
            <div class="feature">
                <h3>🚀 Fast Responses</h3>
                <p>Get instant answers to your questions</p>
            </div>
            <div class="feature">
                <h3>🎯 Smart AI</h3>
                <p>Powered by advanced language models</p>
            </div>
            <div class="feature">
                <h3>📱 Mobile Friendly</h3>
                <p>Works perfectly on all devices</p>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 40px;">
            <p>Need help? Click the chat button in the bottom right!</p>
        </div>
    </div>

    <!-- ChatBot Widget Configuration -->
    <script>
        window.chatbotConfig = {
            botId: 'test_bot_123',
            apiUrl: 'https://api.chatbotcreator.com',
            theme: 'light',
            position: 'bottom-right',
            primaryColor: '#6366f1',
            welcomeMessage: 'Hi! I\\'m here to help you test our chatbot. Ask me anything!',
            title: 'Test Bot',
            subtitle: 'Testing our chatbot features'
        };
    </script>
    <script src="https://cdn.chatbotcreator.com/widget.js" async></script>
</body>
</html>`

    navigator.clipboard.writeText(testCode)
    setCopiedTest(true)
    setTimeout(() => setCopiedTest(false), 2000)
  }

  const testSteps = [
    {
      id: 'widget-display',
      title: 'Widget Display Test',
      description: 'Verify the chatbot widget appears correctly',
      steps: [
        'Check that the chat button appears in the bottom-right corner',
        'Verify the button has the correct color and styling',
        'Ensure the button is clickable and responsive'
      ]
    },
    {
      id: 'chat-functionality',
      title: 'Chat Functionality Test',
      description: 'Test basic chat interactions',
      steps: [
        'Click the chat button to open the chat window',
        'Verify the welcome message appears',
        'Type a test message and send it',
        'Check that your message appears in the chat',
        'Wait for the bot response (may show typing indicator)',
        'Verify the bot response appears correctly'
      ]
    },
    {
      id: 'responsive-design',
      title: 'Responsive Design Test',
      description: 'Test on different screen sizes',
      steps: [
        'Test on desktop (1200px+ width)',
        'Test on tablet (768px-1199px width)',
        'Test on mobile (320px-767px width)',
        'Verify chat window adapts to screen size',
        'Check that all buttons remain accessible'
      ]
    },
    {
      id: 'cross-browser',
      title: 'Cross-Browser Test',
      description: 'Ensure compatibility across browsers',
      steps: [
        'Test in Chrome (latest version)',
        'Test in Firefox (latest version)',
        'Test in Safari (if on Mac)',
        'Test in Edge (latest version)',
        'Verify consistent behavior across all browsers'
      ]
    }
  ]

  const platformTests = [
    {
      platform: 'WhatsApp',
      icon: MessageCircle,
      color: 'text-green-600',
      tests: [
        'Send a test message to your WhatsApp Business number',
        'Verify the bot receives and processes the message',
        'Check that responses are sent back correctly',
        'Test with different message types (text, emojis)',
        'Verify webhook delivery and status'
      ]
    },
    {
      platform: 'Instagram',
      icon: Instagram,
      color: 'text-indigo-600',
      tests: [
        'Send a DM to your Instagram Business account',
        'Verify the bot receives Instagram messages',
        'Check automated responses work correctly',
        'Test with different content types',
        'Verify Instagram API permissions'
      ]
    },
    {
      platform: 'Facebook Messenger',
      icon: Facebook,
      color: 'text-blue-600',
      tests: [
        'Send a message to your Facebook Page',
        'Verify Messenger webhook receives messages',
        'Check bot responses are delivered',
        'Test with different message formats',
        'Verify Page permissions and settings'
      ]
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Testing Your Chatbot Deployments
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Complete testing guide to ensure your chatbots work perfectly across all platforms
        </p>
      </div>

      <Tabs defaultValue="website" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="website">Website Widget</TabsTrigger>
          <TabsTrigger value="social">Social Platforms</TabsTrigger>
          <TabsTrigger value="tools">Testing Tools</TabsTrigger>
          <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
        </TabsList>

        <TabsContent value="website" className="space-y-6">
          {/* Quick Test HTML */}
          <SlideUp>
            <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                  <Globe className="w-5 h-5" />
                  Quick Test HTML Page
                </CardTitle>
                <CardDescription className="text-emerald-700 dark:text-emerald-300">
                  Use this HTML file to quickly test your chatbot widget
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-emerald-700 dark:text-emerald-300 text-sm">
                    Copy this HTML code, save it as a .html file, and open it in your browser to test your widget:
                  </p>
                  <Button onClick={copyTestCode} className="bg-emerald-600 hover:bg-emerald-700">
                    {copiedTest ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copiedTest ? 'Copied!' : 'Copy Test HTML'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </SlideUp>

          {/* Website Testing Checklist */}
          <SlideUp>
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle>Website Testing Checklist</CardTitle>
                <CardDescription>
                  Follow this checklist to thoroughly test your website widget
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {testSteps.map((step, index) => (
                    <div key={step.id} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-slate-100">{step.title}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{step.description}</p>
                        </div>
                      </div>
                      <div className="ml-11 space-y-2">
                        {step.steps.map((substep, stepIndex) => (
                          <label key={stepIndex} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={checkedItems[`${step.id}-${stepIndex}`] || false}
                              onChange={() => toggleCheck(`${step.id}-${stepIndex}`)}
                              className="rounded border-slate-300 text-blue-500 focus:ring-blue-500"
                            />
                            <span className={`text-sm ${
                              checkedItems[`${step.id}-${stepIndex}`] 
                                ? 'line-through text-slate-500' 
                                : 'text-slate-700 dark:text-slate-300'
                            }`}>
                              {substep}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </SlideUp>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          {/* Social Platform Testing */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {platformTests.map((platform) => {
              const Icon = platform.icon
              return (
                <SlideUp key={platform.platform}>
                  <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon className={`w-5 h-5 ${platform.color}`} />
                        {platform.platform} Testing
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {platform.tests.map((test, index) => (
                          <label key={index} className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={checkedItems[`${platform.platform.toLowerCase()}-${index}`] || false}
                              onChange={() => toggleCheck(`${platform.platform.toLowerCase()}-${index}`)}
                              className="mt-0.5 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
                            />
                            <span className={`text-sm ${
                              checkedItems[`${platform.platform.toLowerCase()}-${index}`]
                                ? 'line-through text-slate-500'
                                : 'text-slate-700 dark:text-slate-300'
                            }`}>
                              {test}
                            </span>
                          </label>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </SlideUp>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          {/* Testing Tools */}
          <SlideUp>
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-indigo-500" />
                  Testing Tools & Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">Browser Developer Tools</h4>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <li>• F12 or Right-click → Inspect Element</li>
                      <li>• Console tab for JavaScript errors</li>
                      <li>• Network tab to monitor API calls</li>
                      <li>• Device toolbar for mobile testing</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">Online Testing Tools</h4>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        BrowserStack (Cross-browser testing)
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Responsinator (Responsive testing)
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        PageSpeed Insights (Performance)
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SlideUp>

          {/* Performance Testing */}
          <SlideUp>
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                  <AlertTriangle className="w-5 h-5" />
                  Performance Checklist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Widget Loading</h4>
                    <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                      <li>✓ Widget loads within 2 seconds</li>
                      <li>✓ No JavaScript errors in console</li>
                      <li>✓ Script loads asynchronously</li>
                      <li>✓ Minimal impact on page speed</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">User Experience</h4>
                    <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                      <li>✓ Smooth animations and transitions</li>
                      <li>✓ Chat window opens/closes properly</li>
                      <li>✓ Messages send without delay</li>
                      <li>✓ Typing indicators work correctly</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SlideUp>
        </TabsContent>

        <TabsContent value="troubleshooting" className="space-y-6">
          {/* Common Issues */}
          <SlideUp>
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle>Common Issues & Solutions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Widget Not Appearing</h4>
                    <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                      <li>• Check that the script is included before closing &lt;/body&gt; tag</li>
                      <li>• Verify botId is correct in chatbotConfig</li>
                      <li>• Check browser console for JavaScript errors</li>
                      <li>• Ensure no ad blockers are interfering</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-indigo-500 pl-4">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Bot Not Responding</h4>
                    <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                      <li>• Check API URL is correct and accessible</li>
                      <li>• Verify bot is published and active</li>
                      <li>• Check network tab for failed API requests</li>
                      <li>• Ensure CORS is properly configured</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Styling Issues</h4>
                    <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                      <li>• Check if website CSS is conflicting</li>
                      <li>• Verify z-index is high enough (widget uses 1000000)</li>
                      <li>• Test on different screen sizes</li>
                      <li>• Ensure primaryColor is a valid hex code</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SlideUp>

          {/* Debug Console */}
          <SlideUp>
            <Card className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-slate-500" />
                  Debug Console Commands
                </CardTitle>
                <CardDescription>
                  Use these JavaScript commands in your browser console for debugging
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <code className="block bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm">
                      window.chatbotConfig // View current configuration
                    </code>
                  </div>
                  <div>
                    <code className="block bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm">
                      toggleChatbot() // Manually open/close chat window
                    </code>
                  </div>
                  <div>
                    <code className="block bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm">
                      console.log('ChatBot Widget Status:', window.chatbotWidgetInitialized)
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SlideUp>
        </TabsContent>
      </Tabs>
    </div>
  )
}
