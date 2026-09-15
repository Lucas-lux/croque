# Croque — design system

Recorded from the built V1. Tokens live in `tailwind.config.ts` and `src/index.css`.

## World

« Bistro de nuit » : a deep, saturated bistro green ground instead of black, chalk-white type,
butter yellow as the brand accent, tomato red for love, basil green for good news. The signature
motif is the fruit-crate sticker: an oval, slightly tilted, double-edged label used for compatibility
scores, stamps (MIAM / NOPE), flags and counts. The app is dark-only because the use scene is the evening.

## Color

| Token | Hex | Use |
|---|---|---|
| ink 900 | #0B1A15 | page ground |
| ink 800 | #12261F | cards, chips, inputs |
| ink 700 | #1A342B | raised controls, bars |
| chalk | #F5F1E8 | primary text, nope button |
| chalk mute | #A8B9AF | secondary text (tinted from the green hue, never gray) |
| butter | #F7C948 | primary action, selected state, brand dot |
| tomato | #FF4B3E | like, match screen (drenched), favourites |
| basil | #3FD68F | green flags |

Rules: one accent per action. Butter is the only "do this" colour; tomato is reserved for affection and
the match moment; basil only speaks in flag lines. Inactive states never carry a saturated fill.

## Type

One family: Bricolage Grotesque (variable, self-hosted in `public/fonts`, opsz + wght).
- `.display` (opsz 96, tracking −0.03em, weight 800): screen titles, card names, the wordmark, numbers.
- `.ui` (opsz 14): everything else. Weights 500–700.
- Scale in px: 11 / 12 / 13 / 15 / 16 / 19 / 22 / 26 / 30 / 34 / 38 / 56 (match title) / 64 (wordmark).
- Numbers are tabular (`.tabular`).

## Shape and depth

- Cards: 28px radius (`rounded-card`). Chips, buttons, stickers: pill.
- Shadows always carry offset and blur: `shadow-card`, `shadow-float`, and tinted glows `shadow-butter` / `shadow-tomato` on primary buttons only.
- Photo cards fade to ink at the bottom (`.card-fade`) so white type always passes contrast.
- 1px inset rings at 10–15 % white separate surfaces; no visible borders elsewhere.

## Components

- `Button` (butter / tomato / chalk / ink / ghost / outline; sm → xl), `IconButton` (round, same tones + glass).
- `Chip` selectable pill, `Sticker` signature label, `MetaPill` glass or flat info pill.
- `SmartImage` with shimmer skeleton and emoji fallback.
- `Screen` + `TopBar`, floating `BottomNav` (glass pill, active tab in butter).
- Two-step destructive actions (trash → « Sûr·e ? ») instead of modals.

## Motion

- One authored moment: the swipe. Drag with rotation, MIAM / NOPE stickers scaling in, back card rising, spring fling.
- The match screen is the only orchestrated sequence (title spring, portraits, sticker pop, confetti).
- Everything else: 150–250 ms, ease-out, state-driven. `prefers-reduced-motion` collapses all of it.

## Copy

Second person, short sentences, one wink per screen at most. Flags are the humour carrier:
« Red flag : 47 minutes de préparation. » / « Green flag : seulement 5 ingrédients. »
