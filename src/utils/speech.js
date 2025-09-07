// Text-to-speech utility for accessibility
export const SpeechSynthesis = {
  isSupported: () => {
    return 'speechSynthesis' in window
  },

  speak: (text, options = {}) => {
    if (!SpeechSynthesis.isSupported()) {
      console.warn('Speech synthesis not supported')
      return
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    
    // Set options
    utterance.rate = options.rate || 1
    utterance.pitch = options.pitch || 1
    utterance.volume = options.volume || 1
    utterance.lang = options.lang || 'en-US'

    // Set voice if available
    const voices = window.speechSynthesis.getVoices()
    const preferredVoice = voices.find(voice => 
      voice.lang.startsWith('en') && voice.default
    )
    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    window.speechSynthesis.speak(utterance)
  },

  stop: () => {
    if (SpeechSynthesis.isSupported()) {
      window.speechSynthesis.cancel()
    }
  },

  pause: () => {
    if (SpeechSynthesis.isSupported()) {
      window.speechSynthesis.pause()
    }
  },

  resume: () => {
    if (SpeechSynthesis.isSupported()) {
      window.speechSynthesis.resume()
    }
  }
}

// Hook for using speech synthesis in React components
export const useSpeechSynthesis = () => {
  const speak = (text, options) => {
    SpeechSynthesis.speak(text, options)
  }

  const stop = () => {
    SpeechSynthesis.stop()
  }

  const pause = () => {
    SpeechSynthesis.pause()
  }

  const resume = () => {
    SpeechSynthesis.resume()
  }

  return {
    speak,
    stop,
    pause,
    resume,
    isSupported: SpeechSynthesis.isSupported()
  }
}
