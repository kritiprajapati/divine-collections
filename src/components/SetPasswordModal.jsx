import React, { useState } from 'react';
import { setPasswordForAccount } from '../firebase/auth';
import styles from './AuthModal.module.css'; // Reusing AuthModal styles

export default function SetPasswordModal({ onClose }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await setPasswordForAccount(password);
      setSuccess(true);
    } catch (err) {
      if (err.code === 'auth/requires-recent-login') {
        setError('Please sign out and sign in again with Google, then try this immediately after.');
      } else if (err.code === 'auth/credential-already-in-use') {
        setError('A password is already set for this account.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
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
        <div className={styles.logo}>🔐</div>

        {success ? (
          <>
            <h2 className={styles.title}>Password Set!</h2>
            <p className={styles.sub}>
              You can now sign in using your email and this password, on any device — no Google account needed.
            </p>
            <button className={styles.submitBtn} onClick={onClose}>Done</button>
          </>
        ) : (
          <>
            <h2 className={styles.title}>Set a Password</h2>
            <p className={styles.sub}>
              Add a password so you can sign in from any device without needing your Google account.
            </p>

            {error && <div className={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <input
                className={styles.input}
                type="password"
                placeholder="New password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
                autoFocus
              />
              <input
                className={styles.input}
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Setting password…' : 'Set Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}