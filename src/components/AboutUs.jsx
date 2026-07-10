import React from 'react';
import styles from './AboutUs.module.css';

export default function AboutUs() {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.text}>
          <p className={styles.eyebrow}>✦ Our Story</p>
          <h2 className={styles.heading}>About Divine Collections</h2>
          <p className={styles.para}>
            Divine Collections is a trusted neighbourhood general store bringing you premium
            quality products at factory-direct prices. From skincare and cosmetics to
            crockery, kitchen essentials and gifting items — we stock everything your home needs.
          </p>
          <p className={styles.para}>
            We believe great products shouldn't cost a fortune. By sourcing directly, we cut
            out the middlemen and pass the savings to you. Every product on our shelves is
            hand-picked for quality and value.
          </p>
          <div className={styles.values}>
            <div className={styles.value}>
              <span className={styles.valueIcon}>🏭</span>
              <div>
                <div className={styles.valueTitle}>Factory Prices</div>
                <div className={styles.valueSub}>Direct sourcing, honest pricing</div>
              </div>
            </div>
            <div className={styles.value}>
              <span className={styles.valueIcon}>✅</span>
              <div>
                <div className={styles.valueTitle}>Quality Assured</div>
                <div className={styles.valueSub}>Every product hand-picked</div>
              </div>
            </div>
            <div className={styles.value}>
              <span className={styles.valueIcon}>🤝</span>
              <div>
                <div className={styles.valueTitle}>Personal Service</div>
                <div className={styles.valueSub}>Talk to us directly on WhatsApp</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.visual}>
          <div className={styles.emojiGrid}>
            {['🧼','🧴','✨','🥥','🦷','🫧','💆','☀️','🌿','💧','🧼','🧴'].map((e, i) => (
              <div key={i} className={styles.emojiCell}>{e}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}