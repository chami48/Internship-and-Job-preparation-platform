//smart-screening\src\app\apply\page.tsx
"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export default function ApplyPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [studentIdNumber, setStudentIdNumber] = useState("");
  const [role, setRole] = useState("SOFTWARE_ENGINEER");
  const [idImage, setIdImage] = useState<File | null>(null);
  const verification = api.verification.create.useMutation();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!idImage) {
    alert("Please upload ID image");
    return;
  }

  setLoading(true);

  const reader = new FileReader();

  reader.onload = async () => {
    const base64 = reader.result as string;

    try {
      await verification.mutateAsync({
        fullName,
        email,
        studentIdNumber,
        role,
        idImageUrl: base64,
      });

      alert("Saved successfully ✅");

    } catch (err) {
      alert("Error saving data");
    }

    setLoading(false);
  };

  reader.readAsDataURL(idImage);
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-xl font-bold text-center">
          Applicant Verification Form
        </h1>

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          placeholder="Student ID Number"
          value={studentIdNumber}
          onChange={(e) => setStudentIdNumber(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="SOFTWARE_ENGINEER">Software Engineer</option>
          <option value="UX_ENGINEER">UX Engineer</option>
          <option value="PROJECT_MANAGER">Project Manager</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setIdImage(e.target.files[0] ?? null);
}
          }}
          className="w-full"
          required
        />

        <button
          type="submit"
          className="w-full bg-slate-900 text-white py-2 rounded hover:bg-sky-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
}