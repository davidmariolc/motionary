export const repositoryUrl = "https://github.com/davidmariolc/motionary";
const repositoryApiUrl = "https://api.github.com/repos/davidmariolc/motionary";
const requestTimeout = 5000;

export const fetchRepositoryStars = async (): Promise<number> => {
  const response = await fetch(repositoryApiUrl, {
    headers: { Accept: "application/vnd.github+json" },
    signal: AbortSignal.timeout(requestTimeout),
  });
  if (!response.ok) {
    throw new Error(`GitHub repository request failed (${response.status})`);
  }
  const repository: unknown = await response.json();
  if (
    typeof repository !== "object" ||
    repository === null ||
    !("stargazers_count" in repository)
  ) {
    throw new Error("GitHub returned an invalid star count");
  }
  const count = repository.stargazers_count;
  if (typeof count !== "number" || !Number.isSafeInteger(count) || count < 0) {
    throw new Error("GitHub returned an invalid star count");
  }
  return count;
};
