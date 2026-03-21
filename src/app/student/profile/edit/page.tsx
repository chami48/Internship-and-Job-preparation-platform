"use client";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function EditProfilePage() {
  const router = useRouter();
  const { update: updateSession } = useSession();
  const { data: profile } = api.profile.getProfile.useQuery();

  const updateProfile = api.profile.updateProfile.useMutation({
    onSuccess: async () => {
      await updateSession();
      alert("Profile updated successfully");
      router.push("/student/profile");
    },
  });

  const [year, setYear] = useState("");
  const [skills, setSkills] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [bio, setBio] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [errors, setErrors] = useState({
    skills: "",
    github: "",
    linkedin: "",
    bio: "",
    image: "",
  });

  useEffect(() => {
    if (profile) {
      setYear(profile.year ?? "");
      setSkills(profile.skills ?? "");
      setGithub(profile.github ?? "");
      setLinkedin(profile.linkedin ?? "");
      setPortfolio(profile.portfolio ?? "");
      setBio(profile.bio ?? "");
    }
  }, [profile]);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  if (!profile) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-8 md:px-8">
        <div className="mx-auto w-full max-w-7xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold text-slate-600">Loading profile editor...</p>
        </div>
      </main>
    );
  }

  const validateSkills = (value: string) => {
    const skillList = value.split(",").map((s) => s.trim()).filter(Boolean);

    if (skillList.length > 10) {
      setErrors((prev) => ({ ...prev, skills: "You can add up to 10 skills." }));
    } else {
      setErrors((prev) => ({ ...prev, skills: "" }));
    }
  };

  const validateGithub = (value: string) => {
    if (!value) {
      setErrors((prev) => ({ ...prev, github: "" }));
      return;
    }

    if (!value.toLowerCase().includes("github.com")) {
      setErrors((prev) => ({
        ...prev,
        github: "Enter a valid GitHub profile link (e.g., github.com/username)",
      }));
    } else {
      setErrors((prev) => ({ ...prev, github: "" }));
    }
  };

  const validateLinkedin = (value: string) => {
    if (!value) {
      setErrors((prev) => ({ ...prev, linkedin: "" }));
      return;
    }

    if (!value.toLowerCase().includes("linkedin.com")) {
      setErrors((prev) => ({
        ...prev,
        linkedin: "Enter a valid LinkedIn profile link (e.g., linkedin.com/in/username)",
      }));
    } else {
      setErrors((prev) => ({ ...prev, linkedin: "" }));
    }
  };

  const validateBio = (value: string) => {
    if (value.length > 300) {
      setErrors((prev) => ({
        ...prev,
        bio: "Bio must be 300 characters or less.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, bio: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.values(errors).some((err) => err !== "")) {
      return;
    }

    let imagePath = profile.image ?? "";

    if (image) {
      if (!["image/png", "image/jpeg", "image/jpg"].includes(image.type)) {
        setErrors((prev) => ({
          ...prev,
          image: "Please upload a JPG or PNG image.",
        }));
        return;
      }

      if (image.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size must be under 5MB.",
        }));
        return;
      }

      const formData = new FormData();
      formData.append("file", image);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        setErrors((prev) => ({
          ...prev,
          image: "Image upload failed. Please try again.",
        }));
        return;
      }

      const data = await res.json();
      imagePath = data.path;
    }

    let fixedGithub = github;
    let fixedLinkedin = linkedin;
    let fixedPortfolio = portfolio;

    if (github && !github.startsWith("http")) {
      fixedGithub = "https://" + github;
    }

    if (linkedin && !linkedin.startsWith("http")) {
      fixedLinkedin = "https://" + linkedin;
    }

    if (portfolio && !portfolio.startsWith("http")) {
      fixedPortfolio = "https://" + portfolio;
    }

    updateProfile.mutate({
      year,
      skills,
      github: fixedGithub,
      linkedin: fixedLinkedin,
      portfolio: fixedPortfolio,
      bio,
      image: imagePath,
    });
  };

  const skillCount = skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean).length;

  const hasError = Object.values(errors).some((value) => Boolean(value));

  const inputBase =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100";

  return (
    <main className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-8 md:px-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
        .edit-shell { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="edit-shell mx-auto w-full max-w-7xl">
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <p className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-sky-700">
            Profile Editor
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Edit Your Profile
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Keep your profile complete to improve visibility and job matching.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-base font-bold text-slate-900">Academic and Skill Details</h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                    Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className={inputBase}
                  >
                    <option value="">Select Year</option>
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                    <option>Graduate</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                    Skills (comma separated)
                  </label>
                  <input
                    value={skills}
                    onChange={(e) => {
                      setSkills(e.target.value);
                      validateSkills(e.target.value);
                    }}
                    className={`${inputBase} ${errors.skills ? "border-rose-400 ring-rose-100" : ""}`}
                    placeholder="React, Node.js, TypeScript"
                  />
                  <p className="mt-1 text-xs font-medium text-slate-500">{skillCount}/10 skills used</p>
                  {errors.skills && <p className="mt-1 text-xs font-semibold text-rose-600">{errors.skills}</p>}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-base font-bold text-slate-900">Professional Links</h2>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                    GitHub
                  </label>
                  <input
                    value={github}
                    onChange={(e) => {
                      setGithub(e.target.value);
                      validateGithub(e.target.value);
                    }}
                    className={`${inputBase} ${errors.github ? "border-rose-400 ring-rose-100" : ""}`}
                    placeholder="github.com/username"
                  />
                  {errors.github && <p className="mt-1 text-xs font-semibold text-rose-600">{errors.github}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                    LinkedIn
                  </label>
                  <input
                    value={linkedin}
                    onChange={(e) => {
                      setLinkedin(e.target.value);
                      validateLinkedin(e.target.value);
                    }}
                    className={`${inputBase} ${errors.linkedin ? "border-rose-400 ring-rose-100" : ""}`}
                    placeholder="linkedin.com/in/username"
                  />
                  {errors.linkedin && <p className="mt-1 text-xs font-semibold text-rose-600">{errors.linkedin}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                    Portfolio
                  </label>
                  <input
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    className={inputBase}
                    placeholder="yourportfolio.com"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-base font-bold text-slate-900">Biography</h2>
              <div className="mt-4">
                <textarea
                  value={bio}
                  onChange={(e) => {
                    setBio(e.target.value);
                    validateBio(e.target.value);
                  }}
                  className={`${inputBase} min-h-44 resize-y ${errors.bio ? "border-rose-400 ring-rose-100" : ""}`}
                  maxLength={300}
                  placeholder="Share your interests, strengths, and career focus."
                />
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-500">{bio.length}/300 characters</p>
                  {errors.bio && <p className="text-xs font-semibold text-rose-600">{errors.bio}</p>}
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900">Profile Photo</h2>

              <div className="mt-5 flex items-center gap-4">
                {(preview || profile.image) ? (
                  <img
                    src={preview ?? profile.image ?? ""}
                    alt="Profile preview"
                    className="h-20 w-20 rounded-2xl object-cover ring-4 ring-sky-100"
                  />
                ) : (
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-900 text-xl font-bold text-white ring-4 ring-sky-100">
                    {profile.name?.slice(0, 2).toUpperCase() ?? "ST"}
                  </div>
                )}

                <div className="text-xs text-slate-500">
                  <p className="font-semibold text-slate-700">JPG or PNG</p>
                  <p className="mt-1">Max size: 5MB</p>
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                  Upload new image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setErrors((prev) => ({ ...prev, image: "" }));
                      if (preview) {
                        URL.revokeObjectURL(preview);
                      }
                      setImage(file);
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                  className="block w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-sky-600"
                />
                {errors.image && <p className="mt-2 text-xs font-semibold text-rose-600">{errors.image}</p>}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900">Submit</h2>
              <p className="mt-2 text-sm text-slate-500">
                Save your changes to update your public student profile.
              </p>

              {hasError && (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                  Please fix validation errors before saving.
                </div>
              )}

              <div className="mt-5 space-y-3">
                <button
                  type="submit"
                  disabled={updateProfile.isPending || hasError}
                  className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {updateProfile.isPending ? "Saving..." : "Save Profile"}
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/student/profile")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-sky-300 hover:text-sky-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}