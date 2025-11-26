//src/lib/firestore.ts

import { db } from "./firebase";
import {
  collection,
  getDocs,
  query,
  where,
  DocumentData,
} from "firebase/firestore";

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
