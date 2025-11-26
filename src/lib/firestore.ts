//src/lib/firestore.ts

import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

// Save parent + children under a "families" collection
export async function saveFamily(data: {
  mother: { name: string; phone: string; email: string };
  father?: { name: string; phone: string; email: string };
  children: { name: string; dob: string }[];
  daycareId: string;
}) {
  const familyRef = await addDoc(collection(db, "families"), {
    mother: data.mother,
    father: data.father || null,
    daycareId: data.daycareId,
    createdAt: new Date().toISOString(),
  });

  const childrenCollection = collection(familyRef, "children");
  for (const child of data.children) {
    await addDoc(childrenCollection, {
      ...child,
      createdAt: new Date().toISOString(),
    });
  }

  return familyRef.id;
}
