// src/lib/useSleepLogs.ts
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";

export function useSleepLogs(childId: string) {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const today = new Date().toISOString().split("T")[0];
      const q = query(
        collection(db, `children/${childId}/sleepLogs/${today}/entries`),
        orderBy("timestamp", "asc")
      );

      const snapshot = await getDocs(q);
      const logs = snapshot.docs.map((doc) => doc.data());
      setEntries(logs);
      setLoading(false);
    };

    fetchLogs();
  }, [childId]);

  return { entries, loading };
}
