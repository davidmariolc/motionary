import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { createTranslator } from "next-intl";
import {
  animations,
  filterAnimations,
  getAnimationEntries,
} from "../lib/animations.ts";
import { createDemoAnimations } from "../lib/demo-animation.ts";

const emptyLength = 0;
const minimumCopyLength = 40;
const lineIndex = 0;
const caretIndex = 1;
const initialFrame = 0;

const readMessages = (locale) => {
  return JSON.parse(
    readFileSync(
      new URL(`../messages/${locale}.json`, import.meta.url),
      "utf-8"
    )
  );
};
const messageKeys = (messages, prefix = "") => {
  return Object.entries(messages).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "string" ? path : messageKeys(value, path);
  });
};
const failOnError = (error) => {
  throw error;
};

test("English and Spanish have matching message keys and complete animation content", () => {
  const english = readMessages("en");
  const spanish = readMessages("es");
  assert.deepEqual(
    messageKeys(spanish).toSorted((left, right) => left.localeCompare(right)),
    messageKeys(english).toSorted((left, right) => left.localeCompare(right))
  );
  for (const locale of ["en", "es"]) {
    const t = createTranslator({
      locale,
      messages: readMessages(locale),
      namespace: "Animations",
      onError: failOnError,
    });
    const entries = getAnimationEntries(t);
    assert.equal(entries.length, animations.length);
    for (const entry of entries) {
      assert.ok(entry.name.length > emptyLength);
      assert.ok(entry.description.length > emptyLength);
      assert.ok(entry.prompt.length > minimumCopyLength);
      assert.ok(entry.explanation.length > minimumCopyLength);
      assert.ok(entry.usage.length > minimumCopyLength);
    }
  }
});

test("Spanish search accepts accents and the original English motion names", () => {
  const t = createTranslator({
    locale: "es",
    messages: readMessages("es"),
    namespace: "Animations",
    onError: failOnError,
  });
  const entries = getAnimationEntries(t);
  for (const query of ["elastico", "ELÁSTICO", "rubber band"]) {
    assert.deepEqual(
      filterAnimations(entries, query, "rhythm").map((entry) => entry.id),
      ["elastic"]
    );
  }
  assert.deepEqual(
    filterAnimations(entries, "fade in", "entrances").map((entry) => entry.id),
    ["fade-in"]
  );
});

test("localized ICU messages render counts, rich headings, and search values", () => {
  for (const locale of ["en", "es"]) {
    const t = createTranslator({
      locale,
      messages: readMessages(locale),
      onError: failOnError,
    });
    assert.match(t("Home.description", { count: 24 }), /24/u);
    assert.match(t("Catalog.otherMatches", { count: 1 }), /1/u);
    assert.match(t("Catalog.otherMatches", { count: 2 }), /2/u);
    assert.match(
      t.rich("Catalog.results", { count: 0, strong: (chunks) => chunks }),
      /0/u
    );
    assert.ok(
      t.rich("Home.heading", { accent: (chunks) => chunks, br: () => "\n" })
        .length > emptyLength
    );
    assert.ok(
      t("Catalog.forQuery", { query: "<script>" }).includes("<script>")
    );
  }
});

test("the typewriter timeline follows the translated text length", () => {
  for (const locale of ["en", "es"]) {
    const messages = readMessages(locale);
    const text = messages.Visual.typeLine;
    const calls = [];
    const pauses = [];
    const elements = [lineIndex, caretIndex].map(() => {
      return {
        animate: (frames, options) => {
          calls.push({ frames, options });
          return {
            pause: () => {
              pauses.push(true);
            },
          };
        },
      };
    });
    const stage = {
      querySelector: () => ({ textContent: text }),
      querySelectorAll: () => elements,
    };
    const entry = animations.find((item) => item.id === "typewriter");
    createDemoAnimations(stage, entry);
    assert.equal(pauses.length, elements.length);
    assert.equal(calls[lineIndex].options.easing, `steps(${text.length}, end)`);
    assert.equal(
      calls[caretIndex].frames[initialFrame].transform,
      `translateX(-${text.length}ch)`
    );
  }
});
