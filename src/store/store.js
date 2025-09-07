import { configureStore } from '@reduxjs/toolkit'
import timerReducer from './slices/timerSlice'
import settingsReducer from './slices/settingsSlice'
import logsReducer from './slices/logsSlice'
import authReducer from './slices/authSlice'

export const store = configureStore({
  reducer: {
    timer: timerReducer,
    settings: settingsReducer,
    logs: logsReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})
