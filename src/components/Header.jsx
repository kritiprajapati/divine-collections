import React, { useState } from 'react';
import styles from './Header.module.css';

export default function Header({ user, searchQuery, onSearch, onLogin, onRegister, onLogout, onSetPassword }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function scrollTo(id) {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>

        {/* Row 1: Logo + Desktop Search + Auth */}
        <div className={styles.row1}>
          <a href="/" className={styles.logo}>
            <div className={styles.logoIcon}>D</div>
            <div>
              <div className={styles.logoName}>Divine Collections</div>
              <div className={styles.logoSub}>General Store</div>
            </div>
          </a>

          {/* Desktop search (hidden on mobile via CSS) */}
          <div className={styles.searchDesktop}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="search"
              placeholder="Search soaps, shampoos, brands…"
              value={searchQuery}
              onChange={e => onSearch(e.target.value)}
              autoComplete="off"
              className={styles.searchInput}
            />
          </div>

          {/* Desktop nav links */}
          <nav className={styles.navLinks}>
            <button className={styles.navLink} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</button>
            <button className={styles.navLink} onClick={() => scrollTo('about')}>About</button>
            <button className={styles.navLink} onClick={() => scrollTo('contact')}>Contact</button>
          </nav>

          <div className={styles.actions}>
            {user ? (
              <>
                <div className={styles.userPill}>
                  <div className={styles.avatar}>{user.name[0].toUpperCase()}</div>
                  <span className={styles.userName}>{user.name}</span>
                </div>
                <button className={styles.btnOutline} onClick={onSetPassword}>Set Password</button>
                <button className={styles.btnOutline} onClick={onLogout}>Sign out</button>
              </>
            ) : (
              <>
                <button className={styles.btnOutline} onClick={onLogin}>Sign in</button>
                <button className={styles.btnGold} onClick={onRegister}>Register</button>
              </>
            )}
          </div>
        </div>

        {/* Row 2: Mobile search only (shown on mobile via CSS) */}
        <div className={styles.row2}>
          <div className={styles.searchMobileWrap}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="search"
              placeholder="Search products…"
              value={searchQuery}
              onChange={e => onSearch(e.target.value)}
              autoComplete="off"
              className={styles.searchInput}
            />
          </div>
          {/* Mobile nav */}
          <div className={styles.mobileNav}>
            <button className={styles.navLink} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</button>
            <button className={styles.navLink} onClick={() => scrollTo('about')}>About</button>
            <button className={styles.navLink} onClick={() => scrollTo('contact')}>Contact</button>
          </div>
        </div>
      </div>
    </header>
  );
}
