import { ReactNode, useEffect, useState } from 'react'
import styles from './RoundButtonModal.module.scss'

interface RoundButtonModalProps {
  children: ReactNode;
  icon: 'menu' | 'help';
  modalClass: string;
}

export function RoundButtonModal({ children, icon, modalClass }: RoundButtonModalProps) {
  const [showModal, setShowModal] = useState(false)
  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        setShowModal(false)
      }
    })
  }, [])
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
          <button
          onClick={(e) => { e.stopPropagation(); setShowModal(false) }}
          className={styles.close}
          style={ icon === 'help' ? { right: '10px' } : { left: '10px' }}
          >
            X
          </button>
        </div>
      }
    </div>
  )
}
