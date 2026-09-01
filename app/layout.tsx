import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import MotionProvider from "@/components/MotionProvider";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

/**
 * Runs before first paint, so the correct theme is on <html> by the time the
 * body renders. Doing this in React instead would paint dark, hydrate, then
 * flip — the classic flash of wrong theme. It is deliberately tiny and
 * self-contained; the try/catch covers private-browsing localStorage throws.
 */
const THEME_SCRIPT = `
(function(){
  try {
    var stored = localStorage.getItem('theme');
    var system = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    document.documentElement.dataset.theme = stored || system;
  } catch (e) {
    document.documentElement.dataset.theme = 'dark';
  }
})();
`;

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

const TITLE = "EduFulness — Master End-to-End Azure Data Engineering";
const DESCRIPTION =
  "An industry-standard, project-driven curriculum: 33 modules across 13 phases covering SQL, Azure Data Factory, Databricks, PySpark and Delta Lake, ending in a full retail lakehouse build. Think. Learn. Evolve.";

export const metadata: Metadata = {
  /**
   * Relative URLs in the metadata below resolve against this. The trailing
   * slash matters: without it, "opengraph-image.png" would resolve to
   * /opengraph-image.png at the domain root — the client's PHP site — instead
   * of inside /azure/.
   */
  metadataBase: new URL("https://edufulness.com/azure/"),
  // Tells search engines which URL is authoritative, so /azure and /azure/
  // aren't indexed as two separate pages.
  alternates: { canonical: "/" },
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    siteName: "EduFulness",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning because the inline script mutates the
    // data-theme attribute before React hydrates, which React would otherwise
    // report as a server/client mismatch on <html>.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrains.variable} font-body bg-bg text-text overflow-x-hidden`}
      >
        {/* First focusable element on the page. Invisible until tabbed to, then
            it lets a keyboard or screen-reader user jump the whole nav instead
            of tabbing through every link on every visit. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-purple focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>

        <div className="bg-glow" />
        <div className="bg-grid" />
        <div className="bg-fade" />
        <MotionProvider>{children}</MotionProvider>
        <ThemeToggle />
      </body>
    </html>
  );
}
