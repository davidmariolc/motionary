/* eslint-disable unicorn/no-top-level-side-effects -- Framework configuration factories run once when their modules load. */
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const proxy = createMiddleware(routing);

export default proxy;

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
