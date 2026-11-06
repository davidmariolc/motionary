const textCategory = "text-numbers";
const shapesCategory = "shapes-transitions";
export const categories = [
  { icon: "enter", id: "entrances" },
  { icon: "wave", id: "rhythm" },
  { icon: "text", id: textCategory },
  { icon: "shapes", id: shapesCategory },
] as const;
export type CategoryId = (typeof categories)[number]["id"];
export interface AnimationEntry {
  id: string;
  number: number;
  name: string;
  category: CategoryId;
  description: string;
  explanation: string;
  usage: string;
  synonyms: string;
  prompt: string;
  duration: number;
}
export const animations = [
  { category: "entrances", duration: 400, id: "fade-in", number: 1 },
  { category: "entrances", duration: 700, id: "slide-in", number: 2 },
  { category: "entrances", duration: 700, id: "pop-in", number: 3 },
  { category: "entrances", duration: 700, id: "scale-up", number: 4 },
  { category: "entrances", duration: 900, id: "blur-in", number: 5 },
  { category: "entrances", duration: 500, id: "stagger", number: 6 },
  { category: "rhythm", duration: 1000, id: "overshoot", number: 7 },
  { category: "rhythm", duration: 1300, id: "bounce", number: 8 },
  { category: "rhythm", duration: 1500, id: "spring", number: 9 },
  { category: "rhythm", duration: 1400, id: "ease-in-out", number: 10 },
  { category: "rhythm", duration: 1600, id: "elastic", number: 11 },
  { category: "rhythm", duration: 1100, id: "pulse", number: 12 },
  { category: textCategory, duration: 1500, id: "typewriter", number: 13 },
  { category: textCategory, duration: 1600, id: "count-up", number: 14 },
  { category: textCategory, duration: 450, id: "word-reveal", number: 15 },
  { category: textCategory, duration: 2600, id: "ticker", number: 16 },
  { category: textCategory, duration: 1000, id: "highlight", number: 17 },
  { category: textCategory, duration: 1000, id: "text-swap", number: 18 },
  { category: shapesCategory, duration: 1600, id: "draw-on", number: 19 },
  { category: shapesCategory, duration: 1100, id: "mask-reveal", number: 20 },
  { category: shapesCategory, duration: 1200, id: "wipe", number: 21 },
  { category: shapesCategory, duration: 800, id: "punch-zoom", number: 22 },
  { category: shapesCategory, duration: 1200, id: "bar-grow", number: 23 },
  { category: shapesCategory, duration: 1400, id: "morph", number: 24 },
] as const;

export const getAnimationEntries = (
  translate: (key: string) => string
): AnimationEntry[] => {
  return animations.map((entry) => {
    return {
      ...entry,
      description: translate(`${entry.id}.description`),
      explanation: translate(`${entry.id}.explanation`),
      name: translate(`${entry.id}.name`),
      prompt: translate(`${entry.id}.prompt`),
      synonyms: translate(`${entry.id}.synonyms`),
      usage: translate(`${entry.id}.usage`),
    };
  });
};
export const getCategory = (id: CategoryId) =>
  categories.find((category) => category.id === id) ?? categories[0];
const normalizeSearch = (value: string) => {
  return value
    .normalize("NFD")
    .replaceAll(/[\u{300}-\u{36F}]/gu, "")
    .toLowerCase();
};
export const filterAnimations = (
  entries: AnimationEntry[],
  query: string,
  category: string
) => {
  const words = normalizeSearch(query).trim().split(/\s+/u).filter(Boolean);
  return entries.filter((entry) => {
    return (
      (category === "all" || entry.category === category) &&
      words.every((word) => {
        return normalizeSearch(
          `${entry.name} ${entry.description} ${entry.synonyms}`
        ).includes(word);
      })
    );
  });
};
