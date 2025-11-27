//src/components/ChildCard.tsx

import Link from "next/link";

type Child = {
  id: string;
  name: string;
  dob: string;
  parentEmail: string;
};

export default function ChildCard({ child }: { child: Child }) {
  return (
    <div className="border p-4 rounded shadow-sm bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <p className="font-bold">{child.name}</p>
        <p className="text-sm text-gray-600">DOB: {formatDate(child.dob)}</p>
        <p className="text-sm text-gray-600">Age: {getAge(child.dob)}</p>
        <p className="text-sm text-gray-600">Parent Email: {child.parentEmail}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href={`/dashboard/${child.id}/sleep-log`} className="btn-primary">Sleep Log</Link>
        <Link href={`/dashboard/${child.id}/archived-logs`} className="btn-secondary">Archived</Link>
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
