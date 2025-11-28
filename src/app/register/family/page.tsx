"use client";
import { useState } from "react";
import ChildForm from "@/components/ChildForm";
import { saveFamily } from "@/lib/firestore";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function FamilyRegistrationPage() {
  const [mother, setMother] = useState({ name: "", phone: "", email: "" });
  const [father, setFather] = useState({ name: "", phone: "", email: "" });
  const [children, setChildren] = useState([{ name: "", dob: "" }]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChildChange = (index: number, field: "name" | "dob", value: string) => {
    const newChildren = [...children];
    newChildren[index][field] = value;
    setChildren(newChildren);
  };

  const addChild = () => setChildren([...children, { name: "", dob: "" }]);

  const removeChild = (index: number) => {
    const newChildren = [...children];
    newChildren.splice(index, 1);
    setChildren(newChildren);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in");

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        throw new Error("User document not found");
      }

      const userData = userDocSnap.data();
      const daycareId = userData.daycareId;

      if (!daycareId) {
        throw new Error("Missing daycareId in user profile");
      }

      await saveFamily(daycareId, { mother, father, children });

      alert("Family registered!");
      router.push("/dashboard");
    } catch (err: any) {
      console.error("❌ Error saving family:", err);
      alert(err.message || "Failed to save family.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Register Family 👨‍👩‍👧</h1>

      <div className="mb-6">
        <h2 className="font-semibold mb-2">Mother / Guardian</h2>
        {["name", "phone", "email"].map((field) => (
          <input
            key={field}
            name={field}
            className="w-full mb-2 p-2 border rounded"
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={mother[field as keyof typeof mother]}
            onChange={(e) =>
              setMother({ ...mother, [e.target.name]: e.target.value })
            }
          />
        ))}
      </div>

      <div className="mb-6">
        <h2 className="font-semibold mb-2">Father / Guardian (Optional)</h2>
        {["name", "phone", "email"].map((field) => (
          <input
            key={field}
            name={field}
            className="w-full mb-2 p-2 border rounded"
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={father[field as keyof typeof father]}
            onChange={(e) =>
              setFather({ ...father, [e.target.name]: e.target.value })
            }
          />
        ))}
      </div>

      <div className="mb-4">
        <h2 className="font-semibold mb-2">Children</h2>
        {children.map((child, index) => (
          <ChildForm
            key={index}
            child={child}
            index={index}
            onChange={handleChildChange}
            onRemove={removeChild}
          />
        ))}
        <button
          type="button"
          onClick={addChild}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          ➕ Add Another Child
        </button>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`bg-blue-700 text-white px-6 py-2 rounded mt-6 w-full ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Saving..." : "Save Family"}
      </button>
    </div>
  );
}
