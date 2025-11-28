"use client";

import { useState } from "react";
import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import { register } from "@/lib/auth";

export default function RegisterPage() {
  const [error, setError] = useState<"already-in-use" | "generic" | "">("");

  const handleRegister = async (email: string, password: string) => {
    try {
      await register(email, password);

      // ✅ Redirect to daycare registration form
      window.location.href = "/register/daycare";
    } catch (err: any) {
      console.error("❌ Registration failed:", err);

      const message = err?.message || "";

      if (
        message.includes("already registered") ||
        message.includes("email-already-in-use")
      ) {
        setError("already-in-use");
      } else {
        setError("generic");
      }
    }
  };

  return (
    <div>
      <AuthForm title="Register" onSubmit={handleRegister} />

      {error === "already-in-use" && (
        <p className="mt-4 text-red-600 text-center">
          You are already registered. Please{" "}
          <Link href="/login" className="underline text-blue-600">
            login
          </Link>.
        </p>
      )}

      {error === "generic" && (
        <p className="mt-4 text-red-600 text-center">
          Registration failed. Please try again.
        </p>
      )}
    </div>
  );
}
