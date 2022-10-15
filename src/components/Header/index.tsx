import { DifficultyPresets } from '../../hooks/useGameSettings'
import { DifficultySettings } from '../DifficultySettings'
import { HowToPlay } from '../HowToPlay'

import styles from './Header.module.scss'

interface HeaderProps {
  handleDifficultyChanges: ({ changeType, newDifficultypreset, newSize, newBombsAmount }: {
    changeType: 'preset' | 'custom',
    newDifficultypreset?: DifficultyPresets,
    newSize?: DifficultyPresets,
    newBombsAmount?: number
  }) => void;
  timer: number;
  bombsLeft: number;
  resetGame: () => void;
}

export function Header({ handleDifficultyChanges, timer, bombsLeft, resetGame }: HeaderProps) {
  return (
    <header className={styles.header} >
        <div className={styles.headerLine} >
          <div className={styles.bombsLeft} >
            <img src="mine.svg" alt="Mine Image" />
            <strong>{`${bombsLeft}`}</strong>
          </div>
          <div className={styles.timePassed} >
            <strong>{`${timer}`}</strong>
            <img src="wood.svg" alt="Mine Image" />
          </div>
        </div>

        <div className={styles.headerLine} >
          <DifficultySettings handleDifficultyChanges={handleDifficultyChanges} />
          <button
            disabled={timer === 0}
            className={styles.restartButton}
            onClick={resetGame}
          >
            Restart
          </button>
          <HowToPlay />
        </div>
      </header>
  )
}
