# Communet design system — "Broadsheet"

Warm newsprint: paper-toned neutrals, ink-dark text, one deep Communet green as
the signal color, hairline rules instead of floating cards, an editorial serif
only for big moments, monospace for metadata. Dense and warm where most
generated UIs are cool, floaty and sparse.

## Fonts (Google Fonts, loaded in index.html)
- **Display — Instrument Serif 400** (+ italic): profile names, page titles
  ("Groups", "Saved"), login hero, empty-state headlines, the wordmark.
  Never in buttons, nav or body text.
- **Body/UI — Schibsted Grotesk** 400/500/600/700.
- **Mono — IBM Plex Mono** 400/500: timestamps, counts, handles, section labels.

Scale (px size/line-height): 12/16 mono meta · 13/18 UI small · 15/22 body ·
17/24 emphasized · 20/26 title (600) · 28/32 display · 40/44 display-xl
(−0.01em) · 56/56 login hero. Mono uppercase labels: 11px, +0.06em.

## Color tokens (Chakra semantic tokens, light / dark)
| token | light | dark |
|---|---|---|
| bg | #F4F1EA | #121311 |
| surface | #FBFAF6 | #1A1B18 |
| surface-raised | #FFFFFF | #23251F |
| border | #E2DDD2 | #2C2E29 |
| border-strong | #C9C2B3 | #3A3D36 |
| text-primary | #1A1915 | #ECE9E1 |
| text-secondary | #4A463E | #B9B5AA |
| text-muted | #6E685C | #97928A |
| accent | #1F7A4D | #5CC48A |
| accent-hover | #17603C | #7AD3A0 |
| on-accent | #FFFFFF | #0B1A12 |
| accent-subtle | #E2EDE5 | #1C2E23 |
| danger | #B42318 | #F07C6C |
| success | #2E7D32 | #6FCF8E |

All text pairs pass WCAG AA. Liked state = accent (not red). Red = destructive only.

## Shape, spacing, layout
- Radius: 4px controls/chips/images, 6px menus/modals/composer, full for
  avatars and pills. Nothing above 8px.
- Hairline 1px `border` separators; shadows only on floating layers
  (menus, modals, toasts, popovers).
- 4px base, rhythm 4/8/12/16/24/40. Post padding 16px horizontal, 12px vertical.
- Shell: max 1240px centered. Left rail 240px (72px icon rail below `xl`,
  bottom tab bar below `md`), feed column 600px with left/right borders, right
  column 320px from `lg`. The window scrolls; rails are sticky. No top navbar:
  wordmark, nav, "New post", user/theme menu live in the left rail; search sits
  at the top of the right column.

## Icons
Lucide only (`react-icons/lu`), 20px nav, 18px actions, `currentColor`.
No multicolor `Fc*`, no `Fa6`, no hardcoded hex icon colors. Social links are
text ("instagram ↗"), not brand logos.

## Components
- **Left rail:** wordmark "communet" in Instrument Serif italic 28px lowercase.
  Items 40px, icon + 15/500 text; active = text-primary 600 + 2px accent bar on
  the left, no pill. Full-width primary "New post" button. Bottom: avatar, name,
  mono handle, menu (theme, logout). Unbuilt destinations are hidden or shown
  muted with a mono "SOON" tag.
- **Post:** an `article` with a bottom border, not a card. Avatar gutter (40px)
  + content column. Header line: **Name** 15/600 · time (mono 12 muted, "3h"),
  ⋯ menu right. Body 15/22, max 560px. Image full content width, 4px radius,
  1px border, max-h 520px, cover. Action row 32px: reply / like / save / share,
  18px icon + mono 13px count, muted → accent on hover/active.
- **Composer:** top of feed, bottom border, no card. Borderless auto-growing
  17px textarea, icon-only ghost tools with tooltips, mono char count, small
  primary "Post" disabled until there's content, preview with remove ×.
- **Comments:** 28px avatars, thread line, 14/20 text, flush single-line input.
- **Profile header:** 3:1 cover flush (fallback: surface-raised block with fine
  diagonal texture); 88px avatar left-aligned overlapping the cover by 44px with
  4px `bg` ring; Follow/Edit right. Name Instrument Serif 40px, mono handle,
  15px bio, muted meta line "City · website ↗ · Joined Mar 2024", stats as mono
  numbers ("214 followers"), tabs with 2px accent underline.
- **Group row:** 48px square image (4px radius), name 15/600, mono
  "12 members" line, secondary Join button right, borders between rows.
- **Buttons:** primary = solid accent / on-accent, 600, 36px (32 sm), 4px radius.
  secondary = transparent + 1px border-strong, hover surface-raised.
  ghost = text-muted → text-primary on surface-raised. danger = danger text.
- **Inputs:** 40px, surface bg, 1px border, 4px radius, focus border accent +
  3px accent-subtle ring, labels 13/500 above.
- **Avatars:** circle, 1px inset border, mono initials on accent-subtle.
  Sizes 28 / 40 / 88.
- **Empty states:** left-aligned serif 28px headline ("Nothing saved yet."),
  one muted sentence, one secondary button. No illustrations, no emoji.
- **Skeletons:** mirror the real layout, surface-raised↔border pulse, no shimmer.
  No "Loading..." strings anywhere.
- **Toasts:** bottom-left, surface-raised, 1px border, 3px left bar in status
  color, 14px, 4s, plain wording ("Post saved.").
- **Login/Register:** split screen. Left 55% bg with giant serif wordmark and one
  line of copy (optionally a quiet strip of mono post excerpts). Right 360px form
  column on surface with left border. One "New here? Create an account" link.
  Mobile: form only + wordmark.

## Motion
120ms color/hover, 180ms menus (opacity + 4px translate), 220ms modals/toasts,
`cubic-bezier(.2,.8,.2,1)`. Like icon scales 1 → 1.18 → 1 over 200ms. New posts
fade in 160ms. Respect `prefers-reduced-motion`. No parallax, bounce or
animated gradients.

## Don'ts
No gradients, glass/blur, glow, or purple/indigo/blue accents. No radius > 8px
(except avatars/pills), no shadow-per-card. No emoji or sparkle icons in
headings/buttons. One icon family, no multicolor icons. Serif never in body or
controls. No centered heroes or gradient text. Keep density (~6 posts per 1080p
screen). Accent is the only interactive color; red only for destructive actions.
