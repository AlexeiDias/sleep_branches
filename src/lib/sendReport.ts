export async function sendReport({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const res = await fetch("/api/send-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, html }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to send report");
    }

    return await res.json();
  } catch (err: any) {
    console.error("Email send error:", err.message);
    throw err;
  }
}
