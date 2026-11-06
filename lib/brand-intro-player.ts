import { fullScreenPolygon, getIntroGeometry } from "@/lib/brand-intro";

const flightStart = 1240;
const introDuration = 1920;
const interruptionEvents = [
  "pointerdown",
  "keydown",
  "focusin",
  "wheel",
  "touchstart",
  "scroll",
  "resize",
  "popstate",
  "hashchange",
  "pagehide",
  "motionary:intro-timeout",
] as const;

const prepareLogo = (logo: HTMLElement, target: HTMLElement): void => {
  const style = getComputedStyle(target);
  for (const property of [
    "font-family",
    "font-size",
    "font-weight",
    "letter-spacing",
    "line-height",
    "gap",
    "height",
  ]) {
    logo.style.setProperty(property, style.getPropertyValue(property));
  }
  const targetMark = target.querySelector("svg");
  const mark = logo.querySelector("svg");
  if (!targetMark || !mark) {
    return;
  }
  const { width, height } = targetMark.getBoundingClientRect();
  mark.style.width = `${width}px`;
  mark.style.height = `${height}px`;
};

const requireElement = <T extends Element>(
  parent: ParentNode,
  selector: string
): T => {
  const element = parent.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Missing brand introduction element: ${selector}`);
  }
  return element;
};

export const mountBrandIntro = (
  overlay: HTMLElement | null,
  pathname: string,
  isCurrentRun: () => boolean
): (() => void) | undefined => {
  const root = document.documentElement;
  if (!overlay || !root.dataset.brandIntro) {
    return undefined;
  }
  if (!/^\/(?:en|es)?\/?$/u.test(pathname)) {
    delete root.dataset.brandIntro;
    return undefined;
  }

  const animations: Animation[] = [];
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const controller = new AbortController();
  let isFinished = false;
  let revealTimer: ReturnType<typeof setTimeout> | undefined;
  let fontTimer: ReturnType<typeof setTimeout> | undefined;
  const finish = (): void => {
    if (isFinished) {
      return;
    }
    isFinished = true;
    delete root.dataset.brandIntro;
    clearTimeout(revealTimer);
    clearTimeout(fontTimer);
    controller.abort();
    for (const animation of animations) {
      animation.cancel();
    }
  };
  for (const event of interruptionEvents) {
    window.addEventListener(event, finish, {
      capture: true,
      passive: true,
      signal: controller.signal,
    });
  }
  media.addEventListener("change", finish, { signal: controller.signal });

  const animate = (
    element: Element,
    frames: Keyframe[],
    options: KeyframeAnimationOptions,
    name: string
  ): Animation => {
    const animation = element.animate(frames, { fill: "both", ...options });
    animation.id = `brand-intro:${name}`;
    animations.push(animation);
    return animation;
  };

  const start = (): void => {
    const target = requireElement<HTMLElement>(
      document,
      ".header-inner > .brand"
    );
    const logo = requireElement<HTMLElement>(overlay, ".intro-logo");
    const surface = requireElement<HTMLElement>(overlay, ".intro-surface");
    const backdrop = requireElement<HTMLElement>(overlay, ".intro-backdrop");
    const word = requireElement(logo, ".brand-word");
    const dot = requireElement(logo, ".brand-dot");
    const mark = requireElement(target, "svg");
    const introMark = requireElement(logo, "svg");

    prepareLogo(logo, target);
    const geometry = getIntroGeometry(
      target.getBoundingClientRect(),
      mark.getBoundingClientRect(),
      window.innerWidth,
      window.innerHeight
    );
    const styles = getComputedStyle(root);
    const easeOut = styles.getPropertyValue("--ease-out").trim();
    const easeInOut = styles.getPropertyValue("--ease-in-out").trim();
    root.dataset.brandIntro = "running";
    logo.style.transform = geometry.start;
    logo.style.visibility = "visible";
    surface.style.transformOrigin = `${window.innerWidth / 2}px ${window.innerHeight / 2}px`;

    animate(
      surface,
      [{ clipPath: fullScreenPolygon }, { clipPath: geometry.polygon }],
      {
        delay: 120,
        duration: 760,
        easing: easeInOut,
      },
      "morph"
    );
    animate(
      surface,
      [
        { transform: "translate(0px, 0px) scale(1)" },
        { transform: geometry.surfaceCenter },
      ],
      {
        delay: 820,
        duration: 360,
        easing: easeInOut,
      },
      "surface-center"
    );
    animate(
      surface,
      [{ opacity: 1 }, { opacity: 0 }],
      {
        duration: 880,
        easing: "steps(1, end)",
      },
      "surface-handoff"
    );
    animate(
      introMark,
      [{ opacity: 0 }, { opacity: 1 }],
      {
        duration: 880,
        easing: "steps(1, end)",
      },
      "mark-handoff"
    );
    animate(
      logo,
      [{ transform: geometry.start }, { transform: geometry.center }],
      {
        delay: 820,
        duration: 360,
        easing: easeInOut,
        fill: "forwards",
      },
      "center"
    );
    animate(
      word,
      [
        { clipPath: "inset(0 100% 0 0)", opacity: 0 },
        { clipPath: "inset(0 0% 0 0)", opacity: 1 },
      ],
      {
        delay: 820,
        duration: 360,
        easing: easeOut,
      },
      "word"
    );
    animate(
      dot,
      [{ opacity: 0 }, { opacity: 1 }],
      {
        delay: 1080,
        duration: 160,
        easing: easeOut,
      },
      "dot"
    );
    animate(
      backdrop,
      [{ opacity: 1 }, { opacity: 0 }],
      {
        delay: flightStart,
        duration: 400,
        easing: easeOut,
      },
      "page-reveal"
    );
    const flight = animate(
      logo,
      [{ transform: geometry.center }, { transform: geometry.destination }],
      {
        delay: flightStart,
        duration: introDuration - flightStart,
        easing: easeInOut,
        fill: "forwards",
      },
      "flight"
    );
    // One shared start time keeps the mask and SVG handoff on the same frame.
    const startTime = document.timeline.currentTime;
    if (startTime !== null) {
      for (const animation of animations) {
        animation.startTime = startTime;
      }
    }
    revealTimer = setTimeout(() => {
      root.dataset.brandIntro = "revealing";
    }, flightStart);
    flight.onfinish = finish;
  };

  const startWhenReady = async (): Promise<void> => {
    if (media.matches || root.dataset.brandIntro === "reduced") {
      root.dataset.brandIntro = "reduced";
      for (const element of document.querySelectorAll(
        ".site-header, main, .site-footer"
      )) {
        const fade = animate(
          element,
          [{ opacity: 0 }, { opacity: 1 }],
          { duration: 150 },
          "reduced"
        );
        fade.onfinish = finish;
      }
      return;
    }
    fontTimer = setTimeout(finish, 600);
    await document.fonts.ready;
    clearTimeout(fontTimer);
    if (controller.signal.aborted || !root.dataset.brandIntro) {
      return;
    }
    start();
  };
  const begin = async (): Promise<void> => {
    try {
      await startWhenReady();
    } catch {
      finish();
    }
  };
  void begin();

  return () => {
    clearTimeout(revealTimer);
    clearTimeout(fontTimer);
    controller.abort();
    for (const animation of animations) {
      animation.cancel();
    }
    // Strict Mode immediately mounts again; a real unmount must reveal the page.
    queueMicrotask(() => {
      if (isCurrentRun()) {
        delete root.dataset.brandIntro;
      }
    });
  };
};
