import React from "react";
import { getAge } from "@/lib/utils"; // Make sure this exists or replace with your own logic
import { format } from "date-fns";

// Helper to format the date
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return format(date, "MMM dd, yyyy");
}

type Child = {
  name: string;
  dob: string;
  parentEmail?: string;
};

type ChildCardProps = {
  child: Child;
};

export default function ChildCard({ child }: ChildCardProps) {
  return (
    <div className="border p-4 rounded shadow-sm bg-white">
      <p className="font-bold text-lg">{child.name}</p>
      <p className="text-sm text-gray-600">DOB: {formatDate(child.dob)}</p>
      <p className="text-sm text-gray-600">Age: {getAge(child.dob)}</p>
      {child.parentEmail && (
        <p className="text-sm text-gray-600">Parent Email: {child.parentEmail}</p>
      )}
    </div>
  );
}
