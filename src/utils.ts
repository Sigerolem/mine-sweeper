import { useRef } from 'react'

export type TileType = {
  id: number;
  value: string;
  column: number;
  row: number;
  checked: boolean;
}

export type Size = {
  x: number,
  y: number
}

export function fillArray(size: Size) {
  const newArray = [] as TileType[]

  for (let i = 0; i < size.y; i++) {
    for (let j = 0; j < size.x; j++) {
      newArray.push({
        id: (i * size.x + j),
        value: '',
        column: j,
        row: i,
        checked: false
      })
    }
  }
  return newArray
}

export function listTilesAround(tileRow:number, tileCol: number, gridSize: Size) {
  const tilesAround = [] as number[]
  for (let i = tileRow - 1; i < tileRow + 2; i++) {
    for (let j = tileCol - 1; j < tileCol + 2; j++) {
      if (j < 0 || j >= gridSize.x || i < 0 || i >= gridSize.y) continue
      if (j === tileCol && i === tileRow) continue
      tilesAround.push(i * gridSize.x + j)
    }
  }
  return tilesAround
}

export function placeBombs(amountOfBombs: number, gridSize: Size, clickedTileId: number) {
  const bombsArray = [] as number[]
  while (bombsArray.length < amountOfBombs) {
    const newBomb = Math.floor(Math.random() * (gridSize.x * gridSize.y))

    if (bombsArray.includes(newBomb) || (newBomb - clickedTileId < 2 && newBomb - clickedTileId > -2)) continue

    bombsArray.push(newBomb)
  }
  return bombsArray
}

export function countBombsAround(tilesAround: number[], bombs: number[]) {
  let bombsAround = 0
  tilesAround.forEach(id => {
    if (bombs.includes(id)) {
      bombsAround++
    }
  })
  return bombsAround
}

export function longPressHandler(rightClick: (tileTouched: TileType)=>void, tileTouched: TileType) {
  const timerRef = useRef(0)

  function handleOnTouchStart() {
    timerRef.current = setTimeout(() => {
      rightClick(tileTouched)
    }, 300)
  }

  function handleOnTouchEnd() {
    clearTimeout(timerRef.current)
  }

  return {
    handleOnTouchStart,
    handleOnTouchEnd
  }
}
