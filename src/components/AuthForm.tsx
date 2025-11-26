//src/components/AuthForm.tsx

"use client";
import { useState } from "react";

export default function AuthForm({ onSubmit, title }: { onSubmit: (email: string, password: string) => void, title: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(email, password); }} className="space-y-4 max-w-sm mx-auto">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <input className="w-full border p-2 rounded" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="w-full border p-2 rounded" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">{title}</button>
    </form>
  );
}
