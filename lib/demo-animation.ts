import type { AnimationEntry } from "@/lib/animations";

const linear = "linear";
const easeInOutNative = "ease-in-out";
const restHorizontalTransform = "translateX(0)";
const restTransform = "translateY(0)";
const easeOut = "cubic-bezier(0.23, 1, 0.32, 1)";
const easeInOut = "cubic-bezier(0.77, 0, 0.175, 1)";
const translateX = (values: number[]): Keyframe[] =>
  values.map((value) => ({ transform: `translateX(${value}px)` }));
const translateY = (values: number[]): Keyframe[] =>
  values.map((value) => ({ transform: `translateY(${value}px)` }));
const getTextAndShapeFrames = (
  id: string,
  index: number,
  characterCount: number
): Keyframe[] => {
  switch (id) {
    case "typewriter": {
      return index === 0
        ? [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)" }]
        : [
            { transform: `translateX(-${characterCount}ch)` },
            { transform: restHorizontalTransform },
          ];
    }
    case "count-up": {
      return [{ opacity: 1 }, { opacity: 1 }];
    }
    case "word-reveal": {
      return [
        { opacity: 0, transform: "translateY(18px)" },
        { opacity: 1, transform: restTransform },
      ];
    }
    case "ticker": {
      return [
        { transform: "translateX(18%)" },
        { transform: "translateX(-58%)" },
      ];
    }
    case "highlight": {
      return [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }];
    }
    case "text-swap": {
      return [{ transform: restTransform }, { transform: "translateY(-50%)" }];
    }
    case "draw-on": {
      return [{ strokeDashoffset: "1" }, { strokeDashoffset: "0" }];
    }
    case "mask-reveal": {
      return [
        { clipPath: "circle(0% at 50% 50%)" },
        { clipPath: "circle(75% at 50% 50%)" },
      ];
    }
    case "wipe": {
      return [
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)" },
      ];
    }
    case "punch-zoom": {
      return [
        { offset: 0, transform: "scale(1)" },
        { offset: 0.35, transform: "scale(1.3)" },
        { offset: 1, transform: "scale(1)" },
      ];
    }
    case "bar-grow": {
      return [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }];
    }
    case "morph": {
      return [
        { borderRadius: "8%", transform: "rotate(0deg)" },
        { borderRadius: "50%", transform: "rotate(90deg)" },
      ];
    }
    default: {
      return [{ opacity: 0 }, { opacity: 1 }];
    }
  }
};
const getFrames = (
  id: string,
  index: number,
  characterCount: number
): Keyframe[] => {
  switch (id) {
    case "fade-in": {
      return [{ opacity: 0 }, { opacity: 1 }];
    }
    case "slide-in": {
      return [
        { opacity: 0, transform: "translateY(64px)" },
        { opacity: 1, transform: restTransform },
      ];
    }
    case "pop-in": {
      return [
        { offset: 0, opacity: 0, transform: "scale(0.7)" },
        { offset: 0.65, opacity: 1, transform: "scale(1.12)" },
        { offset: 1, transform: "scale(1)" },
      ];
    }
    case "scale-up": {
      return [
        { opacity: 0, transform: "scale(0.55)" },
        { opacity: 1, transform: "scale(1)" },
      ];
    }
    case "blur-in": {
      return [
        { filter: "blur(18px)", opacity: 0 },
        { filter: "blur(0)", opacity: 1 },
      ];
    }
    case "stagger": {
      return [
        { opacity: 0, transform: "translateY(30px)" },
        { opacity: 1, transform: restTransform },
      ];
    }
    case "overshoot": {
      return translateX([-90, 22, 0]);
    }
    case "elastic": {
      return translateX([-90, 38, -24, 14, -7, 3, 0]);
    }
    case "bounce": {
      return translateY([-80, 30, -24, 30, 3, 30, 20, 30]);
    }
    case "spring": {
      return index === 0
        ? [1.9, 0.65, 1.25, 0.86, 1.07, 1].map((value) => {
            return {
              transform: `scaleY(${value})`,
            };
          })
        : translateY([60, -24, 17, -9, 5, 0]);
    }
    case easeInOutNative: {
      return [
        { transform: restHorizontalTransform },
        { transform: "translateX(170px)" },
      ];
    }
    case "pulse": {
      return index === 0
        ? [
            { opacity: 0.7, transform: "scale(1)" },
            { opacity: 0, transform: "scale(2.2)" },
          ]
        : [
            { transform: "scale(1)" },
            { transform: "scale(1.18)" },
            { transform: "scale(1)" },
          ];
    }
    default: {
      return getTextAndShapeFrames(id, index, characterCount);
    }
  }
};
const getEasing = (id: string, index: number, characterCount: number) => {
  if (id === "typewriter") {
    return `steps(${characterCount}, end)`;
  }
  if (
    id === "ticker" ||
    id === "count-up" ||
    (id === easeInOutNative && index === 0)
  ) {
    return linear;
  }
  if (
    [
      easeInOutNative,
      "highlight",
      "text-swap",
      "draw-on",
      "wipe",
      "morph",
      "pulse",
    ].includes(id)
  ) {
    return easeInOut;
  }
  if (["bounce", "elastic", "spring", "overshoot"].includes(id)) {
    return easeInOutNative;
  }
  return easeOut;
};
export const createDemoAnimations = (
  stage: HTMLElement,
  entry: AnimationEntry
): Animation[] => {
  const characterCount =
    stage.querySelector(".type-line")?.textContent?.length ?? 1;
  return [
    ...stage.querySelectorAll<HTMLElement | SVGElement>("[data-motion]"),
  ].map((element, index) => {
    let stagger = entry.id === "stagger" ? index * 130 : 0;
    if (entry.id === "word-reveal") {
      stagger = index * 230;
    }
    const animation = element.animate(
      getFrames(entry.id, index, characterCount),
      {
        delay: 160 + stagger,
        duration: entry.duration,
        easing: getEasing(entry.id, index, characterCount),
        endDelay: 240,
        fill: "both",
      }
    );
    animation.pause();
    return animation;
  });
};
const playback: {
  pause: (() => void) | null;
} = { pause: null };
export const claimPlayback = (pause: () => void) => {
  if (playback.pause !== pause) {
    playback.pause?.();
  }
  playback.pause = pause;
};
export const releasePlayback = (pause: () => void) => {
  if (playback.pause === pause) {
    playback.pause = null;
  }
};
