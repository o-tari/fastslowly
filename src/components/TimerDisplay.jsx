import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { startTimer, pauseTimer, resumeTimer, stopTimer, resetTimer } from '../store/slices/timerSlice'
import { Play, Pause, Square, RotateCcw } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const TimerDisplay = () => {
  const dispatch = useDispatch()
  const { 
    isRunning, 
    isPaused, 
    startTime, 
    targetDuration, 
    currentProtocol,
    protocols 
  } = useSelector((state) => state.timer)
  
  const [elapsedTime, setElapsedTime] = useState(0)
  const [timeDisplay, setTimeDisplay] = useState('00:00:00')

  useEffect(() => {
    let interval = null
    
    if (isRunning && !isPaused && startTime) {
      interval = setInterval(() => {
        const now = Date.now()
        const elapsed = now - startTime
        setElapsedTime(elapsed)
        setTimeDisplay(formatTime(elapsed))
        
        // Check if target reached
        if (elapsed >= targetDuration) {
          toast.success('🎉 Fasting goal achieved! Great job!', {
            duration: 6000,
          })
          dispatch(stopTimer())
        }
      }, 1000)
    } else if (isPaused) {
      clearInterval(interval)
    } else {
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  }, [isRunning, isPaused, startTime, targetDuration, dispatch])

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const getProgress = () => {
    if (!isRunning || !startTime) return 0
    return Math.min((elapsedTime / targetDuration) * 100, 100)
  }

  const getRemainingTime = () => {
    if (!isRunning || !startTime) return targetDuration
    const remaining = targetDuration - elapsedTime
    return Math.max(remaining, 0)
  }

  const handleStart = () => {
    if (isPaused) {
      dispatch(resumeTimer())
      toast.success('Timer resumed')
    } else {
      dispatch(startTimer())
      toast.success('Fasting started! You\'ve got this! 💪')
    }
  }

  const handlePause = () => {
    dispatch(pauseTimer())
    toast('Timer paused', { icon: '⏸️' })
  }

  const handleStop = () => {
    dispatch(stopTimer())
    toast('Fasting session ended', { icon: '🏁' })
  }

  const handleReset = () => {
    dispatch(resetTimer())
    setElapsedTime(0)
    setTimeDisplay('00:00:00')
    toast('Timer reset', { icon: '🔄' })
  }

  const progress = getProgress()
  const remainingTime = getRemainingTime()
  const circumference = 2 * Math.PI * 90 // radius = 90
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Progress Ring */}
      <div className="relative">
        <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="text-primary-600 transition-all duration-1000 ease-out"
            strokeLinecap="round"
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="text-4xl font-mono font-bold text-gray-900 dark:text-white mb-2">
              {timeDisplay}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {isRunning ? 'Fasting' : 'Ready'}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {protocols[currentProtocol]?.description}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Remaining time */}
      {isRunning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-lg text-gray-600 dark:text-gray-400">
            {remainingTime > 0 ? 'Time remaining:' : 'Goal achieved!'}
          </div>
          <div className="text-2xl font-mono font-semibold text-primary-600">
            {formatTime(remainingTime)}
          </div>
        </motion.div>
      )}

      {/* Controls */}
      <div className="flex items-center space-x-4">
        {!isRunning ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="btn-primary flex items-center space-x-2 px-6 py-3 text-lg"
          >
            <Play className="h-5 w-5" />
            <span>Start Fasting</span>
          </motion.button>
        ) : (
          <>
            {!isPaused ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePause}
                className="btn-secondary flex items-center space-x-2 px-6 py-3 text-lg"
              >
                <Pause className="h-5 w-5" />
                <span>Pause</span>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStart}
                className="btn-primary flex items-center space-x-2 px-6 py-3 text-lg"
              >
                <Play className="h-5 w-5" />
                <span>Resume</span>
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStop}
              className="btn-danger flex items-center space-x-2 px-4 py-3"
            >
              <Square className="h-5 w-5" />
              <span>Stop</span>
            </motion.button>
          </>
        )}
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="btn-secondary flex items-center space-x-2 px-4 py-3"
        >
          <RotateCcw className="h-5 w-5" />
          <span>Reset</span>
        </motion.button>
      </div>

      {/* Progress percentage */}
      <div className="text-center">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Progress
        </div>
        <div className="text-2xl font-bold text-primary-600">
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  )
}

export default TimerDisplay
