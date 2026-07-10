import React from 'react';
import { SORT_OPTIONS } from '../utils/constants';
import styles from './FilterBar.module.css';

export default function FilterBar({
  categories,
  activeCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  stockOnly,
  onStockToggle,
  resultCount,
  searchQuery,
}) {
  return (
    <div className={styles.wrap}>

      {/* Category pills */}
      <div className={styles.topRow}>
        <span className={styles.label}>Browse</span>
        <div className={`${styles.pills} no-scrollbar`}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`${styles.pill} ${activeCategory === cat ? styles.pillActive : ''}`}
              onClick={() => onCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sort + stock toggle */}
      <div className={styles.bottomRow}>
        <select
          className={styles.sortSelect}
          value={sortBy}
          onChange={e => onSortChange(e.target.value)}
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <label className={styles.stockToggle} onClick={onStockToggle}>
          <div className={`${styles.switch} ${stockOnly ? styles.switchOn : ''}`}>
            <div className={styles.knob} />
          </div>
          <span>In stock only</span>
        </label>
      </div>

      {/* Result count */}
      <p className={styles.resultInfo}>
        Showing <strong>{resultCount}</strong> product{resultCount !== 1 ? 's' : ''}
        {activeCategory !== 'All' && <> in <strong>{activeCategory}</strong></>}
        {searchQuery && <> for "<strong>{searchQuery}</strong>"</>}
      </p>

    </div>
  );
}
