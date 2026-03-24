"use client";

import { usePathname } from "next/navigation"; 
import HeaderLegacy from "./HeaderLegacy";
import Footer from "./Footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideHeader =
    pathname === "/company/register" ||
    pathname === "/company/comlogin" ||
    pathname === "/company/dashboard" ||
    pathname === "/company/my-jobs" ||
    pathname === "/company/selected-candidates" ||
    pathname === "/company/interviews" ||
    pathname === "/company/profile" ||
    pathname?.startsWith("/company/my-jobs/") ||
    pathname?.startsWith("/company/selected/") ||
    pathname?.startsWith("/company/create-job");

  const mainClass = "min-h-screen";

  return (
    <>
      {!hideHeader && <HeaderLegacy />}

      <main className={mainClass}>
        {children}
      </main>

      {!hideHeader && <Footer />}
    </>
  );
}