import { api } from "~/trpc/server";
import Link from "next/link";

export default async function StudentProfilePage() {

  const profile = await api.profile.getProfile();

  const skills = profile?.skills ? profile.skills.split(",") : [];

  // PROFILE COMPLETION CALCULATION
  const fields = [
    profile?.name,
    profile?.studentId,
    profile?.degree,
    profile?.year,
    profile?.skills,
    profile?.github,
    profile?.linkedin,
    profile?.portfolio,
    profile?.bio,
    profile?.image,
  ];

  const filledFields = fields.filter(Boolean).length;
  const completion = Math.round((filledFields / fields.length) * 100);

  return (
    <div className="max-w-3xl mx-auto p-6">

      <div className="bg-white shadow-lg rounded-xl p-8">

        <div className="text-center mb-6">

          {profile?.image ? (
            <img
              src={profile.image}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
          ) : (
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              👤
            </div>
          )}

          <h1 className="text-2xl font-bold">{profile?.name}</h1>

          <p className="text-gray-500">
            {profile?.degree ?? "Student"}
          </p>

          {/* PROFILE COMPLETION METER */}

          <div className="mt-4">

            <p className="text-sm font-medium mb-1">
              Profile Completion: {completion}%
            </p>

            <div className="w-full bg-gray-200 rounded-full h-3">

              <div
                className="bg-blue-600 h-3 rounded-full"
                style={{ width: `${completion}%` }}
              ></div>

            </div>

          </div>

        </div>

        <div className="space-y-4">

          <p>
            <strong>Email:</strong> {profile?.email}
          </p>

          <p>
            <strong>Student ID:</strong>{" "}
            {profile?.studentId ?? "Not added"}
          </p>

          <p>
            <strong>Year:</strong>{" "}
            {profile?.year ?? "Not added"}
          </p>

          <div>
            <strong>Skills:</strong>

            <div className="flex flex-wrap gap-2 mt-2">

              {skills.length > 0 ? (
                skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    {skill.trim()}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">Not added</p>
              )}

            </div>

          </div>

          <p>
            <strong>GitHub:</strong>{" "}
            {profile?.github ? (
              <a
                href={profile.github}
                target="_blank"
                className="text-blue-600 underline"
              >
                {profile.github}
              </a>
            ) : (
              "Not added"
            )}
          </p>

          <p>
            <strong>LinkedIn:</strong>{" "}
            {profile?.linkedin ? (
              <a
                href={profile.linkedin}
                target="_blank"
                className="text-blue-600 underline"
              >
                {profile.linkedin}
              </a>
            ) : (
              "Not added"
            )}
          </p>

          <p>
            <strong>Portfolio:</strong>{" "}
            {profile?.portfolio ? (
              <a
                href={profile.portfolio}
                target="_blank"
                className="text-blue-600 underline"
              >
                {profile.portfolio}
              </a>
            ) : (
              "Not added"
            )}
          </p>

          <p>
            <strong>Bio:</strong>{" "}
            {profile?.bio ?? "Not added"}
          </p>

        </div>

        <div className="mt-6 text-center">

          <Link
            href="/student/profile/edit"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Edit Profile
          </Link>

        </div>

      </div>

    </div>
  );
}