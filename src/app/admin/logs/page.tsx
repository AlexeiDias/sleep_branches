//src/app/admin/logs/page.tsx

"use client";

import { useEffect, useState } from "react";
import { getAllChildrenWithLogs } from "@/lib/firestore";
import { format } from "date-fns";

type LogEntry = {
  id: string;
  timestamp: Date;
  type: string;
  position: string;
  mood?: string;
  childName: string;
  childId: string;
};

export default function AdminLogPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [childFilter, setChildFilter] = useState<string>("");

  const uniqueChildren = Array.from(new Set(logs.map((log) => log.childName)));

  useEffect(() => {
    (async () => {
      const allLogs = await getAllChildrenWithLogs();
      setLogs(allLogs);
    })();
  }, []);

  const filteredLogs = childFilter
    ? logs.filter((log) => log.childName === childFilter)
    : logs;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🧑‍💼 Admin Sleep Logs Overview</h1>

      <div className="flex items-center gap-4 mb-4">
        <label htmlFor="childFilter">Filter by Child:</label>
        <select
          id="childFilter"
          value={childFilter}
          onChange={(e) => setChildFilter(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">All Children</option>
          {uniqueChildren.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Child</th>
              <th className="p-2 border">Time</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Position</th>
              <th className="p-2 border">Mood</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id}>
                <td className="p-2 border">{log.childName}</td>
                <td className="p-2 border">{format(log.timestamp, "Pp")}</td>
                <td className="p-2 border">{log.type}</td>
                <td className="p-2 border">{log.position}</td>
                <td className="p-2 border">{log.mood || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
