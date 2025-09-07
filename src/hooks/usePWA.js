import { useState, useEffect } from 'react'
import { dbStorage, Storage, SyncManager } from '../utils/storage'

export const usePWA = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isInstalled, setIsInstalled] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true)
      SyncManager.handleOfflineData()
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const installApp = async () => {
    if (!deferredPrompt) return false

    try {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setIsInstalled(true)
        setShowInstallPrompt(false)
        setDeferredPrompt(null)
        return true
      }
      
      return false
    } catch (error) {
      console.error('Failed to install app:', error)
      return false
    }
  }

  const dismissInstallPrompt = () => {
    setShowInstallPrompt(false)
    setDeferredPrompt(null)
  }

  return {
    isOnline,
    isInstalled,
    showInstallPrompt,
    installApp,
    dismissInstallPrompt
  }
}

export const useOfflineStorage = () => {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initStorage = async () => {
      try {
        await dbStorage.init()
        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to initialize IndexedDB:', error)
        setIsInitialized(true) // Fall back to localStorage
      }
    }

    initStorage()
  }, [])

  const saveData = async (type, data) => {
    if (!isInitialized) return false

    try {
      switch (type) {
        case 'log':
          await dbStorage.saveLog(data)
          Storage.setItem(`log_${data.date}`, data)
          break
        case 'settings':
          await dbStorage.saveSettings(data)
          Storage.setItem('settings', data)
          break
        case 'timer':
          await dbStorage.saveTimerState(data)
          Storage.setItem('timer', data)
          break
        default:
          return false
      }
      return true
    } catch (error) {
      console.error('Failed to save data:', error)
      return false
    }
  }

  const loadData = async (type, key = null) => {
    if (!isInitialized) return null

    try {
      switch (type) {
        case 'log':
          if (key) {
            const dbData = await dbStorage.getLog(key)
            return dbData || Storage.getItem(`log_${key}`)
          }
          return await dbStorage.getAllLogs()
        case 'settings':
          const dbSettings = await dbStorage.getSettings()
          return Object.keys(dbSettings).length > 0 ? dbSettings : Storage.getItem('settings', {})
        case 'timer':
          const dbTimer = await dbStorage.getTimerState()
          return Object.keys(dbTimer).length > 0 ? dbTimer : Storage.getItem('timer', {})
        default:
          return null
      }
    } catch (error) {
      console.error('Failed to load data:', error)
      return null
    }
  }

  const clearAllData = async () => {
    if (!isInitialized) return false

    try {
      await dbStorage.clearAll()
      Storage.clear()
      return true
    } catch (error) {
      console.error('Failed to clear data:', error)
      return false
    }
  }

  return {
    isInitialized,
    saveData,
    loadData,
    clearAllData
  }
}
