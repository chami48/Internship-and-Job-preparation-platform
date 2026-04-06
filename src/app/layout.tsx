import "~/styles/globals.css";

import { type Metadata } from "next";
import { Manrope, Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import ConditionalLayout from "~/app/components/common/ConditionalLayout";
import { TRPCReactProvider } from "~/trpc/react";
import ActivityTracker from "~/app/components/ActivityTracker";
import CursorGlow from "~/app/components/common/CursorGlow";

export const metadata: Metadata = {
  title: "Internship & Job Preparation Platform",
  description: "Smart role-based screening and job preparation platform",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${manrope.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans">
        <SessionProvider>
          <TRPCReactProvider>
            <ActivityTracker />
            <CursorGlow />

            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}