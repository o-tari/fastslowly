import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateCurrentLog, saveLog } from '../store/slices/logsSlice'
import { format } from 'date-fns'
import { 
  Save, 
  Weight, 
  Droplets, 
  Smile, 
  FileText,
  Clock,
  CheckCircle
} from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const DailyLogForm = ({ date, onSave }) => {
  const dispatch = useDispatch()
  const { currentLog, dailyLogs } = useSelector((state) => state.logs)
  const { units } = useSelector((state) => state.settings)
  
  const [formData, setFormData] = useState({
    fastingHours: 0,
    weight: null,
    hydration: 0,
    mood: null,
    notes: '',
    completed: false
  })

  useEffect(() => {
    const logForDate = dailyLogs[date] || currentLog
    if (logForDate && logForDate.date === date) {
      setFormData({
        fastingHours: logForDate.fastingHours || 0,
        weight: logForDate.weight || null,
        hydration: logForDate.hydration || 0,
        mood: logForDate.mood || null,
        notes: logForDate.notes || '',
        completed: logForDate.completed || false
      })
    }
  }, [date, dailyLogs, currentLog])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    const logData = {
      ...formData,
      date: date,
      protocol: currentLog.protocol || '16:8'
    }

    dispatch(updateCurrentLog(logData))
    dispatch(saveLog(logData))
    
    toast.success('Daily log saved successfully!')
    if (onSave) onSave()
  }

  const moodOptions = [
    { value: 1, label: 'Very Poor', emoji: '😞', color: 'text-red-500' },
    { value: 2, label: 'Poor', emoji: '😕', color: 'text-orange-500' },
    { value: 3, label: 'Okay', emoji: '😐', color: 'text-yellow-500' },
    { value: 4, label: 'Good', emoji: '😊', color: 'text-blue-500' },
    { value: 5, label: 'Excellent', emoji: '😄', color: 'text-green-500' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Daily Log - {format(new Date(date), 'MMM dd, yyyy')}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track your fasting progress and wellness metrics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle className={`h-5 w-5 ${formData.completed ? 'text-green-500' : 'text-gray-400'}`} />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {formData.completed ? 'Completed' : 'Incomplete'}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Fasting Hours */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Clock className="h-4 w-4" />
            <span>Fasting Hours</span>
          </label>
          <input
            type="number"
            min="0"
            max="24"
            step="0.5"
            value={formData.fastingHours}
            onChange={(e) => handleInputChange('fastingHours', parseFloat(e.target.value) || 0)}
            className="input"
            placeholder="Enter fasting hours"
          />
        </div>

        {/* Weight */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Weight className="h-4 w-4" />
            <span>Weight ({units.weight})</span>
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={formData.weight || ''}
            onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || null)}
            className="input"
            placeholder={`Enter weight in ${units.weight}`}
          />
        </div>

        {/* Hydration */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Droplets className="h-4 w-4" />
            <span>Hydration (glasses of water)</span>
          </label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleInputChange('hydration', Math.max(0, formData.hydration - 1))}
              className="btn-secondary px-3 py-1"
            >
              -
            </button>
            <input
              type="number"
              min="0"
              max="20"
              value={formData.hydration}
              onChange={(e) => handleInputChange('hydration', parseInt(e.target.value) || 0)}
              className="input text-center w-20"
            />
            <button
              onClick={() => handleInputChange('hydration', Math.min(20, formData.hydration + 1))}
              className="btn-secondary px-3 py-1"
            >
              +
            </button>
          </div>
        </div>

        {/* Mood */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Smile className="h-4 w-4" />
            <span>Mood</span>
          </label>
          <div className="grid grid-cols-5 gap-2">
            {moodOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleInputChange('mood', option.value)}
                className={`
                  p-3 rounded-lg border-2 transition-all duration-200 text-center
                  ${formData.mood === option.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }
                `}
              >
                <div className="text-2xl mb-1">{option.emoji}</div>
                <div className={`text-xs font-medium ${option.color}`}>
                  {option.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <FileText className="h-4 w-4" />
            <span>Notes</span>
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="input min-h-[100px] resize-none"
            placeholder="How did you feel today? Any observations or thoughts..."
          />
        </div>

        {/* Completion Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              Mark as Complete
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Check this when you've finished logging for the day
            </p>
          </div>
          <button
            onClick={() => handleInputChange('completed', !formData.completed)}
            className={`
              w-12 h-6 rounded-full transition-colors duration-200 relative
              ${formData.completed ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}
            `}
          >
            <div className={`
              w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 absolute top-0.5
              ${formData.completed ? 'translate-x-6' : 'translate-x-0.5'}
            `} />
          </button>
        </div>

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="btn-primary w-full flex items-center justify-center space-x-2 py-3"
        >
          <Save className="h-5 w-5" />
          <span>Save Daily Log</span>
        </motion.button>
      </div>
    </motion.div>
  )
}

export default DailyLogForm
