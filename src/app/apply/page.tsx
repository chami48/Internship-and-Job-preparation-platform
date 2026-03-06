//smart-screening\src\app\apply\page.tsx
"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ApplyPage() {

  const searchParams = useSearchParams();
  const appId = searchParams.get("appId");
  const jobId = searchParams.get("jobId");

  const { data: session, status } = useSession();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [studentIdNumber, setStudentIdNumber] = useState("");
  const [role, setRole] = useState("SOFTWARE_ENGINEER");
  const [idImage, setIdImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const verification = api.verification.create.useMutation();
  const {
    data: existingVerification,
    isLoading: checkingVerification,
  } = api.verification.getMyVerification.useQuery(undefined, {
    enabled: !!session,
  });

  // 🔐 Redirect if not logged
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/student/login");
    }
  }, [status, router]);

  // 🚀 Redirect if already verified
  useEffect(() => {
    if (existingVerification && jobId && appId) {
      router.push(`/exam/${jobId}?appId=${appId}`);
    }
  }, [existingVerification, jobId, appId, router]);

  if (status === "loading") {
    return <div className="p-6 text-center">Checking authentication...</div>;
  }

  if (!session) {
    return null;
  }

  // 🚫 Block non-students
  if (session.user.role !== "STUDENT") {
    return (
      <div className="p-6 text-center">
        Only students can access this page.
      </div>
    );
  }

  if (checkingVerification) {
    return <div className="p-6 text-center">Checking verification...</div>;
  }

  // 🚫 Already verified message while redirecting
  if (existingVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <h1 className="text-xl font-bold mb-4">Already Verified ✅</h1>
          <p className="text-slate-600">
            Redirecting you to the exam...
          </p>
        </div>
      </div>
    );
  }

useEffect(() => {
  if (existingVerification && jobId && appId) {
    router.push(`/exam/${jobId}?appId=${appId}`);
  }
}, [existingVerification, jobId, appId, router]);

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

      await verification.mutateAsync({
  fullName,
  studentIdNumber,
  role,
  idImageUrl: base64,
});

alert("Verification successful. You can start the assessment.");

      if (jobId && appId) {
        router.push(`/exam/${jobId}?appId=${appId}`);
      } else {
        router.push("/");
      }
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
              setIdImage(e.target.files?.[0] ?? null);
            }
          }}
          className="w-full"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 text-white py-2 rounded hover:bg-sky-500 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Submit"}
        </button>
      </form>
    </div>
  );
}