import { ReactNode } from 'react'
import styles from './SelectInput.module.scss'

interface SelectInputProps {
  children: ReactNode;
  setFunction: (newValue: string) => void;
  defaultValue: string;
  label: string;
}

export function SelectInput({ children, setFunction, defaultValue, label }: SelectInputProps) {
  return (
    <div className={styles.container} onClick={(e) => { e.stopPropagation() }}>
      <label>{label}</label>
      <select
        className={styles.selectInput}
        name="aham"
        defaultValue={defaultValue}
        onChange={e => {
          setFunction(e.target.value)
        }}
      >
        {children}
      </select>
    </div>
  )
}
