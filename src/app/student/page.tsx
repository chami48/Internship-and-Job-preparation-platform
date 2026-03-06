// smart-screening/src/app/student/page.tsx

import { auth } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function StudentDashboard() {
  const session = await auth();

  if (!session) {
    redirect("/student/login");
  }

  if (session.user.role !== "STUDENT") {
    redirect("/");
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Welcome {session.user?.name}
      </h1>

      <p className="mt-4 text-gray-600">
        Your ID: {session.user.id}
      </p>
    </div>
  );
}