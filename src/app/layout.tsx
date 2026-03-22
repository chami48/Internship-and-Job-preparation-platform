import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import ConditionalLayout from "~/app/components/common/ConditionalLayout";
import { TRPCReactProvider } from "~/trpc/react";
import Header from "~/app/components/common/Header";
import Footer from "~/app/components/common/Footer";
import ActivityTracker from "~/app/components/ActivityTracker";
import CursorGlow from "~/app/components/common/CursorGlow";

export const metadata: Metadata = {
  title: "Internship & Job Preparation Platform",
  description: "Smart role-based screening and job preparation platform",
  icons: [{ rel: "icon", url: "/uploads/logo.jpg" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geist.variable}>
      <body>
        <SessionProvider>
          <TRPCReactProvider>
            <ActivityTracker />   {/* ✅ moved to top */}
            <CursorGlow />
            <Header />
            {children}
            <Footer />
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}