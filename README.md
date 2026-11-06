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

The tests use Node's built-in test runner and TypeScript stripping (Node 22.6+). No backend or environment variables are required. Next's font integration downloads Familjen Grotesk and IBM Plex Mono during the first build.

If a restricted environment prevents Turbopack from opening its local stylesheet worker port, the supported fallback is `pnpm exec next build --webpack`. That build has also been verified in a production server.

## Languages

The site uses next-intl with English (`/en`) and Spanish (`/es`) routes. `proxy.ts` redirects unprefixed URLs using the saved `NEXT_LOCALE` cookie, the browser's language preference, and English as the fallback. Existing `/animations/:slug` URLs keep working through this redirect.

The language button shows the active language and switches directly between English and Spanish, keeping the current page, query parameters, and hash. All internal navigation uses `i18n/navigation.ts`. Catalog filtering and return-position restoration preserve the locale prefix. Search accepts accents and names in either language.

Translations live in `messages/en.json` and `messages/es.json`, including animation descriptions and prompts. `i18n/request.ts` reads the locale from Next.js root parameters so both languages can be prerendered with Cache Components enabled. Only shared interface messages are sent through the client provider; animation copy is resolved on the server.

## Add an animation

1. Add metadata in `lib/animations.ts`: stable slug, study number, category, and duration in milliseconds. Add the matching `Animations` entry in both message files with its name, description, explanation, usage, synonyms, and prompt. Keep the slug and animation timing identical across languages; include names from both languages in searchable synonyms.
2. Add its static visual composition in `components/demo-visual.tsx`. Add `data-motion` to the elements that move. Keep the static composition understandable without playback.
3. Add keyframes in `lib/demo-animation.ts` and any illustration styles in `app/globals.css`. Each timeline must be finite, and its keyframes should match its prompt. Use transforms and opacity when possible; blur, path drawing, clipping, and silhouette demos intentionally illustrate other properties.
4. Verify replay, pause/resume, all four speeds, small screens, and keyboard operation. Cards, filtering, detail routes, related items, and counts derive automatically from the content.

The agreed visual and interaction system is recorded in `design-system/motionary/MASTER.md`. Catalog state is URL-based, with optional session storage used only to restore the return position. Clipboard failure never hides the prompt.
