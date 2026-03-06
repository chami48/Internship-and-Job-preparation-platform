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
  void pathname;

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
