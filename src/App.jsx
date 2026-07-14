import React, { useState, useMemo, useEffect } from 'react';
import Fuse from 'fuse.js';

import Header        from './components/Header';
import Hero          from './components/Hero';
import FilterBar     from './components/FilterBar';
import ProductCard   from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import AuthModal     from './components/AuthModal';
import AboutUs       from './components/AboutUs';
import ContactUs     from './components/ContactUs';
import WAFloat       from './components/WAFloat';
import AdminPanel from './pages/AdminPanel';
import { saveUserProfile, logEnquiry } from './firebase/users';

import { PRODUCTS as SEED_PRODUCTS, CATEGORIES } from './data/products';
import { FUSE_OPTIONS, buildWAUrl } from './utils/constants';
import { subscribeToProducts } from './firebase/products';
import { onAuthChange, logoutUser } from './firebase/auth';

import SetPasswordModal from './components/SetPasswordModal';
import { hasPasswordProvider } from './firebase/auth';

import styles from './App.module.css';

export default function App() {
  // Auth
  const [user, setUser]              = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showModal, setShowModal]    = useState(false);
  const [modalMode, setModalMode]    = useState('login');
  const [pendingProduct, setPending] = useState(null);

  // Products from Firestore
  const [products, setProducts] = useState(SEED_PRODUCTS);
  const [productsLoading, setProductsLoading] = useState(true);

  // Product detail
  const [detailProduct, setDetailProduct] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setCategory] = useState('All');
  const [sortBy, setSortBy]           = useState('default');
  const [stockOnly, setStockOnly]     = useState(false);
  const [showSetPassword, setShowSetPassword] = useState(false);

  // Listen to Firebase auth state
  useEffect(() => {
    const unsub = onAuthChange(firebaseUser => {
      if (firebaseUser) {
        const userData = {
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          email: firebaseUser.email,
          uid: firebaseUser.uid,
        };
        setUser(userData);
        saveUserProfile(userData); // Ensure profile is saved even on session restore
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  // Listen to Firestore products in real time
  useEffect(() => {
    const unsub = subscribeToProducts(firestoreProducts => {
      if (firestoreProducts.length > 0) {
        setProducts(firestoreProducts);
      } else {
        // Firestore is empty — use seed data
        setProducts(SEED_PRODUCTS);
      }
      setProductsLoading(false);
    });
    return unsub;
  }, []);

  // Rebuild Fuse index when products change
  const fuse = useMemo(() => new Fuse(products, FUSE_OPTIONS), [products]);

  const filteredProducts = useMemo(() => {
    let results = searchQuery.trim().length > 1
      ? fuse.search(searchQuery).map(r => r.item)
      : products;
    if (activeCategory !== 'All') results = results.filter(p => p.category === activeCategory);
    if (stockOnly) results = results.filter(p => p.inStock);
    if (sortBy === 'low')  return [...results].sort((a, b) => a.price - b.price);
    if (sortBy === 'high') return [...results].sort((a, b) => b.price - a.price);
    return results;
  }, [searchQuery, activeCategory, sortBy, stockOnly, products, fuse]);

  function handleBuy(product) {
    if (!product.inStock) return;
    if (!user) {
      setPending(product);
      setModalMode('login');
      setShowModal(true);
      return;
    }
    window.open(buildWAUrl(product.name, product.price), '_blank', 'noopener,noreferrer');
    logEnquiry(user.uid, product); // Log this enquiry
  }

  function handleAuth(userData) {
    setUser(userData);  
    setShowModal(false);
    saveUserProfile(userData); // Save/update user profile in Firestore
    if (pendingProduct) {
      window.open(buildWAUrl(pendingProduct.name, pendingProduct.price), '_blank', 'noopener,noreferrer');
      logEnquiry(userData.uid, pendingProduct); // Log this enquiry
      setPending(null);
    }
  }

  async function handleLogout() {
    await logoutUser();
    setUser(null);
  }

  const inStockCount  = products.filter(p => p.inStock).length;
  const categoryCount = CATEGORIES.length - 1;

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--green)' }}>
        <div style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: '24px' }}>Divine Collections</div>
      </div>
    );
  }

  // Admin route
  if (window.location.pathname === '/admin') {
    return <AdminPanel />;
  }

  return (
    <>

      <Header
        user={user}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onLogin={() => { setModalMode('login'); setShowModal(true); setPending(null); }}
        onRegister={() => { setModalMode('register'); setShowModal(true); setPending(null); }}
        onLogout={handleLogout}
        onSetPassword={() => setShowSetPassword(true)}
      />

      <Hero
        totalProducts={products.length}
        inStockCount={inStockCount}
        categoryCount={categoryCount}
        onCategoryClick={setCategory}
      />

      <main className={styles.main} id="products">
        <FilterBar
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onCategoryChange={setCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          stockOnly={stockOnly}
          onStockToggle={() => setStockOnly(v => !v)}
          resultCount={filteredProducts.length}
          searchQuery={searchQuery}
        />

        {productsLoading ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>⏳</div>
            <h3 className={styles.emptyTitle}>Loading products…</h3>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🔍</div>
            <h3 className={styles.emptyTitle}>No products found</h3>
            <p className={styles.emptySub}>Try a different search term or category.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onBuy={handleBuy}
                onViewDetail={setDetailProduct}
              />
            ))}
          </div>
        )}
      </main>

      <AboutUs />
      <ContactUs />

      <footer className={styles.footer}>
        <strong>Divine Collections</strong>
        &nbsp;·&nbsp; 📞 +91 99979 61188
        &nbsp;·&nbsp; Chat with us on WhatsApp
        &nbsp;·&nbsp; © {new Date().getFullYear()}
      </footer>

      {detailProduct && (
        <ProductDetail
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
          onBuy={product => {
            setDetailProduct(null);
            handleBuy(product);
          }}
        />
      )}

      {showModal && (
        <AuthModal
          mode={modalMode}
          pendingProduct={pendingProduct}
          onAuth={handleAuth}
          onClose={() => { setShowModal(false); setPending(null); }}
        />
      )}

      {showSetPassword && (
        <SetPasswordModal onClose={() => setShowSetPassword(false)} />
      )}

      <WAFloat />
    </>
  );
}