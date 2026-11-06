import { Familjen_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import "../globals.css";
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
export const generateStaticParams = () =>
  routing.locales.map((locale) => ({ locale }));

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("Metadata");
  return {
    description: t("description"),
    other: { "page-type": "software", "site-kind": "software" },
    title: { default: t("title"), template: "%s — Motionary" },
  };
};

const RootLayout = async ({ children, params }: LayoutProps<"/[locale]">) => {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const [messages, t] = await Promise.all([
    getMessages(),
    getTranslations("Shell"),
  ]);
  const clientMessages = {
    Catalog: messages.Catalog,
    Categories: messages.Categories,
    Detail: messages.Detail,
    Loading: messages.Loading,
    NotFound: messages.NotFound,
    Player: messages.Player,
    Prompt: messages.Prompt,
    Shell: messages.Shell,
    Visual: messages.Visual,
  };
  return (
    <html
      lang={locale}
      data-type="software"
      className={`${displayFont.variable} ${monoFont.variable}`}
    >
      <body>
        <NextIntlClientProvider locale={locale} messages={clientMessages}>
          <a className="skip-link" href="#main-content">
            {t("skip")}
          </a>
          <SiteHeader />
          {children}
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
};
export default RootLayout;
