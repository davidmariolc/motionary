import assert from "node:assert/strict";
import { test } from "node:test";
import { createTranslator } from "next-intl";
import englishMessages from "../messages/en.json" with { type: "json" };
import {
  categories,
  filterAnimations,
  getAnimationEntries,
} from "../lib/animations.ts";
import { claimPlayback, releasePlayback } from "../lib/demo-animation.ts";

const animations = getAnimationEntries(
  createTranslator({
    locale: "en",
    messages: englishMessages,
    namespace: "Animations",
  })
);

const expectedAnimations = 24;
const expectedCategorySize = 6;
const minimumCopyLength = 40;
const minimumDuration = 0;
const noPauses = 0;
const singlePause = 1;

test("every animation has a unique shareable identity and complete content", () => {
  assert.equal(animations.length, expectedAnimations);
  const identities = new Set(animations.map((entry) => entry.id));
  assert.equal(identities.size, animations.length);
  for (const entry of animations) {
    assert.match(entry.id, /^[a-z]+(?:-[a-z]+)*$/u);
    assert.ok(entry.prompt.length > minimumCopyLength);
    assert.ok(entry.explanation.length > minimumCopyLength);
    assert.ok(entry.duration > minimumDuration);
    assert.ok(categories.some((category) => category.id === entry.category));
  }
});
test("the initial collection has six entries in each category", () => {
  for (const category of categories) {
    assert.equal(
      filterAnimations(animations, "", category.id).length,
      expectedCategorySize
    );
  }
});
test("search combines category, case-insensitive names, and synonyms", () => {
  assert.deepEqual(
    filterAnimations(animations, "  RuBbEr BAND  ", "rhythm").map(
      (entry) => entry.id
    ),
    ["elastic"]
  );
  assert.deepEqual(
    filterAnimations(animations, "rubber band", "entrances"),
    []
  );
  assert.deepEqual(
    filterAnimations(animations, "FADE IN", "entrances").map(
      (entry) => entry.id
    ),
    ["fade-in"]
  );
});
test("search requires all query words and supports empty results", () => {
  assert.deepEqual(
    filterAnimations(animations, "unfindable-effect", "all"),
    []
  );
  assert.deepEqual(
    filterAnimations(animations, "bounce unfindable-effect", "all"),
    []
  );
  assert.equal(
    filterAnimations(animations, " ".repeat(expectedCategorySize), "all")
      .length,
    expectedAnimations
  );
});
test("only the previous active player is paused when another claims playback", () => {
  let firstPauses = 0;
  let secondPauses = 0;
  const first = () => {
    firstPauses += singlePause;
  };
  const second = () => {
    secondPauses += singlePause;
  };
  claimPlayback(first);
  claimPlayback(first);
  assert.equal(firstPauses, noPauses);
  claimPlayback(second);
  assert.equal(firstPauses, singlePause);
  releasePlayback(first);
  claimPlayback(first);
  assert.equal(secondPauses, singlePause);
  releasePlayback(first);
});
