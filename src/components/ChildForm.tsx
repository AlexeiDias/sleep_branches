//src/components/ChildForm.tsx

import React from "react";

type Child = {
  name: string;
  dob: string; // ISO date string
};

export default function ChildForm({
  child,
  index,
  onChange,
  onRemove,
}: {
  child: Child;
  index: number;
  onChange: (index: number, field: keyof Child, value: string) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="border p-4 rounded mb-4">
      <h3 className="font-semibold mb-2">Child {index + 1}</h3>
      <input
        className="w-full mb-2 p-2 border rounded"
        placeholder="Child Name"
        value={child.name}
        onChange={(e) => onChange(index, "name", e.target.value)}
      />
      <input
        type="date"
        className="w-full mb-2 p-2 border rounded"
        value={child.dob}
        onChange={(e) => onChange(index, "dob", e.target.value)}
      />
      <button
        type="button"
        className="text-red-600 hover:underline text-sm"
        onClick={() => onRemove(index)}
      >
        Remove Child
      </button>
    </div>
  );
}
