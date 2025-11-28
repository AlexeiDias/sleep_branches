//src/app/login/page.tsx
'use client';
import AuthForm from "@/components/AuthForm";
import { login } from "@/lib/auth";

export default function LoginPage() {
  return <AuthForm title="Login" onSubmit={async (email, password) => {
    try {
      await login(email, password);
      window.location.href = "/dashboard"; // Redirect after login
    } catch (error) {
      alert("Login failed");
    }
  }} />;
}
