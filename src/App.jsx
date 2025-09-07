import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setTheme, loadSettings } from './store/slices/settingsSlice'
import { loadLog } from './store/slices/logsSlice'
import { format } from 'date-fns'

// Components
import Layout from './components/Layout'
import Home from './pages/Home'
import Timer from './pages/Timer'
import Logs from './pages/Logs'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import Safety from './pages/Safety'
import OfflineIndicator from './components/OfflineIndicator'
import InstallPrompt from './components/InstallPrompt'

// Hooks
import { usePWA, useOfflineStorage } from './hooks/usePWA'

function App() {
  const dispatch = useDispatch()
  const { theme, offlineMode } = useSelector((state) => state.settings)
  const { isAuthenticated } = useSelector((state) => state.auth)
  
  // PWA functionality
  const { 
    isOnline, 
    isInstalled, 
    showInstallPrompt, 
    installApp, 
    dismissInstallPrompt 
  } = usePWA()
  
  const { isInitialized, saveData, loadData } = useOfflineStorage()

  useEffect(() => {
    // Load saved settings
    const savedSettings = localStorage.getItem('fastslowly-settings')
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        dispatch(loadSettings(settings))
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    }

    // Load today's log
    const today = format(new Date(), 'yyyy-MM-dd')
    dispatch(loadLog(today))

    // Set initial theme
    const savedTheme = localStorage.getItem('theme') || 'light'
    dispatch(setTheme(savedTheme))
  }, [dispatch])

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    // Save settings to localStorage whenever they change
    const settings = {
      theme,
      offlineMode,
      // Add other settings as needed
    }
    localStorage.setItem('fastslowly-settings', JSON.stringify(settings))
  }, [theme, offlineMode])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <OfflineIndicator />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/timer" element={<Timer />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/safety" element={<Safety />} />
        </Routes>
      </Layout>
      
      {/* PWA Install Prompt */}
      <InstallPrompt
        isVisible={showInstallPrompt && !isInstalled}
        onInstall={installApp}
        onDismiss={dismissInstallPrompt}
      />
    </div>
  )
}

export default App
