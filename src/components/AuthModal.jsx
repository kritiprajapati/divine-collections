import React, { useState } from 'react';
import styles from './AuthModal.module.css';
import { registerUser, loginUser, loginWithGoogle, resetPassword } from '../firebase/auth';

export default function AuthModal({ mode: initialMode, pendingProduct, onAuth, onClose }) {
  const [mode, setMode]     = useState(initialMode || 'login');
  const [name, setName]     = useState('');
  const [email, setEmail]   = useState('');
  const [password, setPass] = useState('');
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let user;
      if (mode === 'register') {
        if (!name.trim()) { setError('Please enter your name.'); setLoading(false); return; }
        user = await registerUser(name.trim(), email, password);
      } else {
        user = await loginUser(email, password);
      }
      onAuth({ name: user.displayName || email.split('@')[0], email: user.email, uid: user.uid });
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError('');
    setLoading(true);
    try {
      const { loginWithGoogle: gwLogin } = await import('../firebase/auth');
      const user = await loginWithGoogle();
      onAuth({ name: user.displayName || 'Customer', email: user.email, uid: user.uid });
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  }

  function getErrorMessage(code) {
    switch (code) {
      case 'auth/email-already-in-use': return 'This email is already registered. Please sign in.';
      case 'auth/invalid-email':        return 'Please enter a valid email address.';
      case 'auth/weak-password':        return 'Password must be at least 6 characters.';
      case 'auth/user-not-found':       return 'No account found with this email.';
      case 'auth/wrong-password':       return 'Incorrect password. Please try again.';
      case 'auth/invalid-credential':   return 'Invalid email or password. Please try again.';
      case 'auth/popup-closed-by-user': return 'Google sign-in was cancelled.';
      case 'auth/missing-email':        return 'Please enter your email address.';
      default:                          return 'Something went wrong. Please try again.';
    }
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.dragHandle} />
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        <div className={styles.logo}>D</div>
        <h2 className={styles.title}>
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h2>
        <p className={styles.sub}>
          {mode === 'login'
            ? 'Sign in to buy products via WhatsApp.'
            : 'Create a free account to start shopping.'}
        </p>

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
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPass(e.target.value)}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />

          {mode === 'login' && (
            <div className={styles.forgotWrap}>
              {resetSent ? (
                <span className={styles.resetSent}>✓ Reset email sent! Check your inbox.</span>
              ) : (
                <button type="button" className={styles.forgotBtn} onClick={handleForgotPassword}>
                  Forgot password?
                </button>
              )}
            </div>)}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
        </form>

        <div className={styles.divider}><span>or</span></div>

        <button className={styles.googleBtn} onClick={handleGoogle} disabled={loading}>
          <svg viewBox="0 0 24 24" className={styles.googleIcon}>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

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