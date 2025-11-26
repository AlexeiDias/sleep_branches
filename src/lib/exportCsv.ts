export function exportToCSV(filename: string, rows: any[]) {
  if (!rows.length) return;

  const headers = Object.keys(rows[0]);
  const csvContent =
    headers.join(",") +
    "\n" +
    rows
      .map((row) =>
        headers.map((field) => JSON.stringify(row[field] || "")).join(",")
      )
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  link.click();
}
