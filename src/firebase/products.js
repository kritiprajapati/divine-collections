import {
  collection, getDocs, addDoc, updateDoc,
  deleteDoc, doc, onSnapshot, orderBy, query, where,
} from 'firebase/firestore';
import { db } from './config';

const COLLECTION = 'products';

// Listen to active products in real time
export function subscribeToProducts(callback) {
  const q = query(
    collection(db, COLLECTION),
    orderBy('name')
  );
  return onSnapshot(q, snapshot => {
    const products = snapshot.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(p => !p.archived); // exclude archived
    callback(products);
  });
}

// Listen to archived products
export function subscribeToArchivedProducts(callback) {
  const q = query(collection(db, COLLECTION), orderBy('name'));
  return onSnapshot(q, snapshot => {
    const products = snapshot.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(p => p.archived);
    callback(products);
  });
}

// Add a new product
export async function addProduct(product) {
  return await addDoc(collection(db, COLLECTION), { ...product, archived: false });
}

// Update a product
export async function updateProduct(id, data) {
  return await updateDoc(doc(db, COLLECTION, id), data);
}

// Soft delete — archive instead of delete
export async function archiveProduct(id) {
  return await updateDoc(doc(db, COLLECTION, id), {
    archived: true,
    archivedAt: new Date().toISOString(),
  });
}

// Restore archived product
export async function restoreProduct(id) {
  return await updateDoc(doc(db, COLLECTION, id), {
    archived: false,
    archivedAt: null,
  });
}

// Hard delete (permanent)
export async function deleteProduct(id) {
  return await deleteDoc(doc(db, COLLECTION, id));
}

// Seed initial products
export async function seedProducts(products) {
  const promises = products.map(p =>
    addDoc(collection(db, COLLECTION), { ...p, archived: false })
  );
  return await Promise.all(promises);
}