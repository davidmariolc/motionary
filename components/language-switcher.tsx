"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { Icon } from "@/components/icon";
import { useRouter } from "@/i18n/navigation";

const languageNames = { en: "English", es: "Español" } as const;

export const LanguageSwitcher = () => {
  const locale = useLocale();
  const t = useTranslations("Shell");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const nextLocale = locale === "en" ? "es" : "en";

  return (
    <button
      className="language-switcher"
      type="button"
      aria-label={t("switchLanguage", {
        current: languageNames[locale],
        language: languageNames[nextLocale],
      })}
      aria-busy={pending}
      disabled={pending}
      onClick={() => {
        const pathname =
          window.location.pathname.slice(locale.length + 1) || "/";
        const href = `${pathname}${window.location.search}${window.location.hash}`;
        startTransition(() =>
          router.replace(href, { locale: nextLocale, scroll: false })
        );
      }}
    >
      <Icon name="translate" size={20} />
      <span lang={locale}>{languageNames[locale]}</span>
    </button>
  );
};
