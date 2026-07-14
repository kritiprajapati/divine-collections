import React, { useState, useEffect } from 'react';
import { setPasswordForAccount, hasPasswordProvider, changePassword } from '../firebase/auth';
import { updateUserName, getUserEnquiries } from '../firebase/users';
import styles from './AccountSettings.module.css';

export default function AccountSettings({ user, onClose, onNameUpdate }) {
  const [tab, setTab] = useState('profile');

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.dragHandle} />
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>

        <div className={styles.header}>
          <div className={styles.avatar}>{user.name[0].toUpperCase()}</div>
          <div>
            <div className={styles.userName}>{user.name}</div>
            <div className={styles.userEmail}>{user.email}</div>
          </div>
        </div>

        <div className={styles.tabs}>
          <button className={`${styles.tab} ${tab === 'profile' ? styles.tabActive : ''}`} onClick={() => setTab('profile')}>
            👤 Profile
          </button>
          <button className={`${styles.tab} ${tab === 'password' ? styles.tabActive : ''}`} onClick={() => setTab('password')}>
            🔐 Password
          </button>
          <button className={`${styles.tab} ${tab === 'enquiries' ? styles.tabActive : ''}`} onClick={() => setTab('enquiries')}>
            📦 My Enquiries
          </button>
        </div>

        <div className={styles.content}>
          {tab === 'profile' && <ProfileTab user={user} onNameUpdate={onNameUpdate} />}
          {tab === 'password' && <PasswordTab />}
          {tab === 'enquiries' && <EnquiriesTab uid={user.uid} />}
        </div>
      </div>
    </div>
  );
}

function ProfileTab({ user, onNameUpdate }) {
  const [name, setName] = useState(user.name);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSave(e) {
    e.preventDefault();
    if (!name.trim()) { setError('Name cannot be empty.'); return; }
    setError('');
    setLoading(true);
    try {
      await updateUserName(user.uid, name.trim());
      onNameUpdate(name.trim());
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      setError('Failed to update name. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSave} className={styles.form}>
      <label className={styles.label}>Display Name</label>
      <input
        className={styles.input}
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Your name"
      />
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>✓ Name updated!</div>}
      <button type="submit" className={styles.saveBtn} disabled={loading}>
        {loading ? 'Saving…' : 'Save Changes'}
      </button>

      <div className={styles.infoBox}>
        <span>📧</span>
        <div>
          <div className={styles.infoTitle}>Email address</div>
          <div className={styles.infoText}>{user.email}</div>
          <div className={styles.infoNote}>Email cannot be changed. Contact us if you need help.</div>
        </div>
      </div>
    </form>
  );
}

function PasswordTab() {
  const alreadyHasPassword = hasPasswordProvider();
  return alreadyHasPassword ? <ChangePasswordForm /> : <SetPasswordForm />;
}

function SetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      await setPasswordForAccount(password);
      setSuccess(true);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      if (err.code === 'auth/requires-recent-login') {
        setError('Please sign out, sign in again, and try immediately after.');
      } else if (err.code === 'auth/credential-already-in-use') {
        setError('A password is already set for this account.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <p className={styles.hint}>
        Add a password so you can sign in from any device without needing your Google account.
      </p>
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>✓ Password set successfully!</div>}
      <label className={styles.label}>New Password</label>
      <input
        className={styles.input}
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="At least 6 characters"
        autoComplete="new-password"
      />
      <label className={styles.label}>Confirm Password</label>
      <input
        className={styles.input}
        type="password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        placeholder="Re-enter password"
        autoComplete="new-password"
      />
      <button type="submit" className={styles.saveBtn} disabled={loading}>
        {loading ? 'Setting password…' : 'Set Password'}
      </button>
    </form>
  );
}

function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!currentPassword) { setError('Please enter your current password.'); return; }
    if (newPassword.length < 6) { setError('New password must be at least 6 characters.'); return; }
    if (newPassword !== confirmPassword) { setError('New passwords do not match.'); return; }

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Current password is incorrect.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.infoBox} style={{ marginTop: 0, marginBottom: '16px' }}>
        <span>✅</span>
        <div>
          <div className={styles.infoTitle}>Password is set</div>
          <div className={styles.infoText}>Update it below anytime.</div>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>✓ Password changed successfully!</div>}

      <label className={styles.label}>Current Password</label>
      <input
        className={styles.input}
        type="password"
        value={currentPassword}
        onChange={e => setCurrentPassword(e.target.value)}
        placeholder="Enter current password"
        autoComplete="current-password"
      />
      <label className={styles.label}>New Password</label>
      <input
        className={styles.input}
        type="password"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        placeholder="At least 6 characters"
        autoComplete="new-password"
      />
      <label className={styles.label}>Confirm New Password</label>
      <input
        className={styles.input}
        type="password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        placeholder="Re-enter new password"
        autoComplete="new-password"
      />
      <button type="submit" className={styles.saveBtn} disabled={loading}>
        {loading ? 'Updating…' : 'Change Password'}
      </button>
    </form>
  );
}

function EnquiriesTab({ uid }) {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserEnquiries(uid).then(data => {
      setEnquiries(data);
      setLoading(false);
    });
  }, [uid]);

  if (loading) return <div className={styles.loadingText}>Loading…</div>;

  if (enquiries.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📦</div>
        <p>No enquiries yet.</p>
        <p className={styles.emptySub}>Products you enquire about via WhatsApp will show up here.</p>
      </div>
    );
  }

  return (
    <div className={styles.enquiryList}>
      {enquiries.map((e, i) => (
        <div key={i} className={styles.enquiryItem}>
          <div>
            <div className={styles.enquiryName}>{e.productName}</div>
            <div className={styles.enquiryDate}>
              {new Date(e.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
          <div className={styles.enquiryPrice}>₹{e.price}</div>
        </div>
      ))}
    </div>
  );
}