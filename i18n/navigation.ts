/* eslint-disable unicorn/no-top-level-side-effects -- Framework configuration factories run once when their modules load. */
import { createNavigation } from "next-intl/navigation";
import { routing } from "@/i18n/routing";

export const { Link, usePathname, useRouter } = createNavigation(routing);
