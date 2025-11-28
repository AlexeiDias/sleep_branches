// src/lib/sendReport.ts

import nodemailer from "nodemailer";

export async function sendEmailReport({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"Sleep Log System" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  return info;
}
