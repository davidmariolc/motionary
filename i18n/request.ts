/* eslint-disable unicorn/no-top-level-side-effects -- Framework configuration factories run once when their modules load. */
/* eslint-disable no-inline-comments -- Webpack chunk names must be adjacent to dynamic import paths. */
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { locale as getRootLocale } from "next/root-params";
import { routing } from "@/i18n/routing";

const loadMessages = {
  en: async () => {
    const { default: messages } = await import(
      /* webpackChunkName: "messages-en" */ "@/messages/en.json"
    );
    return messages;
  },
  es: async () => {
    const { default: messages } = await import(
      /* webpackChunkName: "messages-es" */ "@/messages/es.json"
    );
    return messages;
  },
};

const requestConfig = getRequestConfig(async ({ locale }) => {
  const requestedLocale = locale ?? (await getRootLocale());
  if (!hasLocale(routing.locales, requestedLocale)) {
    notFound();
  }
  return {
    locale: requestedLocale,
    messages: await loadMessages[requestedLocale](),
  };
});

export default requestConfig;
