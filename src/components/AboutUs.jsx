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
          <img
            // src="https://res.cloudinary.com/su6mdywy/image/upload/v1784024224/Divine_logo_xim45x.png"
            src="https://res.cloudinary.com/su6mdywy/image/upload/v1784025642/Divine_logo_vcs2ds.png"
            alt="Divine Collections"
            className={styles.logoImage}
          />
        </div>
      </div>

      {/* How to shop — OUTSIDE the grid, full width below */}
      <div className={styles.howTo}>
        <h3 className={styles.howToTitle}>How to shop with us</h3>
        <div className={styles.steps}>
          {[
            { icon: '🔍', title: 'Browse', desc: 'Explore our products by category or use the search bar to find what you need.' },
            { icon: '🛒', title: 'Add to Cart', desc: 'Add single or multiple items to your cart. You can adjust quantities anytime.' },
            { icon: '💬', title: 'Order on WhatsApp', desc: 'Click "Order via WhatsApp" — your cart is sent directly to us as a message.' },
            { icon: '💳', title: 'Pay & Receive', desc: 'We confirm your order, share a payment QR code, and arrange delivery.' },
          ].map((step, i) => (
            <div key={i} className={styles.step}>
              <div className={styles.stepIcon}>{step.icon}</div>
              <div className={styles.stepNum}>Step {i + 1}</div>
              <div className={styles.stepTitle}>{step.title}</div>
              <div className={styles.stepDesc}>{step.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}