import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { AnimationCard } from "@/components/animation-card";
import { CopyPrompt } from "@/components/copy-prompt";
import { DemoPlayer } from "@/components/demo-player";
import { Icon } from "@/components/icon";
import { animations, getAnimationEntries, getCategory } from "@/lib/animations";
import type { Metadata } from "next";

export const generateStaticParams = () =>
  animations.map((entry) => ({ slug: entry.id }));
export const generateMetadata = async ({
  params,
}: PageProps<"/[locale]/animations/[slug]">): Promise<Metadata> => {
  const [{ slug }, t, animationText] = await Promise.all([
    params,
    getTranslations("Detail"),
    getTranslations("Animations"),
  ]);
  const entry = getAnimationEntries(animationText).find(
    (item) => item.id === slug
  );
  return {
    description: entry?.description,
    title: entry?.name ?? t("notFound"),
  };
};
const AnimationPage = async ({
  params,
}: PageProps<"/[locale]/animations/[slug]">) => {
  const [{ slug }, t, animationText, categoryText] = await Promise.all([
    params,
    getTranslations("Detail"),
    getTranslations("Animations"),
    getTranslations("Categories"),
  ]);
  const entry = getAnimationEntries(animationText).find(
    (item) => item.id === slug
  );
  if (!entry) {
    notFound();
  }
  const category = getCategory(entry.category);
  const categoryName = categoryText(`${category.id}.name`);
  const related = getAnimationEntries(animationText)
    .filter((item) => item.category === entry.category && item.id !== entry.id)
    .slice(0, 3);
  return (
    <main id="main-content" className="detail-main container">
      <Link href="/" scroll={false} className="back-link">
        <Icon name="back" size={16} />
        {t("back")}
      </Link>
      <div className="detail-heading">
        <div>
          <h1>
            {entry.name}
            <span>.</span>
          </h1>
          <p>{entry.description}</p>
        </div>
        <span className="detail-category">
          <Icon name={category.icon} />
          {categoryName}
        </span>
      </div>
      <div className="detail-grid">
        <div>
          <DemoPlayer key={entry.id} entry={entry} large />
          <p className="playback-note">
            <Icon name="info" size={15} />
            {t("playback")}
          </p>
        </div>
        <div className="detail-description">
          <section>
            <h2>{t("what")}</h2>
            <p>{entry.explanation}</p>
          </section>
          <section>
            <h2>{t("when")}</h2>
            <p>{entry.usage}</p>
          </section>
          <div className="detail-facts">
            <div>
              <span>{t("duration")}</span>
              <strong>{entry.duration} ms</strong>
            </div>
            <div>
              <span>{t("category")}</span>
              <strong>{categoryName}</strong>
            </div>
          </div>
        </div>
      </div>
      <CopyPrompt text={entry.prompt} />
      <section className="related-section" aria-labelledby="related-title">
        <div className="related-heading">
          <div>
            <h2 id="related-title">
              {t("more", { category: categoryName.toLocaleLowerCase() })}
              <span>.</span>
            </h2>
          </div>
          <Link href={`/?category=${entry.category}`} className="text-link">
            {t("viewCategory")}
            <Icon name="arrow" />
          </Link>
        </div>
        <div className="animation-grid">
          {related.map((item) => {
            const { id } = item;
            return <AnimationCard key={id} entry={item} />;
          })}
        </div>
      </section>
    </main>
  );
};
export default AnimationPage;
