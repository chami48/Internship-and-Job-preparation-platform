"use client";

import Header from "./Header";
import Footer from "./Footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const mainClass = "min-h-screen";

  return (
    <>
      <Header />
      <main className={mainClass}>
        {children}
      </main>
      <Footer />
    </>
  );
}
