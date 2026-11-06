import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/icon";

const Loading = () => {
  const t = useTranslations("Loading");
  const detail = useTranslations("Detail");
  return (
    <main
      id="main-content"
      className="detail-main container"
      aria-busy="true"
      aria-label={t("label")}
    >
      <Link href="/" className="back-link">
        <Icon name="back" />
        {detail("back")}
      </Link>
      <div className="detail-heading">
        <div>
          <p className="eyebrow">{t("study")}</p>
          <h1>
            {t("title")}
            <span>.</span>
          </h1>
          <p>{t("description")}</p>
        </div>
      </div>
      <div className="loading-stage">
        <p className="mono">{t("status")}</p>
      </div>
    </main>
  );
};
export default Loading;
