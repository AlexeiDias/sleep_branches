// src/lib/firestore.ts
import { db } from "./firebase";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  serverTimestamp,
  query,
  where,
  orderBy,
  DocumentData,
} from "firebase/firestore";

/* ======================================================
   1) SAVE FAMILY (from /register/family)
   Creates a family doc under "families" and optional children
   ====================================================== */
export async function saveFamily(daycareId: string, familyData: any) {
  try {
    // Create family document
    const familyRef = await addDoc(collection(db, "families"), {
      daycareId,
      mother: familyData.mother,
      father: familyData.father,
      createdAt: serverTimestamp(),
    });

    // Save each child under: families/{familyId}/children/{childId}
    for (const child of familyData.children) {
      const age = calculateAge(child.dob); // Compute age from dob

      await addDoc(collection(familyRef, "children"), {
        name: child.name || "",
        dob: child.dob || "",
        age,
        createdAt: serverTimestamp(),
      });
    }

    return familyRef.id;
  } catch (error) {
    console.error("Error saving family:", error);
    throw error;
  }
}

function calculateAge(dobString: string): number | null {
  if (!dobString) return null;
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return null;
  const ageMs = Date.now() - dob.getTime();
  const age = Math.floor(ageMs / (1000 * 60 * 60 * 24 * 365.25));
  return age;
}

/* ======================================================
   2) SAVE CHILD (optional helper if needed later)
   ====================================================== */
export async function saveChild(familyId: string, childData: any) {
  try {
    const childRef = await addDoc(
      collection(db, "families", familyId, "children"),
      {
        ...childData,
        createdAt: serverTimestamp(),
      }
    );
    return childRef.id;
  } catch (error) {
    console.error("Error saving child:", error);
    throw error;
  }
}

/* ======================================================
   3) ADD A SLEEP LOG ENTRY
   ====================================================== */
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

/* ======================================================
   4) GET CHILDREN FOR DASHBOARD (under a daycare)
   families/{familyId} → children/{childId}
   ====================================================== */
export async function getChildrenByDaycare(
  daycareId: string
): Promise<DocumentData[]> {
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
        familyId: familyDoc.id,
        parentEmail: familyData.mother?.email || familyData.father?.email || "",
      });
    });
  }

  return allChildren;
}

/* ======================================================
   5) GET ARCHIVED SLEEP LOGS FOR CHILD
   sleepLogs/{YYYY-MM-DD}/entries/*
   ====================================================== */
export async function getArchivedSleepLogs(childId: string) {
  const logsRef = collection(db, "children", childId, "sleepLogs");
  const logsSnapshot = await getDocs(logsRef);

  const allLogs: Record<string, any[]> = {};

  for (const dayDoc of logsSnapshot.docs) {
    const date = dayDoc.id;
    const entriesRef = collection(logsRef, date, "entries");
    const entriesSnap = await getDocs(query(entriesRef, orderBy("timestamp")));

    allLogs[date] = entriesSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  return allLogs;
}

/* ======================================================
   6) FETCH PARENT EMAIL FROM CHILD ID
   ====================================================== */
export async function getParentEmailByChildId(
  childId: string
): Promise<string | null> {
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

/* ======================================================
   7) ADMIN: GET ALL CHILDREN WITH LATEST LOGS
   ====================================================== */
export async function getAllChildrenWithLogs() {
  const childrenSnap = await getDocs(collection(db, "children"));
  const allLogs = [];

  for (const docSnap of childrenSnap.docs) {
    const childData = docSnap.data();
    const childId = docSnap.id;

    const sleepLogsSnap = await getDocs(
      collection(db, `children/${childId}/sleepLogs`)
    );

    sleepLogsSnap.forEach((logDoc) => {
      const log = logDoc.data();
      allLogs.push({
        id: logDoc.id,
        timestamp: log.timestamp?.toDate() || new Date(0),
        type: log.type,
        position: log.position,
        mood: log.mood || null,
        childName: childData.name,
        childId,
      });
    });
  }

  return allLogs.sort((a, b) => b.timestamp - a.timestamp);
}
