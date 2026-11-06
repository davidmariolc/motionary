import assert from "node:assert/strict";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import { getIntroGeometry, getMarkPolygon } from "../lib/brand-intro.ts";
import { brandIntroBootstrap } from "../lib/brand-intro-bootstrap.ts";

const empty = 0;
const singleEvent = 1;
const watchdogDelay = 4000;
const markCenter = 14;
const markViewBox = 28;
const viewportHeight = 984;
const maximumLogoWidth = 420;
const horizontalMargins = 48;
const viewportWidths = {
  desktop: 1451,
  largePhone: 484,
  phone: 390,
  smallPhone: 320,
};

const createBrowser = (options = {}) => {
  const storage = new Map(options.storage);
  const dataset = {};
  const timers = [];
  const events = [];
  const context = {
    Event,
    URLSearchParams,
    document: { documentElement: { dataset } },
    performance: {
      getEntriesByType: () => [{ type: options.navigation ?? "navigate" }],
    },
    sessionStorage: {
      getItem: (key) => {
        if (options.blockStorage) {
          throw new Error("Storage is unavailable");
        }
        return storage.get(key) ?? null;
      },
      setItem: (key, value) => {
        if (options.blockWrites) {
          throw new Error("Storage is read-only");
        }
        storage.set(key, value);
      },
    },
    window: {
      dispatchEvent: (event) => {
        events.push(event.type);
      },
      location: {
        hash: options.hash ?? "",
        pathname: options.pathname ?? "/es",
        search: options.search ?? "",
      },
      matchMedia: () => ({ matches: options.reduced ?? false }),
      scrollY: options.scroll ?? empty,
      setTimeout: (callback, delay) => {
        timers.push({ callback, delay });
      },
    },
  };
  return {
    dataset,
    events,
    // eslint-disable-next-line sonarjs/code-eval -- Only the checked-in bootstrap runs in this isolated browser stub.
    run: () => runInNewContext(brandIntroBootstrap, context),
    storage,
    timers,
  };
};

test("a fresh direct homepage visit starts once across reloads and languages", () => {
  for (const pathname of ["/es", "/en", "/es/", "/en/"]) {
    const browser = createBrowser({ pathname });
    browser.run();
    assert.equal(browser.dataset.brandIntro, "pending");
    assert.equal(browser.storage.get("motionary:intro:v1"), "seen");
    delete browser.dataset.brandIntro;
    browser.run();
    assert.equal(browser.dataset.brandIntro, undefined);
    const english = createBrowser({
      pathname: "/en",
      storage: browser.storage,
    });
    english.run();
    assert.equal(english.dataset.brandIntro, undefined);
  }
});

test("deep links, active filters, restored scroll, and history traversal bypass the intro", () => {
  for (const options of [
    { pathname: "/es/animations/stagger" },
    { pathname: "/en/missing" },
    { hash: "#collection" },
    { search: "?q=spring" },
    { search: "?category=rhythm" },
    { scroll: 400 },
    { navigation: "back_forward" },
    { storage: [["motionary:library:v1", '{"scroll":300}']] },
  ]) {
    const browser = createBrowser(options);
    browser.run();
    assert.equal(browser.dataset.brandIntro, undefined);
    assert.equal(browser.storage.has("motionary:intro:v1"), false);
    assert.equal(browser.timers.length, empty);
  }
});

test("reduced motion chooses a short fade and unavailable storage leaves the page visible", () => {
  const reduced = createBrowser({ reduced: true });
  reduced.run();
  assert.equal(reduced.dataset.brandIntro, "reduced");
  for (const options of [{ blockStorage: true }, { blockWrites: true }]) {
    const browser = createBrowser(options);
    browser.run();
    assert.equal(browser.dataset.brandIntro, undefined);
    assert.equal(browser.timers.length, empty);
  }
});

test("the watchdog reveals the page if hydration never completes", () => {
  const browser = createBrowser();
  browser.run();
  const [watchdog] = browser.timers;
  assert.equal(watchdog.delay, watchdogDelay);
  watchdog.callback();
  assert.equal(browser.dataset.brandIntro, undefined);
  assert.deepEqual(browser.events, ["motionary:intro-timeout"]);
  watchdog.callback();
  assert.equal(browser.events.length, singleEvent);
});

test("the mask uses the twelve vertices of the existing M", () => {
  assert.equal(
    getMarkPolygon(markCenter, markCenter, markViewBox),
    "polygon(3px 23px, 3px 5px, 8px 5px, 14px 15px, 20px 5px, 25px 5px, 25px 23px, 20px 23px, 20px 13px, 14px 22px, 8px 13px, 8px 23px)"
  );
});

test("the flight ends at the measured navbar position on narrow and wide screens", () => {
  for (const width of Object.values(viewportWidths)) {
    const brand = { height: 44, left: 20, top: 16, width: 150 };
    const mark = { height: 28, left: 20, top: 24, width: 28 };
    const geometry = getIntroGeometry(brand, mark, width, viewportHeight);
    assert.equal(geometry.destination, "translate(20px, 16px) scale(1)");
    const scale = Number(
      geometry.center.match(/scale\((?<scale>[^)]+)\)/u).groups.scale
    );
    assert.ok(
      brand.width * scale <=
        Math.min(maximumLogoWidth, width - horizontalMargins)
    );
    assert.ok(!geometry.start.includes("NaN"));
    assert.ok(!geometry.polygon.includes("NaN"));
  }
});
