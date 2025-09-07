import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { 
  Settings as SettingsIcon,
  Sun,
  Moon,
  Wifi,
  WifiOff,
  Bell,
  BellOff,
  Eye,
  Volume2,
  VolumeX,
  Type,
  Download,
  Upload,
  Trash2,
  Save,
  RotateCcw
} from 'lucide-react'
import { 
  setTheme, 
  toggleOfflineMode, 
  updateNotifications, 
  updateAccessibility, 
  updateUnits, 
  updatePrivacy 
} from '../store/slices/settingsSlice'
import { exportLogs, importLogs } from '../store/slices/logsSlice'
import toast from 'react-hot-toast'

const Settings = () => {
  const dispatch = useDispatch()
  const { 
    theme, 
    offlineMode, 
    notifications, 
    accessibility, 
    units, 
    privacy 
  } = useSelector((state) => state.settings)
  
  const { dailyLogs } = useSelector((state) => state.logs)
  const [activeTab, setActiveTab] = useState('appearance')

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: theme === 'light' ? Sun : Moon },
    { id: 'notifications', label: 'Notifications', icon: notifications.enabled ? Bell : BellOff },
    { id: 'accessibility', label: 'Accessibility', icon: Eye },
    { id: 'data', label: 'Data & Privacy', icon: Save },
    { id: 'backup', label: 'Backup & Sync', icon: Download }
  ]

  const handleThemeChange = (newTheme) => {
    dispatch(setTheme(newTheme))
    toast.success(`Switched to ${newTheme} mode`)
  }

  const handleOfflineToggle = () => {
    dispatch(toggleOfflineMode())
    toast.success(offlineMode ? 'Switched to online mode' : 'Switched to offline mode')
  }

  const handleNotificationChange = (key, value) => {
    dispatch(updateNotifications({ [key]: value }))
    toast.success('Notification settings updated')
  }

  const handleAccessibilityChange = (key, value) => {
    dispatch(updateAccessibility({ [key]: value }))
    toast.success('Accessibility settings updated')
  }

  const handleUnitsChange = (key, value) => {
    dispatch(updateUnits({ [key]: value }))
    toast.success('Units updated')
  }

  const handlePrivacyChange = (key, value) => {
    dispatch(updatePrivacy({ [key]: value }))
    toast.success('Privacy settings updated')
  }

  const handleExportData = () => {
    try {
      const data = {
        dailyLogs,
        exportDate: new Date().toISOString(),
        version: '1.0'
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `fastslowly-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success('Data exported successfully!')
    } catch (error) {
      toast.error('Failed to export data')
    }
  }

  const handleImportData = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        if (data.dailyLogs) {
          dispatch(importLogs(data.dailyLogs))
          toast.success('Data imported successfully!')
        } else {
          toast.error('Invalid backup file format')
        }
      } catch (error) {
        toast.error('Failed to import data')
      }
    }
    reader.readAsText(file)
  }

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear()
      window.location.reload()
      toast.success('All data cleared')
    }
  }

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Theme
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleThemeChange('light')}
            className={`
              p-4 rounded-lg border-2 transition-all duration-200
              ${theme === 'light'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }
            `}
          >
            <Sun className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
            <div className="font-medium text-gray-900 dark:text-white">Light</div>
          </button>
          
          <button
            onClick={() => handleThemeChange('dark')}
            className={`
              p-4 rounded-lg border-2 transition-all duration-200
              ${theme === 'dark'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }
            `}
          >
            <Moon className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <div className="font-medium text-gray-900 dark:text-white">Dark</div>
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Connection Mode
        </h3>
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-3">
            {offlineMode ? (
              <WifiOff className="h-5 w-5 text-gray-500" />
            ) : (
              <Wifi className="h-5 w-5 text-green-500" />
            )}
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {offlineMode ? 'Offline Mode' : 'Online Mode'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {offlineMode 
                  ? 'Data stored locally only' 
                  : 'Data can be synced to cloud'
                }
              </div>
            </div>
          </div>
          <button
            onClick={handleOfflineToggle}
            className={`
              w-12 h-6 rounded-full transition-colors duration-200 relative
              ${offlineMode ? 'bg-gray-400' : 'bg-primary-600'}
            `}
          >
            <div className={`
              w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 absolute top-0.5
              ${offlineMode ? 'translate-x-0.5' : 'translate-x-6'}
            `} />
          </button>
        </div>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Notification Preferences
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Enable Notifications
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Allow the app to send notifications
              </div>
            </div>
            <button
              onClick={() => handleNotificationChange('enabled', !notifications.enabled)}
              className={`
                w-12 h-6 rounded-full transition-colors duration-200 relative
                ${notifications.enabled ? 'bg-primary-600' : 'bg-gray-400'}
              `}
            >
              <div className={`
                w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 absolute top-0.5
                ${notifications.enabled ? 'translate-x-6' : 'translate-x-0.5'}
              `} />
            </button>
          </div>

          {notifications.enabled && (
            <>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Fasting Complete
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Notify when fasting goal is reached
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationChange('fastingComplete', !notifications.fastingComplete)}
                  className={`
                    w-12 h-6 rounded-full transition-colors duration-200 relative
                    ${notifications.fastingComplete ? 'bg-primary-600' : 'bg-gray-400'}
                  `}
                >
                  <div className={`
                    w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 absolute top-0.5
                    ${notifications.fastingComplete ? 'translate-x-6' : 'translate-x-0.5'}
                  `} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Hydration Reminder
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Remind to drink water during fasting
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationChange('hydrationReminder', !notifications.hydrationReminder)}
                  className={`
                    w-12 h-6 rounded-full transition-colors duration-200 relative
                    ${notifications.hydrationReminder ? 'bg-primary-600' : 'bg-gray-400'}
                  `}
                >
                  <div className={`
                    w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 absolute top-0.5
                    ${notifications.hydrationReminder ? 'translate-x-6' : 'translate-x-0.5'}
                  `} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )

  const renderAccessibilitySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Accessibility Options
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                High Contrast
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Increase contrast for better visibility
              </div>
            </div>
            <button
              onClick={() => handleAccessibilityChange('highContrast', !accessibility.highContrast)}
              className={`
                w-12 h-6 rounded-full transition-colors duration-200 relative
                ${accessibility.highContrast ? 'bg-primary-600' : 'bg-gray-400'}
              `}
            >
              <div className={`
                w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 absolute top-0.5
                ${accessibility.highContrast ? 'translate-x-6' : 'translate-x-0.5'}
              `} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Text-to-Speech
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Read timer updates aloud
              </div>
            </div>
            <button
              onClick={() => handleAccessibilityChange('textToSpeech', !accessibility.textToSpeech)}
              className={`
                w-12 h-6 rounded-full transition-colors duration-200 relative
                ${accessibility.textToSpeech ? 'bg-primary-600' : 'bg-gray-400'}
              `}
            >
              <div className={`
                w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 absolute top-0.5
                ${accessibility.textToSpeech ? 'translate-x-6' : 'translate-x-0.5'}
              `} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Reduced Motion
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Minimize animations and transitions
              </div>
            </div>
            <button
              onClick={() => handleAccessibilityChange('reducedMotion', !accessibility.reducedMotion)}
              className={`
                w-12 h-6 rounded-full transition-colors duration-200 relative
                ${accessibility.reducedMotion ? 'bg-primary-600' : 'bg-gray-400'}
              `}
            >
              <div className={`
                w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 absolute top-0.5
                ${accessibility.reducedMotion ? 'translate-x-6' : 'translate-x-0.5'}
              `} />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Font Size
            </label>
            <select
              value={accessibility.fontSize}
              onChange={(e) => handleAccessibilityChange('fontSize', e.target.value)}
              className="input"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderDataSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Units
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Weight Unit
            </label>
            <select
              value={units.weight}
              onChange={(e) => handleUnitsChange('weight', e.target.value)}
              className="input"
            >
              <option value="kg">Kilograms (kg)</option>
              <option value="lbs">Pounds (lbs)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Temperature Unit
            </label>
            <select
              value={units.temperature}
              onChange={(e) => handleUnitsChange('temperature', e.target.value)}
              className="input"
            >
              <option value="celsius">Celsius (°C)</option>
              <option value="fahrenheit">Fahrenheit (°F)</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Privacy
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Data Sharing
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Allow anonymous usage data collection
              </div>
            </div>
            <button
              onClick={() => handlePrivacyChange('dataSharing', !privacy.dataSharing)}
              className={`
                w-12 h-6 rounded-full transition-colors duration-200 relative
                ${privacy.dataSharing ? 'bg-primary-600' : 'bg-gray-400'}
              `}
            >
              <div className={`
                w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 absolute top-0.5
                ${privacy.dataSharing ? 'translate-x-6' : 'translate-x-0.5'}
              `} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Analytics
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Help improve the app with usage analytics
              </div>
            </div>
            <button
              onClick={() => handlePrivacyChange('analytics', !privacy.analytics)}
              className={`
                w-12 h-6 rounded-full transition-colors duration-200 relative
                ${privacy.analytics ? 'bg-primary-600' : 'bg-gray-400'}
              `}
            >
              <div className={`
                w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 absolute top-0.5
                ${privacy.analytics ? 'translate-x-6' : 'translate-x-0.5'}
              `} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Data Management
        </h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Export Data
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Download a backup of all your fasting data
            </p>
            <button
              onClick={handleExportData}
              className="btn-primary flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </button>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Import Data
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Restore data from a previous backup
            </p>
            <label className="btn-secondary flex items-center space-x-2 cursor-pointer">
              <Upload className="h-4 w-4" />
              <span>Import Data</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
          </div>

          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <h4 className="font-medium text-red-900 dark:text-red-300 mb-2">
              Clear All Data
            </h4>
            <p className="text-sm text-red-700 dark:text-red-400 mb-4">
              Permanently delete all your fasting data. This action cannot be undone.
            </p>
            <button
              onClick={handleClearData}
              className="btn-danger flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear All Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'appearance': return renderAppearanceSettings()
      case 'notifications': return renderNotificationSettings()
      case 'accessibility': return renderAccessibilitySettings()
      case 'data': return renderDataSettings()
      case 'backup': return renderBackupSettings()
      default: return renderAppearanceSettings()
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Customize your fasting experience
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors duration-200
                    ${activeTab === tab.id
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border-r-2 border-primary-500'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="card"
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Settings
