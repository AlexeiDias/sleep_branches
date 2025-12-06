//src/components/SleepCheckModal.tsx

"use client";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (position: string) => void;
};

const sleepPositions = ["Back", "Side", "Tummy"];

export default function SleepCheckModal({ isOpen, onClose, onSubmit }: Props) {
  const [selected, setSelected] = useState<string>("Back");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Select Sleep Position</h2>

        <div className="space-y-2 mb-4">
          {sleepPositions.map((pos) => (
            <label key={pos} className="block">
              <input
                type="radio"
                name="position"
                value={pos}
                checked={selected === pos}
                onChange={() => setSelected(pos)}
              />
              <span className="ml-2">{pos}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
          <button
            onClick={() => {
              onSubmit(selected);
              onClose();
            }}
            className="px-4 py-1 bg-blue-600 text-white rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
