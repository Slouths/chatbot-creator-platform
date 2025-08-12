'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Check, Star } from 'lucide-react'
import Link from 'next/link'
import { SlideUp } from '@/components/animations/slide-up'
import { StaggerContainer } from '@/components/animations/stagger-container'

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    description: 'Perfect for trying out our platform',
    features: [
      '100 conversations/month',
      '1 chatbot',
      'Website integration',
      'Basic analytics',
      'Email support'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Pro',
    price: '$49',
    period: 'per month',
    description: 'For growing businesses',
    features: [
      '2,000 conversations/month',
      '5 chatbots',
      'All platform integrations',
      'Advanced analytics',
      'AI model selection',
      'Custom branding',
      'Priority support'
    ],
    cta: 'Start Free Trial',
    popular: true
  },
  {
    name: 'Enterprise',
    price: '$199',
    period: 'per month',
    description: 'For large organizations',
    features: [
      'Unlimited conversations',
      'Unlimited chatbots',
      'White-label solution',
      'Custom integrations',
      'Advanced security',
      'Dedicated support',
      'SLA guarantee'
    ],
    cta: 'Contact Sales',
    popular: false
  }
]

export function Pricing() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <SlideUp>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-slate-900 dark:text-slate-100">Simple, Transparent </span>
              <span className="text-indigo-600 dark:text-indigo-400">Pricing</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Choose the perfect plan for your business. Start free and scale as you grow.
            </p>
          </div>
        </SlideUp>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 shadow-lg">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className={`glass p-8 rounded-2xl border h-full transition-all duration-300 flex flex-col ${
                plan.popular 
                  ? 'border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.3)] scale-105 lg:scale-110' 
                  : 'border-white/20 hover:border-indigo-500/30'
              }`}>
                <div className="text-center mb-8 mt-6">
                  <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-100">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-slate-900 dark:text-slate-100">{plan.price}</span>
                    {plan.period && (
                      <span className="text-slate-600 dark:text-slate-400 ml-2">/{plan.period}</span>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <Check className="w-5 h-5 text-green-500" />
                      </div>
                      <span className="text-slate-800 dark:text-slate-200">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <Button 
                    asChild
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600'
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    <Link href={plan.name === 'Enterprise' ? '/contact' : '/sign-up'}>
                      {plan.cta}
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </StaggerContainer>

        <SlideUp delay={0.4}>
          <div className="text-center mt-12">
            <p className="text-slate-600 dark:text-slate-400">
              All plans include 14-day free trial. No credit card required.
            </p>
          </div>
        </SlideUp>
      </div>
    </section>
  )
}
