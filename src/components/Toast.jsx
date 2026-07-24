import React, { useEffect } from 'react';
import styles from './Toast.module.css';

export default function Toast({ message, visible }) {
  if (!visible) return null;
  return (
    <div className={styles.toast}>
      {message}
    </div>
  );
}