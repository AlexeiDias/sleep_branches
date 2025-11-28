// src/app/dashboard/page.tsx

"use client";

import { getChildrenByDaycare } from "@/lib/firestore";
import ChildCard from "@/components/ChildCard";
import { checkUserOnboarding } from "@/lib/checkUserOnboarding";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { daycareId } = await checkUserOnboarding();
        const kids = await getChildrenByDaycare(daycareId);
        setChildren(kids);
      } catch (err: any) {
        console.error("Dashboard error:", err);
        if (err.message === "not-logged-in") {
          window.location.href = "/login";
        } else {
          window.location.href = "/register/daycare";
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Children Dashboard 📊</h1>
      {children.length === 0 ? (
        <p className="text-gray-500">No children found. Please register families.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child) => (
            <ChildCard key={child.id} child={child} />
          ))}
        </div>
      )}
    </main>
  );
}
