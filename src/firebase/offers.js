import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, orderBy, query,
} from 'firebase/firestore';
import { db } from './config';

const COLLECTION = 'offers';

export function subscribeToOffers(callback) {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
  return onSnapshot(q, snapshot => {
    const offers = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(offers);
  });
}

export async function addOffer(offer) {
  return await addDoc(collection(db, COLLECTION), {
    ...offer,
    active: true,
    createdAt: new Date().toISOString(),
  });
}

export async function updateOffer(id, data) {
  return await updateDoc(doc(db, COLLECTION, id), data);
}

export async function deleteOffer(id) {
  return await deleteDoc(doc(db, COLLECTION, id));
}

// Calculate discounted price for a cart item based on active offers
export function applyOffer(cartItem, offers) {
  const offer = offers.find(o =>
    o.active && o.productId === cartItem.id
  );
  if (!offer) return { ...cartItem, discountedTotal: cartItem.price * cartItem.qty, offer: null };

  const { buyX, getY } = offer;
  const cycleSize = buyX + getY;
  const fullCycles = Math.floor(cartItem.qty / cycleSize);
  const remainder = cartItem.qty % cycleSize;
  const paidQty = fullCycles * buyX + Math.min(remainder, buyX);
  const discountedTotal = paidQty * cartItem.price;

  return { ...cartItem, discountedTotal, offer };
}