"use client";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { createDemoAnimations } from "@/lib/demo-animation";
import { createDemoPlayback } from "@/lib/demo-playback";
import { DemoVisual } from "@/components/demo-visual";
import { Icon } from "@/components/icon";
import type { DemoPlaybackState } from "@/lib/demo-playback";
import type { AnimationEntry } from "@/lib/animations";

export const DemoPlayer = ({
  entry,
  large = false,
}: {
  readonly entry: AnimationEntry;
  readonly large?: boolean;
}) => {
  const t = useTranslations("Player");
  const stage = useRef<HTMLElement>(null);
  const playback = useRef<ReturnType<typeof createDemoPlayback> | null>(null);
  const [state, setState] = useState<DemoPlaybackState>("idle");
  const [speed, setSpeed] = useState(1);
  const speedId = useId();
  const stageId = useId();
  useEffect(() => {
    const element = stage.current;
    if (!element) {
      return () => {
        // No player was created.
      };
    }
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    const player = createDemoPlayback({
      counter: element.querySelector<HTMLElement>("[data-count]"),
      createAnimations: () => createDemoAnimations(element, entry),
      duration: entry.duration,
      onStateChange: setState,
      pageVisible: !document.hidden,
      reducedMotion: motionPreference.matches,
    });
    playback.current = player;
    const observer = new IntersectionObserver(
      ([record]) => {
        player.setVisible(
          record.isIntersecting && record.intersectionRatio >= 0.05
        );
      },
      { threshold: 0.05 }
    );
    observer.observe(element);
    const onVisibility = () => player.setPageVisible(!document.hidden);
    const onPageHide = () => player.setPageVisible(false);
    const onMotionPreference = () =>
      player.setReducedMotion(motionPreference.matches);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("pageshow", onVisibility);
    motionPreference.addEventListener("change", onMotionPreference);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("pageshow", onVisibility);
      motionPreference.removeEventListener("change", onMotionPreference);
      player.destroy();
      playback.current = null;
    };
  }, [entry]);
  useEffect(() => {
    playback.current?.setSpeed(speed);
  }, [entry, speed]);
  const isPlaying = state === "playing";
  const stageStatus = state === "idle" ? t("idle") : `${t(state)} · ${speed}×`;
  let label = t("play");
  if (isPlaying) {
    label = t("pause");
  } else if (state === "finished") {
    label = t("replay");
  } else if (state === "paused") {
    label = t("resume");
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
          {t(large ? "live" : "study")}
        </span>
        <div className="demo-art" aria-hidden="true">
          <DemoVisual id={entry.id} />
        </div>
        {large ? (
          <output className="stage-bottom mono" aria-live="polite">
            {stageStatus}
          </output>
        ) : null}
      </figure>
      <div className="player-controls">
        <button
          type="button"
          className={large ? "button primary-button" : "preview-button"}
          onClick={() => {
            if (isPlaying) {
              playback.current?.pause();
            } else {
              playback.current?.play();
            }
          }}
          aria-label={t("action", { action: label, name: entry.name })}
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
              onClick={() => playback.current?.play(true)}
              aria-label={t("restartLabel", { name: entry.name })}
            >
              <Icon name="replay" />
              <span>{t("restart")}</span>
            </button>
            <div className="speed-control">
              <label htmlFor={speedId}>{t("speed")}</label>
              <select
                id={speedId}
                aria-label={t("playbackSpeed")}
                value={speed}
                onChange={(event) => setSpeed(Number(event.target.value))}
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
