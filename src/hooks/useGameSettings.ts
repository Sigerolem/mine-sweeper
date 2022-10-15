import { useEffect, useRef } from 'react'

export type DifficultyPresets = 'easy' | 'intermediate' | 'hard' | 'expert' | 'custom'

const difficultySets = {
  easy: {
    size: {
      x: 10,
      y: 10
    },
    bombsAmount: 12
  },
  intermediate: {
    size: {
      x: 18,
      y: 14
    },
    bombsAmount: 35
  },
  hard: {
    size: {
      x: 24,
      y: 20
    },
    bombsAmount: 70
  },
  expert: {
    size: {
      x: 34,
      y: 20
    },
    bombsAmount: 110
  },
  custom: {
    size: {
      x: 34,
      y: 20
    },
    bombsAmount: 110
  }
}

export function useGameSettings(initialDifficulty: DifficultyPresets) {
  const currentDifficulty = useRef<DifficultyPresets>('easy')
  const size = useRef({ x: 10, y: 10 })
  const bombsAmount = useRef(12)

  useEffect(() => {
    currentDifficulty.current = initialDifficulty
    size.current = difficultySets[currentDifficulty.current].size
    bombsAmount.current = difficultySets[currentDifficulty.current].bombsAmount
  }, [])

  function changeDifficulty(newDifficulty: DifficultyPresets) {
    if (newDifficulty === currentDifficulty.current) return
    currentDifficulty.current = newDifficulty
    size.current = difficultySets[currentDifficulty.current].size
    bombsAmount.current = difficultySets[currentDifficulty.current].bombsAmount
  }

  function setCustomDifficulty(newSize: DifficultyPresets, newBombsAmount: number) {
    console.log(newSize, newBombsAmount)
    if (difficultySets[newSize].size === size.current && newBombsAmount === bombsAmount.current) return
    size.current = difficultySets[newSize].size
    bombsAmount.current = newBombsAmount
    currentDifficulty.current = 'custom'
  }

  return {
    currentDifficulty,
    size,
    bombsAmount,
    changeDifficulty,
    setCustomDifficulty
  }
}
