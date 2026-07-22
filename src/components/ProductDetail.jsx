import React, { useEffect } from 'react';
import styles from './ProductDetail.module.css';

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={styles.waIcon}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.shareIcon}>
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);

export default function ProductDetail({ product, cart, onClose, onBuy, onAddToCart }) {
  const [shareCopied, setShareCopied] = React.useState(false);
  const cartItem = cart?.find(item => item.id === product.id);
  const qtyInCart = cartItem ? cartItem.qty : 0;

  // Scroll to top when product opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  if (!product) return null;
  const { name, brand, category, price, inStock, emoji, description, badge, tags } = product;

  function handleShare() {
    const url = `${window.location.origin}?product=${product.id}`;
    if (navigator.share) {
      navigator.share({ title: name, text: `Check out ${name} on Divine Collections!`, url });
    } else {
      navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  }

  const descLines = description ? description.split('\n').filter(l => l.trim()) : [];

  return (
    <div className={styles.page}>
      {/* Sticky top bar with back button */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={onClose}>
          ← Back
        </button>
        <span className={styles.breadcrumb}>
          Divine Collections / {category} / {name}
        </span>
      </div>

      <div className={styles.container}>
        {/* Left: image */}
        <div className={styles.imageSection}>
          <div className={styles.imageWrap}>
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={name}
                className={styles.productImage}
              />
            ) : (
              <span className={styles.emoji}>{emoji}</span>
            )}
          </div>
          {badge && (
            <span className={`${styles.badge} ${badge === 'New' ? styles.badgeNew : styles.badgeFeatured}`}>
              {badge}
            </span>
          )}
        </div>

        {/* Right: details */}
        <div className={styles.details}>
          <p className={styles.category}>{category}</p>
          <h1 className={styles.name}>{name}</h1>
          <p className={styles.brand}>by {brand}</p>

          <div className={`${styles.stockPill} ${inStock ? styles.inStock : styles.outStock}`}>
            {inStock ? '✓ In Stock' : '✗ Out of Stock'}
          </div>

          {/* Price */}
          <div className={styles.priceBlock}>
            {product.originalPrice && (
              <span className={styles.mrp}>MRP ₹{product.originalPrice}</span>
            )}
            <div className={styles.price}>
              ₹{price}<span className={styles.unit}>/unit</span>
            </div>
            {product.originalPrice && (
              <span className={styles.discount}>
                {Math.round((1 - price / product.originalPrice) * 100)}% off
              </span>
            )}
          </div>

          {/* Buttons */}
          <div className={styles.btnGroup}>

            {/* <button
              className={styles.btnCart}
              onClick={() => onAddToCart(product)}
              disabled={!inStock}>
              🛒 Add to Cart
            </button> */}

            {inStock ? (
              qtyInCart > 0 ? (
                <div className={styles.qtyControl}>
                  <button onClick={() => onAddToCart({ ...product, qty: -1 })}>
                    −
                  </button>

                  <span>{qtyInCart}</span>

                  <button onClick={() => onAddToCart(product)}>
                    +
                  </button>
                </div>
              ) : (
                <button
                  className={styles.btnCart}
                  onClick={() => onAddToCart(product)}
                >
                  🛒 Add to Cart
                </button>
              )
            ) : (
              <button
                className={`${styles.btnCart} ${styles.btnCartDisabled}`}
                disabled
              >
                Out of Stock
              </button>
            )}

            <button
              className={`${styles.btnWA} ${!inStock ? styles.btnWADisabled : ''}`}
              onClick={() => onBuy(product)}
              disabled={!inStock}>
              <WhatsAppIcon />
              {inStock ? 'Buy' : 'Unavailable'}
            </button>

            <button className={styles.btnShare} onClick={handleShare}>
              <ShareIcon />
              {shareCopied ? 'Link Copied!' : 'Share'}
            </button>
          </div>

          {/* Description */}
          <div className={styles.descSection}>
            <h3 className={styles.descTitle}>Product Description</h3>
            <div className={styles.desc}>
              {descLines.length > 1 ? (
                <ul className={styles.descList}>
                  {descLines.map((line, i) => (
                    <li key={i}>{line.replace(/^[-•*]\s*/, '')}</li>
                  ))}
                </ul>
              ) : (
                <p>{description}</p>
              )}
            </div>
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className={styles.tagsSection}>
              <h3 className={styles.descTitle}>Tags</h3>
              <div className={styles.tags}>
                {tags.map(tag => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}