"use client";

import { useState } from "react";
import useCountdown from "@/lib/useCountdown";
import SleepCheckModal from "@/components/SleepCheckModal";
import SleepStopModal from "@/components/SleepStopModal";
import SleepLogTable from "@/components/SleepLogTable";
import { addSleepLogEntry } from "@/lib/firestore";

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

  const { minutes, seconds, start, reset } = useCountdown({
    minutes: 12,
    seconds: 0,
    autoStart: false,
    onComplete: () => {
      setShowCheckModal(true);
    },
  });

  const logEntry = (entry: SleepEntry) => {
    setEntries((prev) => [...prev, entry]);
  };

  /**
   * 🟢 START SLEEPING
   * Ask for position first (no auto logging)
   */
  const handleStart = () => {
    setShowCheckModal(true);
  };

  /**
   * 🔁 RESTART (sleep check)
   */
  const handleRestart = () => {
    reset();
    start();
    setShowCheckModal(true);
  };

  /**
   * 🛑 STOP
   */
  const handleStop = () => {
    reset();
    setShowStopModal(true);
  };

  /**
   * ✅ SUBMIT START or CHECK
   */
  const handleCheckSubmit = async (position: string) => {
    const now = new Date().toISOString();

    const action: "Start" | "Check" = isSleeping ? "Check" : "Start";
    const firestoreType = isSleeping ? "check" : "start";

    const entry: SleepEntry = {
      timestamp: now,
      action,
      position,
    };

    // Live table update
    logEntry(entry);

    // Firestore write
    await addSleepLogEntry({
      childId,
      entry: { type: firestoreType, position },
    });

    // Start countdown only on first Start
    if (!isSleeping) {
      setIsSleeping(true);
      start();
    }

    setShowCheckModal(false);
  };

  /**
   * ✅ SUBMIT STOP
   */
  const handleStopSubmit = async (data: { position: string; mood: string }) => {
    const now = new Date().toISOString();

    const entry: SleepEntry = {
      timestamp: now,
      action: "Stop",
      position: data.position,
      mood: data.mood,
    };

    // Live table update
    logEntry(entry);

    // Firestore write
    await addSleepLogEntry({
      childId,
      entry: {
        type: "stop",
        position: data.position,
        mood: data.mood,
      },
    });

    setIsSleeping(false);
    setShowStopModal(false);
  };

  return (
    <div className="space-y-2">
      {/* Countdown */}
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

      {/* Live Log Table */}
      {entries.length > 0 && <SleepLogTable entries={entries} />}
    </div>
  );
}
