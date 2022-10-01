import { useEffect, useRef, useState } from 'react'
import { DifficultySettings } from '../components/DifficultySettings'
import { HowToPlay } from '../components/HowToPlay'
import { Tile } from '../components/Tile'
import { countBombsAround, fillArray, listTilesAround, placeBombs, Size, TileType } from '../utils'
import styles from './Home.module.scss'

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
  }
}

export type Difficulty = 'easy' | 'intermediate' | 'hard' | 'expert'

export function Home() {
  const difficulty = useRef<Difficulty>('easy')
  const size = useRef<Size>({ x: 10, y: 10 })
  const bombsAmount = useRef(12)
  const bombs = useRef([] as number[])
  const checkedTiles = useRef([] as number[])
  const [tiles, setTiles] = useState(fillArray(size.current))
  const [bombsLeft, setBombsLeft] = useState(10)
  const [timer, setTimer] = useState(0)
  const timerTicking = useRef<number>()

  useEffect(() => {
    if (checkedTiles.current.length === ((size.current.x * size.current.y) - bombsAmount.current)) {
      setTimeout(() => {
        alert('ganhou')
      }, 50)
      setTimeout(() => {
        resetGame()
      }, 100)
    }
    setBombsLeft(bombsAmount.current - tiles.reduce((acc, item) => (item.value === '!' ? ++acc : acc), 0))
  }, [tiles])

  useEffect(() => {
    if (timer !== 0) return
    timerTicking.current = setInterval(() => {
      setTimer(prev => prev + 1)
    }, 1000)
  }, [timer])

  function changeDifficulty(newDifficulty: Difficulty) {
    if (difficulty.current === newDifficulty && bombsAmount.current === difficultySets[newDifficulty].bombsAmount) return

    difficulty.current = newDifficulty

    size.current.x = difficultySets[difficulty.current].size.x
    size.current.y = difficultySets[difficulty.current].size.y
    bombsAmount.current = difficultySets[difficulty.current].bombsAmount

    resetGame()
  }

  function setCustomDifficulty(difficultySize: Difficulty, customBombsAmount: number) {
    if (difficulty.current === difficultySize && bombsAmount.current === customBombsAmount) return

    difficulty.current = difficultySize

    size.current.x = difficultySets[difficulty.current].size.x
    size.current.y = difficultySets[difficulty.current].size.y

    bombsAmount.current = customBombsAmount

    resetGame()
  }

  function resetGame() {
    bombs.current = []
    checkedTiles.current = []
    setTiles(fillArray(size.current))
    clearInterval(timerTicking.current)
    setTimer(0)
  }

  function revealBombs() {
    setTiles(prevTiles => prevTiles.map(tile => (
      bombs.current.includes(tile.id) ? { ...tile, value: 'b', checked: true } : tile
    )))
    setTimeout(() => {
      alert('você perdeu')
    }, 50)
    setTimeout(() => {
      resetGame()
    }, 100)
  }

  function revealNumberOfBombsAround(tileId:number, amountOfBombsAround: number) {
    setTiles(prevTiles => prevTiles.map(prevTile => (
      prevTile.id === tileId
        ? { ...prevTile, value: `${amountOfBombsAround > 0 ? amountOfBombsAround : ''}`, checked: true }
        : prevTile
    )))
  }

  function leftClickRecursive(selectedTile: TileType) {
    checkedTiles.current.push(selectedTile.id)

    const tilesAround = listTilesAround(selectedTile.row, selectedTile.column, size.current)
    const bombsAround = countBombsAround(tilesAround, bombs.current)
    revealNumberOfBombsAround(selectedTile.id, bombsAround)

    if (bombsAround > 0) return

    tilesAround.forEach(tileId => {
      if (checkedTiles.current.includes(tileId) === true || tiles[tileId].checked === true) return
      leftClickRecursive(tiles[tileId])
    })
  }

  function handleLeftClick(selectedTile: TileType) {
    if (bombs.current.length === 0) bombs.current = placeBombs(bombsAmount.current, size.current, selectedTile.id)

    if (selectedTile.checked === true || checkedTiles.current.includes(selectedTile.id)) return

    if (selectedTile.value === '!' || selectedTile.value === '?') return

    if (bombs.current.includes(selectedTile.id)) {
      revealBombs()
      return
    }

    leftClickRecursive(selectedTile)
  }

  function handleRightClick(selectedTile: TileType) {
    if (selectedTile.checked === true || checkedTiles.current.includes(selectedTile.id)) return

    setTiles(prevState => prevState.map(tile => (
      tile.id === selectedTile.id
        ? { ...tile, value: tile.value === '!' ? '?' : tile.value === '?' ? '' : '!' }
        : tile
    )))
  }
  return (
    <main onContextMenu={(e) => e.preventDefault()} className={styles.main}>
      <header className={styles.header} >

        <div className={styles.headerLine} >
          <div className={styles.bombsLeft} >
            <img src="/mine.svg" alt="Mine Image" />
            <strong>{`${bombsLeft}`}</strong>
          </div>
          <div className={styles.timePassed} >
            <strong>{`${timer}`}</strong>
            <img src="/wood.svg" alt="Mine Image" />
          </div>
        </div>

        <div className={styles.headerLine} >
          <DifficultySettings changeDifficulty={changeDifficulty} setCustomDifficulty={setCustomDifficulty} />
          <HowToPlay />
        </div>

      </header>
      <div
      className={styles.grid}
      style={{
        gridTemplateColumns: `repeat(${size.current.x}, 1fr)`,
        marginTop: `calc(${size.current.x - size.current.y} * var(--margin-rotation))`
      }}>
        {tiles.map(item =>
          <Tile leftClick={handleLeftClick} rightClick={handleRightClick} tile={item} key={item.id} />
        )}
      </div>
    </main>
  )
}
