# Motionary design system

A dark motion reference library. The journey is discover → identify → copy a prompt. All product copy is in English.

## Tokens

- Background: #111311; preview surfaces: #1A1E19; foreground: #F4F5F0.
- Secondary text: #A3ABA2; accent: #D3F86A; separators: #30362D; functional control borders: #76816E.
- Geist Sans for the interface, Geist Mono for metadata. 8 px spacing rhythm; 12 px card corners.
- Maximum content width: 1280 px. One column below 640 px, two below 1100 px, three from 1100 px.
- Mobile margins: 20 px; tablet: 32 px; desktop: 48 px minimum.

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
