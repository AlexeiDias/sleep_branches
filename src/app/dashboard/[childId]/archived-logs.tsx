"use client";

import { getArchivedSleepLogs, getParentEmailByChildId } from "@/lib/firestore";
import { sendReport } from "@/lib/sendReport";
import { exportToCSV } from "@/lib/exportCsv";
import { exportToPDF } from "@/lib/exportPdf";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function ArchivedLogsPage() {
  const params = useParams();
  const childId = params.childId as string;

  const [logs, setLogs] = useState<Record<string, any[]>>({});
  const [parentEmail, setParentEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const logs = await getArchivedSleepLogs(childId);
      const email = await getParentEmailByChildId(childId);
      setLogs(logs);
      setParentEmail(email);
    })();
  }, [childId]);

  async function handleSend(date: string, entries: any[]) {
    if (!parentEmail) return alert("No parent email found!");

    const html = `
      <h2>Sleep Log for ${date}</h2>
      <table border="1" cellpadding="6" cellspacing="0">
        <tr>
          <th>Time</th><th>Type</th><th>Position</th><th>Mood</th>
        </tr>
        ${entries
          .map(
            (entry) => `
            <tr>
              <td>${format(entry.timestamp?.toDate?.(), "hh:mm a")}</td>
              <td>${entry.type}</td>
              <td>${entry.position}</td>
              <td>${entry.mood || "-"}</td>
            </tr>
          `
          )
          .join("")}
      </table>
    `;

    await sendReport({
      to: parentEmail,
      subject: `Sleep Log for ${date}`,
      html,
    });

    alert("📧 Report sent to " + parentEmail);
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📁 Archived Sleep Logs</h1>

      {!Object.keys(logs).length && (
        <p className="text-gray-500">No logs found.</p>
      )}

      {Object.entries(logs).map(([date, entries]) => (
        <div
          key={date}
          className="mb-10 border rounded p-4 shadow"
          id={`log-table-${date}`}
        >
          <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
            <h2 className="text-xl font-semibold">{date}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => handleSend(date, entries)}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
              >
                ✉️ Send Report
              </button>
              <button
                onClick={() => exportToCSV(`SleepLog-${date}.csv`, entries)}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm"
              >
                ⬇️ CSV
              </button>
              <button
                onClick={() =>
                  exportToPDF(`SleepLog-${date}.pdf`, `log-table-${date}`)
                }
                className="bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                ⬇️ PDF
              </button>
            </div>
          </div>

          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Time</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Position</th>
                <th className="p-2 border">Mood</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, idx) => (
                <tr key={idx}>
                  <td className="p-2 border">
                    {format(entry.timestamp?.toDate?.(), "hh:mm a")}
                  </td>
                  <td className="p-2 border">{entry.type}</td>
                  <td className="p-2 border">{entry.position}</td>
                  <td className="p-2 border">{entry.mood || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
