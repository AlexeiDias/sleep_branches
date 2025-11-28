//src/app/dashboard/[childId]/sleep-log.tsx

"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import useCountdown from "@/lib/useCountdown";
import { addSleepLogEntry } from "@/lib/firestore";


type LogEntry = {
  timestamp: string;
  type: "start" | "check" | "stop";
  position?: string;
  mood?: string;
};

export default function SleepLogPage() {
  const params = useParams();
  const childId = params.childId as string;
  const [log, setLog] = useState<LogEntry[]>([]);
  const [isSleeping, setIsSleeping] = useState(false);
  const [timerKey, setTimerKey] = useState(0); // Forces timer restart

  const { minutes, seconds, isRunning, start, reset } = useCountdown({
    minutes: 13,
    seconds: 0,
    autoStart: false,
    onComplete: handleCheckPrompt,
  });

  function formatNow(): string {
    return new Date().toLocaleTimeString();
  }

  const position = prompt("Baby's initial position? (Back, Side, Tummy)") || "Back";

setLog((prev) => [
  ...prev,
  { timestamp: formatNow(), type: "start", position },
]);

addSleepLogEntry({
  childId,
  entry: { type: "start", position },
});


  const position = prompt("Baby's position during check?") || "Back";

setLog((prev) => [
  ...prev,
  { timestamp: formatNow(), type: "check", position },
]);

addSleepLogEntry({
  childId,
  entry: { type: "check", position },
});


  const position = prompt("Final baby position?") || "Back";
const mood = prompt("Baby’s mood?") || "Neutral";

setLog((prev) => [
  ...prev,
  { timestamp: formatNow(), type: "stop", position, mood },
]);

addSleepLogEntry({
  childId,
  entry: { type: "stop", position, mood },
});


  function handleCheckPrompt() {
    alert("🔔 Time to check on the baby!");
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Sleep Log 💤</h1>

      <div className="mb-4 flex items-center gap-4">
        <div className="text-3xl font-mono">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>

        {!isSleeping ? (
          <button
            onClick={handleStart}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Start Sleep Log
          </button>
        ) : (
          <>
            <button
              onClick={handleRestart}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Restart Check
            </button>
            <button
              onClick={handleStop}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Stop Sleep Log
            </button>
          </>
        )}
      </div>

      <table className="w-full mt-6 border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Time</th>
            <th className="border px-2 py-1">Type</th>
            <th className="border px-2 py-1">Position</th>
            <th className="border px-2 py-1">Mood</th>
          </tr>
        </thead>
        <tbody>
          {log.map((entry, index) => (
            <tr key={index}>
              <td className="border px-2 py-1">{entry.timestamp}</td>
              <td className="border px-2 py-1 capitalize">{entry.type}</td>
              <td className="border px-2 py-1">{entry.position}</td>
              <td className="border px-2 py-1">{entry.mood || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
