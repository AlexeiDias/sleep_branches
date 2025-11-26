// src/app/api/send-report/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const body = await req.json();

  const { to, subject, html } = body;

  // Transporter using Gmail SMTP or any SMTP service
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,     // e.g. daycare@gmail.com
      pass: process.env.EMAIL_PASS,     // app password, not your Gmail password
    },
  });

  const mailOptions = {
    from: `"Daycare Logger App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error('Email sending error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
