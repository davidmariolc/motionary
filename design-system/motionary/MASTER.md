# Motionary design system

A warm, editorial motion reference library. The journey is discover → identify → copy a prompt. All product copy is in English. The real playable Stagger study leads the hero.

## Tokens

- Background: #F7F5EF; surfaces: #EEECE4; foreground: #252722.
- Secondary text: #66685F; accent: #B94320; hero ground: #E66340; separators: #D9D9CE; functional control borders: #82857A.
- Familjen Grotesk for the interface, IBM Plex Mono for metadata, self-hosted with next/font. 8 px spacing rhythm; 10–12 px frame corners.
- Body copy: 16 px; hero lead: 18 px; card titles: 23 px. Compact metadata remains secondary to study names and controls.
- Preview grounds use pale neutrals by category; rhythm uses sage, type uses clay, and transitions use slate. Interface actions share the same near-black fill.
- Maximum content width: 1280 px. One column below 640 px, two below 1100 px, three from 1100 px.
- Mobile margins: 20 px; tablet: 32 px; desktop: 64 px minimum.

## Taste skill adaptation

Kind: software / interactive reference library. Pairing: Familjen Grotesk + IBM Plex Mono from the skill's dealer. Hero: a split composition using the actual player; the dealt rotating triptych is omitted to preserve explicit playback and avoid simulated product UI. Palette: custom warm paper and clay.

Apply the skill's equal edges, restrained colour, clear type hierarchy, real product visuals and quiet hover feedback. Keep the existing React components and Web Animations playback engine. No starter assets, shaders, stock photographs or automatic loops are needed for this product.

The searchable catalog and detail documentation use content-driven height. The skill's fixed one/two-screen landing-section rules, marketing copy budgets and image-caption rules do not apply to functional catalog entries or player controls. Checker findings about these conventions are reviewed as intentional adaptations, while overflow, contrast, broken assets and interaction failures must be fixed.

## Verification

- Production build, TypeScript and Ultracite checks pass; all five existing tests pass.
- Browser checks at 1440 and 390 px confirm search, category intersection, empty results, reset, keyboard shortcut, hero play/pause and finite playback. The detail player passes half-speed playback, pause, replay at double speed and related-link checks on mobile.
- The skill's final consistency checks pass contrast, text contrast, font loading, links, assets and horizontal overflow. Its full pass also checks reduced motion and hover feedback.
- Layout captures cover 1440, 1024, 820, 768 and 390 px. The catalog intentionally scrolls beyond two screens, and card text intentionally sits inside card padding.
- Performance check: zero failures, approximately 243 KiB transferred, 39 KiB of fonts, no broken requests and CLS 0 in the local CPU-rendered measurement. Warnings concern 511 KiB of parsed framework/application JavaScript and the font fallback being counted as a third family; only two actual font families are loaded.

The marketing checkers still report expected mismatches: CSS motion specimens are not recognized as photographs or kit UI fragments; ticker/text-swap clipping, pop-in rotation and wipe overlap are the demonstrations themselves; study names are dictionary terms rather than sales headings; tutorial and prompt sections are functional text; player replay controls share a label across primary and secondary buttons. These are preserved deliberately. The mobile hero uses a compact player so its play control fits the first screen.

## Interaction

- Static compositions by default. Explicit, finite playback only. Only one preview plays at once.
- Play resumes a paused animation. Replay starts from the beginning. Speed changes preserve progress.
- Pause on leaving the viewport or hiding the document. Do not auto-resume.
- Reduced motion disables decorative UI transitions; intentionally requested demonstrations remain available.
- Search intersects with category filters and matches names, descriptions, and synonyms.
- Filter state lives in the URL. Returning from a card restores filters and scroll through optional session storage.
- Copy feedback is announced politely. A failed clipboard write leaves selectable prompt text available.

## Accessibility

Use semantic buttons, links, fieldsets and outputs. Maintain visible focus, 44 px minimum control height, text contrast of at least 4.5:1, and control-boundary contrast of at least 3:1. No important interaction depends on hover or color alone.
