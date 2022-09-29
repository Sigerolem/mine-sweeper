import { useEffect, useRef, useState } from 'react'
import { RoundButtonModal } from '../RoundButtonModal'
import { Tile } from '../Tile'
import { countBombsAround, fillArray, listTilesAround, placeBombs, Size, TileType } from '../utils'
import styles from './Home.module.scss'

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

type Dificulty = 'easy' | 'intermediate' | 'hard' | 'expert'

export function Home() {
  const dificulty = useRef<Dificulty>('easy')
  const size = useRef<Size>({ x: 10, y: 10 })
  const bombsAmount = useRef(12)
  const bombs = useRef([] as number[])
  const checkedTiles = useRef([] as number[])
  const [tiles, setTiles] = useState(fillArray(size.current))
  const [bombsLeft, setBombsLeft] = useState(10)
  const [timer, setTimer] = useState(0)

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
    setInterval(() => {
      setTimer(prev => prev + 1)
    }, 1000)
  }, [])

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
          <RoundButtonModal icon={'menu'} >
            <h3>Difficulty</h3>
            <div>
              <button onClick={() => { changeDificulty('easy') }} >Easy</button>
              <button onClick={() => { changeDificulty('intermediate') }} >Medium</button>
              <button onClick={() => { changeDificulty('hard') }} >Hard</button>
              <button onClick={() => { changeDificulty('expert') }} >Expert</button>
            </div>
          </RoundButtonModal>
          <RoundButtonModal icon={'help'} >
            <h3>How to play</h3>
            <p>When you click on a cell, it will reveal its content.</p>
            <p>If it contains a mine, the game will be over.</p>
            <p>If it doesn&apos;t, then the cell will show how many mines are around it. Like shown below.</p>
            <img src="/help.png" alt="Help" />
            <p>The player can mark a cell by <strong>right clicking</strong> or <strong>long pressing</strong> the cell.</p>
            <p>The mark can be a flag, usually indicating the player is sure about a mine location.</p>
            <p>Or a <strong>question mark</strong> meaning doubt over the specific location of the mine.</p>
            <p>Like shown bellow.</p>
            <img src="/helpMark.png" alt="Help" />
          </RoundButtonModal>
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
