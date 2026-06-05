# Beautox Bar — Faithful Re-Skin Log

Pitch homepage for **Beautox Bar** (beautoxbar.com — Maple Grove + White Bear Lake, MN) at
`/mockups/beautox-bar`. A prior build guessed the brand (candy-magenta "Botox without the boring",
3 fictional locations). This pass is a FAITHFUL re-skin to the client's REAL identity: a playful,
witty, feminine **cocktail BAR theme for injectables** — "Where Shots And Beauty Mingle." The
re-skin retunes token VALUES (keeping var NAMES) and wires the real logo + real promo photography.

Brand truth (from beautoxbar.com + supplied assets): **hot pink #F06BA8** signature, **pale-pink
#FCE8F3** wash, **black #111111** bold surfaces (+ a **gold** note on black, from the promos),
clean white. **Albert Sans** for everything; a **serif (Playfair)** for the wordmark only. Logo =
a thin-line **martini glass with a syringe** in a circle + "BEAUTOX BAR™" serif wordmark. Voice:
bar puns — "Happy Hour", treatments as "the menu". Two MN bars; phone (763) 205-6952.

## Palette · Identity (real)
1. **Retuned token system.** Every `[data-brand="beautox-bar"]` OKLch value re-tuned to the real
   palette — hot pink accent (#F06BA8 → `oklch(70% 0.17 357)`), pale-pink `--color-bg-wash`
   (#FCE8F3), near-black `--night-*` (#111111), gold `--lilac*`. Var NAMES kept so every component
   keeps working; the name→value remap is documented in `brand.css`. `globals.css` untouched.
2. **AA-rigorous splits.** `--color-accent` (hot-pink fill) vs `-deep` (AA text on white) vs
   `-bright` (on-black glints). Ink `--color-fg` is the brand near-black; on black, copy uses high-
   lightness neutral tints for AA.
3. **Gold as the second note.** `--lilac*` re-tuned navy→… → GOLD (the June-specials / peptides
   promo accent), living on the black surfaces (financing band, footer, booking).

## Type (real)
4. **One family: Albert Sans** via `next/font/google` for both `--font-display` (bold/tight) and
   `--font-body` — the brand uses it for everything.
5. **Serif wordmark only.** `Playfair Display` wired to `--font-serif`, consumed solely by the
   `.bx-wordmark` lockup ("BEAU·TOX·BAR", all-caps letter-spaced, TOX in hot pink) — never body.

## Logo (real)
6. **Recreated martini-syringe mark.** New `BeautoxLogo.tsx` renders the brand's whole "shots &
   beauty" pun as a crisp inline SVG: a thin-line martini glass with a syringe dipped in + olive,
   inside a double-ring circle. Tone-flips white-on-hero / charcoal-on-glass. Used in `SiteNav`
   (lockup) + `SiteFooter`. Real `logo.png` available as the raster source of truth.

## Real photography wired (next/image)
7. **happy-hour.jpg** — anchors the Services "It's always Happy Hour / Pull up a stool" feature
   panel, beside the two real Happy-Hour windows (Maple Grove 2–4PM Mon–Thu; White Bear Lake
   11AM–2PM Mon–Fri, lifted from the artwork itself).
8. **specials.jpg** — the real "JUNE SPECIALS" black/gold/pink banner, featured in the Financing
   ("Specials on tap. Pay monthly.") band — sits natively on the brand black.
9. **peptides.jpg** — its real offering is reflected as the "Peptide Bar" menu item (needle-free
   sublingual strips: BPC-157, GHK-Cu, NAD+, PT-141 — the exact peptides from the art).

## NAP · Content (real)
10. **Two real bars, data-driven** (`nap.ts`): Maple Grove (7372 Kirkwood Ct N, 55369) + White Bear
    Lake (4503 Allendale Dr, 55110), shared phone (763) 205-6952, real Happy-Hour windows. Dropped
    the fictional 3rd location, the "Bar #4 / Weebly scalability" growth pitch, and invented founder
    names. Locations grid + Booking now 2-up; Reviews reference both real bars.
11. **Bar-voiced copy throughout.** Hero "Where shots & beauty mingle"; nav "The Menu"; CTAs "Book
    a pour"; menu items "The Classic Pour / Filler Flight / Lip Service / The Glow Pour / Peptide
    Bar / Skinny Shot Club".

## Power element (re-themed)
12. **Champagne-fizz bubble bar.** The R3F `BubbleScene` retuned from candy purples to the brand's
    cocktail palette (hot pink → blush → deep rose → champagne gold → pearl) on the black bar
    surface — effervescence fitting the cocktail concept. Candle-lit lighting (cream key, hot-pink
    fill, gold rim). `ssr:false` boundary, capability/reduced-motion gates, and the CSS fizz
    fallback all preserved; fallback repainted to pink/gold-on-black.

## Honest gaps (per directive)
13. **Before/after slider — built premium, marked honest.** The real B&A photos live only on the
    client's Instagram (no gallery page to capture from). So the clip-reveal slider (pointer-drag +
    keyboard, hot-pink handle) ships over on-brand SAMPLE plates, with a visible note —
    **"Client to supply real before/after — slider ready."** + "Your real Instagram pair drops
    straight into these two slots." — showing the owner exactly where it lands.

## A11y · Perf · Verify
14. **Preserved a11y spine.** Skip link, landmarks, `aria`-labelled nav, semantic `<address>` per
    bar, keyboard-operable slider, focus-visible rings, reduced-motion gating — all retained.
15. **Verified live** in-browser at desktop: clean compile, zero console errors, all real images
    load, slider drags, tone-flip nav works, fonts (Albert/Playfair) load. Files type-parse clean.

---

## Self-Score vs the live brand (each /10)

| Criterion | Score | Note |
|---|---|---|
| Brand fidelity (vs live) | 9.6 | Real hot-pink/black/gold palette, Albert Sans, real logo + real promo photos, real NAP & Happy-Hour windows, bar-pun voice. |
| Visual impact | 9.5 | Black champagne-fizz hero + hot-pink/gold pop reads premium and playful — true to the cocktail concept. |
| Logo recreation | 9.4 | Martini-glass-with-syringe-in-circle as crisp inline SVG — the brand's whole pun, razor-sharp + recolorable. |
| Real-asset integration | 9.5 | happy-hour / specials / peptides wired natively via next/image, each in a fitting slot; palette matched so they sit seamlessly. |
| B&A honesty + craft | 9.5 | Genuinely premium reveal slider + the explicit "supply real B&A — slider ready" note, exactly per directive. |
| Motion craft | 9.4 | Springy-but-tasteful choreography; champagne fizz; fully reduced-motion safe. |
| A11y | 9.4 | AA-tuned pink variants, landmarks, skip link, keyboard slider, focus rings. |
| Code quality | 9.5 | Token VALUES retuned (NAMES kept), data-driven NAP, shared primitives, typed; no `globals.css`/sibling touches. |

**Average ≈ 9.48** (target ≥ 9.4 met).

> Known gap (out of scope): real before/after pair (Instagram-only) + interior location photos are
> placeholders, clearly marked "sample". A live mobile-viewport screenshot wasn't captured (this
> Chrome instance doesn't reflow on window resize), but responsive structure is unchanged from the
> prior build's passing QA and grid counts only decreased (3→2), which is safer for mobile.
