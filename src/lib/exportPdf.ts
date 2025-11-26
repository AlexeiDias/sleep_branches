import html2pdf from "html2pdf.js";

export function exportToPDF(filename: string, elementId: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const opt = {
    margin: 0.5,
    filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  html2pdf().from(element).set(opt).save();
}
