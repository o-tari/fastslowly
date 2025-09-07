import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  syncStatus: 'idle', // 'idle', 'syncing', 'success', 'error'
  lastSync: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
      state.error = null
    },
    setError: (state, action) => {
      state.error = action.payload
      state.isLoading = false
    },
    clearError: (state) => {
      state.error = null
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
      state.syncStatus = 'idle'
      state.lastSync = null
    },
    setSyncStatus: (state, action) => {
      state.syncStatus = action.payload
      if (action.payload === 'success') {
        state.lastSync = new Date().toISOString()
      }
    },
    updateLastSync: (state, action) => {
      state.lastSync = action.payload
    }
  }
})

export const {
  setLoading,
  setUser,
  setError,
  clearError,
  logout,
  setSyncStatus,
  updateLastSync
} = authSlice.actions

export default authSlice.reducer
