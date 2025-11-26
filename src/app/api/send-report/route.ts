//src/app/api/send-report/route.ts

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const body = await req.json();
  const { to, subject, html } = body;

  if (!to || !subject || !html) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Use an App Password
    },
  });

  const mailOptions = {
    from: `"Daycare Logger" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
    });
  } catch (error: any) {
    console.error("Email error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
