'use client'

import Link from 'next/link'
import { Bot, Twitter, Github, Linkedin, Mail } from 'lucide-react'

const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'API', href: '/api-docs' },
    { name: 'Integrations', href: '/integrations' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
  ],
  resources: [
    { name: 'Documentation', href: '/docs' },
    { name: 'Help Center', href: '/help' },
    { name: 'Community', href: '/community' },
    { name: 'Status', href: '/status' },
  ],
  legal: [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Security', href: '/security' },
    { name: 'Compliance', href: '/compliance' },
  ],
}

const socialLinks = [
  { name: 'Twitter', href: 'https://twitter.com/chatbotcreator', icon: Twitter },
  { name: 'GitHub', href: 'https://github.com/chatbotcreator', icon: Github },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/chatbotcreator', icon: Linkedin },
  { name: 'Email', href: 'mailto:hello@chatbotcreator.com', icon: Mail },
]

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              <Bot className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              ChatBot Creator
            </Link>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-sm">
              Build intelligent chatbots for your business with our no-code platform. 
              Transform customer service with AI-powered conversations.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4 text-slate-900 dark:text-slate-100">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-slate-900 dark:text-slate-100">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-slate-900 dark:text-slate-100">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-slate-900 dark:text-slate-100">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              © 2024 ChatBot Creator. All rights reserved.
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Built with <span className="text-indigo-600 dark:text-indigo-400">♥</span> using Next.js, Convex, and modern web technologies.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
