"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Tesseract from "tesseract.js";
import * as faceapi from "face-api.js";

export default function ApplyPage() {

  const params = useParams();
  const searchParams = useSearchParams();

  const jobId = params.jobId as string;
  const appId = searchParams.get("appId");

  const { data: session, status } = useSession();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [detectedStudentId, setDetectedStudentId] = useState<string | null>(null);
  const [idImage, setIdImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const verification = api.verification.create.useMutation();

  const {
    data: existingVerification,
    isLoading: checkingVerification,
  } = api.verification.getMyVerification.useQuery(undefined, {
    enabled: !!session,
  });

  const [role, setRole] = useState("SOFTWARE_ENGINEER");

  // Load face detection model
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    };
    loadModels();
  }, []);

  // Redirect if not logged
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/student/login");
    }
  }, [status, router]);

  // Redirect if already verified
  useEffect(() => {
    if (existingVerification && jobId && appId) {
      router.push(`/exam/${jobId}?appId=${appId}`);
    }
  }, [existingVerification, jobId, appId, router]);

  if (status === "loading") {
    return <div className="p-6 text-center">Checking authentication...</div>;
  }

  if (!session) return null;

  if (session.user.role !== "STUDENT") {
    return <div className="p-6 text-center">Only students can access this page.</div>;
  }

  if (checkingVerification) {
    return <div className="p-6 text-center">Checking verification...</div>;
  }

  if (existingVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <h1 className="text-xl font-bold mb-4">Already Verified ✅</h1>
          <p className="text-slate-600">Redirecting you to the exam...</p>
        </div>
      </div>
    );
  }

  // OCR Function
  const extractITNumber = async (file: File) => {

    console.log("Running OCR...");

    const result = await Tesseract.recognize(file, "eng");

    const text = result.data.text;

    console.log("OCR TEXT:", text);

    const cleanedText = text.replace(/\s/g, "");

    const match = cleanedText.match(/IT\d{7,8}/i);

    if (match) {
      const it = match[0].toUpperCase();
      console.log("Detected IT Number:", it);
      return it;
    }

    return null;
  };

  // Face Detection from ID Card
  const extractFaceFromID = async (file: File) => {

    console.log("Detecting face in ID image...");

    const img = await faceapi.bufferToImage(file);

    const detection = await faceapi.detectSingleFace(
      img,
      new faceapi.TinyFaceDetectorOptions()
    );

    if (!detection) {
      console.log("❌ ID face NOT detected");
      return null;
    }

    console.log("✅ ID face detected");

    const { x, y, width, height } = detection.box;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    ctx?.drawImage(img, x, y, width, height, 0, 0, width, height);

    return canvas.toDataURL();
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!fullName.trim()) {
  alert("Please enter your full name");
  return;
}

if (!idImage) {
  alert("Please upload ID image");
  return;
}

if (!detectedStudentId) {
  alert("Could not detect IT number from ID card.");
  return;
}

    if (!detectedStudentId) {
      alert("Could not detect IT number from ID card.");
      return;
    }

    setLoading(true);

    const reader = new FileReader();

    reader.onload = async () => {

      const base64 = reader.result as string;

      await verification.mutateAsync({
        fullName,
        detectedStudentId,
        role,
        idImageUrl: base64,
      });

      alert("Verification successful. You can start the assessment.");

      if (jobId && appId) {
        router.push(`/apply/${jobId}/agreement?appId=${appId}`);
      } else {
        router.push("/home");
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
          onChange={async (e) => {

            if (!e.target.files || e.target.files.length === 0) return;

            const file = e.target.files[0];

            if (!file) return;

            setIdImage(file);

            const itNumber = await extractITNumber(file);

            if (!itNumber) {
              alert("Could not detect IT number from ID card.");
              return;
            }

            setDetectedStudentId(itNumber);

            const faceImage = await extractFaceFromID(file);

            if (!faceImage) {
              alert("Face not detected in ID card.");
              return;
            }

            console.log("Cropped face from ID:", faceImage);
          }}
          className="w-full"
          required
        />

        {detectedStudentId && (
          <div className="text-sm text-green-600">
            Detected Student ID: <strong>{detectedStudentId}</strong>
          </div>
        )}

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