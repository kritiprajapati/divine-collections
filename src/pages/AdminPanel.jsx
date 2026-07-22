import React, { useState, useEffect } from 'react';
import { onAuthChange, loginWithGoogle, logoutUser } from '../firebase/auth';
import { subscribeToProducts, addProduct, updateProduct, deleteProduct, seedProducts } from '../firebase/products';
import { PRODUCTS as SEED_PRODUCTS, CATEGORIES } from '../data/products';
import styles from './AdminPanel.module.css';
import { uploadImageToCloudinary } from '../utils/cloudinary';

const ADMIN_EMAIL = 'divinecollectionsstore@gmail.com';

const EMPTY_FORM = {
  name: '', brand: '', category: 'Hygiene', price: '', originalPrice: '',
  inStock: true, emoji: '🧼', badge: '', description: '', tags: '', imageUrl: '',
};

export default function AdminPanel() {
  const [user, setUser]           = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [products, setProducts]   = useState([]);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading]     = useState(false);
  const [message, setMessage]     = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [seeding, setSeeding]     = useState(false);
  const [showForm, setShowForm]   = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [adminSearch, setAdminSearch] = useState('');

  useEffect(() => {
    const unsub = onAuthChange(u => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user || user.email !== ADMIN_EMAIL) return;
    const unsub = subscribeToProducts(setProducts);
    return unsub;
  }, [user]);

  function showMsg(msg) {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  }

  async function handleLogin() {
    try { await loginWithGoogle(); }
    catch (e) { showMsg('Login failed: ' + e.message); }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (uploadingImage) {
        showMsg('⏳ Please wait for the image to finish uploading.');
        return;
    }
    setLoading(true);
    try {
      const data = {
        ...form,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        badge: form.badge || null,
      };

      if (editingId) {
        await updateProduct(editingId, data);
        showMsg('✅ Product updated!');
      } else {
        await addProduct(data);
        showMsg('✅ Product added!');
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch (e) {
      showMsg('❌ Error: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setImagePreview(localPreview);

    setUploadingImage(true);
    try {
        const url = await uploadImageToCloudinary(file);
        setForm(prev => ({ ...prev, imageUrl: url }));
        showMsg('✅ Image uploaded!');
    } catch (err) {
        showMsg('❌ ' + err.message);
        setImagePreview('');
    } finally {
        setUploadingImage(false);
    }}

  function handleEdit(product) {
    setForm({
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice || '',
        inStock: product.inStock,
        emoji: product.emoji,
        badge: product.badge || '',
        description: product.description,
        tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
        imageUrl: product.imageUrl || '',
    });

    setImagePreview(product.imageUrl || '');
    setEditingId(product.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    }

  async function handleDelete(id) {
    try {
      await deleteProduct(id);
      setDeleteConfirm(null);
      showMsg('✅ Product deleted!');
    } catch (e) {
      showMsg('❌ Error: ' + e.message);
    }
  }

  async function handleToggleStock(product) {
    try {
      await updateProduct(product.id, { inStock: !product.inStock });
      showMsg(`✅ ${product.name} marked as ${!product.inStock ? 'In Stock' : 'Out of Stock'}`);
    } catch (e) {
      showMsg('❌ Error: ' + e.message);
    }
  }

  async function handleSeed() {
    setSeeding(true);
    try {
      const cleanProducts = SEED_PRODUCTS.map(({ id, ...rest }) => rest);
      await seedProducts(cleanProducts);
      showMsg('✅ All products seeded to Firestore!');
    } catch (e) {
      showMsg('❌ Seed error: ' + e.message);
    } finally {
      setSeeding(false);
    }
  }

  // Loading
  if (authLoading) {
    return <div className={styles.center}><div className={styles.loading}>Loading…</div></div>;
  }

  // Not logged in
  if (!user) {
    return (
      <div className={styles.loginWrap}>
        <div className={styles.loginBox}>
          <div className={styles.loginLogo}>D</div>
          <h1 className={styles.loginTitle}>Divine Collections</h1>
          <p className={styles.loginSub}>Admin Panel</p>
          <button className={styles.googleBtn} onClick={handleLogin}>
            <svg viewBox="0 0 24 24" className={styles.googleIcon}>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  // Wrong account
  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className={styles.loginWrap}>
        <div className={styles.loginBox}>
          <div className={styles.loginLogo}>🚫</div>
          <h1 className={styles.loginTitle}>Access Denied</h1>
          <p className={styles.loginSub}>You are not authorised to view this page.</p>
          <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>Signed in as: {user.email}</p>
          <button className={styles.googleBtn} onClick={logoutUser}>Sign out</button>
        </div>
      </div>
    );
  }

  const visibleProducts = adminSearch.trim()
      ? products.filter(p =>
          p.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
          p.brand.toLowerCase().includes(adminSearch.toLowerCase()) ||
          p.category.toLowerCase().includes(adminSearch.toLowerCase())
        )
      : products;

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
            <div className={styles.headerLogo}>D</div>
            <div>
              <div className={styles.headerTitle}>Divine Collections</div>
              <div className={styles.headerSub}>Admin Panel</div>
            </div>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.adminEmail}>{user.email}</span>
            <a href="/" className={styles.btnOutline}>View Site</a>
            <button className={styles.btnOutline} onClick={logoutUser}>Sign out</button>
          </div>
        </div>
      </header>

      <div className={styles.inner}>
        {/* Message */}
        {message && <div className={styles.message}>{message}</div>}

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statNum}>{products.length}</div>
            <div className={styles.statLabel}>Total Products</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNum}>{products.filter(p => p.inStock).length}</div>
            <div className={styles.statLabel}>In Stock</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNum}>{products.filter(p => !p.inStock).length}</div>
            <div className={styles.statLabel}>Out of Stock</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNum}>{[...new Set(products.map(p => p.category))].length}</div>
            <div className={styles.statLabel}>Categories</div>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button
            className={styles.btnPrimary}
            onClick={() => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(!showForm); setImagePreview(''); }}
          >
            {showForm ? '✕ Cancel' : '+ Add New Product'}
          </button>
          {products.length === 0 && (
            <button className={styles.btnSeed} onClick={handleSeed} disabled={seeding}>
              {seeding ? 'Seeding…' : '🌱 Seed Products from Data File'}
            </button>
          )}
        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <div className={styles.formWrap}>
            <h2 className={styles.formTitle}>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Product Name *</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Dove Beauty Bar" />
                </div>
                <div className={styles.formGroup}>
                  <label>Brand *</label>
                  <input required value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} placeholder="e.g. Dove" />
                </div>
                <div className={styles.formGroup}>
                  <label>Category *</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                    <label>Selling Price (₹) *</label>
                    <input required type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="e.g. 150" />
                </div>
                <div className={styles.formGroup}>
                    <label>MRP (₹) — optional</label>
                    <input type="number" value={form.originalPrice} onChange={e => setForm({...form, originalPrice: e.target.value})} placeholder="e.g. 495" />
                </div>

                <div className={styles.formGroup}>
                  <label>Emoji</label>
                  <input value={form.emoji} onChange={e => setForm({...form, emoji: e.target.value})} placeholder="e.g. 🧼" />
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Product Image</label>
                    <div className={styles.imageUploadWrap}>
                        {imagePreview && (
                        <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                        )}
                        <label className={styles.uploadBtn}>
                        {uploadingImage ? 'Uploading…' : imagePreview ? 'Change Image' : 'Upload Image'}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                            disabled={uploadingImage}
                        />
                        </label>
                        <p className={styles.uploadHint}>If no image is uploaded, the emoji will be used instead.</p>
                    </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Badge</label>
                  <select value={form.badge} onChange={e => setForm({...form, badge: e.target.value})}>
                    <option value="">None</option>
                    <option value="New">New</option>
                    <option value="Featured">Featured</option>
                  </select>
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>Description *</label>
                  <textarea
                    required
                    value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})}
                    placeholder={"Short description…\n\nFor bullet points, press Enter between each point:\n- Point one\n- Point two"}
                    rows={6}
                    />
                    <p className={styles.fieldHint}>💡 Press Enter between lines to create bullet points in the product detail view.</p>
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>Tags (comma separated)</label>
                  <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="e.g. soap, bathing, moisturising, sensitive" />
                </div>
                <div className={styles.formGroup}>
                  <label>Stock Status</label>
                  <div className={styles.toggleWrap}>
                    <label className={styles.toggle}>
                      <input type="checkbox" checked={form.inStock} onChange={e => setForm({...form, inStock: e.target.checked})} />
                      <span className={styles.toggleSlider} />
                    </label>
                    <span>{form.inStock ? 'In Stock' : 'Out of Stock'}</span>
                  </div>
                </div>
              </div>
              <div className={styles.formActions}>
                <button type="submit" className={styles.btnPrimary} disabled={loading}>
                  {loading ? 'Saving…' : editingId ? 'Update Product' : 'Add Product'}
                </button>
                <button type="button" className={styles.btnOutline} 
                onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setEditingId(null); setImagePreview(''); }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Product List */}
        <div className={styles.productList}>
          {/* <h2 className={styles.sectionTitle}>All Products ({products.length})</h2> */}
          <div className={styles.listHeader}>
            <h2 className={styles.sectionTitle}>All Products ({products.length})</h2>
            <input
              className={styles.searchInput}
              type="search"
              placeholder="Search products…"
              value={adminSearch}
              onChange={e => setAdminSearch(e.target.value)}
            />
          </div>
          {products.length === 0 ? (
            <div className={styles.empty}>
              <p>No products in Firestore yet.</p>
              <p>Click "Seed Products" above to import all products from your data file.</p>
            </div>
          ) : (
            <div className={styles.table}>
              <div className={styles.tableHeader}>
                <span>Product</span>
                <span>Category</span>
                <span>Price</span>
                <span>Stock</span>
                <span>Actions</span>
              </div>
              {products.map(product => (
                <div key={product.id} className={styles.tableRow}>
                  <div className={styles.productInfo}>
                    {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className={styles.productThumb} />
                    ) : (
                        <span className={styles.productEmoji}>{product.emoji}</span>
                    )}
                    <div>
                        <div className={styles.productName}>{product.name}</div>
                        <div className={styles.productBrand}>{product.brand}</div>
                    </div>
                </div>
                  <span className={styles.productCategory}>{product.category}</span>
                  <span className={styles.productPrice}>₹{product.price}</span>
                  <button
                    className={`${styles.stockBtn} ${product.inStock ? styles.stockIn : styles.stockOut}`}
                    onClick={() => handleToggleStock(product)}
                  >
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </button>
                  <div className={styles.rowActions}>
                    <button className={styles.btnEdit} onClick={() => handleEdit(product)}>Edit</button>
                    <button className={styles.btnDelete} onClick={() => setDeleteConfirm(product.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className={styles.overlay}>
          <div className={styles.confirmBox}>
            <h3>Delete Product?</h3>
            <p>This cannot be undone.</p>
            <div className={styles.confirmActions}>
              <button className={styles.btnDelete} onClick={() => handleDelete(deleteConfirm)}>Yes, Delete</button>
              <button className={styles.btnOutline} onClick={() => setDeleteConfirm(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}