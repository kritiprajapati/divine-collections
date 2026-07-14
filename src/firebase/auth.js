import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth } from './config';
import { sendPasswordResetEmail } from 'firebase/auth';
import { EmailAuthProvider, linkWithCredential,} from 'firebase/auth';

const googleProvider = new GoogleAuthProvider();

export async function registerUser(name, email, password) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName: name });
  return result.user;
}

export async function loginUser(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function logoutUser() {
  await signOut(auth);
}

export async function setPasswordForAccount(password) {
  const user = auth.currentUser;
  if (!user) throw new Error('You must be signed in.');
  const credential = EmailAuthProvider.credential(user.email, password);
  await linkWithCredential(user, credential);
}

export function hasPasswordProvider() {
  const user = auth.currentUser;
  if (!user) return false;
  return user.providerData.some(p => p.providerId === 'password');
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}