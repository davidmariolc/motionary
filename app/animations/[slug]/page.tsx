import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimationCard } from "@/components/animation-card";
import { CopyPrompt } from "@/components/copy-prompt";
import { DemoPlayer } from "@/components/demo-player";
import { Icon } from "@/components/icon";
import { animations, getCategory } from "@/lib/animations";
import type { Metadata } from "next";

export const generateStaticParams = () =>
  animations.map((entry) => ({ slug: entry.id }));
export const generateMetadata = async ({
  params,
}: PageProps<"/animations/[slug]">): Promise<Metadata> => {
  const { slug } = await params;
  const entry = animations.find((item) => item.id === slug);
  return {
    description: entry?.description,
    title: entry?.name ?? "Animation not found",
  };
};
const AnimationPage = async ({ params }: PageProps<"/animations/[slug]">) => {
  const { slug } = await params;
  const entry = animations.find((item) => item.id === slug);
  if (!entry) {
    notFound();
  }
  const category = getCategory(entry.category);
  const related = animations
    .filter((item) => item.category === entry.category && item.id !== entry.id)
    .slice(0, 3);
  return (
    <main id="main-content" className="detail-main container">
      <Link href="/" scroll={false} className="back-link">
        <Icon name="back" size={16} />
        Back to library
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
          {category.name}
        </span>
      </div>
      <div className="detail-grid">
        <div>
          <DemoPlayer key={entry.id} entry={entry} large />
          <p className="playback-note">
            <Icon name="info" size={15} />
            One motion at a time. Play it at your own pace.
          </p>
        </div>
        <div className="detail-description">
          <section>
            <h2>What it does</h2>
            <p>{entry.explanation}</p>
          </section>
          <section>
            <h2>When to use it</h2>
            <p>{entry.usage}</p>
          </section>
          <div className="detail-facts">
            <div>
              <span>BASE DURATION</span>
              <strong>{entry.duration} ms</strong>
            </div>
            <div>
              <span>CATEGORY</span>
              <strong>{category.name}</strong>
            </div>
          </div>
        </div>
      </div>
      <CopyPrompt text={entry.prompt} />
      <section className="related-section" aria-labelledby="related-title">
        <div className="related-heading">
          <div>
            <h2 id="related-title">
              More in {category.name.toLowerCase()}
              <span>.</span>
            </h2>
          </div>
          <Link href={`/?category=${entry.category}`} className="text-link">
            View category
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
