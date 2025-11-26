//src/app/register/page.tsx

import AuthForm from "@/components/AuthForm";
import { register } from "@/lib/auth";

export default function RegisterPage() {
  return <AuthForm title="Register" onSubmit={async (email, password) => {
    try {
      await register(email, password);
      window.location.href = "/register/daycare"; // Go to daycare setup
    } catch (error) {
      alert("Registration failed");
    }
  }} />;
}
