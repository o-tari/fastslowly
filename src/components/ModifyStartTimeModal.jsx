import { useState, useEffect } from 'react'
import { X, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const ModifyStartTimeModal = ({ isOpen, onClose, onSave, currentStartTime }) => {
  const [selectedDateTime, setSelectedDateTime] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  useEffect(() => {
    if (isOpen && currentStartTime) {
      const date = new Date(currentStartTime)
      const dateStr = date.toISOString().split('T')[0]
      const timeStr = date.toTimeString().slice(0, 5)
      
      setSelectedDate(dateStr)
      setSelectedTime(timeStr)
      setSelectedDateTime(`${dateStr}T${timeStr}`)
    }
  }, [isOpen, currentStartTime])

  const handleSave = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select both date and time')
      return
    }

    const newStartTime = new Date(`${selectedDate}T${selectedTime}`).getTime()
    const now = Date.now()
    
    // Validate that the new start time is not in the future
    if (newStartTime > now) {
      toast.error('Start time cannot be in the future')
      return
    }

    // Validate that the new start time is not too far in the past (more than 7 days)
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000)
    if (newStartTime < sevenDaysAgo) {
      toast.error('Start time cannot be more than 7 days in the past')
      return
    }

    onSave(newStartTime)
    onClose()
    toast.success('Start time updated successfully')
  }

  const handleDateChange = (e) => {
    const date = e.target.value
    setSelectedDate(date)
    if (selectedTime) {
      setSelectedDateTime(`${date}T${selectedTime}`)
    }
  }

  const handleTimeChange = (e) => {
    const time = e.target.value
    setSelectedTime(time)
    if (selectedDate) {
      setSelectedDateTime(`${selectedDate}T${time}`)
    }
  }

  const formatCurrentStartTime = () => {
    if (!currentStartTime) return ''
    return new Date(currentStartTime).toLocaleString()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Modify Start Time
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Current start time */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Current start time:
            </div>
            <div className="font-mono text-lg text-gray-900 dark:text-white">
              {formatCurrentStartTime()}
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Time
              </label>
              <input
                type="time"
                value={selectedTime}
                onChange={handleTimeChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Warning */}
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Note:</strong> Modifying the start time will reset any paused time and recalculate your fasting progress.
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors"
            >
              Update Start Time
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ModifyStartTimeModal
