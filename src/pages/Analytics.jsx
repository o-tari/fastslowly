import { useState } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Target,
  Award,
  Clock,
  Weight,
  Droplets,
  Smile
} from 'lucide-react'
import AnalyticsCharts from '../components/AnalyticsCharts'

const Analytics = () => {
  const { stats } = useSelector((state) => state.logs)
  const { dailyLogs } = useSelector((state) => state.logs)
  const [timeRange, setTimeRange] = useState('30') // '7', '30', '90', 'all'

  const getInsights = () => {
    const logs = Object.values(dailyLogs).filter(log => log.completed)
    const totalLogs = logs.length
    
    if (totalLogs === 0) return []

    const insights = []

    // Streak insight
    if (stats.currentStreak > 0) {
      insights.push({
        type: 'success',
        icon: Award,
        title: 'Great Streak!',
        description: `You've maintained a ${stats.currentStreak}-day fasting streak. Keep it up!`
      })
    }

    // Average fasting hours insight
    if (stats.averageFastingHours > 0) {
      const avgHours = Math.round(stats.averageFastingHours * 10) / 10
      if (avgHours >= 16) {
        insights.push({
          type: 'success',
          icon: Clock,
          title: 'Excellent Fasting',
          description: `Your average of ${avgHours} hours per day is fantastic!`
        })
      } else if (avgHours >= 12) {
        insights.push({
          type: 'info',
          icon: Clock,
          title: 'Good Progress',
          description: `Your average of ${avgHours} hours is a solid foundation.`
        })
      }
    }

    // Weight change insight
    if (stats.weightChange !== 0) {
      const change = Math.abs(stats.weightChange)
      const direction = stats.weightChange > 0 ? 'gained' : 'lost'
      insights.push({
        type: stats.weightChange < 0 ? 'success' : 'warning',
        icon: Weight,
        title: 'Weight Change',
        description: `You've ${direction} ${change.toFixed(1)} ${stats.weightChange > 0 ? 'kg' : 'kg'} over your fasting journey.`
      })
    }

    // Hydration insight
    const avgHydration = logs.reduce((sum, log) => sum + (log.hydration || 0), 0) / totalLogs
    if (avgHydration > 0) {
      if (avgHydration >= 8) {
        insights.push({
          type: 'success',
          icon: Droplets,
          title: 'Great Hydration',
          description: `You're averaging ${avgHydration.toFixed(1)} glasses of water per day. Excellent!`
        })
      } else if (avgHydration < 6) {
        insights.push({
          type: 'warning',
          icon: Droplets,
          title: 'Stay Hydrated',
          description: `Consider increasing your water intake. You're averaging ${avgHydration.toFixed(1)} glasses per day.`
        })
      }
    }

    // Mood insight
    const avgMood = logs.reduce((sum, log) => sum + (log.mood || 0), 0) / logs.filter(log => log.mood).length
    if (avgMood > 0) {
      if (avgMood >= 4) {
        insights.push({
          type: 'success',
          icon: Smile,
          title: 'Positive Mood',
          description: `Your average mood rating of ${avgMood.toFixed(1)}/5 shows great well-being!`
        })
      } else if (avgMood < 3) {
        insights.push({
          type: 'info',
          icon: Smile,
          title: 'Mood Check',
          description: `Your average mood is ${avgMood.toFixed(1)}/5. Consider what might help improve your well-being.`
        })
      }
    }

    return insights
  }

  const insights = getInsights()

  const getInsightColor = (type) => {
    switch (type) {
      case 'success': return 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800'
      case 'warning': return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800'
      case 'info': return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800'
      default: return 'border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600'
    }
  }

  const getInsightIconColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'info': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics & Insights
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your progress and discover patterns in your fasting journey
        </p>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <div className="card text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
              <Award className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {stats.currentStreak}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Current Streak
          </div>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {stats.totalFastingDays}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Days
          </div>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {Math.round(stats.averageFastingHours * 10) / 10}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Avg Hours
          </div>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
              <Target className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {stats.longestStreak}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Best Streak
          </div>
        </div>
      </motion.div>

      {/* Insights */}
      {insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Insights & Recommendations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start space-x-3">
                  <insight.icon className={`h-5 w-5 mt-0.5 ${getInsightIconColor(insight.type)}`} />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {insight.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Time Range Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Detailed Analytics
          </h2>
          <div className="flex space-x-2">
            {[
              { value: '7', label: '7 Days' },
              { value: '30', label: '30 Days' },
              { value: '90', label: '90 Days' },
              { value: 'all', label: 'All Time' }
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`
                  px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200
                  ${timeRange === range.value
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                `}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <AnalyticsCharts />
      </motion.div>
    </div>
  )
}

export default Analytics
