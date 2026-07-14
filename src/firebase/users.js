import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
} from 'firebase/firestore';
import { db } from './config';

const COLLECTION = 'users';

// Create or update a user profile — called on every login/register
export async function saveUserProfile(user) {
  const userRef = doc(db, COLLECTION, user.uid);
  await setDoc(userRef, {
    name: user.name,
    email: user.email,
    lastActive: serverTimestamp(),
  }, { merge: true }); // merge: true keeps existing fields, only updates what's passed

  // Only set signupDate if it doesn't already exist
  await setDoc(userRef, {
    signupDate: serverTimestamp(),
  }, { merge: true });
}

// Log a product enquiry (when user clicks Buy Now)
export async function logEnquiry(uid, product) {
  const userRef = doc(db, COLLECTION, uid);
  await updateDoc(userRef, {
    enquiries: arrayUnion({
      productName: product.name,
      productId: product.id,
      price: product.price,
      timestamp: new Date().toISOString(),
    }),
    lastActive: serverTimestamp(),
  });
}

export async function updateUserName(uid, newName) {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, { name: newName });

  // Also update Firebase Auth display name
  const { auth } = await import('./config');
  const { updateProfile } = await import('firebase/auth');
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName: newName });
  }
}

export async function getUserEnquiries(uid) {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return [];
  const data = snap.data();
  return (data.enquiries || []).slice().reverse(); // most recent first
}