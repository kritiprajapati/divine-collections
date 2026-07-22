import React from 'react';
import styles from './MarqueeBanner.module.css';

const ITEMS = [
  { text: 'SHOP', icon: '🛍️' },
  { text: 'SAVE', icon: '💰' },
  { text: 'REPEAT', icon: '🔄' },
  { text: 'FACTORY PRICES', icon: '🏭' },
  { text: 'PREMIUM QUALITY', icon: '✨' },
  { text: 'SHOP', icon: '🛍️' },
  { text: 'SAVE', icon: '💰' },
  { text: 'REPEAT', icon: '🔄' },
  { text: 'FACTORY PRICES', icon: '🏭' },
  { text: 'PREMIUM QUALITY', icon: '✨' },
];

export default function MarqueeBanner() {
  return (
    <div className={styles.banner}>
      <div className={styles.track}>
        {/* Duplicate for seamless loop */}
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span key={i} className={styles.item}>
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.text}>{item.text}</span>
            <span className={styles.dot}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}