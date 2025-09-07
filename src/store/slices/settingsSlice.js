import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  theme: 'light', // 'light' or 'dark'
  offlineMode: false,
  notifications: {
    enabled: true,
    fastingComplete: true,
    eatingWindowStart: true,
    eatingWindowEnd: true,
    hydrationReminder: true,
    hydrationInterval: 2 // hours
  },
  accessibility: {
    highContrast: false,
    textToSpeech: false,
    reducedMotion: false,
    fontSize: 'medium' // 'small', 'medium', 'large'
  },
  units: {
    weight: 'kg', // 'kg' or 'lbs'
    temperature: 'celsius' // 'celsius' or 'fahrenheit'
  },
  privacy: {
    dataSharing: false,
    analytics: true
  }
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload
      document.documentElement.setAttribute('data-theme', action.payload)
      localStorage.setItem('theme', action.payload)
    },
    toggleOfflineMode: (state) => {
      state.offlineMode = !state.offlineMode
    },
    updateNotifications: (state, action) => {
      state.notifications = { ...state.notifications, ...action.payload }
    },
    updateAccessibility: (state, action) => {
      state.accessibility = { ...state.accessibility, ...action.payload }
    },
    updateUnits: (state, action) => {
      state.units = { ...state.units, ...action.payload }
    },
    updatePrivacy: (state, action) => {
      state.privacy = { ...state.privacy, ...action.payload }
    },
    loadSettings: (state, action) => {
      return { ...state, ...action.payload }
    }
  }
})

export const {
  setTheme,
  toggleOfflineMode,
  updateNotifications,
  updateAccessibility,
  updateUnits,
  updatePrivacy,
  loadSettings
} = settingsSlice.actions

export default settingsSlice.reducer
