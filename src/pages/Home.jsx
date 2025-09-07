import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Clock, 
  TrendingUp, 
  Calendar, 
  Target,
  Play,
  BarChart3,
  BookOpen,
  Settings
} from 'lucide-react'

const Home = () => {
  const { isRunning, currentProtocol, protocols } = useSelector((state) => state.timer)
  const { stats } = useSelector((state) => state.logs)
  const { theme } = useSelector((state) => state.settings)

  const quickActions = [
    {
      title: 'Start Timer',
      description: 'Begin a new fasting session',
      icon: Play,
      href: '/timer',
      color: 'bg-primary-500 hover:bg-primary-600',
      disabled: isRunning
    },
    {
      title: 'View Logs',
      description: 'Check your fasting history',
      icon: BookOpen,
      href: '/logs',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Analytics',
      description: 'Track your progress',
      icon: BarChart3,
      href: '/analytics',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Settings',
      description: 'Customize your experience',
      icon: Settings,
      href: '/settings',
      color: 'bg-gray-500 hover:bg-gray-600'
    }
  ]

  const statsCards = [
    {
      title: 'Current Streak',
      value: stats.currentStreak,
      unit: 'days',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Total Days',
      value: stats.totalFastingDays,
      unit: 'fasted',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      title: 'Average Hours',
      value: Math.round(stats.averageFastingHours * 10) / 10,
      unit: 'hours',
      icon: Clock,
      color: 'text-purple-600'
    },
    {
      title: 'Longest Streak',
      value: stats.longestStreak,
      unit: 'days',
      icon: Target,
      color: 'text-orange-600'
    }
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome to FastSlowly
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Your journey to better health starts here
        </p>
      </motion.div>

      {/* Current Status */}
      {isRunning && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Fasting in Progress
                </h2>
                <p className="text-primary-100">
                  You're currently following the {protocols[currentProtocol]?.name} protocol
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Active</span>
              </div>
            </div>
            <div className="mt-4">
              <Link
                to="/timer"
                className="inline-flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Clock className="h-4 w-4" />
                <span>View Timer</span>
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Your Progress
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="card text-center"
            >
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.title}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                {stat.unit}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            >
              <Link
                to={action.href}
                className={`
                  block p-6 rounded-xl text-white transition-all duration-200 hover:shadow-lg
                  ${action.disabled ? 'opacity-50 cursor-not-allowed' : action.color}
                `}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <action.icon className="h-6 w-6" />
                  <h3 className="text-lg font-semibold">
                    {action.title}
                  </h3>
                </div>
                <p className="text-sm opacity-90">
                  {action.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Motivational Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="text-center"
      >
        <div className="card max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Today's Motivation
          </h3>
          <blockquote className="text-lg italic text-gray-700 dark:text-gray-300 mb-4">
            "The body achieves what the mind believes."
          </blockquote>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Every fasting session is a step towards better health and self-discipline.
            You've got this! 💪
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Home
