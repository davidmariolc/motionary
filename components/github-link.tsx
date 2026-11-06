import { cacheLife } from "next/cache";
import { getFormatter, getTranslations } from "next-intl/server";
import { Icon } from "@/components/icon";
import { fetchRepositoryStars, repositoryUrl } from "@/lib/github";

const getRepositoryStars = async (): Promise<number | null> => {
  "use cache";
  try {
    const stars = await fetchRepositoryStars();
    cacheLife("hours");
    return stars;
  } catch {
    cacheLife("minutes");
    return null;
  }
};

export const GitHubLink = async () => {
  const [t, format, stars] = await Promise.all([
    getTranslations("Shell"),
    getFormatter(),
    getRepositoryStars(),
  ]);
  const label =
    stars === null
      ? t("githubUnavailable")
      : t("githubStars", { count: stars });
  return (
    <a
      className="github-link"
      href={repositoryUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      <Icon name="github" size={20} />
      <span>{stars === null ? "—" : format.number(stars)}</span>
      <Icon name="star" size={20} />
    </a>
  );
};
