'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { SlideUp } from '@/components/animations/slide-up'
import { StaggerContainer } from '@/components/animations/stagger-container'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'CEO at TechStart',
    content: 'ChatBot Creator transformed our customer service. We reduced response times by 80% and our customers love the instant support.',
    rating: 5,
    avatar: '/images/avatars/sarah.jpg'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Head of Operations at RetailCo',
    content: 'The no-code builder is incredibly intuitive. We had our first chatbot live in under 30 minutes and have seen a 60% reduction in support tickets.',
    rating: 5,
    avatar: '/images/avatars/marcus.jpg'
  },
  {
    name: 'Emily Watson',
    role: 'CTO at FinanceFlow',
    content: 'Security and compliance were our biggest concerns. ChatBot Creator exceeded our expectations with SOC 2 compliance and enterprise-grade security.',
    rating: 5,
    avatar: '/images/avatars/emily.jpg'
  }
]

export function Testimonials() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <SlideUp>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 dark:from-slate-100 dark:via-indigo-100 dark:to-slate-100 bg-clip-text text-transparent">
                Loved by
              </span>
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent block">
                Thousands of Businesses
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              See what our customers are saying about their experience with ChatBot Creator.
            </p>
          </div>
        </SlideUp>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="glass p-6 rounded-2xl border border-white/20 shadow-xl h-full">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-blue-500 fill-current" />
                  ))}
                </div>
                
                <Quote className="w-8 h-8 text-slate-500 dark:text-slate-400 mb-4" />
                
                <p className="text-slate-800 dark:text-slate-200 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{testimonial.name}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
