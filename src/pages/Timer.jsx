import { motion } from 'framer-motion'
import TimerDisplay from '../components/TimerDisplay'
import ProtocolSelector from '../components/ProtocolSelector'
import { Droplets, Heart, Brain, Zap } from 'lucide-react'

const Timer = () => {
  const benefits = [
    {
      icon: Heart,
      title: 'Heart Health',
      description: 'Improved cardiovascular function'
    },
    {
      icon: Brain,
      title: 'Mental Clarity',
      description: 'Enhanced focus and cognitive function'
    },
    {
      icon: Zap,
      title: 'Energy Boost',
      description: 'Increased energy and vitality'
    },
    {
      icon: Droplets,
      title: 'Cellular Repair',
      description: 'Autophagy and cellular regeneration'
    }
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Fasting Timer
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your intermittent fasting journey with precision and motivation
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Timer */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card text-center"
          >
            <TimerDisplay />
          </motion.div>
        </div>

        {/* Protocol Selector */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <ProtocolSelector />
          </motion.div>
        </div>
      </div>

      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Benefits of Intermittent Fasting
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              className="card text-center hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-full">
                  <benefit.icon className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Motivational Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-8 text-center"
      >
        <div className="card max-w-2xl mx-auto">
          <blockquote className="text-lg italic text-gray-700 dark:text-gray-300 mb-2">
            "The secret of getting ahead is getting started."
          </blockquote>
          <cite className="text-sm text-gray-500 dark:text-gray-400">
            — Mark Twain
          </cite>
        </div>
      </motion.div>
    </div>
  )
}

export default Timer
