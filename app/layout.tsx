import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import MotionProvider from "@/components/MotionProvider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "DataForge — Master End-to-End Azure Data Engineering",
  description:
    "Build production-grade pipelines from ingestion to insight. Learn Azure Data Factory, Databricks, Synapse and Power BI by shipping a real end-to-end project.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrains.variable} font-body bg-bg text-text overflow-x-hidden`}
      >
        <div className="bg-glow" />
        <div className="bg-grid" />
        <div className="bg-fade" />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
