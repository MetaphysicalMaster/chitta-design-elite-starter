"use client";

/**
 * BeforeAfter — results section on a rice-paper field. Opens with an honest
 * "As featured in Fort Worth Magazine" press strip (photo-a / photo-b are the
 * real Fort Worth Magazine editorial features — a FOCUS / "Women Who Forward
 * Fort Worth" bio of Dr. Phuah and the 2022 "Faces of Fort Worth" Laser &
 * Noninvasive feature — third-party recognition, NOT client before/afters, so
 * they are framed as press, never captioned as a client result). Below, an
 * interactive drag slider trio carries the compare MECHANIC — pointer + full
 * keyboard support (arrows/Home/End) — with brand-toned plates (rice-paper →
 * soft sakura) honestly marked "sample · illustrative" until paired before/
 * afters are sourced. The "drag to reveal" promise refers only to those tagged
 * sliders. Botanical: a light, airy frame rather than a dark gallery.
 *
 * THE REVEAL PAYOFF: each plate carries a hand-drawn sumi-e profile (the same
 * serene line-art face on both sides, perfectly registered so the drag never
 * "jumps") with per-treatment differences drawn as honest illustration —
 * forehead/glabella lines that smooth away (tox), pigment flecks that clear to
 * an even luminous tone (IPL), and a flattened mid-face that lifts into a soft
 * cheek apple (filler). The AFTER side blooms: a soft glow, sakura accents and
 * gold glints — privacy-first ("your face is never paraded online") yet the
 * drag now has a visible, on-brand difference to reveal.
 */

import { useCallback, useId, useRef, useState } from "react";
import { SectionHeading, Reveal, BrandPhoto } from "./primitives";
import { cn } from "@/lib/utils";

type CaseId = "tox" | "ipl" | "filler";

type Case = {
  id: CaseId;
  treatment: string;
  detail: string;
  before: string;
  after: string;
};

// Illustrative plates lean into the BRAND — a warm rice-paper "before" easing to
// a soft sakura "after" (hue ~6–9, the petal range), not a generic gray→pink
// cliché. Honestly tagged "sample" until paired before/afters are wired.
const CASES: Case[] = [
  {
    id: "tox",
    treatment: "Neuromodulator — Forehead & Glabella",
    detail: "Placed by Dr. Phuah · 14 days post",
    before: "linear-gradient(155deg, oklch(95% 0.008 86), oklch(90% 0.012 84))",
    after: "linear-gradient(155deg, oklch(93% 0.04 8), oklch(86% 0.07 6))",
  },
  {
    id: "ipl",
    treatment: "IPL Photofacial — Pigment & Tone",
    detail: "Three-session plan · 8 weeks",
    before: "radial-gradient(120% 120% at 40% 30%, oklch(95% 0.008 86), oklch(89% 0.012 82))",
    after: "radial-gradient(120% 120% at 40% 30%, oklch(92% 0.045 8), oklch(85% 0.075 6))",
  },
  {
    id: "filler",
    treatment: "Liquid Facial Balancing",
    detail: "Full-face plan · proportion-led",
    before: "radial-gradient(130% 100% at 60% 40%, oklch(94% 0.008 86), oklch(88% 0.012 82))",
    after: "radial-gradient(130% 100% at 60% 40%, oklch(91% 0.055 8), oklch(84% 0.085 6))",
  },
];

/* ============================================================
   Illustrative sumi-e face — the drag-reveal payoff.
   ONE shared profile (identical paths on both sides of the slider, so the
   reveal is perfectly registered) + per-treatment BEFORE concerns / AFTER
   bloom. Pure inline SVG: crisp at any DPR, zero network, zero CLS, static
   (reduced-motion safe by construction), honest "sample · illustrative".
   ============================================================ */

/* Shared base profile — a serene right-facing sumi-e line drawing. */
const FACE_BASE: { d: string; w: number }[] = [
  // the signature profile line: forehead → nose → lips → chin → jaw → neck
  {
    d: "M158 78 C196 70 226 92 232 134 C234 152 230 164 226 172 C224 180 226 186 230 194 C238 208 248 222 247 232 C246 238 240 241 236 243 C234 247 236 250 239 254 C243 258 243 263 239 266 C236 268 235 269 236 271 C241 274 243 279 240 285 C238 291 232 295 230 298 C236 302 240 309 237 318 C233 330 220 340 204 346 C186 353 168 362 160 378 C154 392 153 408 155 430",
    w: 2.4,
  },
  // flowing hair, back sweep + inner strand
  { d: "M158 78 C120 88 96 126 92 178 C88 228 100 268 96 310 C94 330 88 348 80 362", w: 2.2 },
  { d: "M170 76 C140 92 120 124 116 170 C113 208 120 240 117 274", w: 1.6 },
  // brow + closed, serene eye
  { d: "M196 170 C206 164 218 164 226 169", w: 2 },
  { d: "M200 192 C208 197 218 197 226 192", w: 2 },
  // ear + lip corner + shoulder hint
  { d: "M152 214 C140 208 132 220 138 234 C142 243 152 244 156 236", w: 1.6 },
  { d: "M224 268 C229 269.5 233 270 236 271", w: 1.4 },
  { d: "M155 430 C180 440 220 448 260 452", w: 2 },
];

/* Small brand glyphs for the AFTER bloom. */
function Sparkle({ x, y, s = 1, o = 0.8 }: { x: number; y: number; s?: number; o?: number }) {
  return (
    <path
      d="M0 -7 Q1.4 -1.4 7 0 Q1.4 1.4 0 7 Q-1.4 1.4 -7 0 Q-1.4 -1.4 0 -7 Z"
      transform={`translate(${x} ${y}) scale(${s})`}
      fill="var(--gold)"
      opacity={o}
    />
  );
}

function Petal({ x, y, r = 0, s = 1, o = 0.4 }: { x: number; y: number; r?: number; s?: number; o?: number }) {
  return (
    <path
      d="M0 -8 C3 -4 7 -3 7 1 C7 5 4 8 0 8 C-4 8 -7 5 -7 1 C-7 -3 -3 -4 0 -8 Z"
      transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}
      fill="var(--sakura-deep)"
      opacity={o}
    />
  );
}

/* Per-treatment BEFORE concern marks — quiet ink, never caricature. */
function BeforeDetails({ variant }: { variant: CaseId }) {
  const stroke = {
    stroke: "var(--ink)",
    strokeOpacity: 0.34,
    strokeWidth: 1.8,
    fill: "none",
    strokeLinecap: "round" as const,
  };
  if (variant === "tox") {
    return (
      <g {...stroke}>
        {/* forehead lines */}
        <path d="M177 104 C194 98 211 98 224 103" />
        <path d="M174 120 C193 113 212 113 227 119" />
        <path d="M173 136 C192 129 212 129 228 135" />
        {/* glabella "11s" */}
        <path d="M217 174 C216 180 215 186 216 191" />
        <path d="M225 172 C224 178 223 184 224 189" />
      </g>
    );
  }
  if (variant === "ipl") {
    return (
      <g fill="var(--ink)" fillOpacity={0.2}>
        {/* scattered pigment — cheek, temple, jaw */}
        <ellipse cx={186} cy={238} rx={5} ry={4} />
        <ellipse cx={199} cy={252} rx={3.6} ry={3} />
        <ellipse cx={178} cy={258} rx={4.4} ry={3.6} />
        <ellipse cx={206} cy={236} rx={2.8} ry={2.4} />
        <ellipse cx={190} cy={274} rx={3.4} ry={2.8} />
        <ellipse cx={205} cy={266} rx={2.6} ry={2.2} />
        <ellipse cx={180} cy={154} rx={4} ry={3.4} />
        <ellipse cx={192} cy={146} rx={3} ry={2.6} />
        <ellipse cx={171} cy={166} rx={3.2} ry={2.6} />
        <ellipse cx={214} cy={300} rx={3} ry={2.5} />
        <ellipse cx={196} cy={308} rx={4} ry={3.2} />
      </g>
    );
  }
  // filler — deflated mid-face: nasolabial fold, marionette hint, flat cheek
  return (
    <g {...stroke}>
      <path d="M225 243 C219 254 215 264 214 274" />
      <path d="M223 288 C220 296 217 303 214 309" />
      <path d="M183 232 C189 252 194 268 196 284" />
    </g>
  );
}

/* Per-treatment AFTER bloom — glow, smoothed/lifted accents, sakura + gold. */
function AfterDetails({ variant, uid }: { variant: CaseId; uid: string }) {
  const accent = {
    stroke: "var(--sakura-deep)",
    fill: "none",
    strokeLinecap: "round" as const,
  };
  return (
    <g>
      {variant === "tox" && (
        <>
          <ellipse cx={200} cy={126} rx={54} ry={32} fill={`url(#${uid}-glow)`} />
          {/* the smoothed brow — a soft dotted arc where the lines were */}
          <path d="M176 122 C196 112 218 113 230 121" {...accent} strokeOpacity={0.45} strokeWidth={2.2} strokeDasharray="0.5 7" />
          <Sparkle x={184} y={104} s={0.9} />
          <Sparkle x={224} y={146} s={0.65} o={0.65} />
        </>
      )}
      {variant === "ipl" && (
        <>
          <ellipse cx={194} cy={250} rx={56} ry={68} fill={`url(#${uid}-glow)`} />
          {/* even-tone luminosity contours along the clear cheek */}
          <path d="M176 230 C192 243 200 264 198 288" {...accent} strokeOpacity={0.35} strokeWidth={2} />
          <path d="M161 244 C173 256 179 272 177 292" {...accent} strokeOpacity={0.24} strokeWidth={2} />
          <Sparkle x={171} y={220} s={0.8} />
          <Sparkle x={207} y={286} s={0.6} o={0.7} />
          <Sparkle x={186} y={156} s={0.7} o={0.6} />
        </>
      )}
      {variant === "filler" && (
        <>
          <ellipse cx={199} cy={252} rx={36} ry={28} fill={`url(#${uid}-blush)`} />
          {/* the lifted cheek apple */}
          <path d="M180 236 C198 238 212 252 215 272" {...accent} strokeOpacity={0.5} strokeWidth={2.2} />
          {/* a defined jaw accent traced just inside the jawline */}
          <path d="M206 342 C220 335 230 327 235 316" stroke="var(--gold-deep)" strokeOpacity={0.4} strokeWidth={2} fill="none" strokeLinecap="round" />
          <Sparkle x={182} y={224} s={0.8} />
          <Sparkle x={227} y={230} s={0.6} o={0.7} />
        </>
      )}
      {/* drifting sakura — the brand's signature, only where the bloom lands */}
      <Petal x={330} y={78} r={20} />
      <Petal x={302} y={128} r={-16} s={0.7} o={0.32} />
      <Petal x={352} y={152} r={42} s={0.55} o={0.28} />
    </g>
  );
}

/* The full plate art: shared registered base + phase details. */
function FaceArt({ variant, phase }: { variant: CaseId; phase: "before" | "after" }) {
  const uid = useId();
  return (
    <svg
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
      focusable="false"
    >
      <defs>
        <radialGradient id={`${uid}-glow`}>
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.55} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${uid}-blush`}>
          <stop offset="0%" stopColor="var(--sakura-deep)" stopOpacity={0.26} />
          <stop offset="100%" stopColor="var(--sakura-deep)" stopOpacity={0} />
        </radialGradient>
      </defs>
      <g transform="translate(30 10)">
        {phase === "after" ? <AfterDetails variant={variant} uid={uid} /> : null}
        <g stroke="var(--ink)" strokeOpacity={0.5} fill="none" strokeLinecap="round" strokeLinejoin="round">
          {FACE_BASE.map((p) => (
            <path key={p.d} d={p.d} strokeWidth={p.w} />
          ))}
        </g>
        {phase === "before" ? <BeforeDetails variant={variant} /> : null}
      </g>
    </svg>
  );
}

function useSlider() {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    setFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPos((p) => Math.max(0, p - 4));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPos((p) => Math.min(100, p + 4));
    } else if (e.key === "Home") {
      e.preventDefault();
      setPos(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setPos(100);
    }
  };

  return { pos, ref, onPointerDown, onPointerMove, onPointerUp, onKeyDown };
}

function SliderHandle({
  pos,
  label,
  onKeyDown,
}: {
  pos: number;
  label: string;
  onKeyDown: (e: React.KeyboardEvent) => void;
}) {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-y-0"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      >
        <div className="relative h-full w-px bg-white/95 shadow-[0_0_0_1px_oklch(72%_0.11_86_/_0.35)]" />
      </div>
      <button
        type="button"
        role="slider"
        aria-label={`Reveal ${label} before and after. Use arrow keys to compare.`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={`Showing ${Math.round(pos)}% before, ${100 - Math.round(pos)}% after`}
        onKeyDown={onKeyDown}
        className={cn(
          "absolute top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full",
          "border border-white bg-white text-[var(--color-accent-deep)] shadow-lg backdrop-blur",
          "transition-transform duration-200 hover:scale-105",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]",
        )}
        style={{ left: `${pos}%` }}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
          <path d="M9 6 4 12l5 6M15 6l5 6-5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </>
  );
}

function Slider({ data, ratio = "4/5" }: { data: Case; ratio?: string }) {
  const { pos, ref, onPointerDown, onPointerMove, onPointerUp, onKeyDown } = useSlider();

  return (
    <figure className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--glass-shadow)]">
      <div
        ref={ref}
        className="relative w-full cursor-ew-resize touch-none select-none"
        style={{ aspectRatio: ratio }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div className="absolute inset-0" style={{ background: data.after }} aria-hidden>
          <FaceArt variant={data.id} phase="after" />
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wider text-[var(--color-fg)]">
            After
          </span>
        </div>
        <div
          className="absolute inset-0"
          style={{ background: data.before, clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          aria-hidden
        >
          <FaceArt variant={data.id} phase="before" />
          <span className="absolute left-3 top-3 rounded-full bg-[var(--night-0)]/85 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wider text-white">
            Before
          </span>
        </div>
        <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/30 px-3 py-1 text-[0.56rem] font-medium uppercase tracking-[0.2em] text-white/85 backdrop-blur-sm">
          Sample · illustrative
        </span>
        <SliderHandle pos={pos} label={data.treatment} onKeyDown={onKeyDown} />
      </div>
      <figcaption className="flex items-center justify-between gap-3 px-5 py-4">
        <span className="font-display text-lg text-[var(--color-fg)]">{data.treatment}</span>
        <span className="text-xs text-[var(--color-fg-subtle)]">{data.detail}</span>
      </figcaption>
    </figure>
  );
}

export function BeforeAfter() {
  return (
    <section
      id="results"
      className="relative scroll-mt-20 overflow-hidden py-24 sm:py-28"
    >
      {/* soft sakura aura echoing the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(50% 46% at 86% 0%, oklch(92% 0.05 8 / 0.7), transparent 70%), radial-gradient(46% 50% at 0% 100%, var(--color-accent-subtle), transparent 72%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="As featured in Fort Worth Magazine"
          title={
            <>
              The work, in the{" "}
              <span className="font-display-em text-[var(--color-accent-deep)]">public eye.</span>
            </>
          }
          lead="Dr. Phuah and the practice, featured in Fort Worth Magazine — and a look at the feather touch in motion. Slide the illustrative handles below, or use your keyboard, to see how a soft, never-overworked result reads."
        />

        {/* PRESS, framed honestly — photo-a / photo-b are Fort Worth Magazine
            editorial features (a FOCUS bio of Dr. Phuah and the 2022 "Faces of
            Fort Worth" feature), NOT client before/afters. They reinforce the
            awards/credibility narrative — the brand's proudest theme — so they
            sit as a recognition strip captioned as press, never as a client
            result. The illustrative drag-sliders below carry the honest "sample"
            mark for the compare mechanic. */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
          <Reveal>
            <figure>
              <BrandPhoto
                src="/clients/hanami/photo-a.png"
                alt="Fort Worth Magazine FOCUS feature — Dr. Elaine Phuah, DO, MBA, FACOI, of Hanami Medspa in the 'Women Who Forward Fort Worth' editorial"
                aspect="4 / 5"
                radius="2xl"
                position="50% 30%"
                frame
                sizes="(min-width: 1024px) 32rem, (min-width: 640px) 45vw, 100vw"
                className="shadow-[var(--glass-shadow)]"
              />
              <figcaption className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--color-fg-subtle)]">
                <span className="font-medium text-[var(--color-accent-deep)]">As featured in Fort Worth Magazine</span>
                <span aria-hidden className="text-[var(--color-fg-subtle)]/60">·</span>
                <span>Women Who Forward Fort Worth</span>
              </figcaption>
            </figure>
          </Reveal>
          <Reveal delay={0.08}>
            <figure>
              <BrandPhoto
                src="/clients/hanami/photo-b.jpeg"
                alt="Fort Worth Magazine feature — 'The Face of Laser & Noninvasive Skin Rejuvenation,' Hanami Medspa's Dr. Phuah and team"
                aspect="4 / 5"
                radius="2xl"
                position="50% 30%"
                frame
                sizes="(min-width: 1024px) 32rem, (min-width: 640px) 45vw, 100vw"
                className="shadow-[var(--glass-shadow)]"
              />
              <figcaption className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--color-fg-subtle)]">
                <span className="font-medium text-[var(--color-accent-deep)]">As featured in Fort Worth Magazine</span>
                <span aria-hidden className="text-[var(--color-fg-subtle)]/60">·</span>
                <span>Faces of Fort Worth · 2022</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>

        {/* The compare mechanic — clearly framed as an illustrative demo so the
            honestly-tagged sample sliders never read as faux before/afters. */}
        <div className="mt-16">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-deep)]">
            See the difference · drag to reveal
          </p>
          <p className="mt-2 max-w-[56ch] text-sm font-light text-[var(--color-fg-muted)]">
            An illustrative look at the feather touch — soft, balanced, never
            frozen.{" "}
            <span className="text-[var(--color-fg)]">
              Real, consented before &amp; afters are shared privately at your
              consultation
            </span>{" "}
            — your face is never paraded online.
          </p>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-3">
          {CASES.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.08}>
              <Slider data={c} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
