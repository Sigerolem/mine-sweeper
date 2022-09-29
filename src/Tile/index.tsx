import { longPressHandler, TileType } from '../utils'
import styles from './Tile.module.scss'

interface TileProps {
  tile: TileType;
  rightClick: (tile: TileType) => void;
  leftClick: (tile: TileType) => void;
}

const numberColors = ['', '#47b2ff', '#37ff4b', '#ff4747', '#ff38c7', '#800000', '#008080', '#b40078']

export function Tile({ tile, leftClick, rightClick }: TileProps) {
  const longPress = longPressHandler(rightClick, tile)
  return (
    <div
      className={tile.checked ? `${styles.tile} ${styles.checked}` : styles.tile}
      style={{ color: isNaN(parseInt(tile.value)) ? 'var(--body)' : `${numberColors[parseInt(tile.value)]}` }}
      onClick={() => { leftClick(tile) }}
      onAuxClick={() => { rightClick(tile) }}
      onMouseUp={e => {
        if (e.button === 0) {
          const div = e.target as HTMLDivElement
          div.classList.remove(`${styles.hover}`)
          leftClick(tile)
        } else if (e.button === 2) {
          const div = e.target as HTMLDivElement
          div.classList.remove(`${styles.hover}`)
        }
      }}
      onTouchStart={longPress.handleOnTouchStart}
      onTouchEnd={longPress.handleOnTouchEnd}
      onTouchMove={longPress.handleOnTouchEnd}
      onMouseEnter={e => {
        const div = e.target as HTMLDivElement
        if (
          (e.buttons.toString() === '1' || e.buttons.toString() === '2') &&
          !div.classList.contains(`${styles.checked}`)
        ) div.classList.add(`${styles.hover}`)
      }}
      onMouseLeave={e => {
        const div = e.target as HTMLDivElement
        div.classList.remove(`${styles.hover}`)
      }}
      onMouseDown={e => {
        const div = e.target as HTMLDivElement
        if (!div.classList.contains(`${styles.checked}`)) div.classList.add(`${styles.hover}`)
      }}
    >
      {tile.value === 'b'
        ? <img src="/mine.svg" />
        : tile.value === '!'
          ? <img src="/flag.svg" />
          : tile.value
        }
    </div>
  )
}
