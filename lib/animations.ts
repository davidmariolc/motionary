const textCategory = "text-numbers";
const shapesCategory = "shapes-transitions";
export const categories = [
  { icon: "enter", id: "entrances", name: "Entrances", short: "Entrance" },
  { icon: "wave", id: "rhythm", name: "Rhythm", short: "Rhythm" },
  {
    icon: "text",
    id: textCategory,
    name: "Text & Numbers",
    short: "Text & numbers",
  },
  {
    icon: "shapes",
    id: shapesCategory,
    name: "Shapes & Transitions",
    short: "Shape & transition",
  },
] as const;
export type CategoryId = (typeof categories)[number]["id"];
export interface AnimationEntry {
  id: string;
  number: number;
  name: string;
  category: CategoryId;
  description: string;
  explanation: string;
  usage: string;
  synonyms: string;
  prompt: string;
  duration: number;
}
type Definition = readonly [
  string,
  string,
  CategoryId,
  string,
  string,
  string,
  string,
  string,
  number,
];
const definitions: Definition[] = [
  [
    "fade-in",
    "Fade in",
    "entrances",
    "A quiet entrance. From invisible to there.",
    "An element gradually becomes visible, moving from transparent to fully opaque. Its position stays still, letting the content speak for itself.",
    "Introduce images, supporting content, or a gentle change of state without pulling attention away from the page.",
    "appear opacity dissolve surgir",
    "Reveal the element with a fade-in: animate its opacity from 0 to 1 over 400 ms using an ease-out curve. Keep its position and size unchanged.",
    400,
  ],
  [
    "slide-in",
    "Slide in",
    "entrances",
    "A little movement in the right direction.",
    "An element travels a short distance into its final position while fading into view. The direction gives the entrance a sense of origin.",
    "Introduce a panel, a new section, or content entering from the edge of a layout.",
    "move translate entrance sliding deslizar",
    "Reveal the element with a slide-in from below: animate translateY from 64 px to 0 and opacity from 0 to 1 over 700 ms with ease-out. Keep the surrounding layout fixed.",
    700,
  ],
  [
    "pop-in",
    "Pop in",
    "entrances",
    "Small start. A slightly bouncy arrival.",
    "An element scales past its resting size, then settles back. The small overshoot makes the entrance feel playful and physical.",
    "Draw attention to a badge, a new item, or an occasional moment of positive feedback.",
    "pop scale appear jump salto",
    "Make the element pop in over 700 ms: begin at 70% scale and zero opacity, grow to 112%, and settle at 100%. Keep its center fixed and use a soft overshoot.",
    700,
  ],
  [
    "scale-up",
    "Scale up",
    "entrances",
    "Grow into place, without the bounce.",
    "An element grows smoothly from a smaller size to its final dimensions. Unlike pop in, it settles without overshooting.",
    "Bring an image, dialog, or focal element into view with a simple sense of depth.",
    "grow enlarge zoom entrance crescer",
    "Reveal the element by scaling it from 55% to 100% while fading opacity from 0 to 1 over 700 ms using ease-out. Do not overshoot or change layout dimensions.",
    700,
  ],
  [
    "blur-in",
    "Blur in",
    "entrances",
    "From out of focus to perfectly clear.",
    "A soft, blurred element becomes sharp and fully visible. The reveal changes focus rather than moving across the screen.",
    "Give a headline, photograph, or editorial reveal a cinematic entrance. Use sparingly because blur requires painting.",
    "focus sharp defocus blur reveal borrado",
    "Reveal the element over 900 ms by animating filter blur from 18 px to 0 and opacity from 0 to 1 with ease-out. Keep position and size fixed.",
    900,
  ],
  [
    "stagger",
    "Stagger",
    "entrances",
    "One by one. Better together.",
    "A group shares the same entrance, but each item begins a little after the last. The sequence turns separate elements into a readable rhythm.",
    "Introduce cards, list items, or a small group of related elements in a deliberate order.",
    "cascade sequence delay list cascata",
    "Reveal four items with a stagger: fade each from 0 to 1 and translateY from 30 px to 0 over 500 ms using ease-out. Start each item 130 ms after the previous one.",
    500,
  ],
  [
    "overshoot",
    "Overshoot",
    "rhythm",
    "Go a little too far. Then settle in.",
    "An element travels beyond its destination and gently returns. That extra movement suggests momentum rather than an abrupt stop.",
    "Give a meaningful entrance or repositioning a small sense of weight and personality.",
    "past return momentum settle passa",
    "Move the element horizontally from -90 px to 0 over 1000 ms. Pass the destination by 22 px, then settle at 0 with a single soft overshoot.",
    1000,
  ],
  [
    "bounce",
    "Bounce",
    "rhythm",
    "A landing with a little life in it.",
    "An element falls toward a surface and rebounds with progressively smaller hops, as if gravity is bringing it to rest.",
    "Illustrate a landing or add occasional playful feedback to a successful action.",
    "hop gravity ball rebound quicar",
    "Animate a square dropping toward a baseline over 1300 ms. Bounce upward three times with decreasing heights, then rest on the baseline. Keep horizontal position fixed.",
    1300,
  ],
  [
    "spring",
    "Spring",
    "rhythm",
    "Stretch, release, find your balance.",
    "A displaced element oscillates around its resting position, losing energy with each swing. It resembles an object suspended on a spring.",
    "Demonstrate physical settling and movement that should feel weighted.",
    "physics oscillation damping mola",
    "Animate a suspended square with a damped spring over 1500 ms. Pull it down 60 px, then oscillate around its resting position with decreasing amplitude until it comes to rest.",
    1500,
  ],
  [
    "ease-in-out",
    "Ease in-out",
    "rhythm",
    "Start slow. Find your pace. Slow down.",
    "Movement accelerates gradually and decelerates before stopping. A linear comparison makes the difference in speed easy to see.",
    "Move an element between two visible positions when both departure and arrival should feel deliberate.",
    "accelerate decelerate smooth easing linear",
    "Move two markers horizontally across equal tracks over 1400 ms. Use linear easing on the first and ease-in-out on the second so their acceleration and deceleration can be compared.",
    1400,
  ],
  [
    "elastic",
    "Elastic",
    "rhythm",
    "A rubber-band kind of energy.",
    "An element snaps toward its destination and wobbles around it with elastic rebounds. It feels more pronounced and stretchy than a single overshoot.",
    "Explain elastic motion or add a rare expressive accent to a playful experience.",
    "rubber band stretch snap elastico",
    "Move the square from -90 px to 0 over 1600 ms: overshoot by 38 px, rebound by 24 px, then oscillate with decreasing amplitude until resting at 0.",
    1600,
  ],
  [
    "pulse",
    "Pulse",
    "rhythm",
    "A small beat that says: look here.",
    "An element expands and returns to its original size. A fading outer ring reinforces the beat without changing the surrounding layout.",
    "Briefly point out a location, available action, or status change. Avoid endless attention-seeking loops.",
    "beat attention ring location pulsar",
    "Create one pulse over 1100 ms: scale the central marker from 1 to 1.18 and back to 1. Expand an outer ring from 1 to 2.2 while fading it out. Do not loop automatically.",
    1100,
  ],
  [
    "typewriter",
    "Typewriter",
    textCategory,
    "A thought, one character at a time.",
    "Text is revealed in discrete character-sized steps, accompanied by a cursor. The letters appear in reading order rather than fading together.",
    "Present a short command, an occasional narrative line, or a terminal-inspired message.",
    "typing character cursor machine maquina",
    "Reveal “Make it move.” one character at a time over 1500 ms using 13 discrete steps. Keep a caret at the end of the visible text and keep the line position fixed.",
    1500,
  ],
  [
    "count-up",
    "Count up",
    textCategory,
    "Numbers with a sense of progress.",
    "A numeric value increases from zero to a target. The unit stays still so the viewer can follow the changing value.",
    "Introduce a meaningful statistic or visualize progress toward a fixed number.",
    "counter counting number statistic anos",
    "Animate a numeric counter from 0 to 100 over 1600 ms with ease-out. Keep the percent sign stationary and use tabular numerals to prevent layout shift.",
    1600,
  ],
  [
    "word-reveal",
    "Word reveal",
    textCategory,
    "Give every word its own moment.",
    "A sentence appears word by word, combining a small vertical movement with a fade. The order follows the natural reading direction.",
    "Reveal a short headline or emphasize the pacing of a concise editorial sentence.",
    "split text words sequential palavra",
    "Reveal “Good things take motion.” word by word. Animate each word from translateY(18 px) and opacity 0 to its resting position and opacity 1 over 450 ms, with 230 ms between word starts.",
    450,
  ],
  [
    "ticker",
    "Ticker",
    textCategory,
    "Keep the words moving along.",
    "A continuous strip of text travels horizontally through a clipped window. Linear speed keeps movement steady and readable.",
    "Show a short announcement or an editorial strip with optional playback.",
    "marquee scrolling sliding text rolling letreiro",
    "Move a horizontal strip reading “IDEAS IN MOTION — MAKE SOMETHING MOVE —” from right to left at a constant speed over 2600 ms, clipped to its container. Play one pass and provide pause controls.",
    2600,
  ],
  [
    "highlight",
    "Highlight",
    textCategory,
    "A moving underline for your point.",
    "A colored highlight sweeps behind a phrase, drawing attention to words that remain still and readable.",
    "Emphasize a key phrase or important takeaway without moving the text.",
    "marker emphasis underline grifar",
    "Sweep a lime highlight from left to right behind “worth a second look” over 1000 ms using ease-in-out. Keep the text fixed, fully visible, and readable throughout.",
    1000,
  ],
  [
    "text-swap",
    "Text swap",
    textCategory,
    "Same sentence. A fresh possibility.",
    "A word slides out of a clipped text window as another slides in. The surrounding sentence stays still.",
    "Show alternatives within one short headline or switch between product qualities.",
    "rotating word change replace trocar",
    "Under the fixed label “MAKE IT”, slide “simple.” upward out of a clipped window while “moving.” enters from below over 1000 ms using ease-in-out. Preserve the text container height.",
    1000,
  ],
  [
    "draw-on",
    "Draw on",
    shapesCategory,
    "A line finding its way into being.",
    "An outline is progressively drawn along a path. Animating the visible stroke makes the shape look as though a pen is tracing it.",
    "Reveal an illustration, route, icon, or simple hand-drawn accent.",
    "svg stroke path trace drawing traco",
    "Draw an SVG path from start to finish over 1600 ms with ease-in-out by animating stroke-dashoffset from the total path length to 0. Use a lime stroke and no fill.",
    1600,
  ],
  [
    "mask-reveal",
    "Mask reveal",
    shapesCategory,
    "Uncover what was there all along.",
    "A clipping mask expands to uncover an element. The content stays still while its visible area grows.",
    "Reveal an image, geometric composition, or headline with a radial opening.",
    "clip clipping circle uncover mascara",
    "Reveal the composition with an expanding circular clip-path over 1100 ms using ease-out. Expand the circle from 0% to 75% at the center without scaling the underlying content.",
    1100,
  ],
  [
    "wipe",
    "Wipe",
    shapesCategory,
    "One scene makes way for another.",
    "A new surface sweeps across the old one, replacing it along a clean moving edge.",
    "Demonstrate a before-and-after or switch between two distinct scenes.",
    "curtain transition before after cortina",
    "Transition from a dark panel labeled “Before” to a lime panel labeled “After” using a left-to-right wipe over 1200 ms with ease-in-out. Keep both labels stationary in their panels.",
    1200,
  ],
  [
    "punch-zoom",
    "Punch zoom",
    shapesCategory,
    "A closer look. An instant of impact.",
    "The entire composition quickly zooms inward and settles back. This brief camera-like move makes the focal content feel more immediate.",
    "Add occasional impact to a reveal, key number, or storytelling beat.",
    "camera impact zoom punch snap",
    "Create a punch zoom on a framed “8 million ideas” composition over 800 ms: quickly scale from 1 to 1.3, then settle at 1. Keep the transform origin centered and clip the scene to its viewport.",
    800,
  ],
  [
    "bar-grow",
    "Bar grow",
    shapesCategory,
    "From a starting point to something more.",
    "A bar extends from its anchored edge toward its final length. Scaling avoids moving the surrounding layout.",
    "Introduce a progress indicator or show the relative size of a simple value.",
    "progress fill chart loading barra",
    "Grow a horizontal lime bar from scaleX(0) to scaleX(1) over 1200 ms using ease-out with transform-origin at the left edge. Keep its container and label fixed.",
    1200,
  ],
  [
    "morph",
    "Morph",
    shapesCategory,
    "One shape. A different possibility.",
    "A square smoothly rounds into a circle while keeping the same center and visual continuity.",
    "Explain a transformation or connect related visual states through a shared shape.",
    "shape transformation circle square border radius forma",
    "Morph a lime square into a circle over 1400 ms using ease-in-out by animating border-radius from 8% to 50% with a subtle quarter-turn rotation. Preserve its center and size.",
    1400,
  ],
];
// eslint-disable-next-line unicorn/no-top-level-side-effects -- Transforming static definitions has no external effects.
export const animations: AnimationEntry[] = definitions.map(
  (
    [
      id,
      name,
      category,
      description,
      explanation,
      usage,
      synonyms,
      prompt,
      duration,
    ],
    index
  ) => {
    return {
      category,
      description,
      duration,
      explanation,
      id,
      name,
      number: index + 1,
      prompt,
      synonyms,
      usage,
    };
  }
);
export const getCategory = (id: CategoryId) =>
  categories.find((category) => category.id === id) ?? categories[0];
export const filterAnimations = (
  entries: AnimationEntry[],
  query: string,
  category: string
) => {
  const words = query.trim().toLowerCase().split(/\s+/u).filter(Boolean);
  return entries.filter((entry) => {
    return (
      (category === "all" || entry.category === category) &&
      words.every((word) => {
        return `${entry.name} ${entry.description} ${entry.synonyms}`
          .toLowerCase()
          .includes(word);
      })
    );
  });
};
