"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import ProfileMenu from "~/app/components/common/ProfileMenu";

export default function HeaderAuthControls() {
  const { data: session, status } = useSession();

  const isLoggedIn = status === "authenticated";
  const isLoading = status === "loading";

  return (
    <div className="flex items-center gap-3">
      <ProfileMenu
        isLoggedIn={isLoggedIn}
        name={session?.user?.name}
        email={session?.user?.email}
        image={session?.user?.image}
      />

      {!isLoggedIn && !isLoading && (
        <>
          <Link
            href="/api/auth/signin?callbackUrl=/home"
            className="rounded-lg border-1.5 border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:border-sky-400 hover:text-sky-400"
          >
            Log in
          </Link>
          <Link
            href="/student"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-500"
          >
            Get Started
          </Link>
        </>
      )}
    </div>
  );
}
