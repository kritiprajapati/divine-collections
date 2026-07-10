import React, { useState, useEffect } from 'react';
import styles from './Hero.module.css';

const SHOWCASE_ITEMS = [
  { label: 'Hygiene',   emoji: '🧼', category: 'Hygiene'   },
  { label: 'Skincare',  emoji: '✨', category: 'Skincare'  },
  { label: 'Hair Care', emoji: '💆', category: 'Hair Care' },
  { label: 'Oral Care', emoji: '🦷', category: 'Oral Care' },
  { label: 'Kitchen',   emoji: '🍳', category: 'Kitchen'   },
  { label: 'Crockery',  emoji: '🍽️', category: 'Crockery'  },
  { label: 'Cosmetics', emoji: '💄', category: 'Cosmetics' },
  { label: 'Gifting',   emoji: '🎁', category: 'Gifting'   },
];

export default function Hero({ totalProducts, inStockCount, categoryCount, onCategoryClick }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(i => (i + 1) % SHOWCASE_ITEMS.length);
    }, 1400);
    return () => clearInterval(timer);
  }, []);

  function handleCategoryClick(category) {
    onCategoryClick(category);
    const el = document.getElementById('products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  function scrollToProducts() {
    const el = document.getElementById('products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        {/* Left: text */}
        <div className={styles.left}>
          <p className={styles.eyebrow}>✦ Welcome to Divine Collections</p>
          <h1 className={styles.heading}>
            Your Trusted Store for{' '}
            <em className={styles.accent}>Premium Products at Factory Prices</em>
          </h1>
          <p className={styles.sub}>
            Skincare, cosmetics, crockery, kitchen essentials, gifting &amp; more — all under one roof.
          </p>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statNum}>{totalProducts}+</div>
              <div className={styles.statLabel}>Products</div>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <div className={styles.statNum}>{inStockCount}</div>
              <div className={styles.statLabel}>In Stock</div>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <div className={styles.statNum}>{categoryCount}</div>
              <div className={styles.statLabel}>Categories</div>
            </div>
          </div>

          <button className={styles.scrollBtn} onClick={scrollToProducts}>
            Shop Now ↓
          </button>
        </div>

        {/* Right: clickable category showcase */}
        <div className={styles.right}>
          <div className={styles.showcase}>
            {SHOWCASE_ITEMS.map((item, i) => (
              <button
                key={i}
                className={`${styles.showcaseItem} ${i === activeIndex ? styles.showcaseActive : ''}`}
                onClick={() => handleCategoryClick(item.category)}
                title={`Browse ${item.label}`}
              >
                <span className={styles.showcaseEmoji}>{item.emoji}</span>
                <span className={styles.showcaseLabel}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.scrollIndicator} onClick={scrollToProducts}>
        <div className={styles.scrollDot} />
      </div>
    </section>
  );
}