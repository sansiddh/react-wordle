import Modal from 'components/Modal';
import styles from './CompletionModal.module.scss';

const CompletionModal = ({ isOpen, onClose, onPlayAgain, onShare }) => {
  return (
    <Modal title="🎉 Congratulations! 🎉" isOpen={isOpen} onClose={onClose}>
      <div className={styles.content}>
        <p className={styles.message}>
          You have received a very tempting offer to be Sansiddh's "woman-amigo" (girl-friend)
        </p>
        <p className={styles.submessage}>
          What is going to be your response?
        </p>
        
        <div className={styles.buttons}>
          <button className={styles.primaryButton} >
            {/* {onClick = { onPlayAgain } } */}
            Yes
          </button>
          <button className={styles.secondaryButton} >
            {/* {onClick = { onShare } } */}
            Yes
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CompletionModal;

