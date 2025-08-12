'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Bot, MessageSquare, Zap, Sparkles, Play, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Simplified background - reduced animations for performance */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Status Badge */}
          <motion.div
            className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              🎉 Now with GPT-4 integration
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="heading-primary mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Build Intelligent Chatbots
            <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              That Actually Work
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto text-balance"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Create AI-powered chatbots that understand your customers, integrate seamlessly 
            across platforms, and drive real business results.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link href="/dashboard">
              <Button
                size="lg"
                className="glass-button bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 hover:from-indigo-600 hover:to-purple-700 px-8 py-4 text-lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Building Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            <Button
              variant="outline"
              size="lg"
              className="glass-button border-slate-200 dark:border-slate-700 hover:bg-white/50 dark:hover:bg-slate-800/50 px-8 py-4 text-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">10K+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Active Chatbots</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">99.9%</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Uptime</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">50M+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Messages Processed</div>
            </div>
          </motion.div>
        </div>

        {/* Feature Preview Cards - Simplified */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="glass-card p-6 text-center">
            <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg mb-4">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
              AI-Powered
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              GPT-4 and Claude integration for natural conversations
            </p>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 shadow-lg mb-4">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Multi-Platform
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Deploy to WhatsApp, web, and social media instantly
            </p>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
              No-Code
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Visual builder with drag-and-drop simplicity
            </p>
          </div>
        </motion.div>

        {/* Customer Logos */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Trusted by teams at
          </p>
          <div className="flex items-center justify-center gap-8 opacity-60">
            {['Stripe', 'Shopify', 'Slack', 'Zoom', 'Notion'].map((company) => (
              <div key={company} className="text-lg font-semibold text-slate-600 dark:text-slate-400">
                {company}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
