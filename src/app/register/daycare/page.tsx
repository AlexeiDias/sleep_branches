"use client";
import { useState } from "react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

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
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in");

      // 1️⃣ Save daycare info to Firestore
      const daycareRef = await addDoc(collection(db, "daycares"), {
        ...form,
        createdBy: user.uid,
        createdAt: new Date(),
      });

      // 2️⃣ Update user's document with daycareId
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        daycareId: daycareRef.id,
      });

      // 3️⃣ Redirect to next step
      console.log("✅ Daycare created and linked to user:", daycareRef.id);
      window.location.href = "/register/family";
    } catch (err) {
      console.error("❌ Error saving daycare:", err);
      alert("Failed to register daycare.");
    }
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
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Next: Add Families
        </button>
      </form>
    </div>
  );
}
