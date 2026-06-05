# SESSION HANDOFF — CHITTA DesignGod med-spa pitch-mockup program

**Purpose:** Continue this work in a NEW (ideally local desktop + browser-MCP) Claude Code session with full context. Everything below is already committed to branch `claude/columbus-med-spa-leads-PIBPb` of `MetaphysicalMaster/chitta-design-elite-starter`. Nothing is lost.

## WHY THE MOVE
The previous session ran in the Claude Code **web sandbox**, whose network policy 403'd every client website + image CDN. So mockups were built from *reconstructed* research, not from *seeing* the real sites → weak brand transference (wrong colors/logo/elements). **The fix:** run locally (your machine's network) with a **Playwright/browser MCP** so Claude can render, screenshot, and pull real assets from the live sites.

## WHAT THIS PROGRAM IS
We find med spas / dermatology / aesthetics practices with weak websites, build a $10K-tier "AFTER" pitch homepage (Next.js 16 + Tailwind v4 + React Three Fiber/Three.js) on the `chitta-design-elite-starter` repo, deploy each as its own GitHub Pages repo (`<slug>-rebrand`), and pitch the owner. Methodology mirrors the prior "Pure Silk" rebuild.

## CURRENT STATE (all on the branch)
**Mockups built** — routes under `app/mockups/<slug>/`, components under `components/mockups/<slug>/`. Each: scoped `[data-brand="<slug>"]` OKLch tokens, a signature Three.js power element (`dynamic(ssr:false)` + `IntersectionObserver` pause + on-brand static fallback), reusable sections, `tsc`+`next build` gated, self-scored ≥9.4, 40–54 passes each.
- **Columbus (deployed + live, photo-loaded):** `blue-sky`, `encore` → live at `metaphysicalmaster.github.io/blue-sky-rebrand/`, `/encore-rebrand/`. (`beyond-skin`, `the-luxe` also built + deployed, parked.)
- **National set (built, bundles in `deploy/`, NOT yet deployed):** `avail`, `happy-clinic`, `simplyskin`, `timeless`, `hanami`, `sousan`, `darst`, `beautox-bar`, `karma`, `eternity`.

**Research / strategy docs** (`docs/leads/`):
- `columbus-med-spa-leads.md` — original 6-prospect scorecard.
- `expansion-15-city-lead-bank.md` — 15-city worst-website lead bank (45 candidates, 3-axis scored).
- `top-10-build-targets.md` — the 10 selected for builds.
- `top-10-gameplan.md` — DesignGod × DistroGod co-counsel (per-lead brand + power element + GTM hook + offer).
- `docs/mockups/GOAL.md` — Columbus build tracker.

**Deploy:** `deploy/build-pages.sh` builds slimmed (~6MB) per-client static bundles; `deploy/<slug>-rebrand/` are ship-ready. Ship flow = `gh repo create MetaphysicalMaster/<slug>-rebrand --public --source=. --push` then `gh api -X POST repos/MetaphysicalMaster/<slug>-rebrand/pages -f "source[branch]=main" -f "source[path]=/"`.

## THE OWNER'S LATEST DIRECTION (do this next)
**Drop 3** (their sites are already good): `avail`, `karma`, `eternity`.
**Enhance 7 with REAL brand transference** — and for each: keep their **actual brand colors + logo**, keep their **one strongest existing element**, and lean into the **female-luxury med-spa aesthetic**.

| Slug | Real-brand directive (from the live site) |
|---|---|
| `darst` | ✅ DONE — rebranded to real brown brush-script logo + teal tones; split-flap reviews + treatment marquee added |
| `happy-clinic` | Pull **Dr. Nguyen's** photo (polish) onto the page; use his real **before/afters** in the slider; add the split-flap review board |
| `simplyskin` | Take their **hero photo** and animate it into a **seamless joyful loop** (Higgsfield img→video, identical first/last frame, woman having a moment of joy) |
| `timeless` | Real **doctor photos** (polished); keep + elevate their **FAQ chatbot** → guided booking walkthrough |
| `hanami` | Make hero petals look like **real Japanese cherry-blossom** petals; DROP reviews, instead an **oversized scrolling awards rail** (their proudest element); pull + polish the **doctor photo** |
| `sousan` | **Kill the green** (wrong brand); recreate their hero aesthetic = **greyscale with selective pink pop** (pink lipstick/earrings) and stretch it site-wide; highlight their **awards** |
| `beautox-bar` | Plug their **killer real before/after** photo into the B&A slider |

**Two shared elements to infuse into most builds:**
1. **Split-flap "Solari" review board** — 6 panels; one panel flips every **1.5s** round-robin so each individual panel refreshes every **9s**; 3D `rotateX` bottom-hinge leaf flip; reduced-motion → crossfade. (Reference impl: `components/mockups/darst/SplitFlapBoard.tsx`.)
2. **Treatment marquee** (from Karma's site) — horizontal auto-scrolling treatment cards w/ quality photos; pause on hover; reduced-motion-safe. (Reference: `components/mockups/darst/TreatmentMarquee.tsx`.)

## HOW TO GET REAL ASSETS (the whole point of moving local)
- Use the **Playwright/browser MCP** to open each live site, screenshot it, and read its real palette/logo/layout/best-element.
- Pull the real images (doctor headshots, hero, before/afters, award badges) directly; save into `public/clients/<slug>/` and reference them, OR feed their URLs to an image/video gen MCP (e.g. Higgsfield) to polish/animate.
- For SimplySkin's hero animation: image→video, first frame = last frame for a seamless loop.

## TOOLING NOTES
- Image/video gen in the old session = Higgsfield MCP (`generate_image` nano_banana_pro / gpt_image_2; `generate_video` for the SimplySkin loop). Add it in the new session if you want AI imagery/animation. Its brand-kit *scrape* exists but its auto-colors proved unreliable (read Darst as blue, not brown) — trust the live screenshot, not the scrape.
- Next.js 16 has breaking changes — read `node_modules/next/dist/docs/` before coding (see `AGENTS.md`).
- Commit identity for verified commits: `git config user.email noreply@anthropic.com && git config user.name Claude`.

## IMMEDIATE NEXT STEPS
1. Add a Playwright/browser MCP; open each of the 7 live sites; capture real brand + assets.
2. Re-derive + rebuild the 6 remaining (`happy-clinic`, `simplyskin`, `timeless`, `hanami`, `sousan`, `beautox-bar`) faithfully, Darst-style. Cross-check `darst` against its live site too.
3. Rebuild slimmed bundles (`bash deploy/build-pages.sh`), deploy the 7 to GitHub Pages.
4. Draft outreach per `top-10-gameplan.md`; Wave-1 first (Happy Clinic, SimplySkin + the strongest).
