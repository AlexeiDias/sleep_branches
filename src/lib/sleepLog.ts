// src/lib/sleepLog.ts
import { db } from "./firebase";
import { doc, setDoc, collection } from "firebase/firestore";
import { ensureSleepLogIndexed } from "./sleepLogIndex"; // we'll create this too
import { v4 as uuidv4 } from "uuid";

export type SleepLogEntry = {
  timestamp: string; // ISO string
  action: "Start" | "Check" | "Stop";
  position: string;
  mood?: string;
};

export async function saveSleepLogEntry(childId: string, entry: SleepLogEntry, userId: string) {
  const date = entry.timestamp.split("T")[0]; // YYYY-MM-DD
  const entryId = uuidv4();

  const entryRef = doc(db, `children/${childId}/sleepLogs/${date}/entries/${entryId}`);
  await setDoc(entryRef, {
    ...entry,
    createdBy: userId,
  });

  await ensureSleepLogIndexed(childId, date, userId);
}
