import React, { useState, useMemo } from 'react';
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

import { PRODUCTS, CATEGORIES } from './data/products';
import { FUSE_OPTIONS, buildWAUrl } from './utils/constants';

import styles from './App.module.css';

const fuse = new Fuse(PRODUCTS, FUSE_OPTIONS);

export default function App() {
  // Auth
  const [user, setUser]              = useState(null);
  const [showModal, setShowModal]    = useState(false);
  const [modalMode, setModalMode]    = useState('login');
  const [pendingProduct, setPending] = useState(null);

  // Product detail
  const [detailProduct, setDetailProduct] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setCategory] = useState('All');
  const [sortBy, setSortBy]           = useState('default');
  const [stockOnly, setStockOnly]     = useState(false);

  const filteredProducts = useMemo(() => {
    console.log('Active category:', activeCategory);
    let results = searchQuery.trim().length > 1
      ? fuse.search(searchQuery).map(r => r.item)
      : PRODUCTS;
    if (activeCategory !== 'All') results = results.filter(p => p.category === activeCategory);
    if (stockOnly) results = results.filter(p => p.inStock);
    if (sortBy === 'low')  return [...results].sort((a, b) => a.price - b.price);
    if (sortBy === 'high') return [...results].sort((a, b) => b.price - a.price);
    return results;
  }, [searchQuery, activeCategory, sortBy, stockOnly]);

  function handleBuy(product) {
    if (!product.inStock) return;
    if (!user) {
      setPending(product);
      setModalMode('login');
      setShowModal(true);
      return;
    }
    window.open(buildWAUrl(product.name, product.price), '_blank', 'noopener,noreferrer');
  }

  function handleViewDetail(product) {
    setDetailProduct(product);
  }

  function handleAuth(userData) {
    setUser(userData);
    setShowModal(false);
    if (pendingProduct) {
      window.open(buildWAUrl(pendingProduct.name, pendingProduct.price), '_blank', 'noopener,noreferrer');
      setPending(null);
    }
  }

  const inStockCount  = PRODUCTS.filter(p => p.inStock).length;
  const categoryCount = CATEGORIES.length - 1;

  return (
    <>
      <Header
        user={user}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onLogin={() => { setModalMode('login'); setShowModal(true); setPending(null); }}
        onRegister={() => { setModalMode('register'); setShowModal(true); setPending(null); }}
        onLogout={() => setUser(null)}
      />

      <Hero
        totalProducts={PRODUCTS.length}
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

        {filteredProducts.length === 0 ? (
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
                onViewDetail={handleViewDetail}
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

      <WAFloat />
    </>
  );
}