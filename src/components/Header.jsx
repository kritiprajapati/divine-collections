import React, { useState, useRef, useEffect } from 'react';
import styles from './Header.module.css';

export default function Header({ user, searchQuery, onSearch, onLogin, onRegister, onLogout, onAccountSettings }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function scrollTo(id) {
    setDropdownOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.row1}>

          <a href="/" className={styles.logo}>
          <img src="https://res.cloudinary.com/su6mdywy/image/upload/v1784025641/Bag_logo_tpvgg8.png" alt="Divine Collections" className={styles.logoIcon} />
            <div>
              <div className={styles.logoName}>Divine Collections</div>
              <div className={styles.logoSub}>General Store</div>
            </div>
          </a>

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

          <nav className={styles.navLinks}>
            <button className={styles.navLink} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</button>
            <button className={styles.navLink} onClick={() => scrollTo('about')}>About</button>
            <button className={styles.navLink} onClick={() => scrollTo('contact')}>Contact</button>
          </nav>

          <div className={styles.actions}>
            {user ? (
              <div className={styles.accountWrap} ref={dropdownRef}>
                <button
                  className={styles.userPillBtn}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className={styles.avatar}>{user.name[0].toUpperCase()}</div>
                  <span className={styles.userName}>{user.name}</span>
                  <span className={styles.chevron}>{dropdownOpen ? '▲' : '▼'}</span>
                </button>

                {dropdownOpen && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                      <div className={styles.dropdownName}>{user.name}</div>
                      <div className={styles.dropdownEmail}>{user.email}</div>
                    </div>
                    <button
                      className={styles.dropdownItem}
                      onClick={() => { setDropdownOpen(false); onAccountSettings(); }}
                    >
                      ⚙️ Account Settings
                    </button>
                    <button
                      className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                      onClick={() => { setDropdownOpen(false); onLogout(); }}
                    >
                      🚪 Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button className={styles.btnOutline} onClick={onLogin}>Sign in</button>
                <button className={styles.btnmustard} onClick={onRegister}>Register</button>
              </>
            )}
          </div>
        </div>

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