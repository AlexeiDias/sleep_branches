// src/lib/auth.ts
"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

/**
 * Register new user and create /users/{uid}
 */
export async function register(email: string, password: string) {
  try {
    // Create user in Firebase Auth
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCred.user.uid;

    // Create /users/{uid} Firestore record
    await setDoc(doc(db, "users", uid), {
      role: "admin",
      daycareId: "DAYCARE_ID_PLACEHOLDER",
      email,
      createdAt: serverTimestamp(),
    });

    // 🔥 Important: ensure Firestore write propagates
    await new Promise((resolve) => setTimeout(resolve, 300));

    return uid;
  } catch (err: any) {
    if (err.code === "auth/email-already-in-use") {
      throw new Error("This email is already registered.");
    }

    console.error("❌ register() error:", err);
    throw err;
  }
}

/**
 * Login existing user
 */
export async function login(email: string, password: string) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return true;
  } catch (err: any) {
    console.error("❌ login() error:", err);
    throw err;
  }
}
