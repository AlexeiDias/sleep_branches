//src/app/api/send-report/route.ts

import nodemailer from "nodemailer";

export async function POST(request: Request) {
  const { to, subject, text } = await request.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ message: "Email sent", info }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error", error }), {
      status: 500,
    });
  }
}
