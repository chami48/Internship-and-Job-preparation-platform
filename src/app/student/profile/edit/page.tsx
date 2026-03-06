"use client";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditProfilePage() {

  const router = useRouter();

  const { data: profile } = api.profile.getProfile.useQuery();

  const updateProfile = api.profile.updateProfile.useMutation({
    onSuccess: () => {
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

  if (!profile) {
    return <div className="p-10">Loading...</div>;
  }

  // ---------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------

  const validateSkills = (value: string) => {
    const skillList = value.split(",").map(s => s.trim()).filter(Boolean);

    if (skillList.length > 10) {
      setErrors(prev => ({ ...prev, skills: "You can add up to 10 skills." }));
    } else {
      setErrors(prev => ({ ...prev, skills: "" }));
    }
  };

  const validateGithub = (value: string) => {

    if (!value) {
      setErrors(prev => ({ ...prev, github: "" }));
      return;
    }

    if (!value.toLowerCase().includes("github.com")) {
      setErrors(prev => ({
        ...prev,
        github: "Enter a valid GitHub profile link (e.g., github.com/username)",
      }));
    } else {
      setErrors(prev => ({ ...prev, github: "" }));
    }
  };

  const validateLinkedin = (value: string) => {

    if (!value) {
      setErrors(prev => ({ ...prev, linkedin: "" }));
      return;
    }

    if (!value.toLowerCase().includes("linkedin.com")) {
      setErrors(prev => ({
        ...prev,
        linkedin: "Enter a valid LinkedIn profile link (e.g., linkedin.com/in/username)",
      }));
    } else {
      setErrors(prev => ({ ...prev, linkedin: "" }));
    }
  };

  const validateBio = (value: string) => {

    if (value.length > 300) {
      setErrors(prev => ({
        ...prev,
        bio: "Bio must be 300 characters or less.",
      }));
    } else {
      setErrors(prev => ({ ...prev, bio: "" }));
    }
  };

  // ---------------------------
  // SUBMIT
  // ---------------------------

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (Object.values(errors).some(err => err !== "")) {
      return;
    }

    let imagePath = profile.image ?? "";

    if (image) {

      if (!["image/png", "image/jpeg", "image/jpg"].includes(image.type)) {
        setErrors(prev => ({
          ...prev,
          image: "Please upload a JPG or PNG image.",
        }));
        return;
      }

      if (image.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
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

      const data = await res.json();
      imagePath = data.path;
    }

    // AUTO FIX URLS

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

  return (
    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Edit Profile
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* IMAGE */}

        <div>
          <label className="block font-medium mb-2">
            Profile Image
          </label>

          {/* CURRENT IMAGE */}

          {profile.image && !preview && (
            <img
              src={profile.image}
              className="w-24 h-24 rounded-full mb-3 object-cover"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {

              const file = e.target.files?.[0];

              if (file) {
                setImage(file);
                setPreview(URL.createObjectURL(file));
              }

            }}
          />

          {errors.image && (
            <p className="text-red-500 text-sm mt-1">
              {errors.image}
            </p>
          )}

          {/* NEW IMAGE PREVIEW */}

          {preview && (
            <img
              src={preview}
              className="w-24 h-24 rounded-full mt-3 object-cover"
            />
          )}

        </div>

        {/* YEAR */}

        <div>
          <label className="block font-medium">
            Year
          </label>

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border p-2 w-full rounded"
          >
            <option value="">Select Year</option>
            <option>1st Year</option>
            <option>2nd Year</option>
            <option>3rd Year</option>
            <option>4th Year</option>
            <option>Graduate</option>
          </select>
        </div>

        {/* SKILLS */}

        <div>
          <label className="block font-medium">
            Skills (comma separated)
          </label>

          <input
            value={skills}
            onChange={(e) => {
              setSkills(e.target.value);
              validateSkills(e.target.value);
            }}
            className={`border p-2 w-full rounded ${errors.skills ? "border-red-500" : ""}`}
            placeholder="React, Node, TypeScript"
          />

          {errors.skills && (
            <p className="text-red-500 text-sm mt-1">
              {errors.skills}
            </p>
          )}
        </div>

        {/* GITHUB */}

        <div>
          <label className="block font-medium">
            GitHub
          </label>

          <input
            value={github}
            onChange={(e) => {
              setGithub(e.target.value);
              validateGithub(e.target.value);
            }}
            className={`border p-2 w-full rounded ${errors.github ? "border-red-500" : ""}`}
            placeholder="github.com/username"
          />

          {errors.github && (
            <p className="text-red-500 text-sm mt-1">
              {errors.github}
            </p>
          )}
        </div>

        {/* LINKEDIN */}

        <div>
          <label className="block font-medium">
            LinkedIn
          </label>

          <input
            value={linkedin}
            onChange={(e) => {
              setLinkedin(e.target.value);
              validateLinkedin(e.target.value);
            }}
            className={`border p-2 w-full rounded ${errors.linkedin ? "border-red-500" : ""}`}
            placeholder="linkedin.com/in/username"
          />

          {errors.linkedin && (
            <p className="text-red-500 text-sm mt-1">
              {errors.linkedin}
            </p>
          )}
        </div>

        {/* PORTFOLIO */}

        <div>
          <label className="block font-medium">
            Portfolio
          </label>

          <input
            value={portfolio}
            onChange={(e) => setPortfolio(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="yourportfolio.com"
          />
        </div>

        {/* BIO */}

        <div>
          <label className="block font-medium">
            Bio
          </label>

          <textarea
            value={bio}
            onChange={(e) => {
              setBio(e.target.value);
              validateBio(e.target.value);
            }}
            className={`border p-2 w-full rounded ${errors.bio ? "border-red-500" : ""}`}
            maxLength={300}
          />

          <p className="text-sm text-gray-500">
            {bio.length}/300 characters
          </p>

          {errors.bio && (
            <p className="text-red-500 text-sm">
              {errors.bio}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Save Profile
        </button>

      </form>

    </div>
  );
}