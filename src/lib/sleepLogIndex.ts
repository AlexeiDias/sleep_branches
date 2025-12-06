// src/lib/sleepLogIndex.ts
import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

export async function ensureSleepLogIndexed(childId: string, date: string, userId: string) {
  const indexRef = doc(db, `children/${childId}/sleepLogIndex/${date}`);
  await setDoc(indexRef, {
    createdAt: new Date().toISOString(),
    createdBy: userId,
  }, { merge: true });
}
