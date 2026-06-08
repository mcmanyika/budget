import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { getClientAuth, getClientDb } from "./firebase";
import type { UserProfile } from "@/types";

export async function signUp(email: string, password: string, displayName: string) {
  const credential = await createUserWithEmailAndPassword(getClientAuth(), email, password);
  await updateProfile(credential.user, { displayName });

  const profile: Omit<UserProfile, "id"> = {
    email,
    displayName,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(doc(getClientDb(), "users", credential.user.uid), {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return credential.user;
}

export async function signIn(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(getClientAuth(), email, password);
  return credential.user;
}

export async function logOut() {
  await signOut(getClientAuth());
}

export async function getUserProfile(user: User): Promise<UserProfile | null> {
  const snap = await getDoc(doc(getClientDb(), "users", user.uid));
  if (!snap.exists()) return null;

  const data = snap.data();
  return {
    id: user.uid,
    email: data.email,
    displayName: data.displayName,
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
  };
}

export async function updateUserProfile(userId: string, data: Partial<Pick<UserProfile, "displayName">>) {
  await setDoc(
    doc(getClientDb(), "users", userId),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true }
  );
}
