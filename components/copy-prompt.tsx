"use client";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icon";

export const CopyPrompt = ({ text }: { readonly text: string }) => {
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
        <h2 id="prompt-title">Take the words with you.</h2>
        <span className="mono">READY FOR YOUR NEXT PROMPT</span>
      </div>
      <div className="prompt-box">
        <span className="prompt-symbol" aria-hidden="true">
          ↳
        </span>
        <p>{text}</p>
      </div>
      <div className="prompt-actions">
        <span>Copy it. Tweak it. Make it yours.</span>
        <button type="button" className="button primary-button" onClick={copy}>
          <Icon name={status === "copied" ? "check" : "copy"} />
          {status === "copied" ? "Copied!" : "Copy prompt"}
        </button>
      </div>
      <output
        className={status === "failed" ? "copy-status copy-error" : "sr-only"}
        aria-live="polite"
      >
        {status === "copied" ? "Copied! Prompt copied to clipboard." : ""}
        {status === "failed"
          ? "Copy was unavailable. Select the prompt above and copy it manually."
          : ""}
      </output>
    </section>
  );
};
