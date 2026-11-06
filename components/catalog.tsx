"use client";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { AnimationCard } from "@/components/animation-card";
import { Icon } from "@/components/icon";
import { categories, filterAnimations } from "@/lib/animations";
import { restoreCatalog } from "@/lib/catalog-state";
import type { ReactNode } from "react";
import type { AnimationEntry } from "@/lib/animations";

const richText = {
  key: (chunks: ReactNode) => <kbd>{chunks}</kbd>,
  strong: (chunks: ReactNode) => <strong>{chunks}</strong>,
};

const filtersEvent = "motionary:filters";
const subscribe = (listener: () => void) => {
  window.addEventListener("popstate", listener);
  window.addEventListener(filtersEvent, listener);
  return () => {
    window.removeEventListener("popstate", listener);
    window.removeEventListener(filtersEvent, listener);
  };
};
const getSnapshot = () => window.location.search;
const getServerSnapshot = () => "";
const updateFilters = (query: string, category: string) => {
  const parameters = new URLSearchParams();
  if (query) {
    parameters.set("q", query);
  }
  if (category !== "all") {
    parameters.set("category", category);
  }
  const search = parameters.toString();
  const suffix = search ? `?${search}` : "";
  window.history.replaceState(
    window.history.state,
    "",
    `${window.location.pathname}${suffix}${window.location.hash}`
  );
  window.dispatchEvent(new Event(filtersEvent));
};
export const Catalog = ({
  entries,
}: {
  readonly entries: AnimationEntry[];
}) => {
  const t = useTranslations("Catalog");
  const categoryText = useTranslations("Categories");
  const search = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const parameters = new URLSearchParams(search);
  const query = parameters.get("q") ?? "";
  const requestedCategory = parameters.get("category") ?? "all";
  const category = categories.some((item) => item.id === requestedCategory)
    ? requestedCategory
    : "all";
  const results = filterAnimations(entries, query, category);
  const allResults = filterAnimations(entries, query, "all");
  const hasFilters = query.length > 0 || category !== "all";
  const canSearchAll = category !== "all" && allResults.length > 0;
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    restoreCatalog();
    const onKeyDown = (event: KeyboardEvent) => {
      const { target } = event;
      const typing =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
      const hasModifier = event.metaKey || event.ctrlKey || event.altKey;
      if (hasModifier || typing || event.key !== "/") {
        return;
      }
      event.preventDefault();
      input.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  return (
    <section
      id="collection"
      className="collection"
      aria-labelledby="collection-title"
    >
      <div className="collection-heading">
        <h2 id="collection-title">
          {t("title")}{" "}
          <span className="collection-total mono">
            {String(entries.length).padStart(2, "0")}
          </span>
        </h2>
        <span className="collection-note">{t("note")}</span>
      </div>
      <label className="search-label sr-only" htmlFor="animation-search">
        {t("search")}
      </label>
      <div className="search-field">
        <Icon name="search" size={21} />
        <input
          id="animation-search"
          aria-label={t("search")}
          aria-controls="animation-results"
          ref={input}
          type="search"
          value={query}
          placeholder={t("placeholder")}
          onChange={(event) => updateFilters(event.target.value, category)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              updateFilters("", category);
            }
          }}
          autoComplete="off"
        />
        {query ? (
          <button
            type="button"
            className="icon-button"
            aria-label={t("clear")}
            onClick={() => {
              updateFilters("", category);
              input.current?.focus();
            }}
          >
            <Icon name="close" />
          </button>
        ) : (
          <span className="search-shortcut" aria-hidden="true">
            {t.rich("shortcut", richText)}
          </span>
        )}
      </div>
      <div className="filter-bar">
        <fieldset className="category-filters" aria-label={t("filter")}>
          <button
            type="button"
            className="filter-button"
            aria-pressed={category === "all"}
            aria-controls="animation-results"
            onClick={() => updateFilters(query, "all")}
          >
            <Icon name="grid" size={15} />
            {t("all")}
            <span>{allResults.length}</span>
          </button>
          {categories.map((item) => {
            return (
              <button
                type="button"
                key={item.id}
                className="filter-button"
                aria-pressed={category === item.id}
                aria-controls="animation-results"
                onClick={() => updateFilters(query, item.id)}
              >
                <Icon name={item.icon} size={15} />
                {categoryText(`${item.id}.name`)}
                <span>
                  {
                    allResults.filter((entry) => entry.category === item.id)
                      .length
                  }
                </span>
              </button>
            );
          })}
        </fieldset>
      </div>
      <div className="results-meta">
        <output aria-live="polite" aria-atomic="true">
          {t.rich("results", {
            count: results.length,
            ...richText,
          })}
          {category === "all"
            ? ""
            : t("inCategory", { category: categoryText(`${category}.name`) })}
          {query ? t("forQuery", { query }) : ""}
        </output>
        {hasFilters ? (
          <button
            type="button"
            className="reset-filters"
            onClick={() => {
              updateFilters("", "all");
              input.current?.focus();
            }}
          >
            <Icon name="close" size={14} /> {t("reset")}
          </button>
        ) : (
          <span className="mono">
            <Icon name="play" size={14} /> {t("interactive")}
          </span>
        )}
      </div>
      <div id="animation-results">
        {results.length > 0 ? (
          <div className="animation-grid">
            {results.map((entry) => {
              const { id } = entry;
              return <AnimationCard key={id} entry={entry} />;
            })}
          </div>
        ) : (
          <div className="empty-state">
            <Icon name="search" size={32} />
            <h3>{t("empty")}</h3>
            <p>
              {canSearchAll
                ? t("otherMatches", { count: allResults.length })
                : t("tryAgain")}
            </p>
            <button
              type="button"
              className="button primary-button"
              onClick={() => {
                updateFilters(canSearchAll ? query : "", "all");
                input.current?.focus();
              }}
            >
              {t(canSearchAll ? "searchAll" : "clearFilters")}
              <Icon name="arrow" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
