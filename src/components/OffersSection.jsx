import React from 'react';
import styles from './OffersSection.module.css';

export default function OffersSection({ products, onViewDetail, onAddToCart }) {
  // Show products that have an originalPrice (i.e. have a discount)
  const offerProducts = products.filter(p => p.originalPrice && p.inStock).slice(0, 6);

  if (offerProducts.length === 0) return null;

  return (
    <>
      {/* SHOP. SAVE. REPEAT. banner */}
      <div className={styles.banner}>
        <span className={styles.bannerText}>SHOP.</span>
        <span className={styles.bannerText}>SAVE.</span>
        <span className={styles.bannerText}>REPEAT.</span>
      </div>

      {/* Offers section */}
      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>🔥 Limited Time</p>
            <h2 className={styles.heading}>Season's Best Offers</h2>
            <p className={styles.sub}>Factory prices on top brands — only at Divine Collections</p>
          </div>

          <div className={styles.grid}>
            {offerProducts.map(product => {
              const discount = Math.round((1 - product.price / product.originalPrice) * 100);
              return (
                <div
                  key={product.id}
                  className={styles.card}
                  onClick={() => onViewDetail(product)}
                >
                  <div className={styles.discountBadge}>-{discount}%</div>
                  <div className={styles.cardImage}>
                    {product.imageUrl
                      ? <img src={product.imageUrl} alt={product.name} />
                      : <span>{product.emoji}</span>}
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.cardCategory}>{product.category}</p>
                    <p className={styles.cardName}>{product.name}</p>
                    <div className={styles.cardPricing}>
                      <span className={styles.cardMrp}>₹{product.originalPrice}</span>
                      <span className={styles.cardPrice}>₹{product.price}</span>
                    </div>
                    <button
                      className={styles.addBtn}
                      onClick={e => { e.stopPropagation(); onAddToCart(product); }}
                    >
                      + Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}