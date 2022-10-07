import { ReactNode, useState } from 'react'
import styles from './RoundButtonModal.module.scss'

interface RoundButtonModalProps {
  children: ReactNode;
  icon: 'menu' | 'help';
  modalClass: string;
}

export function RoundButtonModal({ children, icon, modalClass }: RoundButtonModalProps) {
  const [showModal, setShowModal] = useState(false)
  return (
    <div
      className={styles.container}
      onClick={() => { setShowModal(prev => !prev) }}
      // onMouseLeave={() => { setShowModal(false) }}
      title={icon === 'menu' ? 'Settings' : 'How to play'}
    >
      {
        icon === 'help'
          ? '?'
          : <img src="menu.svg" alt="" />
      }
      {
        showModal &&
        <div className={modalClass} style={ icon === 'help' ? { right: '-10px' } : { left: '-10px' }} >
          {children}
          <button className={styles.close} style={ icon === 'help' ? { right: '10px' } : { left: '10px' }} >X</button>
        </div>
      }
    </div>
  )
}
