import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Catalog } from "@/components/catalog";
import { DemoPlayer } from "@/components/demo-player";
import { Icon } from "@/components/icon";
import { getAnimationEntries, categories } from "@/lib/animations";
import type { ReactNode } from "react";

const richText = {
  accent: (chunks: ReactNode) => <span>{chunks}</span>,
  br: () => <br />,
};

const Home = async () => {
  const [t, animationText] = await Promise.all([
    getTranslations("Home"),
    getTranslations("Animations"),
  ]);
  const animations = getAnimationEntries(animationText);
  const featured = animations.find((entry) => entry.id === "stagger");
  return (
    <main id="main-content" className="container">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <h1 id="hero-title">{t.rich("heading", richText)}</h1>
          <p className="hero-description">
            {t("description", { count: animations.length })}
          </p>
          <div className="hero-actions">
            <Link href="#collection" className="button primary-button">
              {t("browse")} <Icon name="arrow" size={18} />
            </Link>
            <span className="hero-fact">
              {t("categories", { count: categories.length })}
            </span>
          </div>
        </div>
        {featured ? (
          <div className="hero-feature">
            <div className="feature-topline mono">
              <span>{t("inside")}</span>
              <Icon name="diagonal" size={20} />
            </div>
            <div className="feature-title">
              <span className="mono">
                {t("study", {
                  number: String(featured.number).padStart(2, "0"),
                })}
              </span>
              <Link href={`/animations/${featured.id}`}>{featured.name}</Link>
            </div>
            <DemoPlayer entry={featured} />
            <div className="feature-bottomline">
              <span>{featured.description}</span>
              <span className="mono">
                {String(featured.number).padStart(2, "0")} / {animations.length}
              </span>
            </div>
          </div>
        ) : null}
      </section>
      <Catalog entries={animations} />
      <section
        id="how-it-works"
        className="how-it-works"
        aria-labelledby="how-title"
      >
        <div>
          <h2 id="how-title">{t.rich("howHeading", richText)}</h2>
          <Link href="#collection" className="text-link">
            {t("find")} <Icon name="arrow" />
          </Link>
        </div>
        <ol>
          <li>
            <span>01</span>
            <div>
              <h3>{t("find")}</h3>
              <p>{t("findDescription")}</p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <h3>{t("preview")}</h3>
              <p>{t("previewDescription")}</p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <h3>{t("copy")}</h3>
              <p>{t("copyDescription")}</p>
            </div>
          </li>
        </ol>
      </section>
    </main>
  );
};
export default Home;
