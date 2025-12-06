//src/components/SleepLogTable.tsx

"use client";

import { useEffect, useState } from "react";

type SleepLogEntry = {
  timestamp: string;
  action: "Start" | "Check" | "Stop";
  position: string;
  mood?: string;
};

type Props = {
  entries: SleepLogEntry[];
};

function formatTime(ts: string) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatInterval(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}m ${sec}s`;
}

export default function SleepLogTable({ entries }: Props) {
  const [sessions, setSessions] = useState<
    (SleepLogEntry & { interval?: string })[][]
  >([]);
  const [dailyTotalMs, setDailyTotalMs] = useState(0);

  useEffect(() => {
    if (entries.length === 0) return;

    let grouped: (SleepLogEntry & { interval?: string })[][] = [];
    let session: (SleepLogEntry & { interval?: string })[] = [];
    let totalSleep = 0;

    for (let i = 0; i < entries.length; i++) {
      const current = entries[i];
      const prev = i > 0 ? entries[i - 1] : null;

      const currentTime = new Date(current.timestamp).getTime();
      const prevTime = prev ? new Date(prev.timestamp).getTime() : null;

      const entryWithInterval = {
        ...current,
        interval:
          prevTime !== null ? formatInterval(currentTime - prevTime) : "—",
      };

      session.push(entryWithInterval);

      if (current.action === "Stop") {
        // Close session on Stop
        grouped.push(session);

        const start = session.find((e) => e.action === "Start");
        if (start) {
          const startMs = new Date(start.timestamp).getTime();
          totalSleep += currentTime - startMs;
        }

        session = [];
      }
    }

    // ⏱️ If active session is in progress (no Stop), still show it live
    if (session.length > 0) {
      grouped.push(session);
    }

    setSessions(grouped);
    setDailyTotalMs(totalSleep);
  }, [entries]);

  const formattedTotal = formatInterval(dailyTotalMs);

  return (
    <div className="mt-4 space-y-8">
      {sessions.map((session, index) => {
        const sessionStart = session.find((e) => e.action === "Start");
        const sessionStop = session.find((e) => e.action === "Stop");

        let sessionDuration = "—";
        if (sessionStart && sessionStop) {
          const startMs = new Date(sessionStart.timestamp).getTime();
          const stopMs = new Date(sessionStop.timestamp).getTime();
          sessionDuration = formatInterval(stopMs - startMs);
        }

        return (
          <div key={index} className="border border-gray-400 rounded-md p-4">
            <h3 className="text-md font-semibold mb-2">
              💤 Sleep Session {index + 1}
            </h3>

            <table className="min-w-full table-fixed border text-sm">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-2">⏰ Timestamp</th>
                  <th className="p-2">Action</th>
                  <th className="p-2">Position</th>
                  <th className="p-2">Mood</th>
                  <th className="p-2">Interval</th>
                </tr>
              </thead>
              <tbody>
                {session.map((entry, idx) => (
                  <tr key={idx} className="text-center border-t border-gray-300">
                    <td className="p-2">{formatTime(entry.timestamp)}</td>
                    <td className="p-2">{entry.action}</td>
                    <td className="p-2">{entry.position || "—"}</td>
                    <td className="p-2">{entry.mood || "—"}</td>
                    <td className="p-2">{entry.interval || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {sessionStop && (
              <p className="mt-2 text-sm text-blue-800 font-medium">
                Total for this session: <strong>{sessionDuration}</strong>
              </p>
            )}
          </div>
        );
      })}

      {sessions.length > 0 && (
        <p className="text-right text-sm text-green-800 font-bold mt-4">
          🧮 Total Sleep Today: {formattedTotal}
        </p>
      )}
    </div>
  );
}
