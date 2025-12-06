//src/components/SleepStopModal.tsx

"use client";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { position: string; mood: string }) => void;
};

const sleepPositions = ["Back", "Side", "Tummy", "Sitting", "Standing"];
const moods = ["Happy", "Crying", "Neutral"];

export default function SleepStopModal({ isOpen, onClose, onSubmit }: Props) {
  const [position, setPosition] = useState("Back");
  const [mood, setMood] = useState("Happy");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Stop Sleep Check</h2>

        {/* Sleep Position */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Sleep Position</h3>
          <div className="space-y-2">
            {sleepPositions.map((pos) => (
              <label key={pos} className="block">
                <input
                  type="radio"
                  name="position"
                  value={pos}
                  checked={position === pos}
                  onChange={() => setPosition(pos)}
                />
                <span className="ml-2">{pos}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Mood Selection */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Child's Mood</h3>
          <div className="space-y-2">
            {moods.map((m) => (
              <label key={m} className="block">
                <input
                  type="radio"
                  name="mood"
                  value={m}
                  checked={mood === m}
                  onChange={() => setMood(m)}
                />
                <span className="ml-2">{m}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={() => {
              onSubmit({ position, mood });
              onClose();
            }}
            className="px-4 py-1 bg-red-600 text-white rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
