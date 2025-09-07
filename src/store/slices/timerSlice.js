import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isRunning: false,
  isPaused: false,
  startTime: null,
  pauseTime: null,
  totalPausedTime: 0,
  targetDuration: 16 * 60 * 60 * 1000, // 16 hours in milliseconds
  currentProtocol: '16:8',
  protocols: {
    '16:8': { name: '16:8', fastingHours: 16, eatingHours: 8, description: '16 hours fasting, 8 hours eating' },
    '18:6': { name: '18:6', fastingHours: 18, eatingHours: 6, description: '18 hours fasting, 6 hours eating' },
    '20:4': { name: '20:4', fastingHours: 20, eatingHours: 4, description: '20 hours fasting, 4 hours eating' },
    'OMAD': { name: 'OMAD', fastingHours: 23, eatingHours: 1, description: 'One Meal A Day' },
    '5:2': { name: '5:2', fastingHours: 24, eatingHours: 0, description: '5 days normal eating, 2 days fasting' },
    'custom': { name: 'Custom', fastingHours: 16, eatingHours: 8, description: 'Custom protocol' }
  }
}

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    startTimer: (state) => {
      state.isRunning = true
      state.isPaused = false
      state.startTime = Date.now()
      state.pauseTime = null
    },
    pauseTimer: (state) => {
      if (state.isRunning && !state.isPaused) {
        state.isPaused = true
        state.pauseTime = Date.now()
      }
    },
    resumeTimer: (state) => {
      if (state.isRunning && state.isPaused) {
        state.isPaused = false
        state.totalPausedTime += Date.now() - state.pauseTime
        state.pauseTime = null
      }
    },
    stopTimer: (state) => {
      state.isRunning = false
      state.isPaused = false
      state.startTime = null
      state.pauseTime = null
      state.totalPausedTime = 0
    },
    resetTimer: (state) => {
      state.isRunning = false
      state.isPaused = false
      state.startTime = null
      state.pauseTime = null
      state.totalPausedTime = 0
    },
    setProtocol: (state, action) => {
      const protocol = action.payload
      state.currentProtocol = protocol
      if (protocol !== 'custom') {
        state.targetDuration = state.protocols[protocol].fastingHours * 60 * 60 * 1000
      }
    },
    setCustomDuration: (state, action) => {
      state.targetDuration = action.payload * 60 * 60 * 1000 // Convert hours to milliseconds
    },
    updateProtocols: (state, action) => {
      state.protocols = { ...state.protocols, ...action.payload }
    }
  }
})

export const {
  startTimer,
  pauseTimer,
  resumeTimer,
  stopTimer,
  resetTimer,
  setProtocol,
  setCustomDuration,
  updateProtocols
} = timerSlice.actions

export default timerSlice.reducer
