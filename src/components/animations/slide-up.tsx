'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface SlideUpProps {
  children: ReactNode
  delay?: number
  duration?: number
  distance?: number
  className?: string
}

export function SlideUp({ 
  children, 
  delay = 0, 
  duration = 0.6, 
  distance = 50,
  className = "" 
}: SlideUpProps) {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: distance 
      }}
      animate={{ 
        opacity: 1, 
        y: 0 
      }}
      transition={{ 
        duration, 
        delay,
        ease: [0.25, 0.25, 0.25, 0.75]
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
