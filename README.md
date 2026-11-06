# Motionary

A visual, interactive dictionary of motion built with Next.js 16, React 19, and the Web Animations API. It contains 24 playable motion studies, category and text search, shareable detail pages, and copyable AI prompts.

## Develop

```sh
nvm use
pnpm install
pnpm dev
```

## Verify

```sh
pnpm run ci
```

This runs formatting and lint checks, generates Next.js route types, checks TypeScript, runs the tests, and builds the production app. Use `pnpm run verify` for the same checks without the production build. The individual commands are `pnpm run check`, `pnpm run typecheck`, `pnpm test`, and `pnpm run build`.

Node.js 26 is selected in `.nvmrc` to match the existing Vercel project. pnpm is pinned by `packageManager` in `package.json`. The tests use Node's built-in test runner and TypeScript stripping. No backend or application environment variables are required. Next's font integration downloads Familjen Grotesk and IBM Plex Mono during the first build.

If a restricted environment prevents Turbopack from opening its local stylesheet worker port, the supported fallback is `pnpm exec next build --webpack`. That build has also been verified in a production server.

## CI/CD

GitHub Actions runs `.github/workflows/ci.yml` for pull requests targeting `main`, pushes to `main`, merge queue entries, and manual runs. It installs dependencies with `--frozen-lockfile`, caches the pnpm store, and runs every verification step above. New runs cancel older runs for the same ref. Actions are pinned to commit SHAs; Dependabot proposes weekly updates.

Vercel processes `vercel.json` before executing the build command, so `.prettierignore` excludes it from the general formatting check. GitHub Actions separately checks the committed `vercel.json` with Prettier, using `.gitignore` instead.

Continuous deployment uses the existing Vercel Git integration for `davidmariolc/motionary`. Vercel creates previews for branches and deploys `main` to production. `vercel.json` sets the build command to `pnpm run ci`, so previews and production must pass the quality checks and tests before the Next.js build can succeed. A failed check leaves the current production deployment in place. GitHub Actions and Vercel each run the checks independently; the Vercel build does not wait for the GitHub workflow. No Vercel token or GitHub Actions secrets are needed.

These changes take effect once committed and pushed. For merge protection, require the `Quality and build` check on `main` in GitHub branch protection or a ruleset after the workflow has run once. Branch protection is managed in GitHub and is not enabled by these files.

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
