'use client'

import { useState } from 'react'
import { DashboardHeader } from '@/components/layout/dashboard-header'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SlideUp } from '@/components/animations/slide-up'
import { 
  User, 
  CreditCard, 
  Key, 
  Bell, 
  Shield, 
  Globe,
  Zap,
  Package
} from 'lucide-react'

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('account')

  const sections = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Zap },
  ]

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
                Settings
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage your account, billing, and platform preferences
              </p>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-4">
                  <nav className="space-y-1">
                    {sections.map((section) => {
                      const Icon = section.icon
                      return (
                        <button
                          key={section.id}
                          onClick={() => setActiveSection(section.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                            activeSection === section.id
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {section.label}
                        </button>
                      )
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {activeSection === 'account' && <AccountSettings />}
                {activeSection === 'billing' && <BillingSettings />}
                {activeSection === 'api' && <ApiSettings />}
                {activeSection === 'notifications' && <NotificationSettings />}
                {activeSection === 'security' && <SecuritySettings />}
                {activeSection === 'integrations' && <IntegrationSettings />}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AccountSettings() {
  return (
    <SlideUp>
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your personal information and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" defaultValue="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" placeholder="Acme Corp" defaultValue="Acme Corp" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" placeholder="CEO" defaultValue="CEO" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </SlideUp>
  )
}

function BillingSettings() {
  return (
    <div className="space-y-6">
      <SlideUp>
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>You are currently on the Pro plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div>
                <h3 className="font-semibold">Pro Plan</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">$49/month • Billed monthly</p>
              </div>
              <Button variant="outline">Change Plan</Button>
            </div>
          </CardContent>
        </Card>
      </SlideUp>

      <SlideUp delay={0.1}>
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Manage your payment methods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <CreditCard className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium">•••• •••• •••• 4242</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Expires 12/24</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Update</Button>
            </div>
          </CardContent>
        </Card>
      </SlideUp>
    </div>
  )
}

function ApiSettings() {
  return (
    <SlideUp>
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Manage your API keys for integrations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium">Production API Key</p>
              <Button variant="outline" size="sm">Regenerate</Button>
            </div>
            <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">sk_live_••••••••••••••••••••••••</code>
          </div>
          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium">Test API Key</p>
              <Button variant="outline" size="sm">Regenerate</Button>
            </div>
            <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">sk_test_••••••••••••••••••••••••</code>
          </div>
        </CardContent>
      </Card>
    </SlideUp>
  )
}

function NotificationSettings() {
  return (
    <SlideUp>
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Choose how you want to be notified</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: 'Email notifications', description: 'Receive updates via email', enabled: true },
            { label: 'Push notifications', description: 'Browser push notifications', enabled: false },
            { label: 'SMS alerts', description: 'Critical alerts via SMS', enabled: false },
            { label: 'Weekly reports', description: 'Summary of chatbot performance', enabled: true },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
              <Button 
                variant={item.enabled ? 'default' : 'outline'} 
                size="sm"
                className={item.enabled ? 'bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900' : ''}
              >
                {item.enabled ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </SlideUp>
  )
}

function SecuritySettings() {
  return (
    <div className="space-y-6">
      <SlideUp>
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Keep your account secure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security</p>
              </div>
              <Button variant="outline">Enable</Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <div>
                <p className="font-medium">Change Password</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Update your password regularly</p>
              </div>
              <Button variant="outline">Update</Button>
            </div>
          </CardContent>
        </Card>
      </SlideUp>
    </div>
  )
}

function IntegrationSettings() {
  return (
    <SlideUp>
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>Connect your chatbots to other platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'WhatsApp', icon: '📱', connected: true },
              { name: 'Facebook Messenger', icon: '📘', connected: true },
              { name: 'Instagram', icon: '📷', connected: false },
              { name: 'Slack', icon: '💼', connected: false },
              { name: 'Discord', icon: '🎮', connected: false },
              { name: 'Telegram', icon: '✈️', connected: false },
            ].map((integration, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{integration.icon}</span>
                    <div>
                      <p className="font-medium">{integration.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {integration.connected ? 'Connected' : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant={integration.connected ? 'outline' : 'default'} 
                    size="sm"
                    className={!integration.connected ? 'bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900' : ''}
                  >
                    {integration.connected ? 'Manage' : 'Connect'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </SlideUp>
  )
} 