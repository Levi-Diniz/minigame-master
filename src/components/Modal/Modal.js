import React from 'react';
import styles from './modal.module.css'; // Importa o CSS Module

const Modal = ({ show, title, handleClose, button, children }) => {
  const showHideClassName = show ? styles.displayBlock : styles.displayNone;

  return (
    <div className={`${styles.modal} ${showHideClassName}`}>
      <section className={styles.modalMain}>
        <div className={styles.container}>
          <div className={styles.teste}>
            <h2 className={styles.modal_title}>{title}</h2>
            {button === 'on' && (
              <button onClick={handleClose}>x</button>
            )}
          </div>
          <div className={styles.teste2}>
            {children}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Modal;
