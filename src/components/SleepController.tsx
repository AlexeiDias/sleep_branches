// src/components/SleepController.tsx

"use client";

import { useState } from "react";
import useCountdown from "@/lib/useCountdown";
import SleepCheckModal from "@/components/SleepCheckModal";
import SleepStopModal from "@/components/SleepStopModal";
import SleepLogTable from "@/components/SleepLogTable";

type SleepEntry = {
  timestamp: string;
  action: "Start" | "Check" | "Stop";
  position: string;
  mood?: string;
};

type Props = {
  childId: string;
};

export default function SleepController({ childId }: Props) {
  const [isSleeping, setIsSleeping] = useState(false);
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [showStopModal, setShowStopModal] = useState(false);
  const [entries, setEntries] = useState<SleepEntry[]>([]);

  const {
    minutes,
    seconds,
    isRunning,
    start,
    reset,
  } = useCountdown({
    minutes: 12, // ⏱️ Set to 12 minutes
    seconds: 0,
    autoStart: false,
    onComplete: () => {
      setShowCheckModal(true); // Timer done = prompt sleep check
    },
  });

  const logEntry = (entry: SleepEntry) => {
    setEntries((prev) => [...prev, entry]);
  };

  const handleStart = () => {
    const now = new Date().toISOString();
    logEntry({ timestamp: now, action: "Start", position: "Back" });
    setIsSleeping(true);
    start();
  };

  const handleRestart = () => {
    reset();
    start();
    setShowCheckModal(true); // Show modal manually on Restart
  };

  const handleStop = () => {
    reset();
    setShowStopModal(true); // Open mood + position modal
  };

  const handleCheckSubmit = (position: string) => {
    const now = new Date().toISOString();
    logEntry({ timestamp: now, action: "Check", position });
  };

  const handleStopSubmit = (data: { position: string; mood: string }) => {
    const now = new Date().toISOString();
    logEntry({
      timestamp: now,
      action: "Stop",
      position: data.position,
      mood: data.mood,
    });
    setIsSleeping(false);
  };

  return (
    <div className="space-y-2">
      {/* Countdown label */}
      {isSleeping && (
        <p className="text-sm text-blue-600">
          Next check-in: {minutes}:{seconds.toString().padStart(2, "0")}
        </p>
      )}

      {/* Buttons */}
      <div className="flex gap-2 flex-wrap">
        {!isSleeping ? (
          <button
            onClick={handleStart}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            🟢 Start Sleeping
          </button>
        ) : (
          <>
            <button
              onClick={handleRestart}
              className="bg-yellow-500 text-white px-3 py-1 rounded"
            >
              🔁 Restart
            </button>
            <button
              onClick={handleStop}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              🛑 Stop
            </button>
          </>
        )}
      </div>

      {/* Modals */}
      <SleepCheckModal
        isOpen={showCheckModal}
        onClose={() => setShowCheckModal(false)}
        onSubmit={handleCheckSubmit}
      />

      <SleepStopModal
        isOpen={showStopModal}
        onClose={() => setShowStopModal(false)}
        onSubmit={handleStopSubmit}
      />

      {/* Log Table */}
      {entries.length > 0 && <SleepLogTable entries={entries} />}
    </div>
  );
}
