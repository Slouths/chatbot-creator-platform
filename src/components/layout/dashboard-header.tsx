'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import { 
  Menu, 
  X, 
  Bot, 
  LayoutDashboard, 
  MessageSquare, 
  BarChart3, 
  Settings,
  FileText,
  Home,
  Sparkles
} from 'lucide-react'

export function DashboardHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/chatbots', label: 'Chatbots', icon: MessageSquare },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/docs', label: 'Documentation', icon: FileText },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <motion.header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'glass-nav shadow-lg' 
          : 'bg-white/40 dark:bg-slate-900/40 backdrop-blur-lg border-b border-white/10 dark:border-slate-700/30'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-60 group-hover:opacity-80 transition-opacity"
                  whileHover={{ scale: 1.1 }}
                />
                <div className="relative glass-card p-2">
                  <Bot className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                ChatBot Creator
              </span>
            </Link>
          </motion.div>
          </div>

          {/* Center: Desktop Navigation */}
          <div className="flex-1 flex justify-center">
            <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item, index) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      active 
                        ? 'text-indigo-600 dark:text-indigo-400' 
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 glass-card"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <div className="relative z-10 flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                </motion.div>
              )
            })}
            </nav>
          </div>

          {/* Right: Desktop User Menu */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                className="glass-button relative overflow-hidden group bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 hover:from-indigo-600 hover:to-purple-700"
                size="sm"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Sparkles className="w-4 h-4 mr-2" />
                <span className="relative z-10">Upgrade Pro</span>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="relative glass-card p-2 rounded-full border-2 border-indigo-500/20 hover:border-indigo-500/40 transition-colors">
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 rounded-full ring-2 ring-white/50"
                    }
                  }}
                />
              </div>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden glass-card p-2 text-slate-600 dark:text-slate-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="md:hidden border-t border-white/10 dark:border-slate-700/30 mt-4"
            >
              <nav className="py-4 space-y-2">
                {navItems.map((item, index) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                          active 
                            ? 'glass-card text-indigo-600 dark:text-indigo-400 font-medium' 
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-800/50'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    </motion.div>
                  )
                })}
                
                <div className="pt-4 border-t border-white/10 dark:border-slate-700/30 flex flex-col gap-3 px-4">
                  <Button 
                    className="glass-button bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 justify-center"
                    size="sm"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Upgrade Pro
                  </Button>
                  
                  <div className="flex justify-center">
                                <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="relative glass-card p-2 rounded-full border-2 border-indigo-500/20 hover:border-indigo-500/40 transition-colors">
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 rounded-full ring-2 ring-white/50"
                    }
                  }}
                />
              </div>
            </div>
                  </div>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
} 