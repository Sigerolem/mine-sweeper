import { useEffect, useRef, useState } from 'react'
import { Tile } from '../Tile'
import { countBombsAround, fillArray, listTilesAround, placeBombs, Size, TileType } from '../utils'
import styles from './Home.module.css'

const dificultySets = {
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
    bombsAmount: 30
  },
  hard: {
    size: {
      x: 24,
      y: 20
    },
    bombsAmount: 60
  },
  expert: {
    size: {
      x: 36,
      y: 20
    },
    bombsAmount: 80
  }
}

type Dificulty = 'easy' | 'intermediate' | 'hard' | 'expert'

export function Home() {
  const dificulty = useRef<Dificulty>('easy')
  const size = useRef<Size>({ x: 10, y: 10 })
  const bombsAmount = useRef(12)
  const bombs = useRef([] as number[])
  const checkedTiles = useRef([] as number[])
  const [tiles, setTiles] = useState(fillArray(size.current))
  const [bombsLeft, setBombsLeft] = useState(10)

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

  function changeDificulty(newDificulty: Dificulty) {
    if (dificulty.current === newDificulty) return

    dificulty.current = newDificulty

    size.current.x = dificultySets[dificulty.current].size.x
    size.current.y = dificultySets[dificulty.current].size.y
    bombsAmount.current = dificultySets[dificulty.current].bombsAmount

    resetGame()
  }

  function resetGame() {
    bombs.current = []
    checkedTiles.current = []
    setTiles(fillArray(size.current))
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
      <div className={styles.buttons} >
        <button onClick={() => { changeDificulty('easy') }} >Easy</button>
        <button onClick={() => { changeDificulty('intermediate') }} >Medium</button>
        <button onClick={() => { changeDificulty('hard') }} >Hard</button>
        <button onClick={() => { changeDificulty('expert') }} >Expert</button>
        <span>Bombs left: <strong>{`${bombsLeft}`}</strong></span>
      </div>
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
