// ─────────────────────────────────────────
// DIVINE COLLECTIONS — App Constants
// ─────────────────────────────────────────

// WhatsApp number in international format (no + sign, no spaces)
export const WA_NUMBER = '919997961188';

// Build the WhatsApp URL for a product
export const buildWAUrl = (productName, productPrice) => {
  const message = `Hi! I'd like to buy *${productName}* (₹${productPrice}). Is it available?`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
};

// Sort options
export const SORT_OPTIONS = [
  { value: 'default', label: 'Sort: Default' },
  { value: 'low',     label: 'Price: Low → High' },
  { value: 'high',    label: 'Price: High → Low' },
];

// Fuse.js search config
export const FUSE_OPTIONS = {
  keys: [
    'name',
    'brand',
    'category',
    'description',
    { name: 'tags', weight: 2 },
  ],
  threshold: 0.38,
  minMatchCharLength: 2,
  includeScore: true,
};
