import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BrandArtwork } from "@/components/brand-artwork";
import { GitHubLink } from "@/components/github-link";
import { Icon } from "@/components/icon";
import { LanguageSwitcher } from "@/components/language-switcher";
import { animations } from "@/lib/animations";

export const Brand = () => {
  const t = useTranslations("Shell");
  return (
    <Link href="/" className="brand" aria-label={t("home")}>
      <BrandArtwork />
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
            <span className="nav-label">{t("library")}</span>
            <span className="nav-count mono">{animations.length}</span>
          </Link>
          <Link href="/#how-it-works">
            <span className="nav-label">{t("how")}</span>
            <Icon name="info" size={18} />
          </Link>
        </nav>
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
