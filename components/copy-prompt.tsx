"use client";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icon";

export const CopyPrompt = ({ text }: { readonly text: string }) => {
  const t = useTranslations("Prompt");
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const resetLater = () => {
    timer.current = setTimeout(
      () => setStatus((current) => (current === "copied" ? "idle" : current)),
      2500
    );
  };
  const copy = async () => {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    resetLater();
  };
  return (
    <section className="prompt-section" aria-labelledby="prompt-title">
      <div className="prompt-heading">
        <h2 id="prompt-title">{t("title")}</h2>
        <span className="mono">{t("ready")}</span>
      </div>
      <div className="prompt-box">
        <span className="prompt-symbol" aria-hidden="true">
          ↳
        </span>
        <p>{text}</p>
      </div>
      <div className="prompt-actions">
        <span>{t("hint")}</span>
        <button type="button" className="button primary-button" onClick={copy}>
          <Icon name={status === "copied" ? "check" : "copy"} />
          {t(status === "copied" ? "copied" : "copy")}
        </button>
      </div>
      <output
        className={status === "failed" ? "copy-status copy-error" : "sr-only"}
        aria-live="polite"
      >
        {status === "copied" ? t("success") : ""}
        {status === "failed" ? t("failure") : ""}
      </output>
    </section>
  );
};
