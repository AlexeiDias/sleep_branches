//src/app/page.tsx

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center h-screen text-center p-6">
      <h1 className="text-4xl font-bold mb-4">Welcome to Daycare Logger 👶</h1>
      <p className="mb-8">Track sleep, meals, bottles, and more – safely and easily.</p>
      <div className="flex gap-4">
        <Link href="/login" className="bg-blue-500 text-white px-4 py-2 rounded">Login</Link>
        <Link href="/register" className="bg-green-500 text-white px-4 py-2 rounded">Register</Link>
      </div>
    </main>
  );
}
