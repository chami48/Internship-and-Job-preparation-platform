//C:\SLIIT\Y3S1\ITPM\Y3S1Project\smart-screening\src\app\components\common\HeaderAuthControls.tsx
"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import ProfileMenu from "~/app/components/common/ProfileMenu";

export default function HeaderAuthControls() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isLoggedIn = status === "authenticated";
  const isLoading = status === "loading";

  const isLanding = pathname === "/" || pathname === "/landing";
  const isAuthPage =
    pathname?.startsWith("/student/register") ||
    pathname?.startsWith("/company/register") ||
    pathname?.startsWith("/api/auth/signin") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/signin") ||
    pathname?.startsWith("/student/login") ||
    pathname?.startsWith("/company/comlogin");

  if (isLanding || isAuthPage) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/api/auth/signin?callbackUrl=/"
          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition-colors hover:bg-slate-100"
        >
          Sign In
        </Link>
        <Link
          href="/student/register"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-500"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {isLoggedIn ? (
        <>
          <ProfileMenu
            isLoggedIn={isLoggedIn}
            name={session?.user?.name}
            email={session?.user?.email}
            image={session?.user?.image}
          />
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/home" })}
            aria-label="Sign out"
            className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-200 text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </>
      ) : (
        !isLoading && (
          <>
            <Link
              href="/api/auth/signin?callbackUrl=/"
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition-colors hover:bg-slate-100"
            >
              Sign In
            </Link>
            <Link
              href="/student"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-500"
            >
              Sign Up
            </Link>
          </>
        )
      )}
    </div>
  );
}