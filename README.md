# Motionary

A visual, interactive dictionary of motion built with Next.js 16, React 19, and the Web Animations API. It contains 24 playable motion studies, category and text search, shareable detail pages, and copyable AI prompts.

## Develop

```sh
pnpm install
pnpm dev
```

## Verify

```sh
pnpm test
pnpm exec next typegen
pnpm exec tsc --noEmit
pnpm exec ultracite check app components lib tests eslint.config.mjs
pnpm build
```

The tests use Node's built-in test runner and TypeScript stripping (Node 22.6+). No backend or environment variables are required. Next's existing font integration downloads Geist during the first build.

If a restricted environment prevents Turbopack from opening its local stylesheet worker port, the supported fallback is `pnpm exec next build --webpack`. That build has also been verified in a production server.

## Add an animation

1. Add a definition in `lib/animations.ts`: stable slug, English name, category, description, explanation, use case, searchable synonyms, prompt, and duration in milliseconds. The slug is the public identity; the displayed study number follows catalog order.
2. Add its static visual composition in `components/demo-visual.tsx`. Add `data-motion` to the elements that move. Keep the static composition understandable without playback.
3. Add keyframes in `lib/demo-animation.ts` and any illustration styles in `app/globals.css`. Each timeline must be finite, and its keyframes should match its prompt. Use transforms and opacity when possible; blur, path drawing, clipping, and silhouette demos intentionally illustrate other properties.
4. Verify replay, pause/resume, all four speeds, small screens, and keyboard operation. Cards, filtering, detail routes, related items, and counts derive automatically from the content.

The agreed visual and interaction system is recorded in `design-system/motionary/MASTER.md`. Catalog state is URL-based, with optional session storage used only to restore the return position. Clipboard failure never hides the prompt.
