import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexus Control - AI Integration Hub",
  description: "AI-Powered Integration Hub for VPN, Multi-LLM, Google Apps, and Self-Improvement. Control everything from one dashboard.",
  keywords: ["Nexus Control", "VPN", "Multi-LLM", "Claude", "ChatGPT", "Google AI", "Self-Improvement", "Next.js", "TypeScript"],
  authors: [{ name: "Nexus Control Team" }],
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
  manifest: "/manifest.json",
  themeColor: "#0f172a",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nexus Control",
  },
  openGraph: {
    title: "Nexus Control - AI Integration Hub",
    description: "AI-powered integration hub for VPN, Multi-LLM, and self-improvement",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus Control",
    description: "AI-powered integration hub",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
