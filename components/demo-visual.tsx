import { useTranslations } from "next-intl";

const TextAndShapeVisual = ({ id }: { readonly id: string }) => {
  const t = useTranslations("Visual");
  switch (id) {
    case "typewriter": {
      return (
        <div className="type-composition">
          <span className="terminal-label">{t("nextIdea")}</span>
          <div className="type-window">
            <span
              data-motion
              className="type-line"
              style={{ width: `${t("typeLine").length}ch` }}
            >
              {t("typeLine")}
            </span>
            <span data-motion className="type-caret" />
          </div>
        </div>
      );
    }
    case "count-up": {
      return (
        <div className="counter-composition">
          <span className="counter-value" data-motion data-count>
            100
          </span>
          <span className="counter-unit">%</span>
          <span className="counter-label">{t("everyDay")}</span>
        </div>
      );
    }
    case "word-reveal": {
      return (
        <div className="word-composition">
          {[t("wordOne"), t("wordTwo"), t("wordThree"), t("wordFour")].map(
            (word) => {
              return (
                <span key={word} data-motion>
                  {word}
                </span>
              );
            }
          )}
        </div>
      );
    }
    case "ticker": {
      return (
        <div className="ticker-composition">
          <div data-motion>
            {t("ideas")} <span>✳</span> {t("makeMove")} <span>✳</span>{" "}
            {t("ideas")}
          </div>
        </div>
      );
    }
    case "highlight": {
      return (
        <div className="highlight-composition">
          {t("highlightLead")}
          <br />
          <span className="highlight-phrase">
            <i data-motion />
            <span>{t("highlightPhrase")}</span>
          </span>
        </div>
      );
    }
    case "text-swap": {
      return (
        <div className="swap-composition">
          <span className="terminal-label">{t("makeIt")}</span>
          <div className="swap-window">
            <div data-motion className="swap-words">
              <span>{t("simple")}</span>
              <span>{t("moving")}</span>
            </div>
          </div>
        </div>
      );
    }
    case "draw-on": {
      return (
        <svg
          className="draw-composition"
          viewBox="0 0 240 130"
          aria-hidden="true"
        >
          <path
            className="draw-guide"
            d="M15 100C40 100 25 25 68 30S103 118 133 77 157 13 182 33 203 103 225 45"
          />
          <path
            data-motion
            pathLength="1"
            className="draw-path"
            d="M15 100C40 100 25 25 68 30S103 118 133 77 157 13 182 33 203 103 225 45"
          />
          <circle cx="15" cy="100" r="4" />
        </svg>
      );
    }
    case "mask-reveal": {
      return (
        <div data-motion className="mask-composition">
          <div className="mask-circle" />
          <div className="mask-grid" />
          <span>
            {t("look")}
            <br />
            {t("closer")}
          </span>
        </div>
      );
    }
    case "wipe": {
      return (
        <div className="wipe-composition">
          <span>{t("before")}</span>
          <div data-motion className="wipe-after">
            <span>{t("after")}</span>
          </div>
        </div>
      );
    }
    case "punch-zoom": {
      return (
        <div className="punch-viewport">
          <div data-motion className="punch-composition">
            <span className="punch-caption">{t("bigPicture")}</span>
            <strong>{t("million")}</strong>
            <span>{t("counting")}</span>
            <i />
          </div>
        </div>
      );
    }
    case "bar-grow": {
      return (
        <div className="bar-composition">
          <div className="bar-label">
            <span>{t("progress")}</span>
            <span>100%</span>
          </div>
          <div className="bar-track">
            <div data-motion />
          </div>
          <div className="bar-ticks">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
        </div>
      );
    }
    case "morph": {
      return (
        <div className="morph-composition">
          <div className="morph-outline" />
          <div data-motion className="motion-square" />
          <span>{t("morph")}</span>
        </div>
      );
    }
    default: {
      return <div data-motion className="motion-square" />;
    }
  }
};
export const DemoVisual = ({ id }: { readonly id: string }) => {
  const t = useTranslations("Visual");
  switch (id) {
    case "fade-in": {
      return (
        <div className="fade-composition">
          <div className="ghost-square" />
          <div data-motion className="motion-square fade-square" />
          <div className="ghost-square" />
        </div>
      );
    }
    case "slide-in": {
      return (
        <div className="slide-composition">
          <div className="slide-guide" />
          <div className="slide-arrow" aria-hidden="true">
            ↑
          </div>
          <div data-motion className="motion-square" />
        </div>
      );
    }
    case "pop-in": {
      return (
        <div className="pop-composition">
          <span className="pop-mark mark-one" />
          <span className="pop-mark mark-two" />
          <span className="pop-mark mark-three" />
          <span className="pop-mark mark-four" />
          <div data-motion className="motion-square" />
        </div>
      );
    }
    case "scale-up": {
      return (
        <div className="scale-composition">
          <div className="scale-outline outline-small" />
          <div className="scale-outline outline-large" />
          <div data-motion className="motion-square" />
        </div>
      );
    }
    case "blur-in": {
      return (
        <div className="blur-composition">
          <div className="blur-ghost" />
          <div data-motion className="motion-square" />
        </div>
      );
    }
    case "stagger": {
      return (
        <div className="stagger-composition">
          {[0, 1, 2, 3].map((item) => {
            const key = `stagger-${item}`;
            return <div key={key} data-motion className="stagger-block" />;
          })}
        </div>
      );
    }
    case "overshoot":
    case "elastic": {
      return (
        <div className="track-composition">
          <div className="motion-track" />
          <span className="track-start" />
          <span className="track-end" />
          <div data-motion className="motion-square" />
        </div>
      );
    }
    case "bounce": {
      return (
        <div className="bounce-composition">
          <div data-motion className="motion-square" />
          <div className="floor-line" />
        </div>
      );
    }
    case "spring": {
      return (
        <div className="spring-composition">
          <div className="spring-anchor" />
          <svg
            data-motion
            className="spring-coil"
            viewBox="0 0 24 64"
            aria-hidden="true"
          >
            <path
              d="M12 0 4 8 20 16 4 24 20 32 4 40 20 48 12 56v8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          <div data-motion className="motion-square" />
        </div>
      );
    }
    case "ease-in-out": {
      return (
        <div className="ease-composition">
          <div>
            <span>{t("linear")}</span>
            <div className="ease-track">
              <i data-motion />
            </div>
          </div>
          <div>
            <span>ease-in-out</span>
            <div className="ease-track">
              <i data-motion />
            </div>
          </div>
        </div>
      );
    }
    case "pulse": {
      return (
        <div className="pulse-composition">
          <div className="pulse-grid" />
          <div data-motion className="pulse-ring" />
          <div data-motion className="pulse-dot" />
        </div>
      );
    }
    default: {
      return <TextAndShapeVisual id={id} />;
    }
  }
};
