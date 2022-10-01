import { useRef } from 'react'
import { Difficulty } from '../../Home'
import { RoundButtonModal } from '../RoundButtonModal'
import { SelectInput } from '../SelectInput'
import styles from './DifficultySettings.module.scss'

interface DifficultySettingsProps {
  changeDifficulty: (difficulty: Difficulty) => void;
  setCustomDifficulty: (difficulty: Difficulty, bombs: number) => void
}

export function DifficultySettings({ changeDifficulty, setCustomDifficulty }: DifficultySettingsProps) {
  const newSize = useRef<Difficulty>('easy')
  const newBombs = useRef<string>('10')
  return (
    <RoundButtonModal icon={'menu'} modalClass={styles.modal} >
      <h3>Difficulty</h3>
      <div className={styles.difficultyOptions}>
        <button onClick={() => { changeDifficulty('easy') }} >Easy</button>
        <button onClick={() => { changeDifficulty('intermediate') }} >Medium</button>
        <button onClick={() => { changeDifficulty('hard') }} >Hard</button>
        <button onClick={() => { changeDifficulty('expert') }} >Expert</button>
      </div>
      <h3>Custom</h3>
      <div className={styles.settings}>
        <SelectInput label='Size' defaultValue={newSize.current} varRef={newSize}>
          <option value="easy">Small</option>
          <option value="intermediate">Medium</option>
          <option value="hard">Big</option>
          <option value="expert">Bigger</option>
        </SelectInput>
        <SelectInput label='Mines' defaultValue={newBombs.current} varRef={newBombs}>
          <option value="10">10</option>
          <option value="30">30</option>
          <option value="50">50</option>
          <option value="70">70</option>
          <option value="90">90</option>
          <option value="120">120</option>
        </SelectInput>
        <button onClick={(e) => {
          e.preventDefault()
          setCustomDifficulty(newSize.current, parseInt(newBombs.current))
        }}>
          Set
        </button>
      </div>
    </RoundButtonModal>
  )
}
