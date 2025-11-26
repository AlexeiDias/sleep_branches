//src/lib/firestore.ts

import { db } from "./firebase";
import {
  collection,
  doc,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
  DocumentData,
} from "firebase/firestore";

/**
 * Add a sleep log entry for a child on the current day
 */
export async function addSleepLogEntry({
  childId,
  entry,
}: {
  childId: string;
  entry: {
    type: "start" | "check" | "stop";
    position: string;
    mood?: string;
  };
}) {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const entriesRef = collection(
    db,
    "children",
    childId,
    "sleepLogs",
    today,
    "entries"
  );

  await addDoc(entriesRef, {
    ...entry,
    timestamp: serverTimestamp(),
  });
}
/**
 * Get all children associated with a daycare
 */
export async function getChildrenByDaycare(daycareId: string): Promise<DocumentData[]> {
  const familiesRef = collection(db, "families");
  const q = query(familiesRef, where("daycareId", "==", daycareId));
  const snapshot = await getDocs(q);

  const allChildren: DocumentData[] = [];

  for (const familyDoc of snapshot.docs) {
    const familyData = familyDoc.data();
    const childrenSnap = await getDocs(collection(familyDoc.ref, "children"));
    childrenSnap.forEach((childDoc) => {
      allChildren.push({
        ...childDoc.data(),
        id: childDoc.id,
        parentEmail: familyData.mother?.email || "",
      });
    });
  }

  return allChildren;
}
