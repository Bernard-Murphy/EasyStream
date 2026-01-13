import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { LoginModal } from "@/components/LoginModal";
import { Toaster } from "@/components/ui/sonner";
import { PageTransitions } from "@/components/PageTransitions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EasyStream",
  description: "EasyStream - anonymous live streaming over WebRTC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        <Suspense fallback={null}>
          <LoginModal />
        </Suspense>
        <Toaster />
        <PageTransitions>{children}</PageTransitions>
      </body>
    </html>
  );
}
