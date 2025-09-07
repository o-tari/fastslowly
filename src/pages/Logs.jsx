import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { format, addDays, subDays } from 'date-fns'
import { ChevronLeft, ChevronRight, Calendar, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import DailyLogForm from '../components/DailyLogForm'
import LogTimeline from '../components/LogTimeline'

const Logs = () => {
  const dispatch = useDispatch()
  const { dailyLogs } = useSelector((state) => state.logs)
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [activeTab, setActiveTab] = useState('form') // 'form' or 'timeline'

  const handleDateChange = (direction) => {
    const currentDate = new Date(selectedDate)
    const newDate = direction === 'next' 
      ? addDays(currentDate, 1)
      : subDays(currentDate, 1)
    setSelectedDate(format(newDate, 'yyyy-MM-dd'))
  }

  const handleToday = () => {
    setSelectedDate(format(new Date(), 'yyyy-MM-dd'))
  }

  const hasLogForDate = (date) => {
    return dailyLogs[date] && dailyLogs[date].completed
  }

  const getLogStats = () => {
    const logs = Object.values(dailyLogs)
    const completedLogs = logs.filter(log => log.completed)
    const totalDays = logs.length
    const completionRate = totalDays > 0 ? (completedLogs.length / totalDays) * 100 : 0
    
    return {
      totalDays,
      completedLogs: completedLogs.length,
      completionRate: Math.round(completionRate)
    }
  }

  const stats = getLogStats()

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Daily Logs
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your fasting progress and wellness metrics
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">
            {stats.totalDays}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Days Logged
          </div>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {stats.completedLogs}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Completed Logs
          </div>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {stats.completionRate}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Completion Rate
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-6"
      >
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('form')}
            className={`
              flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200
              ${activeTab === 'form'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }
            `}
          >
            <Plus className="h-4 w-4" />
            <span>Add Log</span>
          </button>
          
          <button
            onClick={() => setActiveTab('timeline')}
            className={`
              flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200
              ${activeTab === 'timeline'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }
            `}
          >
            <Calendar className="h-4 w-4" />
            <span>Timeline</span>
          </button>
        </div>
      </motion.div>

      {/* Content */}
      {activeTab === 'form' ? (
        <motion.div
          key="form"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Date Navigation */}
          <div className="card mb-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleDateChange('prev')}
                className="btn-secondary flex items-center space-x-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {format(new Date(selectedDate), 'EEEE, MMMM dd, yyyy')}
                </div>
                <button
                  onClick={handleToday}
                  className="text-sm text-primary-600 hover:text-primary-700 transition-colors duration-200"
                >
                  Go to Today
                </button>
              </div>
              
              <button
                onClick={() => handleDateChange('next')}
                className="btn-secondary flex items-center space-x-2"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            
            {/* Date Status */}
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Log Status
                </span>
                <div className="flex items-center space-x-2">
                  {hasLogForDate(selectedDate) ? (
                    <>
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600 font-medium">
                        Completed
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Not logged
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Daily Log Form */}
          <DailyLogForm 
            date={selectedDate}
            onSave={() => {
              // Optional: Add any post-save actions
            }}
          />
        </motion.div>
      ) : (
        <motion.div
          key="timeline"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <LogTimeline />
        </motion.div>
      )}
    </div>
  )
}

export default Logs
