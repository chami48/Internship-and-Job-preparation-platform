import { auth } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function StudentDashboard() {
  const session = await auth();

  if (!session) {
    redirect("/student/login");
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Welcome {session.user?.name}
      </h1>
    </div>
  );
}