import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Smartphone, Monitor } from 'lucide-react'

const InstallPrompt = ({ onInstall, onDismiss, isVisible }) => {
  const [isClosing, setIsClosing] = useState(false)

  const handleInstall = async () => {
    const success = await onInstall()
    if (success) {
      setIsClosing(true)
    }
  }

  const handleDismiss = () => {
    setIsClosing(true)
    setTimeout(() => {
      onDismiss()
      setIsClosing(false)
    }, 300)
  }

  return (
    <AnimatePresence>
      {isVisible && !isClosing && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                  <Download className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Install FastSlowly
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get quick access to your fasting tracker
                  </p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Smartphone className="h-4 w-4" />
                <span>Mobile</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Monitor className="h-4 w-4" />
                <span>Desktop</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleInstall}
                className="flex-1 btn-primary flex items-center justify-center space-x-2 py-2"
              >
                <Download className="h-4 w-4" />
                <span>Install</span>
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                Not now
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default InstallPrompt
