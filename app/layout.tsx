import { Familjen_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import type { Metadata } from "next";
import "./globals.css";
// eslint-disable-next-line unicorn/no-top-level-side-effects -- Next compiles font declarations at build time.
const displayFont = Familjen_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});
// eslint-disable-next-line unicorn/no-top-level-side-effects -- Next compiles font declarations at build time.
const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-metadata",
  weight: ["400", "500"],
});
export const metadata: Metadata = {
  description:
    "A visual dictionary of motion. Explore interactive animations, learn their names, and copy ready-to-use prompts for your next idea.",
  other: { "page-type": "software", "site-kind": "software" },
  title: {
    default: "Motionary — A visual dictionary of motion",
    template: "%s — Motionary",
  },
};
const RootLayout = ({ children }: LayoutProps<"/">) => {
  return (
    <html
      lang="en"
      data-type="software"
      className={`${displayFont.variable} ${monoFont.variable}`}
    >
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
};
export default RootLayout;
