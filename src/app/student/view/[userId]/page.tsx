"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Github, Linkedin, Globe, MapPin, Award } from "lucide-react";

interface StudentProfile {
  id: string;
  name: string | null;
  email: string | null;
  studentId: string | null;
  degree: string | null;
  year: string | null;
  specialization: string | null;
  skills: string | null;
  github: string | null;
  linkedin: string | null;
  portfolio: string | null;
  bio: string | null;
  image: string | null;
}

export default function PublicStudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.userId as string;

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/student/${userId}`);
        if (!response.ok) throw new Error("Profile not found");
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 sm:p-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 animate-pulse" />
            <p className="text-slate-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 sm:p-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <p className="text-red-600 font-semibold">{error || "Profile not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  const skills = profile.skills
    ? profile.skills.split(",").map((s) => s.trim())
    : [];

  const initials = (profile.name || "S")
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Background */}
          <div className="h-24 bg-gradient-to-r from-[#0EA5E9] to-[#0284C7]" />

          {/* Profile Content */}
          <div className="px-6 sm:px-8 pb-8">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col sm:flex-row gap-6 -mt-12 mb-8">
              <div className="flex-shrink-0">
                {profile.image ? (
                  <img
                    src={profile.image}
                    alt={profile.name || "Student"}
                    className="w-24 h-24 rounded-2xl border-4 border-white shadow-md object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-md bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center text-white text-xl font-bold">
                    {initials}
                  </div>
                )}
              </div>

              <div className="flex-1 pt-4">
                <h1 className="text-3xl font-bold text-[#0F172A] mb-2">{profile.name || "No name provided"}</h1>
                {profile.studentId && (
                  <p className="text-sm text-slate-600 font-medium mb-3">Student ID: {profile.studentId}</p>
                )}
                {profile.degree && (
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <Award size={16} /> {profile.degree}
                    {profile.year && ` • Year ${profile.year}`}
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-slate-700 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Contact & Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition border border-slate-200"
                >
                  <Mail size={18} className="text-[#0EA5E9]" />
                  <span className="text-sm font-semibold text-slate-700">{profile.email}</span>
                </a>
              )}

              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition border border-slate-200"
                >
                  <Github size={18} className="text-[#0EA5E9]" />
                  <span className="text-sm font-semibold text-slate-700 truncate">GitHub</span>
                </a>
              )}

              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition border border-slate-200"
                >
                  <Linkedin size={18} className="text-[#0EA5E9]" />
                  <span className="text-sm font-semibold text-slate-700 truncate">LinkedIn</span>
                </a>
              )}

              {profile.portfolio && (
                <a
                  href={profile.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition border border-slate-200"
                >
                  <Globe size={18} className="text-[#0EA5E9]" />
                  <span className="text-sm font-semibold text-slate-700 truncate">Portfolio</span>
                </a>
              )}
            </div>

            {/* Education & Skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Education Section */}
              <div>
                <h2 className="text-lg font-bold text-[#0F172A] mb-4">Education</h2>
                <div className="space-y-3">
                  {profile.degree && (
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Degree</p>
                      <p className="text-[#0F172A] font-semibold">{profile.degree}</p>
                    </div>
                  )}
                  {profile.specialization && (
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Specialization</p>
                      <p className="text-[#0F172A] font-semibold">{profile.specialization}</p>
                    </div>
                  )}
                  {profile.year && (
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Year</p>
                      <p className="text-[#0F172A] font-semibold">Year {profile.year}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills Section */}
              {skills.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-[#0F172A] mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-gradient-to-r from-cyan-50 to-blue-50 text-slate-700 text-sm font-semibold rounded-full border border-cyan-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
