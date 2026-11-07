import assert from "node:assert/strict";
import { mock, test } from "node:test";
import { createDemoAnimations } from "../lib/demo-animation.ts";
import { createDemoPlayback } from "../lib/demo-playback.ts";

const startDelay = 160;
const endDelay = 240;
const duration = 1000;
const halfway = 0.5;
const frameTime = 16;

const empty = 0;
const firstIndex = 0;
const lastIndex = -1;
const single = 1;
const staggerElements = 5;
const wordElements = 4;
const typewriterElements = 2;
const staggerDelay = 130;
const wordDelay = 230;

const createAnimation = (options = {}) => {
  const animation = {
    cancel: () => {
      animation.playState = "idle";
      animation.currentTime = null;
    },
    currentTime: empty,
    effect: { getTiming: () => ({ delay: startDelay, ...options }) },
    onfinish: null,
    pause: () => {
      animation.playState = "paused";
    },
    play: () => {
      animation.playState = "running";
    },
    playState: "paused",
    playbackRate: single,
    updatePlaybackRate: (value) => {
      animation.playbackRate = value;
    },
  };
  return animation;
};

const createFrames = (context) => {
  const callbacks = new Map();
  let nextId = empty;
  context.mock.method(globalThis, "requestAnimationFrame", (onFrame) => {
    nextId += single;
    callbacks.set(nextId, onFrame);
    return nextId;
  });
  context.mock.method(globalThis, "cancelAnimationFrame", (id) => {
    callbacks.delete(id);
  });
  return {
    advance: () => {
      const scheduled = callbacks.values().toArray();
      callbacks.clear();
      for (const onFrame of scheduled) {
        onFrame(frameTime);
      }
    },
    callbacks,
  };
};

// Node has no rendering clock; each test replaces these with a controlled clock.
Object.defineProperties(globalThis, {
  cancelAnimationFrame: {
    configurable: true,
    value: mock.fn(),
    writable: true,
  },
  requestAnimationFrame: {
    configurable: true,
    value: () => empty,
    writable: true,
  },
});

const createPlayer = (context, options = {}) => {
  const animations = [createAnimation(), createAnimation()];
  const states = [];
  let creations = empty;
  const player = createDemoPlayback({
    counter: null,
    createAnimations: () => {
      creations += single;
      return animations;
    },
    duration,
    onStateChange: (state) => {
      states.push(state);
    },
    pageVisible: true,
    reducedMotion: false,
    ...options,
  });
  context.after(() => player.destroy());
  return {
    animations,
    creations: () => creations,
    finish: () => {
      for (const animation of animations) {
        animation.currentTime = duration + startDelay + endDelay;
        animation.playState = "finished";
      }
      animations.at(lastIndex).onfinish?.();
    },
    player,
    states,
  };
};

test("visible players start independently and loop without recreating their animations", (context) => {
  const first = createPlayer(context);
  const second = createPlayer(context);
  assert.equal(first.creations(), empty);
  first.player.setVisible(true);
  second.player.setVisible(true);
  for (const fixture of [first, second]) {
    assert.equal(fixture.states.at(lastIndex), "playing");
    fixture.finish();
    fixture.finish();
    assert.equal(fixture.creations(), single);
    assert.ok(
      fixture.animations.every((animation) => animation.currentTime === empty)
    );
    assert.ok(
      fixture.animations.every((animation) => animation.playState === "running")
    );
  }
  first.player.pause();
  assert.ok(
    second.animations.every((animation) => animation.playState === "running")
  );
});

test("viewport and page visibility suspend and resume from the same position", (context) => {
  const { player, animations, states } = createPlayer(context, {
    pageVisible: false,
  });
  player.setVisible(true);
  assert.deepEqual(states, []);
  player.setPageVisible(true);
  for (const animation of animations) {
    animation.currentTime = duration * halfway;
  }
  player.setVisible(false);
  assert.equal(states.at(lastIndex), "paused");
  player.setPageVisible(false);
  player.setVisible(true);
  assert.equal(states.at(lastIndex), "paused");
  player.setPageVisible(true);
  assert.equal(states.at(lastIndex), "playing");
  assert.ok(
    animations.every(
      (animation) => animation.currentTime === duration * halfway
    )
  );
});

test("manual pause survives visibility changes until explicit resume", (context) => {
  const { player, states } = createPlayer(context);
  player.setVisible(true);
  player.pause();
  player.setVisible(false);
  player.setPageVisible(false);
  player.setVisible(true);
  player.setPageVisible(true);
  assert.equal(states.at(lastIndex), "paused");
  player.play();
  assert.equal(states.at(lastIndex), "playing");
});

test("resuming a staggered group keeps completed elements at their final frame", (context) => {
  const { animations, player } = createPlayer(context);
  player.setVisible(true);
  const [completed, running] = animations;
  const completedTime = duration + startDelay + endDelay;
  completed.currentTime = completedTime;
  completed.playState = "finished";
  running.currentTime = duration * halfway;
  player.setVisible(false);
  assert.equal(completed.playState, "finished");
  player.setVisible(true);
  assert.equal(completed.playState, "finished");
  assert.equal(completed.currentTime, completedTime);
  assert.equal(running.playState, "running");
  assert.equal(running.currentTime, duration * halfway);
});

test("a finish event queued before the page is hidden resumes the loop on return", (context) => {
  for (const reducedMotion of [false, true]) {
    const { player, animations, states } = createPlayer(context, {
      reducedMotion,
    });
    player.setVisible(true);
    player.play();
    for (const animation of animations) {
      animation.playState = "finished";
    }
    player.setPageVisible(false);
    animations.at(lastIndex).onfinish();
    assert.equal(states.at(lastIndex), "finished");
    player.setPageVisible(true);
    assert.equal(states.at(lastIndex), reducedMotion ? "finished" : "playing");
  }
});

test("reduced motion allows a manual single pass and responds to preference changes", (context) => {
  const fixture = createPlayer(context, { reducedMotion: true });
  const { player, states } = fixture;
  player.setVisible(true);
  assert.equal(fixture.creations(), empty);
  player.play();
  fixture.finish();
  assert.equal(states.at(lastIndex), "finished");
  player.setVisible(false);
  player.setVisible(true);
  assert.equal(states.at(lastIndex), "finished");
  player.setReducedMotion(false);
  assert.equal(states.at(lastIndex), "playing");
  player.setReducedMotion(true);
  assert.equal(states.at(lastIndex), "paused");
  player.play();
  fixture.finish();
  assert.equal(states.at(lastIndex), "finished");
  player.pause();
  player.setReducedMotion(false);
  assert.equal(states.at(lastIndex), "finished");
});

test("speed survives loops and restart resets the counter without losing its clock", (context) => {
  const frames = createFrames(context);
  const counter = { textContent: "100" };
  const fixture = createPlayer(context, { counter });
  const { player, animations } = fixture;
  player.setSpeed(halfway);
  player.setVisible(true);
  assert.equal(counter.textContent, "0");
  animations[firstIndex].currentTime = startDelay + duration * halfway;
  frames.advance();
  assert.equal(counter.textContent, "88");
  fixture.finish();
  assert.equal(counter.textContent, "0");
  assert.ok(
    animations.every((animation) => animation.playbackRate === halfway)
  );
  animations[firstIndex].currentTime = startDelay + duration;
  frames.advance();
  assert.equal(counter.textContent, "100");
  player.play(true);
  assert.equal(counter.textContent, "0");
  assert.equal(frames.callbacks.size, single);
  player.pause();
  assert.equal(frames.callbacks.size, empty);
  player.play();
  assert.equal(frames.callbacks.size, single);
  player.destroy();
  assert.equal(frames.callbacks.size, empty);
  assert.ok(animations.every((animation) => animation.playState === "idle"));
  assert.ok(animations.every((animation) => animation.onfinish === null));
  player.setVisible(true);
  assert.equal(fixture.creations(), single);
});

test("staggered and text demos retain full timing and replay only after the last element finishes", (context) => {
  for (const [id, elementCount, stagger] of [
    ["stagger", staggerElements, staggerDelay],
    ["word-reveal", wordElements, wordDelay],
    ["typewriter", typewriterElements, empty],
    ["count-up", single, empty],
  ]) {
    const calls = [];
    const elements = Array.from({ length: elementCount }, () => {
      return {
        animate: (keyframes, options) => {
          const animation = createAnimation(options);
          calls.push({ animation, keyframes, options });
          return animation;
        },
      };
    });
    const stage = {
      querySelector: () => ({ textContent: "Dale vida." }),
      querySelectorAll: () => elements,
    };
    const player = createDemoPlayback({
      counter: null,
      createAnimations: () => createDemoAnimations(stage, { duration, id }),
      duration,
      onStateChange: mock.fn(),
      pageVisible: true,
      reducedMotion: false,
    });
    context.after(() => player.destroy());
    player.setVisible(true);
    for (const [index, { options, animation }] of calls.entries()) {
      assert.equal(options.delay, startDelay + index * stagger);
      assert.equal(options.duration, duration);
      assert.equal(options.endDelay, endDelay);
      if (index < elementCount - single) {
        assert.equal(animation.onfinish, null);
      }
      animation.currentTime = options.delay + duration + endDelay;
      animation.playState = "finished";
    }
    calls.at(lastIndex).animation.onfinish();
    assert.ok(calls.every(({ animation }) => animation.currentTime === empty));
    assert.ok(
      calls.every(({ animation }) => animation.playState === "running")
    );
    assert.equal(calls.length, elementCount);
  }
});
