"use client";

import { type FormEvent, useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export default function StudentRegisterPage() {
  const router = useRouter();
  const sendOtp = api.student.auth.sendOtp.useMutation();
  const register = api.student.auth.register.useMutation();

  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [degree, setDegree] = useState("");
  const [year, setYear] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

const handleSendOtp = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  if (!email.endsWith("@my.sliit.lk")) {
    alert("Only SLIIT student emails allowed");
    return;
  }

  try {
    await sendOtp.mutateAsync({ email });

    alert("OTP sent to your email");
    setOtpSent(true);

  } catch (error) {
    console.error(error);
    alert("Failed to send OTP");
  }
};

  const handleRegister = async () => {
    try {
      await register.mutateAsync({
        name,
        studentId,
        email,
        password,
        degree,
        year,
        otp,
      });

      alert("Registration successful!");
      router.push("/student/login");
    } catch (error) {
      console.error(error);
      alert("Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSendOtp}
        className="flex w-[420px] flex-col gap-4 rounded-lg border p-6 shadow"
      >
        <h1 className="text-center text-xl font-bold">Student Registration</h1>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2"
          required
        />

        <input
          type="text"
          placeholder="Student ID (ITXXXXXXX)"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="border p-2"
          required
        />

        <input
          type="email"
          placeholder="ITXXXXXXX@my.sliit.lk"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2"
          required
        />

        <select
          value={degree}
          onChange={(e) => setDegree(e.target.value)}
          className="border p-2"
        >
          <option value="">Select Degree Program</option>
          <option value="BSc IT">BSc IT</option>
          <option value="BSc SE">Software Engineering</option>
          <option value="BSc CS">Computer Science</option>
          <option value="BSc DS">Data Science</option>
        </select>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border p-2"
        >
          <option value="">Year of Study</option>
          <option value="1">Year 1</option>
          <option value="2">Year 2</option>
          <option value="3">Year 3</option>
          <option value="4">Year 4</option>
        </select>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2"
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border p-2"
          required
        />

        {!otpSent && (
          <button type="submit" className="rounded bg-blue-600 p-2 text-white">
            Send OTP
          </button>
        )}

        {otpSent && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border p-2"
            />

            <button
              type="button"
              onClick={handleRegister}
              className="rounded bg-green-600 p-2 text-white"
            >
              Verify OTP & Register
            </button>
          </>
        )}
      </form>
    </div>
  );
}
