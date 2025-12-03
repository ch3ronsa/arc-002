import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArcOS - Productivity Meets Blockchain",
  description: "Manage tasks, protect notes, and track your productivity on Arc Network. Your work, secured on-chain.",
};

import { ErrorSuppressor } from "@/components/ErrorSuppressor";

import { ThemeProvider } from "@/providers/ThemeProvider";
import { Web3Provider } from "@/providers/Web3Provider";
import { WorkspaceProvider } from "@/providers/WorkspaceProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <Web3Provider>
            <WorkspaceProvider>
              <ErrorSuppressor />
              {children}
            </WorkspaceProvider>
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
