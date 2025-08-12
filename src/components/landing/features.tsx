'use client'

import { motion } from 'framer-motion'
import { Bot, MessageSquare, Zap, Globe, BarChart3, Shield, Smartphone, Code, Sparkles } from 'lucide-react'

const features = [
  {
    icon: Bot,
    title: 'AI-Powered Intelligence',
    description: 'Advanced AI models including GPT-4 and Claude for natural, intelligent conversations.',
    color: 'from-blue-500 to-cyan-500',
    stats: '99.9% accuracy',
    benefit: 'Reduces response time by 85%'
  },
  {
    icon: MessageSquare,
    title: 'Multi-Platform Deployment',
    description: 'Deploy seamlessly to WhatsApp, Instagram, Facebook Messenger, and websites.',
    color: 'from-purple-500 to-violet-500',
    stats: '20+ platforms',
    benefit: 'Reach 3x more customers'
  },
  {
    icon: Zap,
    title: 'No-Code Builder',
    description: 'Visual drag-and-drop interface for creating complex conversation flows.',
    color: 'from-blue-500 to-cyan-500',
    stats: '5-min setup',
    benefit: 'Save 95% development time'
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Multi-language support with automatic translation and cultural adaptation.',
    color: 'from-emerald-500 to-teal-500',
    stats: '100+ languages',
    benefit: 'Expand globally instantly'
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Comprehensive insights into conversations, user behavior, and bot performance.',
    color: 'from-emerald-500 to-teal-500',
    stats: 'Live insights',
    benefit: 'Improve conversion by 40%'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'SOC 2 compliant with end-to-end encryption and data privacy protection.',
    color: 'from-indigo-500 to-blue-500',
    stats: 'Bank-level security',
    benefit: '100% compliance guaranteed'
  },
  {
    icon: Smartphone,
    title: 'Mobile Optimized',
    description: 'Perfect experience across all devices with responsive design.',
    color: 'from-purple-500 to-violet-500',
    stats: 'All devices',
    benefit: 'Mobile-first experience'
  },
  {
    icon: Code,
    title: 'Developer Friendly',
    description: 'Powerful APIs, webhooks, and custom integrations for advanced use cases.',
    color: 'from-gray-500 to-slate-500',
    stats: 'REST & GraphQL APIs',
    benefit: 'Unlimited customization'
  }
]

export function Features() {
  return (
    <section id="features" className="py-20 relative overflow-hidden">
      {/* Simplified background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            className="inline-flex items-center gap-3 glass-card px-6 py-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Powerful Features
            </span>
          </motion.div>

          <h2 className="heading-primary mb-6">
            Everything You Need to Build
            <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Amazing Chatbots
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto text-balance">
            From simple FAQ bots to complex AI assistants, our platform provides all the tools 
            you need to create exceptional customer experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group h-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <div className="glass-card p-6 h-full relative overflow-hidden">
                {/* Header */}
                <div className="relative z-10 mb-4">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="mb-2">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {feature.title}
                    </h3>
                  </div>
                  
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                    {feature.stats}
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {feature.benefit}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="glass-card p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Join thousands of businesses already using our platform to transform their customer experience.
            </p>
            <button className="inline-flex items-center gap-2 glass-button bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 px-8 py-3 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300">
              <Sparkles className="w-4 h-4" />
              Start Free Trial
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
