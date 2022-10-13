import { MutableRefObject, ReactNode } from 'react'
import { Difficulty } from '../../Home'
import styles from './SelectInput.module.scss'

interface SelectInputProps {
  children: ReactNode;
  varRef: MutableRefObject<string | Difficulty>
  defaultValue: string;
  label: string;
}

export function SelectInput({ children, varRef, defaultValue, label }: SelectInputProps) {
  return (
    <div className={styles.container} onClick={(e) => { e.stopPropagation() }}>
      <label>{label}</label>
      <select
        className={styles.selectInput}
        defaultValue={defaultValue}
        onChange={e => {
          varRef.current = e.target.value
        }}
      >
        {children}
      </select>
    </div>
  )
}
