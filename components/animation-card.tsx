"use client";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { DemoPlayer } from "@/components/demo-player";
import { Icon } from "@/components/icon";
import { getCategory } from "@/lib/animations";
import { rememberCatalog } from "@/lib/catalog-state";
import type { AnimationEntry } from "@/lib/animations";

export const AnimationCard = ({
  entry,
}: {
  readonly entry: AnimationEntry;
}) => {
  const t = useTranslations("Catalog");
  const categoryText = useTranslations("Categories");
  const category = getCategory(entry.category);
  return (
    <article className="animation-card" data-category={entry.category}>
      <DemoPlayer entry={entry} />
      <div className="card-content">
        <div className="card-heading">
          <h3>
            <Link href={`/animations/${entry.id}`} onClick={rememberCatalog}>
              {entry.name}
            </Link>
          </h3>
          <span className="category-label">
            <Icon name={category.icon} size={12} />
            {categoryText(`${category.id}.short`)}
          </span>
        </div>
        <p>{entry.description}</p>
        <Link
          className="card-link"
          href={`/animations/${entry.id}`}
          onClick={rememberCatalog}
        >
          <span>{t("view")}</span>
          <Icon name="diagonal" size={16} />
        </Link>
      </div>
    </article>
  );
};
