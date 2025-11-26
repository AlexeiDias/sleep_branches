//src/components/ChildCard.tsx

import Link from "next/link";

type Child = {
  id: string;
  name: string;
  dob: string;
  parentEmail: string;
};

export default function ChildCard({ child }: { child: Child }) {
  const age = getAgeFromDOB(child.dob);

  return (
    <div className="border rounded p-4 shadow-sm bg-white">
      <h3 className="text-xl font-bold mb-2">{child.name}</h3>
      <p className="text-sm">DOB: {child.dob}</p>
      <p className="text-sm">Age: {age}</p>
      <p className="text-sm mb-3">Parent Email: {child.parentEmail}</p>

      <div className="flex flex-wrap gap-2">
        <Link
          href={`/dashboard/${child.id}/sleep-log`}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
        >
          💤 Start Sleep Log
        </Link>
        <Link
          href={`/dashboard/${child.id}/archived-logs`}
          className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
        >
          📁 Archived Logs
        </Link>
        <Link
          href={`/dashboard/${child.id}/edit`}
          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
        >
          ✏️ Edit Child Info
        </Link>
      </div>
    </div>
  );
}

function getAgeFromDOB(dob: string): string {
  const birthDate = new Date(dob);
  const today = new Date();

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();

  if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
    years--;
    months += 12;
  }

  return `${years} yrs ${months} mo`;
}
