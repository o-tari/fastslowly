import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setProtocol, setCustomDuration } from '../store/slices/timerSlice'
import { Clock, Plus, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const ProtocolSelector = () => {
  const dispatch = useDispatch()
  const { currentProtocol, protocols, targetDuration } = useSelector((state) => state.timer)
  const [showCustom, setShowCustom] = useState(false)
  const [customHours, setCustomHours] = useState(16)

  const handleProtocolChange = (protocol) => {
    dispatch(setProtocol(protocol))
    if (protocol === 'custom') {
      setShowCustom(true)
    } else {
      setShowCustom(false)
    }
  }

  const handleCustomSubmit = () => {
    if (customHours > 0 && customHours <= 24) {
      dispatch(setCustomDuration(customHours))
      setShowCustom(false)
    }
  }

  const formatDuration = (hours) => {
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    return `${h}:${m.toString().padStart(2, '0')}`
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <Clock className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Fasting Protocol
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {Object.entries(protocols).map(([key, protocol]) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleProtocolChange(key)}
            className={`
              p-3 rounded-lg border-2 transition-all duration-200 text-left
              ${currentProtocol === key
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }
            `}
          >
            <div className="font-medium text-gray-900 dark:text-white">
              {protocol.name}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {protocol.description}
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {showCustom && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 dark:border-gray-600 pt-4"
          >
            <div className="flex items-center space-x-2 mb-3">
              <Plus className="h-4 w-4 text-primary-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Custom Duration
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="number"
                min="1"
                max="24"
                step="0.5"
                value={customHours}
                onChange={(e) => setCustomHours(parseFloat(e.target.value) || 0)}
                className="input w-20 text-center"
                placeholder="16"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                hours
              </span>
              <button
                onClick={handleCustomSubmit}
                className="btn-primary px-3 py-1 text-sm"
              >
                Set
              </button>
              <button
                onClick={() => setShowCustom(false)}
                className="btn-secondary px-3 py-1 text-sm"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current target display */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Current Target
        </div>
        <div className="text-lg font-semibold text-gray-900 dark:text-white">
          {formatDuration(targetDuration / (60 * 60 * 1000))} hours
        </div>
      </div>
    </div>
  )
}

export default ProtocolSelector
