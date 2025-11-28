"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-8 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Sleep Branches</h1>
      <p className="mb-6 text-gray-600">Helping daycares track sleep, meals, and more.</p>
      <div className="flex space-x-4">
        <Link href="/register">
          <span className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">Register</span>
        </Link>
        <Link href="/login">
          <span className="px-6 py-3 border border-blue-600 text-blue-600 rounded hover:bg-blue-50">Login</span>
        </Link>
      </div>
    </main>
  );
}
