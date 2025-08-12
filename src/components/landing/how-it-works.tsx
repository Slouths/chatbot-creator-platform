'use client'

import { motion } from 'framer-motion'
import { Settings, Upload, Rocket, Sparkles } from 'lucide-react'

const steps = [
  {
    step: 1,
    title: 'Configure Your Bot',
    description: 'Choose industry, personality, and goals. Our AI learns your business needs.',
    icon: Settings,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    step: 2,
    title: 'Train & Customize',
    description: 'Upload your knowledge base, FAQs, and brand guidelines for personalized responses.',
    icon: Upload,
    color: 'from-purple-500 to-violet-500'
  },
  {
    step: 3,
    title: 'Deploy & Monitor',
    description: 'Integrate with your platforms and track performance with real-time analytics.',
    icon: Rocket,
    color: 'from-emerald-500 to-teal-500'
  }
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            className="inline-flex items-center gap-3 glass-card px-6 py-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-medium text-slate-700 dark:text-slate-300">
              How It Works
            </span>
          </motion.div>

          <h2 className="heading-primary mb-6">
            Get Started in
            <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              3 Simple Steps
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Build and deploy your AI chatbot in minutes, not days
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="glass-card p-8 text-center h-full">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${step.color} shadow-lg mb-6`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                  {step.step}
                </div>
                
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  {step.title}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-400">
                  {step.description}
                </p>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-slate-300 to-transparent dark:from-slate-600" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 