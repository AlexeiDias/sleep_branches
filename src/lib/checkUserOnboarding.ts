import { auth, db } from "@/lib/firebase";
import { getDoc, doc } from "firebase/firestore";

/**
 * Checks the current user's onboarding status.
 * @returns Object with { user, userData, daycareId }, or throws if not valid
 */
export async function checkUserOnboarding() {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("not-logged-in");
  }

  const userDocRef = doc(db, "users", user.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    throw new Error("no-user-doc");
  }

  const userData = userDocSnap.data();
  const daycareId = userData?.daycareId;

  if (!daycareId) {
    throw new Error("missing-daycare");
  }

  return { user, userData, daycareId };
}
