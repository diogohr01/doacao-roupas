// Notification.js

import React, { useEffect } from 'react';
import styles from './notificacao.module.css';

const Notification = ({ message, onClose, type }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // Fecha após 3 segundos
    return () => clearTimeout(timer);
  }, [onClose]);

  let notificationClass = styles.notification;
  if (type === 'error') {
    notificationClass += ` ${styles.error}`; // Adiciona a classe de erro se for uma mensagem de erro
  }

  return (
    <div className={notificationClass}>
      {message}
    </div>
  );
};

export default Notification;
