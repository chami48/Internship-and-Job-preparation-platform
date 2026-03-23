"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Pages where header should be hidden
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

  return (
    <>
      {!hideHeader && <Header />}
      {children}
      <Footer />
    </>
  );
}
