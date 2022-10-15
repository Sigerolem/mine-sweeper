import { useEffect, useRef, useState } from 'react'
import { EndGameModal } from '../components/EndGameModal'
import { Header } from '../components/Header'
import { Tile } from '../components/Tile'
import { DifficultyPresets, useGameSettings } from '../hooks/useGameSettings'
import { useTimer } from '../hooks/useTimer'
import { countBombsAround, fillArray, listTilesAround, placeBombs, TileType } from '../utils'
import styles from './Home.module.scss'

export function Home() {
  const { timer, pauseTimer, setTimer } = useTimer()
  const { size, bombsAmount, changeDifficulty, setCustomDifficulty, currentDifficulty } = useGameSettings('easy')

  const bombs = useRef([] as number[])
  const checkedTiles = useRef([] as number[])
  const [tiles, setTiles] = useState(fillArray(size.current))
  const [bombsLeft, setBombsLeft] = useState(10)
  const [modal, setModal] = useState(false)
  const endGameSituation = useRef<'won' | 'lost'>('won')

  useEffect(() => {
    if (checkedTiles.current.length === ((size.current.x * size.current.y) - bombsAmount.current)) {
      pauseTimer(true)
      setTimeout(() => {
        const bestTime = parseInt(localStorage.getItem(`best_${currentDifficulty.current}_time`) ?? '0')
        if (timer < bestTime || bestTime === 0) {
          localStorage.setItem(`best_${currentDifficulty}_time`, String(timer))
        }
        endGameSituation.current = 'won'
        setModal(true)
      }, 400)
    }
    setBombsLeft(bombsAmount.current - tiles.reduce((acc, item) => (item.value === '!' ? ++acc : acc), 0))
  }, [tiles])

  function handleDifficultyChanges({ changeType, newDifficultypreset, newSize, newBombsAmount }: {
    changeType: 'preset' | 'custom',
    newDifficultypreset?: DifficultyPresets,
    newSize?: DifficultyPresets,
    newBombsAmount?: number
  }) {
    if (changeType === 'preset') {
      changeDifficulty(newDifficultypreset!)
      resetGame()
    } else if (changeType === 'custom') {
      setCustomDifficulty(newSize!, newBombsAmount!)
      resetGame()
    }
  }

  function resetGame() {
    bombs.current = []
    checkedTiles.current = []
    setTiles(fillArray(size.current))
    setTimer(0)
  }

  function revealBombs() {
    setTiles(prevTiles => prevTiles.map(tile => (
      bombs.current.includes(tile.id) ? { ...tile, value: 'b', checked: true } : tile
    )))
    setTimeout(() => {
      setModal(true)
      endGameSituation.current = 'lost'
      pauseTimer(true)
    }, 400)
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

  function closeEndGameModal() {
    setModal(false)
    pauseTimer(false)
    resetGame()
  }

  return (
    <main onContextMenu={(e) => e.preventDefault()} className={styles.main}>
      <Header
        handleDifficultyChanges={handleDifficultyChanges}
        timer={timer}
        bombsLeft={bombsLeft}
        resetGame={resetGame}
      />

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

      <EndGameModal
        showModal={modal}
        situation={endGameSituation.current}
        closeModal={closeEndGameModal}
        time={timer}
        difficulty={currentDifficulty.current}
      />
    </main>
  )
}
