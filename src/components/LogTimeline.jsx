import { useState } from 'react'
import { useSelector } from 'react-redux'
import { format, parseISO, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns'
import { 
  Calendar, 
  Clock, 
  Weight, 
  Droplets, 
  Smile, 
  FileText,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Circle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const LogTimeline = () => {
  const { dailyLogs } = useSelector((state) => state.logs)
  const { units } = useSelector((state) => state.settings)
  const [expandedDates, setExpandedDates] = useState(new Set())
  const [filter, setFilter] = useState('all') // 'all', 'completed', 'incomplete'

  const sortedLogs = Object.entries(dailyLogs)
    .sort(([a], [b]) => new Date(b) - new Date(a))

  const filteredLogs = sortedLogs.filter(([date, log]) => {
    if (filter === 'completed') return log.completed
    if (filter === 'incomplete') return !log.completed
    return true
  })

  const toggleExpanded = (date) => {
    const newExpanded = new Set(expandedDates)
    if (newExpanded.has(date)) {
      newExpanded.delete(date)
    } else {
      newExpanded.add(date)
    }
    setExpandedDates(newExpanded)
  }

  const getDateLabel = (date) => {
    const dateObj = parseISO(date)
    if (isToday(dateObj)) return 'Today'
    if (isYesterday(dateObj)) return 'Yesterday'
    if (isThisWeek(dateObj)) return format(dateObj, 'EEEE')
    if (isThisMonth(dateObj)) return format(dateObj, 'MMM dd')
    return format(dateObj, 'MMM dd, yyyy')
  }

  const getMoodEmoji = (mood) => {
    const moodMap = {
      1: '😞',
      2: '😕',
      3: '😐',
      4: '😊',
      5: '😄'
    }
    return moodMap[mood] || '😐'
  }

  const getMoodColor = (mood) => {
    const colorMap = {
      1: 'text-red-500',
      2: 'text-orange-500',
      3: 'text-yellow-500',
      4: 'text-blue-500',
      5: 'text-green-500'
    }
    return colorMap[mood] || 'text-gray-500'
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Fasting Timeline
          </h3>
        </div>
        
        <div className="flex space-x-2">
          {['all', 'completed', 'incomplete'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`
                px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200
                ${filter === filterType
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }
              `}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            No logs found for the selected filter
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLogs.map(([date, log], index) => {
            const isExpanded = expandedDates.has(date)
            const dateObj = parseISO(date)
            
            return (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden"
              >
                {/* Header */}
                <div
                  onClick={() => toggleExpanded(date)}
                  className="p-4 bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                      
                      <div className="flex items-center space-x-2">
                        {log.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400" />
                        )}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {getDateLabel(date)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      {log.fastingHours > 0 && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{log.fastingHours}h</span>
                        </div>
                      )}
                      {log.weight && (
                        <div className="flex items-center space-x-1">
                          <Weight className="h-4 w-4" />
                          <span>{log.weight} {units.weight}</span>
                        </div>
                      )}
                      {log.mood && (
                        <div className="flex items-center space-x-1">
                          <span className="text-lg">{getMoodEmoji(log.mood)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 border-t border-gray-200 dark:border-gray-600">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {/* Fasting Hours */}
                          {log.fastingHours > 0 && (
                            <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <Clock className="h-5 w-5 text-blue-600" />
                              <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Fasting</div>
                                <div className="font-semibold text-gray-900 dark:text-white">
                                  {log.fastingHours} hours
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Weight */}
                          {log.weight && (
                            <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                              <Weight className="h-5 w-5 text-green-600" />
                              <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Weight</div>
                                <div className="font-semibold text-gray-900 dark:text-white">
                                  {log.weight} {units.weight}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Hydration */}
                          {log.hydration > 0 && (
                            <div className="flex items-center space-x-2 p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                              <Droplets className="h-5 w-5 text-cyan-600" />
                              <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Hydration</div>
                                <div className="font-semibold text-gray-900 dark:text-white">
                                  {log.hydration} glasses
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Mood */}
                          {log.mood && (
                            <div className="flex items-center space-x-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                              <Smile className="h-5 w-5 text-purple-600" />
                              <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Mood</div>
                                <div className={`font-semibold ${getMoodColor(log.mood)}`}>
                                  {getMoodEmoji(log.mood)} {log.mood}/5
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Notes */}
                        {log.notes && (
                          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Notes
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {log.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default LogTimeline
