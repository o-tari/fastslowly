import { createSlice } from '@reduxjs/toolkit'
import { format, startOfDay, endOfDay } from 'date-fns'

const initialState = {
  dailyLogs: {},
  currentLog: {
    date: format(new Date(), 'yyyy-MM-dd'),
    fastingHours: 0,
    weight: null,
    hydration: 0, // glasses of water
    mood: null, // 1-5 scale
    notes: '',
    completed: false,
    protocol: '16:8'
  },
  stats: {
    currentStreak: 0,
    longestStreak: 0,
    totalFastingDays: 0,
    averageFastingHours: 0,
    weightChange: 0,
    lastWeight: null
  }
}

const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    updateCurrentLog: (state, action) => {
      state.currentLog = { ...state.currentLog, ...action.payload }
    },
    saveLog: (state, action) => {
      const log = action.payload || state.currentLog
      const date = log.date
      
      state.dailyLogs[date] = log
      
      // Update stats
      state.stats = calculateStats(state.dailyLogs)
      
      // Reset current log for next day
      const nextDate = format(new Date(Date.now() + 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
      state.currentLog = {
        date: nextDate,
        fastingHours: 0,
        weight: null,
        hydration: 0,
        mood: null,
        notes: '',
        completed: false,
        protocol: state.currentLog.protocol
      }
    },
    loadLog: (state, action) => {
      const date = action.payload
      if (state.dailyLogs[date]) {
        state.currentLog = state.dailyLogs[date]
      } else {
        state.currentLog = {
          ...state.currentLog,
          date: date
        }
      }
    },
    deleteLog: (state, action) => {
      const date = action.payload
      delete state.dailyLogs[date]
      state.stats = calculateStats(state.dailyLogs)
    },
    importLogs: (state, action) => {
      state.dailyLogs = { ...state.dailyLogs, ...action.payload }
      state.stats = calculateStats(state.dailyLogs)
    },
    exportLogs: (state) => {
      // This will be handled by a selector or component
      return state.dailyLogs
    },
    updateStats: (state) => {
      state.stats = calculateStats(state.dailyLogs)
    }
  }
})

// Helper function to calculate statistics
function calculateStats(dailyLogs) {
  const logs = Object.values(dailyLogs).filter(log => log.completed)
  
  if (logs.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalFastingDays: 0,
      averageFastingHours: 0,
      weightChange: 0,
      lastWeight: null
    }
  }
  
  // Calculate streaks
  const sortedDates = Object.keys(dailyLogs)
    .filter(date => dailyLogs[date].completed)
    .sort((a, b) => new Date(b) - new Date(a))
  
  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0
  
  for (let i = 0; i < sortedDates.length; i++) {
    const currentDate = new Date(sortedDates[i])
    const nextDate = i < sortedDates.length - 1 ? new Date(sortedDates[i + 1]) : null
    
    if (i === 0) {
      tempStreak = 1
      currentStreak = 1
    } else if (nextDate && (currentDate - nextDate) === 24 * 60 * 60 * 1000) {
      tempStreak++
      if (i === 0) currentStreak = tempStreak
    } else {
      longestStreak = Math.max(longestStreak, tempStreak)
      tempStreak = 1
      if (i === 0) currentStreak = 0
    }
  }
  
  longestStreak = Math.max(longestStreak, tempStreak)
  
  // Calculate average fasting hours
  const totalFastingHours = logs.reduce((sum, log) => sum + (log.fastingHours || 0), 0)
  const averageFastingHours = logs.length > 0 ? totalFastingHours / logs.length : 0
  
  // Calculate weight change
  const weights = logs
    .filter(log => log.weight)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
  
  const weightChange = weights.length >= 2 
    ? weights[weights.length - 1].weight - weights[0].weight 
    : 0
  
  const lastWeight = weights.length > 0 ? weights[weights.length - 1].weight : null
  
  return {
    currentStreak,
    longestStreak,
    totalFastingDays: logs.length,
    averageFastingHours,
    weightChange,
    lastWeight
  }
}

export const {
  updateCurrentLog,
  saveLog,
  loadLog,
  deleteLog,
  importLogs,
  exportLogs,
  updateStats
} = logsSlice.actions

export default logsSlice.reducer
