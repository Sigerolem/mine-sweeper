import { useCallback, useEffect } from 'react'
import styles from './EndGameModal.module.scss'

interface EndGameModalProps {
  showModal: boolean;
  closeModal: () => void;
  situation: 'lost' | 'won';
  time: number;
  difficulty: string;
}

export function EndGameModal({ showModal, closeModal, situation, time, difficulty }: EndGameModalProps) {
  const handleCloseModal = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && showModal) {
      closeModal()
    }
  }, [showModal])

  useEffect(() => {
    document.addEventListener('keydown', handleCloseModal)
    return () => {
      document.removeEventListener('keydown', handleCloseModal)
    }
  }, [handleCloseModal])

  return (
    <div
    className={styles.container}
    style={{ display: showModal ? 'flex' : 'none' }}
    onClick={closeModal}
    >
      <div className={styles.content} >
        {
          situation === 'won'
            ? (
              <div>
                <h1>You won!</h1>
                <p>Play time: {time}s</p>
                <p>Best time: {localStorage.getItem('bestMineSweeperTime')}s</p>
                { time === parseInt(localStorage.getItem('bestMineSweeperTime') ?? '0') &&
                  <p>New best time with {difficulty} difficulty!!! 😀</p>
                }
              </div>
              )
            : (
                <div>
                <h1>You lost</h1>
                <p>Play time: {time}s</p>
                <p>Best time: {localStorage.getItem('bestMineSweeperTime') ?? '0'}s</p>
              </div>
              )
        }
      </div>
    </div>
  )
}
