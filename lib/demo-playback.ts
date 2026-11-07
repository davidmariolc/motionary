export type DemoPlaybackState = "idle" | "playing" | "paused" | "finished";

export const createDemoPlayback = ({
  createAnimations,
  counter,
  duration,
  reducedMotion,
  pageVisible,
  onStateChange,
}: {
  readonly createAnimations: () => Animation[];
  readonly counter: HTMLElement | null;
  readonly duration: number;
  readonly reducedMotion: boolean;
  readonly pageVisible: boolean;
  readonly onStateChange: (state: DemoPlaybackState) => void;
}) => {
  let hasReducedMotion = reducedMotion;
  let isPageVisible = pageVisible;
  let group: Animation[] = [];
  let frame = 0;
  let state: DemoPlaybackState = "idle";
  let speed = 1;
  let isVisible = false;
  let isManuallyPaused = false;
  let isRequested = !reducedMotion;
  let isDestroyed = false;

  const setState = (next: DemoPlaybackState) => {
    if (state === next) {
      return;
    }

    state = next;
    onStateChange(next);
  };
  const updateCounter = () => {
    const [animation] = group;
    if (!animation || !counter) {
      return;
    }
    const delay = animation.effect?.getTiming().delay ?? 0;
    const progress = Math.min(
      1,
      Math.max(0, (Number(animation.currentTime) - delay) / duration)
    );
    counter.textContent = String(Math.round(100 * (1 - (1 - progress) ** 3)));
    if (state === "playing") {
      frame = requestAnimationFrame(updateCounter);
    }
  };
  const suspend = () => {
    if (state !== "playing") {
      return;
    }
    for (const animation of group) {
      if (animation.playState !== "finished") {
        animation.pause();
      }
    }
    cancelAnimationFrame(frame);
    setState("paused");
  };
  const reset = () => {
    cancelAnimationFrame(frame);
    for (const animation of group) {
      animation.pause();
      animation.currentTime = 0;
    }
    if (counter) {
      counter.textContent = "0";
    }
  };
  const resume = () => {
    for (const animation of group) {
      animation.updatePlaybackRate(speed);
      if (animation.playState !== "finished") {
        animation.play();
      }
    }
    setState("playing");
    cancelAnimationFrame(frame);
    updateCounter();
  };
  const onFinish = () => {
    if (isDestroyed || group.at(-1)?.playState !== "finished") {
      return;
    }
    cancelAnimationFrame(frame);
    if (counter) {
      counter.textContent = "100";
    }
    if (isRequested && !hasReducedMotion && isVisible && isPageVisible) {
      reset();
      resume();
    } else {
      if (hasReducedMotion) {
        isRequested = false;
      }
      setState("finished");
    }
  };
  const reconcile = () => {
    if (isDestroyed) {
      return;
    }
    if (!isRequested || !isVisible || !isPageVisible) {
      suspend();
      return;
    }
    if (state === "playing") {
      return;
    }
    if (group.length === 0) {
      group = createAnimations();
      // The last element includes the full stagger and the end pause.
      const leader = group.at(-1);
      if (!leader) {
        return;
      }
      leader.onfinish = onFinish;
      reset();
    } else if (state === "finished") {
      reset();
    }
    resume();
  };

  return {
    destroy: () => {
      isDestroyed = true;
      cancelAnimationFrame(frame);
      for (const animation of group) {
        animation.onfinish = null;
        animation.cancel();
      }
      group = [];
    },
    pause: () => {
      isManuallyPaused = true;
      isRequested = false;
      suspend();
    },
    play: (shouldRestart = false) => {
      isManuallyPaused = false;
      isRequested = true;
      if (shouldRestart) {
        suspend();
        reset();
      }
      reconcile();
    },
    setPageVisible: (isActive: boolean) => {
      isPageVisible = isActive;
      reconcile();
    },
    setReducedMotion: (shouldReduce: boolean) => {
      hasReducedMotion = shouldReduce;
      isRequested = !shouldReduce && !isManuallyPaused;
      reconcile();
    },
    setSpeed: (value: number) => {
      speed = value;
      for (const animation of group) {
        animation.updatePlaybackRate(value);
      }
    },
    setVisible: (isActive: boolean) => {
      isVisible = isActive;
      reconcile();
    },
  };
};
