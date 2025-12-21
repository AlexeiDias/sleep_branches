// src/components/ChildCard.tsx

"use client";

import React from "react";
import { getAge } from "@/lib/utils";
import { format } from "date-fns";
import SleepController from "@/components/SleepController";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return format(date, "MMM dd, yyyy");
}

type Child = {
  id: string;
  name: string;
  dob: string;
  parentEmail?: string;
};

type ChildCardProps = {
  child: Child;
};

export default function ChildCard({ child }: ChildCardProps) {
  return (
    <div className="border p-4 rounded shadow-sm bg-black space-y-2">
      <p className="font-bold text-lg text-white">{child.name}</p>
      <p className="text-sm text-gray-300">DOB: {formatDate(child.dob)}</p>
      <p className="text-sm text-gray-300">{getAge(child.dob)}</p>
      {child.parentEmail && (
        <p className="text-sm text-gray-300">
          Parent Email: {child.parentEmail}
        </p>
      )}

      {/* Sleep controls */}
      {child.id && (
        <div className="pt-2 border-t border-gray-700 mt-2">
          <SleepController childId={child.id} />
        </div>
      )}
    </div>
  );
}
