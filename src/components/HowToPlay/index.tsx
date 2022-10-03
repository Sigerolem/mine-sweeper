import { RoundButtonModal } from '../RoundButtonModal'
import styles from './HowToPlay.module.scss'

export function HowToPlay() {
  return (
    <RoundButtonModal icon={'help'} modalClass={styles.modal} >
    <h3>How to play</h3>
    <p>When you click on a cell, it will reveal its content.</p>
    <p>If it contains a mine, the game will be over.</p>
    <p>If it doesn&apos;t, then the cell will show how many mines are around it. Like shown below.</p>
    <img src="help.png" alt="Help" />
    <p>The player can mark a cell by <strong>right clicking</strong> or <strong>long pressing</strong> the cell.</p>
    <p>The mark can be a flag, usually indicating the player is sure about a mine location.</p>
    <p>Or a <strong>question mark</strong> meaning doubt over the specific location of the mine.</p>
    <p>Like shown bellow.</p>
    <img src="helpMark.png" alt="Help" />
  </RoundButtonModal>
  )
}
