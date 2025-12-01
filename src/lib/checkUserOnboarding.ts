// src/lib/checkUserOnboarding.ts

import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export async function checkUserOnboarding(): Promise<{ daycareId: string }> {
  const user = await waitForAuth();

  if (!user) {
    throw new Error("not-logged-in");
  }

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error("User document not found");
  }

  const data = userSnap.data();
  if (!data.daycareId) {
    throw new Error("Missing daycareId in user profile");
  }

  return { daycareId: data.daycareId };
}

// ✅ Helper to wait for Firebase to finish restoring auth state
function waitForAuth(): Promise<ReturnType<typeof auth.currentUser>> {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub(); // unsubscribe after first emit
      resolve(user);
    });
  });
}
