import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from './config';

const COLLECTION = 'products';

// Listen to products in real time
export function subscribeToProducts(callback) {
  const q = query(collection(db, COLLECTION), orderBy('name'));
  return onSnapshot(q, snapshot => {
    const products = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(products);
  });
}

// Add a new product
export async function addProduct(product) {
  return await addDoc(collection(db, COLLECTION), product);
}

// Update a product
export async function updateProduct(id, data) {
  return await updateDoc(doc(db, COLLECTION, id), data);
}

// Delete a product
export async function deleteProduct(id) {
  return await deleteDoc(doc(db, COLLECTION, id));
}

// Seed initial products (run once from admin panel)
export async function seedProducts(products) {
  const promises = products.map(p => addDoc(collection(db, COLLECTION), p));
  return await Promise.all(promises);
}