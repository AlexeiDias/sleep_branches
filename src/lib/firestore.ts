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
  orderBy,
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

/**
 * Fetch all archived sleep logs for a child
 * Grouped by sleepLogs/{date}/entries
 */
export async function getArchivedSleepLogs(childId: string) {
  const logsRef = collection(db, "children", childId, "sleepLogs");
  const logsSnapshot = await getDocs(logsRef);

  const allLogs: Record<string, any[]> = {};

  for (const dayDoc of logsSnapshot.docs) {
    const date = dayDoc.id; // YYYY-MM-DD
    const entriesRef = collection(logsRef, date, "entries");
    const entriesSnap = await getDocs(query(entriesRef, orderBy("timestamp")));

    allLogs[date] = entriesSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  return allLogs;
}

/**
 * Fetch parent email (preferably mother) from a child’s ID
 */
export async function getParentEmailByChildId(childId: string): Promise<string | null> {
  const childRef = doc(db, "children", childId);
  const childSnap = await getDoc(childRef);

  if (!childSnap.exists()) return null;

  const childData = childSnap.data();
  const familyId = childData.familyId;

  if (!familyId) return null;

  const familyRef = doc(db, "families", familyId);
  const familySnap = await getDoc(familyRef);

  if (!familySnap.exists()) return null;

  const familyData = familySnap.data();

  return familyData?.mother?.email || familyData?.father?.email || null;
}

export async function getAllChildrenWithLogs() {
  const childrenSnap = await getDocs(collection(db, "children"));
  const allLogs = [];

  for (const doc of childrenSnap.docs) {
    const childData = doc.data();
    const childId = doc.id;
    const sleepLogsSnap = await getDocs(
      collection(db, `children/${childId}/sleepLogs`)
    );

    sleepLogsSnap.forEach((logDoc) => {
      const log = logDoc.data();
      allLogs.push({
        id: logDoc.id,
        timestamp: log.timestamp.toDate(),
        type: log.type,
        position: log.position,
        mood: log.mood || null,
        childName: childData.name,
        childId,
      });
    });
  }

  // Sort by timestamp descending
  return allLogs.sort((a, b) => b.timestamp - a.timestamp);
}