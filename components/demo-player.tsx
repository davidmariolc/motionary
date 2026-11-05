"use client";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  claimPlayback,
  createDemoAnimations,
  releasePlayback,
} from "@/lib/demo-animation";
import { DemoVisual } from "@/components/demo-visual";
import { Icon } from "@/components/icon";
import type { AnimationEntry } from "@/lib/animations";

export const DemoPlayer = ({
  entry,
  large = false,
}: {
  readonly entry: AnimationEntry;
  readonly large?: boolean;
}) => {
  type PlaybackState = "idle" | "playing" | "paused" | "finished";
  const stage = useRef<HTMLElement>(null);
  const group = useRef<Animation[]>([]);
  const frame = useRef(0);
  const [state, setState] = useState<PlaybackState>("idle");
  const [speed, setSpeed] = useState(1);
  const speedId = useId();
  const stageId = useId();
  const pause = useCallback(() => {
    for (const animation of group.current) {
      animation.pause();
    }
    cancelAnimationFrame(frame.current);
    setState((current) => (current === "playing" ? "paused" : current));
  }, []);
  useEffect(() => {
    const element = stage.current;
    if (!element) {
      return () => {
        /*
        No observer was created.
        */
      };
    }
    const observer = new IntersectionObserver(
      ([record]) => {
        if (!record.isIntersecting) {
          pause();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(element);
    const onVisibility = () => {
      if (document.hidden) {
        pause();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", pause);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", pause);
      cancelAnimationFrame(frame.current);
      releasePlayback(pause);
      for (const animation of group.current) {
        animation.cancel();
      }
    };
  }, [pause]);
  const updateCounter = () => {
    const [animation] = group.current;
    const value = stage.current?.querySelector("[data-count]");
    if (!animation || !value) {
      return;
    }
    const progress = Math.min(
      1,
      Math.max(0, (Number(animation.currentTime) - 160) / entry.duration)
    );
    value.textContent = String(Math.round(100 * (1 - (1 - progress) ** 3)));
    if (animation.playState === "running") {
      frame.current = requestAnimationFrame(updateCounter);
    }
  };
  const play = (shouldRestart = false) => {
    if (!stage.current) {
      return;
    }
    claimPlayback(pause);
    if (shouldRestart || state === "idle" || state === "finished") {
      cancelAnimationFrame(frame.current);
      for (const animation of group.current) {
        animation.cancel();
      }
      group.current = createDemoAnimations(stage.current, entry);
      const leader = group.current.at(-1);
      if (leader) {
        leader.addEventListener(
          "finish",
          () => {
            setState("finished");
            releasePlayback(pause);
          },
          { once: true }
        );
      }
    }
    for (const animation of group.current) {
      animation.updatePlaybackRate(speed);
      animation.play();
    }
    setState("playing");
    if (entry.id === "count-up") {
      updateCounter();
    }
  };
  const changeSpeed = (value: number) => {
    setSpeed(value);
    for (const animation of group.current) {
      animation.updatePlaybackRate(value);
    }
  };
  const isPlaying = state === "playing";
  let label = "Play";
  if (isPlaying) {
    label = "Pause";
  } else if (state === "finished") {
    label = "Replay";
  }
  let icon: "pause" | "replay" | "play" = "play";
  if (isPlaying) {
    icon = "pause";
  } else if (state === "finished") {
    icon = "replay";
  }
  return (
    <div className={large ? "demo-player demo-player-large" : "demo-player"}>
      <figure
        id={stageId}
        ref={stage}
        className={`demo-stage demo-${entry.id}`}
        aria-label={`${entry.name}: ${entry.description}`}
      >
        <div className="stage-corner corner-tl" />
        <div className="stage-corner corner-br" />
        <span className="stage-number mono" aria-hidden="true">
          {String(entry.number).padStart(2, "0")}
        </span>
        <span className="stage-marker mono" aria-hidden="true">
          {large ? "Live preview" : "Motion study"}
        </span>
        <div className="demo-art" aria-hidden="true">
          <DemoVisual id={entry.id} />
        </div>
        {large ? (
          <span className="stage-bottom mono">
            {state === "idle"
              ? "Press play to explore"
              : `${state.toUpperCase()} · ${speed}×`}
          </span>
        ) : null}
      </figure>
      <div className="player-controls">
        <button
          type="button"
          className={large ? "button primary-button" : "preview-button"}
          onClick={() => {
            (isPlaying ? pause : play)();
          }}
          aria-label={`${label} ${entry.name}`}
          aria-controls={stageId}
        >
          <Icon name={icon} size={large ? 18 : 14} />
          <span>{label}</span>
        </button>
        {large ? (
          <>
            <button
              type="button"
              className="button replay-button"
              onClick={() => play(true)}
              aria-label={`Replay ${entry.name}`}
            >
              <Icon name="replay" />
              <span>Replay</span>
            </button>
            <div className="speed-control">
              <label htmlFor={speedId}>Speed</label>
              <select
                id={speedId}
                value={speed}
                onChange={(event) => changeSpeed(Number(event.target.value))}
              >
                {[0.5, 1, 1.5, 2].map((value) => {
                  return (
                    <option key={value} value={value}>
                      {value}×
                    </option>
                  );
                })}
              </select>
            </div>
          </>
        ) : (
          <span className="preview-hint mono">{entry.duration} MS</span>
        )}
      </div>
    </div>
  );
};
