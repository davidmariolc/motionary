const prepareBrandIntro = () => {
  // eslint-disable-next-line unicorn/consistent-function-scoping -- The serialized bootstrap must contain all of its dependencies.
  const prepareIntro = () => {
    const { pathname, search, hash } = window.location;
    const parameters = new URLSearchParams(search);
    const [navigation] = performance.getEntriesByType("navigation");
    const hasFilters =
      Boolean(parameters.get("q")) ||
      (parameters.has("category") && parameters.get("category") !== "all");
    const isHomepage = /^\/(?:en|es)?\/?$/u.test(pathname);
    const isDeepLink = Boolean(hash) || hasFilters || Boolean(window.scrollY);
    const isHistoryTraversal =
      navigation && "type" in navigation && navigation.type === "back_forward";
    const isRestoring =
      isHistoryTraversal ||
      Boolean(sessionStorage.getItem("motionary:library:v1"));
    const hasSeenIntro = Boolean(sessionStorage.getItem("motionary:intro:v1"));
    if (!isHomepage || isDeepLink || isRestoring || hasSeenIntro) {
      return;
    }

    sessionStorage.setItem("motionary:intro:v1", "seen");
    const root = document.documentElement;
    root.dataset.brandIntro = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
      ? "reduced"
      : "pending";

    const watchdogDelay = 4000;
    window.setTimeout(() => {
      if (!root.dataset.brandIntro) {
        return;
      }

      delete root.dataset.brandIntro;
      window.dispatchEvent(new Event("motionary:intro-timeout"));
    }, watchdogDelay);
  };
  try {
    prepareIntro();
  } catch {
    // The page stays visible when session storage is unavailable.
  }
};

// This self-contained function executes in the head, before the body can paint.
// eslint-disable-next-line unicorn/no-top-level-side-effects -- Serializes trusted code without executing the browser-only function.
export const brandIntroBootstrap = `(${prepareBrandIntro.toString()})();`;
