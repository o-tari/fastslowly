// Local storage utilities for offline mode
export const Storage = {
  // LocalStorage wrapper with error handling
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
      return false
    }
  },

  getItem: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('Failed to read from localStorage:', error)
      return defaultValue
    }
  },

  removeItem: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Failed to remove from localStorage:', error)
      return false
    }
  },

  clear: () => {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
      return false
    }
  }
}

// IndexedDB utilities for more robust offline storage
export class IndexedDBStorage {
  constructor(dbName = 'FastSlowlyDB', version = 1) {
    this.dbName = dbName
    this.version = version
    this.db = null
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result

        // Create object stores
        if (!db.objectStoreNames.contains('logs')) {
          const logsStore = db.createObjectStore('logs', { keyPath: 'date' })
          logsStore.createIndex('date', 'date', { unique: true })
        }

        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' })
        }

        if (!db.objectStoreNames.contains('timer')) {
          db.createObjectStore('timer', { keyPath: 'id' })
        }
      }
    })
  }

  async saveLog(log) {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['logs'], 'readwrite')
      const store = transaction.objectStore('logs')
      const request = store.put(log)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async getLog(date) {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['logs'], 'readonly')
      const store = transaction.objectStore('logs')
      const request = store.get(date)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async getAllLogs() {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['logs'], 'readonly')
      const store = transaction.objectStore('logs')
      const request = store.getAll()

      request.onsuccess = () => {
        const logs = {}
        request.result.forEach(log => {
          logs[log.date] = log
        })
        resolve(logs)
      }
      request.onerror = () => reject(request.error)
    })
  }

  async saveSettings(settings) {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['settings'], 'readwrite')
      const store = transaction.objectStore('settings')
      const request = store.put({ key: 'app', value: settings })

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async getSettings() {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['settings'], 'readonly')
      const store = transaction.objectStore('settings')
      const request = store.get('app')

      request.onsuccess = () => resolve(request.result?.value || {})
      request.onerror = () => reject(request.error)
    })
  }

  async saveTimerState(timerState) {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['timer'], 'readwrite')
      const store = transaction.objectStore('timer')
      const request = store.put({ id: 'current', ...timerState })

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async getTimerState() {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['timer'], 'readonly')
      const store = transaction.objectStore('timer')
      const request = store.get('current')

      request.onsuccess = () => resolve(request.result || {})
      request.onerror = () => reject(request.error)
    })
  }

  async clearAll() {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['logs', 'settings', 'timer'], 'readwrite')
      
      const clearLogs = transaction.objectStore('logs').clear()
      const clearSettings = transaction.objectStore('settings').clear()
      const clearTimer = transaction.objectStore('timer').clear()

      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
  }
}

// Export singleton instance
export const dbStorage = new IndexedDBStorage()

// Sync utilities for online/offline mode
export const SyncManager = {
  isOnline: () => navigator.onLine,
  
  async syncToCloud(data) {
    // This would integrate with Firebase or your preferred backend
    // For now, we'll just simulate the sync
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Data synced to cloud:', data)
        resolve(true)
      }, 1000)
    })
  },

  async syncFromCloud() {
    // This would fetch data from your backend
    // For now, we'll return empty data
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Data synced from cloud')
        resolve({})
      }, 1000)
    })
  },

  async handleOfflineData() {
    // Queue data for sync when back online
    const offlineData = Storage.getItem('offlineQueue', [])
    if (offlineData.length > 0) {
      try {
        await this.syncToCloud(offlineData)
        Storage.setItem('offlineQueue', [])
        console.log('Offline data synced successfully')
      } catch (error) {
        console.error('Failed to sync offline data:', error)
      }
    }
  }
}

// Initialize sync when back online
window.addEventListener('online', () => {
  SyncManager.handleOfflineData()
})
