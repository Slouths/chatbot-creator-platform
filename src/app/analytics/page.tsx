import { DashboardHeader } from '@/components/layout/dashboard-header'
import { AnalyticsDashboard } from '@/components/dashboard/analytics-dashboard'
import { motion } from 'framer-motion'

export default function AnalyticsPage() {
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
                Analytics & Insights
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Monitor performance, track conversations, and gain valuable insights from your chatbots
              </p>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AnalyticsDashboard />
          </motion.div>
        </div>
      </div>
    </div>
  )
} 