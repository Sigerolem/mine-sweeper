import { Difficulty } from '../../Home'
import { RoundButtonModal } from '../RoundButtonModal'
import { SelectInput } from '../SelectInput'
import styles from './DifficultySettings.module.scss'

interface DifficultySettingsProps {
  changeDifficulty: (difficulty: Difficulty) => void
}

export function DifficultySettings({ changeDifficulty }: DifficultySettingsProps) {
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
        <SelectInput label='Size' defaultValue='small' setFunction={() => { }}>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="big">Big</option>
          <option value="bigger">Bigger</option>
        </SelectInput>
        <SelectInput label='Mines' defaultValue='10' setFunction={() => { }}>
          <option value="10">10</option>
          <option value="30">30</option>
          <option value="50">50</option>
        </SelectInput>
        <button>Set</button>
      </div>
    </RoundButtonModal>
  )
}
