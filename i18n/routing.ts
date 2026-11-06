/* eslint-disable unicorn/no-top-level-side-effects -- Framework configuration factories run once when their modules load. */
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  defaultLocale: "en",
  localePrefix: "always",
  locales: ["en", "es"],
});
