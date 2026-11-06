import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/icon";

const NotFound = () => {
  const t = useTranslations("NotFound");
  return (
    <main id="main-content" className="not-found container">
      <p className="eyebrow">{t("eyebrow")}</p>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
      <Link className="button primary-button" href="/">
        {t("back")}
        <Icon name="arrow" />
      </Link>
    </main>
  );
};
export default NotFound;
