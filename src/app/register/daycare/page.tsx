"use client";
import { useState } from "react";

export default function DaycareRegistrationPage() {
  const [form, setForm] = useState({
    businessName: "",
    address: "",
    phone: "",
    licenseHolder: "",
    licenseNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // TODO: Save to Firestore
    console.log("Daycare form submitted:", form);
    window.location.href = "/register/family"; // Redirect to next step
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Register Daycare 🏢</h1>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
        {["businessName", "address", "phone", "licenseHolder", "licenseNumber"].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field.replace(/([A-Z])/g, " $1")}
            className="w-full border p-2 rounded"
            value={form[field as keyof typeof form]}
            onChange={handleChange}
            required
          />
        ))}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">Next: Add Families</button>
      </form>
    </div>
  );
}
