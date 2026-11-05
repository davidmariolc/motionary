import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import type { Metadata } from "next";
import "./globals.css";
// eslint-disable-next-line unicorn/no-top-level-side-effects -- Next compiles font declarations at build time.
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
// eslint-disable-next-line unicorn/no-top-level-side-effects -- Next compiles font declarations at build time.
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});
export const metadata: Metadata = {
  description:
    "A visual dictionary of motion. Explore interactive animations, learn their names, and copy ready-to-use prompts for your next idea.",
  title: {
    default: "Motionary — A visual dictionary of motion",
    template: "%s — Motionary",
  },
};
const RootLayout = ({ children }: LayoutProps<"/">) => {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
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
