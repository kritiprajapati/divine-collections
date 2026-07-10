import React, { useState } from 'react';
import styles from './AuthModal.module.css';

export default function AuthModal({ mode: initialMode, pendingProduct, onAuth, onClose }) {
  const [mode, setMode]       = useState(initialMode || 'login');
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPass]   = useState('');
  const [error, setError]     = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (mode === 'register' && !name.trim()) {
      setError('Please enter your name.'); return;
    }
    if (!email.trim()) { setError('Please enter your email.'); return; }
    if (!password)     { setError('Please enter your password.'); return; }

    // In Phase 2 this will call Firebase Auth
    // For now we simulate login locally
    const user = { name: mode === 'register' ? name.trim() : email.split('@')[0], email };
    onAuth(user);
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        {/* Drag handle (mobile) */}
        <div className={styles.dragHandle} />

        {/* Close */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>

        {/* Logo */}
        <div className={styles.logo}>D</div>

        <h2 className={styles.title}>
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h2>
        <p className={styles.sub}>
          {mode === 'login'
            ? 'Sign in to buy products via WhatsApp.'
            : 'Create a free account to start shopping.'}
        </p>

        {/* Product preview if coming from Buy button */}
        {pendingProduct && (
          <div className={styles.productPreview}>
            <div className={styles.previewEmoji}>{pendingProduct.emoji}</div>
            <div>
              <div className={styles.previewName}>{pendingProduct.name}</div>
              <div className={styles.previewPrice}>₹{pendingProduct.price}</div>
            </div>
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {mode === 'register' && (
            <input
              className={styles.input}
              type="text"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              autoComplete="name"
              autoFocus
            />
          )}
          <input
            className={styles.input}
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            autoFocus={mode === 'login'}
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPass(e.target.value)}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
          <button type="submit" className={styles.submitBtn}>
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className={styles.switchMode}>
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            className={styles.switchBtn}
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
          >
            {mode === 'login' ? 'Register' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
