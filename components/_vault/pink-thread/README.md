# Pink Thread — vaulted signature element

A **continuous scroll-drawn accent line** that "sews" a whole landing page
together: it spills out of a script signature, wraps a portrait, underlines the
statement word of each section heading, threads vertically through grids, fuses
with a timeline rail, passes through a before/after divider, and finally ties a
knot around the closing CTA — the entire page held on one living drawn line.

It was originally built for the **Sousan Med Spa** pitch and removed from that
site on 2026-06-13: a continuous line that wanders all over the page reads as
**imprecise / all-over-the-place**, which is the wrong signal for a *precision*
medical-aesthetics brand. It is stored here for **reuse in a future industry**.

> **Best for:** an **expressive / creative / editorial** industry where a
> hand-drawn "one continuous gesture" feels on-brand — e.g. a fashion label,
> an illustrator/photographer portfolio, a creative studio or agency, a wedding
> or events brand, a storytelling/long-form editorial site.
>
> **Not for:** precision / clinical / medical / engineering / finance brands,
> where the wandering line undercuts the "exact, controlled, refined" promise.

## How it works

- Section markup tags anchors with `data-thread="start|frame|underline|rail|pass|passv|knot"`.
  On mount (and on resize / font-load / layout change) the component measures each
  anchor via the `offsetParent` chain (LAYOUT positions — immune to entrance-reveal
  transforms that pollute `getBoundingClientRect`) and builds one smooth Catmull-Rom
  path through them, inserting alternating left/right "weave" sways across long gaps.
- The path is drawn with the classic `stroke-dashoffset` technique, scrubbed by a
  single GSAP `ScrollTrigger` (sync it to your smooth-scroll/Lenis instance).
- Color-pop hooks: elements tagged `data-pop` get `.is-popped` as they cross the
  viewport; hairlines tagged `data-rule` draw in with a transform-only `scaleX`.
- Craft: `stroke-dashoffset` + transforms only (no layout thrash), one `<path>`,
  sampling done once per build, `pointer-events:none`, `aria-hidden`. Under
  `prefers-reduced-motion` it renders fully drawn and quiet (no scrub, no tip).

## Reusing it

1. Drop `PinkThread.tsx` into the target slug's components folder (rename the
   component/accent color to fit that brand — it doesn't have to be pink).
2. Bring the styles: copy the `.sn-thread*`, color-pop, and `.sn-signature`
   rules into the target's scoped brand CSS (see `pink-thread.css` here — these
   were lifted verbatim from the Sousan `brand.css` so nothing is lost). Re-point
   the stroke/glow/tip colors at the new brand's accent token.
3. Add the `data-thread` / `data-pop` / `data-rule` anchors to that page's
   sections, and ensure your `ScrollTrigger` is synced to your smooth scroller.

## Files

- `PinkThread.tsx` — the component (verbatim copy of the removed Sousan version).
- `pink-thread.css` — the supporting styles (thread stroke/tip/glow, color-pop
  moments, the script `.sn-signature` origin), lifted from Sousan `brand.css`.

> Stored element only — **not imported by any live slug.** Do not wire this into
> a precision/medical brand.
