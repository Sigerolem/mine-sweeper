import { useRef } from 'react'
import { DifficultyPresets } from '../../hooks/useGameSettings'
import { RoundButtonModal } from '../RoundButtonModal'
import { SelectInput } from '../SelectInput'
import styles from './DifficultySettings.module.scss'

interface DifficultySettingsProps {
  handleDifficultyChanges: ({ changeType, newDifficultypreset, newSize, newBombsAmount }: {
    changeType: 'preset' | 'custom',
    newDifficultypreset?: DifficultyPresets,
    newSize?: DifficultyPresets,
    newBombsAmount?: number
  }) => void;
}

export function DifficultySettings({ handleDifficultyChanges }: DifficultySettingsProps) {
  const newSize = useRef<DifficultyPresets>('easy')
  const newBombs = useRef<string>('10')
  return (
    <RoundButtonModal icon={'menu'} modalClass={styles.modal} >
      <h3>Difficulty</h3>
      <div className={styles.difficultyOptions}>
        <button onClick={() => { handleDifficultyChanges({ changeType: 'preset', newDifficultypreset: 'easy' }) }} >Easy</button>
        <button onClick={() => { handleDifficultyChanges({ changeType: 'preset', newDifficultypreset: 'intermediate' }) }} >Medium</button>
        <button onClick={() => { handleDifficultyChanges({ changeType: 'preset', newDifficultypreset: 'hard' }) }} >Hard</button>
        <button onClick={() => { handleDifficultyChanges({ changeType: 'preset', newDifficultypreset: 'expert' }) }} >Expert</button>
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
          handleDifficultyChanges({ changeType: 'custom', newSize: newSize.current, newBombsAmount: parseInt(newBombs.current) })
        }}>
          Set
        </button>
      </div>
    </RoundButtonModal>
  )
}
