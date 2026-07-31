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

const TITLE = "DataForge — Master End-to-End Azure Data Engineering";
const DESCRIPTION =
  "Build production-grade pipelines from ingestion to insight. Learn Azure Data Factory, Databricks, Synapse and Power BI by shipping a real end-to-end project.";

export const metadata: Metadata = {
  // TODO: set to the real production origin before deploying. Without
  // metadataBase, Next resolves relative OG image URLs against localhost and
  // link previews silently break in production.
  metadataBase: new URL("https://dataforge.example.com"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    siteName: "DataForge",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
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
