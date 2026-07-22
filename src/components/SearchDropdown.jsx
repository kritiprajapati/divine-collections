import React, { useEffect, useRef } from 'react';
import styles from './SearchDropdown.module.css';

export default function SearchDropdown({ results, onSelect, visible, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    }
    if (visible) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [visible, onClose]);

  if (!visible || results.length === 0) return null;

  return (
    <div className={styles.dropdown} ref={ref}>
      {results.slice(0, 6).map(product => (
        <button
          key={product.id}
          className={styles.item}
          onMouseDown={e => {
            e.preventDefault(); // prevent input blur before click fires
            onSelect(product);
            onClose();
          }}
        >
          <span className={styles.name}>{product.name}</span>
          <span className={styles.category}>{product.category}</span>
        </button>
      ))}
    </div>
  );
}