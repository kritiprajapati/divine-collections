import React from 'react';
import styles from './CartDrawer.module.css';

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function CartDrawer({ cart, onClose, onUpdateQty, onRemove, onCheckout, onClearCart, user, onLoginRequired }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  function handleCheckout() {
    if (!user) { onLoginRequired(); return; }
    onCheckout();
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.drawer}>

        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Your Cart</h2>
            <p className={styles.itemCount}>{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
          </div>
          <div className={styles.headerActions}>
            {cart.length > 0 && (
              <button className={styles.clearBtn} onClick={onClearCart}>Clear all</button>
            )}
            <button className={styles.closeBtn} onClick={onClose}>✕</button>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🛒</div>
            <p className={styles.emptyText}>Your cart is empty</p>
            <p className={styles.emptySub}>Add products to get started</p>
            <button className={styles.continueShopping} onClick={onClose}>Browse Products</button>
          </div>
        ) : (
          <>
            {/* Items list */}
            <div className={styles.items}>
              {cart.map(item => (
                <div key={item.id} className={styles.item}>
                  <div className={styles.itemImage}>
                    {item.imageUrl
                      ? <img src={item.imageUrl} alt={item.name} />
                      : <span>{item.emoji}</span>}
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>{item.name}</div>
                    <div className={styles.itemPrice}>₹{item.price} × {item.qty} = <strong>₹{item.price * item.qty}</strong></div>
                  </div>
                  <div className={styles.itemRight}>
                    <div className={styles.qtyControl}>
                      <button onClick={() => onUpdateQty(item.id, item.qty - 1)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => onUpdateQty(item.id, item.qty + 1)}>+</button>
                    </div>
                    <button className={styles.removeBtn} onClick={() => onRemove(item.id)}>🗑</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className={styles.footer}>
              <div className={styles.totalRow}>
                <div>
                  <div className={styles.totalLabel}>Total ({totalItems} items)</div>
                  <div className={styles.totalAmount}>₹{total}</div>
                </div>
              </div>
              <button className={styles.checkoutBtn} onClick={handleCheckout}>
                <WhatsAppIcon />
                Order via WhatsApp
              </button>
              <button className={styles.continueShopping} onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}