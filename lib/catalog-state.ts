const storageKey = "motionary:library:v1";
const filtersEvent = "motionary:filters";
export const rememberCatalog = () => {
  if (!/^\/(?:en|es)?\/?$/u.test(window.location.pathname)) {
    return;
  }
  const data = JSON.stringify({
    scroll: window.scrollY,
    search: window.location.search,
  });
  try {
    sessionStorage.setItem(storageKey, data);
  } catch {
    /*
    Session storage is optional.
    */
  }
};
const readCatalog = (): unknown => {
  let raw: string | null;
  try {
    raw = sessionStorage.getItem(storageKey);
  } catch {
    return null;
  }
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};
const clearCatalog = () => {
  try {
    sessionStorage.removeItem(storageKey);
  } catch {
    /*
    Session storage is optional.
    */
  }
};
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;
export const restoreCatalog = () => {
  const saved = readCatalog();
  clearCatalog();
  if (!isRecord(saved)) {
    return;
  }
  const { search, scroll } = saved;
  if (typeof search !== "string" || typeof scroll !== "number") {
    return;
  }
  if (window.location.search && window.location.search !== search) {
    return;
  }
  if (!window.location.search && search.startsWith("?")) {
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${search}${window.location.hash}`
    );
    window.dispatchEvent(new Event(filtersEvent));
  }
  if (window.location.hash) {
    return;
  }
  requestAnimationFrame(() =>
    requestAnimationFrame(() => window.scrollTo(0, scroll))
  );
};
