import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NextDegree — Find Universities That Actually Fit You",
  description:
    "Enter your English score, budget, and dream country. We instantly match you against 6,000+ programs across 7 countries — no login, no fees.",
  keywords: [
    "university finder",
    "study abroad",
    "IELTS",
    "scholarships",
    "education",
    "college match",
  ],
  openGraph: {
    title: "NextDegree — Find Universities That Actually Fit You",
    description:
      "Real-time university matching powered by government-grade education APIs.",
    url: "https://nextdegree.app",
    siteName: "NextDegree",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body style={{ margin: 0, background: "#080818", color: "#f1f5f9" }}>
        <Navbar />
        {/* push content below the fixed navbar */}
        <div style={{ paddingTop: 64 }}>{children}</div>
        <Footer />
      </body>
    </html>
  );
}
