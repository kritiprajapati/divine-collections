import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Fuse from 'fuse.js';
import { WA_NUMBER } from './utils/constants';

import Header          from './components/Header';
import Hero            from './components/Hero';
import FilterBar       from './components/FilterBar';
import ProductCard     from './components/ProductCard';
import ProductDetail   from './components/ProductDetail';
import AuthModal       from './components/AuthModal';
import AboutUs         from './components/AboutUs';
import ContactUs       from './components/ContactUs';
import WAFloat         from './components/WAFloat';
import AdminPanel      from './pages/AdminPanel';
import AccountSettings from './components/AccountSettings';
import CartDrawer      from './components/CartDrawer';
import MarqueeBanner   from './components/MarqueeBanner';
import Toast           from './components/Toast';

import { saveUserProfile, logEnquiry, saveCartToFirestore, loadCartFromFirestore, addToWishlist, removeFromWishlist, getWishlist } from './firebase/users';
import { PRODUCTS as SEED_PRODUCTS, CATEGORIES } from './data/products';
import { FUSE_OPTIONS, buildWAUrl } from './utils/constants';
import { subscribeToProducts } from './firebase/products';
import { onAuthChange, logoutUser } from './firebase/auth';

import styles from './App.module.css';

export default function App() {
  // Auth
  const [user, setUser]               = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [modalMode, setModalMode]     = useState('login');
  const [pendingProduct, setPending]  = useState(null);

  // Account settings
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [accountTab, setAccountTab]                   = useState('profile');

  // Products
  const [products, setProducts]               = useState(SEED_PRODUCTS);
  const [productsLoading, setProductsLoading] = useState(true);

  // Product detail
  const [detailProduct, setDetailProduct]   = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setCategory] = useState('All');
  const [sortBy, setSortBy]           = useState('default');
  const [stockOnly, setStockOnly]     = useState(false);
  const [badgeFilter, setBadgeFilter] = useState('all');

  // Cart
  const [cart, setCart]         = useState([]);
  const [showCart, setShowCart] = useState(false);

  // Wishlist
  const [wishlist, setWishlist] = useState([]);

  // Toast
  const [toast, setToast]           = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  function showToast(msg) {
    setToast(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  }

  // Listen to Firebase auth state
  useEffect(() => {
    const unsub = onAuthChange(async firebaseUser => {
      if (firebaseUser) {
        const userData = {
          name:  firebaseUser.displayName || firebaseUser.email.split('@')[0],
          email: firebaseUser.email,
          uid:   firebaseUser.uid,
        };
        setUser(userData);
        saveUserProfile(userData);
        // Restore cart from Firestore
        const savedCart = await loadCartFromFirestore(firebaseUser.uid);
        if (savedCart.length > 0) setCart(savedCart);
        // Load wishlist
        const savedWishlist = await getWishlist(firebaseUser.uid);
        setWishlist(savedWishlist);
      } else {
        setUser(null);
        setCart([]);
        setWishlist([]);
      }
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  // Save cart to Firestore whenever it changes (debounced)
  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => {
      saveCartToFirestore(user.uid, cart);
    }, 800);
    return () => clearTimeout(timer);
  }, [cart, user]);

  // Products from Firestore
  useEffect(() => {
    const unsub = subscribeToProducts(firestoreProducts => {
      if (firestoreProducts.length > 0) setProducts(firestoreProducts);
      else setProducts(SEED_PRODUCTS);
      setProductsLoading(false);
    });
    return unsub;
  }, []);

  const fuse = useMemo(() => new Fuse(products, FUSE_OPTIONS), [products]);

  const filteredProducts = useMemo(() => {
    let results = searchQuery.trim().length > 1
      ? fuse.search(searchQuery).map(r => r.item)
      : products;
    if (activeCategory !== 'All') results = results.filter(p => p.category === activeCategory);
    if (stockOnly)                results = results.filter(p => p.inStock);
    if (badgeFilter !== 'all')    results = results.filter(p => p.badge === badgeFilter);
    if (sortBy === 'low')  return [...results].sort((a, b) => a.price - b.price);
    if (sortBy === 'high') return [...results].sort((a, b) => b.price - a.price);
    return results;
  }, [searchQuery, activeCategory, sortBy, stockOnly, badgeFilter, products, fuse]);

  // Wishlist toggle
  async function handleToggleWishlist(product) {
    if (!user) {
      setModalMode('login');
      setShowModal(true);
      return;
    }
    const isWishlisted = wishlist.some(w => w.id === product.id);
    if (isWishlisted) {
      await removeFromWishlist(user.uid, product.id);
      setWishlist(prev => prev.filter(w => w.id !== product.id));
      showToast('Removed from wishlist');
    } else {
      await addToWishlist(user.uid, product);
      setWishlist(prev => [...prev, product]);
      showToast('Added to wishlist ❤️');
    }
  }

  function handleBuy(product) {
    if (!product.inStock) return;
    if (!user) {
      setPending(product);
      setModalMode('login');
      setShowModal(true);
      return;
    }
    window.open(buildWAUrl(product.name, product.price), '_blank', 'noopener,noreferrer');
    logEnquiry(user.uid, product);
  }

  function handleAuth(userData) {
    setUser(userData);
    setShowModal(false);
    saveUserProfile(userData);
    if (pendingProduct) {
      window.open(buildWAUrl(pendingProduct.name, pendingProduct.price), '_blank', 'noopener,noreferrer');
      logEnquiry(userData.uid, pendingProduct);
      setPending(null);
    }
  }

  function handleSearchKeyDown(e) {
    if (e.key === 'Enter' && searchQuery.trim().length > 1) {
      const results = fuse.search(searchQuery).map(r => r.item);
      if (results.length > 0) {
        setScrollPosition(window.scrollY);
        setDetailProduct(results[0]);
        setSearchQuery('');
      }
    }
  }

  async function handleLogout() {
    if (user) await saveCartToFirestore(user.uid, cart);
    await logoutUser();
    setUser(null);
    setCart([]);
    setWishlist([]);
    window.location.reload();
  }

  function handleAddToCart(product) {
    if (!product.inStock) return;
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (product.qty === -1) {
        if (!existing) return prev;
        if (existing.qty === 1) return prev.filter(item => item.id !== product.id);
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty - 1 } : item);
      }
      if (existing) return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
  }

  function handleUpdateQty(id, qty) {
    if (qty < 1) { handleRemoveFromCart(id); return; }
    setCart(prev => prev.map(item => item.id === id ? { ...item, qty } : item));
  }

  function handleRemoveFromCart(id) {
    setCart(prev => prev.filter(item => item.id !== id));
  }

  function handleCartCheckout() {
    const itemsList = cart.map(item => `• ${item.name} x${item.qty} — ₹${item.price * item.qty}`).join('\n');
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const message = `Hi! I'd like to order the following:\n\n${itemsList}\n\nTotal: ₹${total}`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  }

  function handleClearCart() { setCart([]); }

  function openAccountSettings(tab = 'profile') {
    setAccountTab(tab);
    setShowAccountSettings(true);
  }

  const inStockCount  = products.filter(p => p.inStock).length;
  const categoryCount = CATEGORIES.length - 1;

  const headerProps = {
    user,
    searchQuery,
    onSearch:          setSearchQuery,
    onLogin:           () => { setModalMode('login');    setShowModal(true); setPending(null); },
    onRegister:        () => { setModalMode('register'); setShowModal(true); setPending(null); },
    onLogout:          handleLogout,
    onAccountSettings: openAccountSettings,
    searchResults:     searchQuery.trim().length > 1 ? fuse.search(searchQuery).map(r => r.item) : [],
    onSearchKeyDown:   handleSearchKeyDown,
    onSearchSelect:    product => { setSearchQuery(''); setScrollPosition(window.scrollY); setDetailProduct(product); },
    cartCount:         cart.reduce((sum, item) => sum + item.qty, 0),
    onCartOpen:        () => setShowCart(true),
  };

  const modals = (
    <>
      {showCart && (
        <CartDrawer
          cart={cart}
          onClose={() => setShowCart(false)}
          onUpdateQty={handleUpdateQty}
          onRemove={handleRemoveFromCart}
          onCheckout={handleCartCheckout}
          onClearCart={handleClearCart}
          user={user}
          onLoginRequired={() => { setShowCart(false); setModalMode('login'); setShowModal(true); }}
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
      {showAccountSettings && user && (
        <AccountSettings
          user={user}
          initialTab={accountTab}
          onClose={() => setShowAccountSettings(false)}
          onNameUpdate={newName => setUser(prev => ({ ...prev, name: newName }))}
          onAddToCart={handleAddToCart}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
        />
      )}
      <Toast message={toast} visible={toastVisible} />
    </>
  );

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--navy)' }}>
        <div style={{ color: 'var(--mustard)', fontFamily: 'var(--font-display)', fontSize: '24px' }}>Divine Collections</div>
      </div>
    );
  }

  if (window.location.pathname === '/admin') return <AdminPanel />;

  if (detailProduct) {
    return (
      <>
        <Header {...headerProps} />
        <ProductDetail
          product={detailProduct}
          cart={cart}
          onClose={() => {
            setDetailProduct(null);
            setTimeout(() => window.scrollTo({ top: scrollPosition, behavior: 'instant' }), 50);
          }}
          onBuy={product => { setDetailProduct(null); handleBuy(product); }}
          onAddToCart={handleAddToCart}
          isWishlisted={wishlist.some(w => w.id === detailProduct?.id)}
          onToggleWishlist={handleToggleWishlist}
        />
        {modals}
      </>
    );
  }

  return (
    <>
      <Header {...headerProps} />

      <Hero
        totalProducts={products.length}
        inStockCount={inStockCount}
        categoryCount={categoryCount}
        onCategoryClick={setCategory}
      />

      <MarqueeBanner />

      <main className={styles.main} id="products">
        <FilterBar
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onCategoryChange={setCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          stockOnly={stockOnly}
          onStockToggle={() => setStockOnly(v => !v)}
          badgeFilter={badgeFilter}
          onBadgeFilterChange={setBadgeFilter}
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
                cartItem={cart.find(item => item.id === product.id)}
                isWishlisted={wishlist.some(w => w.id === product.id)}
                onBuy={handleBuy}
                onViewDetail={product => { setScrollPosition(window.scrollY); setDetailProduct(product); }}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
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

      <WAFloat />
      {modals}
    </>
  );
}