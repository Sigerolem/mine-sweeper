import { ReactNode, useState } from 'react'
import styles from './RoundButtonModal.module.scss'

interface RoundButtonModalProps {
  children: ReactNode;
  icon: 'menu' | 'help';
}

export function RoundButtonModal({ children, icon }: RoundButtonModalProps) {
  const [showModal, setShowModal] = useState(false)
  return (
    <div
      className={styles.roundButton}
      onClick={() => { setShowModal(prev => !prev) }}
      onMouseLeave={() => { setShowModal(false) }}
    >
      {
        icon === 'help'
          ? '?'
          : <img src="menu.svg" alt="" />
      }
      {
        showModal &&
        <div className={styles.modal} style={ icon === 'help' ? { right: '-10px' } : { left: '-10px' }} >
          {children}
        </div>
      }
    </div>
  )
}
