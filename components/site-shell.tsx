import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { GitHubLink } from "@/components/github-link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { animations } from "@/lib/animations";

export const Brand = () => {
  const t = useTranslations("Shell");
  return (
    <Link href="/" className="brand" aria-label={t("home")}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 23V5h5l6 10 6-10h5v18h-5V13l-6 9-6-9v10Z"
          fill="currentColor"
        />
      </svg>
      <span>
        motionary<span className="brand-dot">.</span>
      </span>
    </Link>
  );
};
export const SiteHeader = () => {
  const t = useTranslations("Shell");
  return (
    <header className="site-header">
      <div className="header-inner container">
        <Brand />
        <nav aria-label={t("navigation")}>
          <Link href="/#collection">
            {t("library")}{" "}
            <span className="nav-count mono">{animations.length}</span>
          </Link>
          <Link href="/#how-it-works">
            {t("how")} <span aria-hidden="true">↗</span>
          </Link>
        </nav>
        <span className="header-note mono">
          <span className="small-dot" /> {t("note")}
        </span>
        <div className="header-actions">
          <LanguageSwitcher />
          <GitHubLink />
        </div>
      </div>
    </header>
  );
};
export const SiteFooter = () => {
  const t = useTranslations("Shell");
  return (
    <footer className="site-footer container">
      <div>
        <Brand />
        <p>{t("tagline")}</p>
      </div>
      <p className="mono">
        {t("made")}
        <br />
        <span>{t("studies", { count: animations.length })}</span>
      </p>
    </footer>
  );
};
