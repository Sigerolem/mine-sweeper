import { useEffect, useRef, useState } from 'react'

export function useTimer() {
  const [timer, setTimer] = useState(0)
  const isTimerPaused = useRef(false)

  useEffect(() => {
    setInterval(() => {
      if (isTimerPaused.current) return
      setTimer(prev => prev + 1)
    }, 1000)
  }, [])

  function pauseTimer(bool: boolean) {
    isTimerPaused.current = bool
  }

  return {
    timer,
    setTimer,
    pauseTimer,
    isTimerPaused
  }
}
