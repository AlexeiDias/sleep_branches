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

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-4">
  <label htmlFor="childFilter" className="text-sm">Filter by Child:</label>
  <select
    id="childFilter"
    value={childFilter}
    onChange={(e) => setChildFilter(e.target.value)}
    className="border rounded p-2 w-full sm:w-auto"
  >
    <option value="">All Children</option>
    {children.map((child) => (
      <option key={child.id} value={child.id}>
        {child.name}
      </option>
    ))}
  </select>
</div>

      <div className="overflow-x-auto">
  <table className="min-w-[600px] w-full text-sm border">
    <thead className="bg-gray-100">
      <tr>
        <th className="px-4 py-2 border">Child</th>
        <th className="px-4 py-2 border">Date</th>
        <th className="px-4 py-2 border">Time</th>
        <th className="px-4 py-2 border">Type</th>
        <th className="px-4 py-2 border">Mood</th>
        <th className="px-4 py-2 border">Position</th>
      </tr>
    </thead>
    <tbody>
      {filteredLogs.map((log, index) => (
        <tr key={index}>
          <td className="px-4 py-2 border">{log.childName}</td>
          <td className="px-4 py-2 border">{log.date}</td>
          <td className="px-4 py-2 border">{log.time}</td>
          <td className="px-4 py-2 border">{log.type}</td>
          <td className="px-4 py-2 border">{log.mood}</td>
          <td className="px-4 py-2 border">{log.position}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

    </div>
  );
}
