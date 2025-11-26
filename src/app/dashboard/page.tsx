import { getChildrenByDaycare } from "@/lib/firestore";
import ChildCard from "@/components/ChildCard";

export default async function DashboardPage() {
  // TODO: Replace with actual daycareId from user session/context
  const daycareId = "DAYCARE_ID_PLACEHOLDER";

  const children = await getChildrenByDaycare(daycareId);

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
