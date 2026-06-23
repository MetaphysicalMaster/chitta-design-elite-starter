"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { AuroraGradient } from "@/components/effects/aurora-gradient";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Motion primitives                                                  */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Exponential proof chart                                            */
/*  Builds two SVG paths — additive (flat-ish) vs exponential —        */
/*  and marks the inflection point where the gap becomes undeniable.   */
/* ------------------------------------------------------------------ */

const CHART_W = 760;
const CHART_H = 360;
const PAD = 8;

function buildPaths() {
  const steps = 48;
  const additive: string[] = [];
  const exponential: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps; // 0..1
    const x = PAD + t * (CHART_W - PAD * 2);

    // Additive: a gentle straight climb.
    const yAdd = CHART_H - PAD - t * (CHART_H * 0.18);

    // Exponential: hockey-stick. Normalised e-curve.
    const k = 4.1;
    const norm = (Math.exp(k * t) - 1) / (Math.exp(k) - 1);
    const yExp = CHART_H - PAD - norm * (CHART_H - PAD * 2);

    additive.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${yAdd.toFixed(1)}`);
    exponential.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${yExp.toFixed(1)}`);
  }

  // Inflection marker — where exponential visibly tears away (~72%).
  const it = 0.72;
  const kx = PAD + it * (CHART_W - PAD * 2);
  const knorm = (Math.exp(4.1 * it) - 1) / (Math.exp(4.1) - 1);
  const ky = CHART_H - PAD - knorm * (CHART_H - PAD * 2);

  return {
    additive: additive.join(" "),
    exponential: exponential.join(" "),
    inflection: { x: kx, y: ky },
  };
}

function ExponentialChart() {
  const reduce = useReducedMotion();
  const { additive, exponential, inflection } = useMemo(() => buildPaths(), []);

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-border bg-bg-elevated p-4 sm:p-8">
      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        className="w-full h-auto"
        role="img"
        aria-label="A chart comparing additive marketing, which climbs gently in a near-straight line, against metamarketing, which curves exponentially upward and tears away at the inflection point."
      >
        {/* baseline grid */}
        {[0.25, 0.5, 0.75].map((g) => (
          <line
            key={g}
            x1={PAD}
            x2={CHART_W - PAD}
            y1={CHART_H - PAD - g * (CHART_H - PAD * 2)}
            y2={CHART_H - PAD - g * (CHART_H - PAD * 2)}
            className="stroke-border"
            strokeWidth={1}
            strokeDasharray="2 6"
          />
        ))}

        {/* additive line */}
        <motion.path
          d={additive}
          fill="none"
          className="stroke-fg-subtle"
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={reduce ? undefined : { pathLength: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />

        {/* exponential gradient stroke */}
        <defs>
          <linearGradient id="expgrad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-info)" />
            <stop offset="100%" stopColor="var(--color-accent)" />
          </linearGradient>
        </defs>
        <motion.path
          d={exponential}
          fill="none"
          stroke="url(#expgrad)"
          strokeWidth={4}
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={reduce ? undefined : { pathLength: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{ filter: "drop-shadow(0 0 10px var(--color-accent-subtle))" }}
        />

        {/* inflection marker */}
        <motion.g
          initial={reduce ? false : { opacity: 0, scale: 0.6 }}
          whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 1.4, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ transformOrigin: `${inflection.x}px ${inflection.y}px` }}
        >
          <circle cx={inflection.x} cy={inflection.y} r={7} className="fill-accent" />
          <circle cx={inflection.x} cy={inflection.y} r={13} className="fill-none stroke-accent" strokeWidth={1.5} opacity={0.5} />
        </motion.g>
      </svg>

      {/* legend */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex items-center gap-2 text-sm text-fg-muted">
          <span className="h-0.5 w-6 rounded bg-fg-subtle" />
          Everyone else — marketing that <em className="not-italic text-fg">adds</em>
        </div>
        <div className="flex items-center gap-2 text-sm text-fg">
          <span className="h-1 w-6 rounded bg-gradient-to-r from-info to-accent" />
          Metamarketing — results that <span className="bg-gradient-to-r from-info to-accent bg-clip-text font-semibold text-transparent">compound</span>
        </div>
      </div>

      <p className="mt-4 text-sm text-fg-muted">
        <span className="font-medium text-accent">The marked point</span> is the inflection —
        the day the difference stops being a theory and becomes your bank balance. You won&apos;t
        have to guess when it arrives. You&apos;ll watch it happen.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Live growth simulator                                              */
/*  Visitor-driven. This widget is itself the proof that we build      */
/*  working web apps — not static pages.                               */
/* ------------------------------------------------------------------ */

function fmt(n: number) {
  return Math.round(n).toLocaleString("en-US");
}

function GrowthSimulator() {
  const [months, setMonths] = useState(8);

  const base = 100;
  const additive = base + months * 14; // linear
  const exponential = base * Math.pow(1.46, months); // compounding
  const multiple = exponential / additive;

  // bar widths (relative to exponential at 12mo as ceiling)
  const ceiling = base * Math.pow(1.46, 12);
  const addPct = Math.max(2, (additive / ceiling) * 100);
  const expPct = Math.max(2, (exponential / ceiling) * 100);

  return (
    <div className="rounded-3xl border border-border bg-bg-elevated p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label htmlFor="months" className="text-sm font-medium text-fg">
          Run the clock forward
        </label>
        <span className="font-mono text-sm text-fg-muted">
          month <span className="text-fg">{months}</span> / 12
        </span>
      </div>

      <input
        id="months"
        type="range"
        min={0}
        max={12}
        step={1}
        value={months}
        onChange={(e) => setMonths(Number(e.target.value))}
        className="mt-4 w-full accent-[var(--color-accent)]"
        aria-describedby="sim-output"
      />

      <div id="sim-output" className="mt-8 grid gap-6 sm:grid-cols-2">
        {/* additive */}
        <div>
          <p className="text-sm text-fg-muted">Everyone else (additive)</p>
          <p className="mt-1 font-mono text-3xl font-semibold text-fg-subtle tabular-nums">
            {fmt(additive)}
          </p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-bg-subtle">
            <motion.div
              className="h-full rounded-full bg-fg-subtle"
              animate={{ width: `${addPct}%` }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>

        {/* exponential */}
        <div>
          <p className="text-sm text-fg">Metamarketing (exponential)</p>
          <p className="mt-1 bg-gradient-to-r from-info to-accent bg-clip-text font-mono text-3xl font-semibold tabular-nums text-transparent">
            {fmt(exponential)}
          </p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-bg-subtle">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-info to-accent"
              animate={{ width: `${expPct}%` }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      </div>

      <p className="mt-8 text-base text-fg-muted">
        At month <span className="text-fg">{months}</span>, metamarketing is already{" "}
        <span className="font-semibold text-accent">{multiple.toFixed(1)}×</span> ahead — and the
        gap widens every month you wait.{" "}
        <span className="text-fg">
          You just dragged that yourself. That&apos;s a web app — not a brochure. It&apos;s also
          exactly what we build for you.
        </span>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable CTA                                                       */
/* ------------------------------------------------------------------ */

function PrimaryCTA({ className }: { className?: string }) {
  return (
    <motion.a
      whileHover={{ scale: 1.02, boxShadow: "var(--shadow-lg)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      href="#apply"
      className={cn(
        "inline-flex h-12 items-center justify-center rounded-xl px-7",
        "bg-fg text-bg font-medium text-sm",
        "hover:bg-fg-muted transition-colors duration-fast",
        className
      )}
    >
      Request the audit
    </motion.a>
  );
}

/* ------------------------------------------------------------------ */
/*  Clarity pillars                                                    */
/* ------------------------------------------------------------------ */

const pillars = [
  {
    k: "When",
    d: "You will know the exact day the curve bends. Not a quarter later in a report — the day it happens.",
  },
  {
    k: "Why",
    d: "No fog, no 'attribution is hard.' You'll see precisely what moved, and what it moved.",
  },
  {
    k: "How much",
    d: "Not a few points of lift. A multiple. The kind of number you have to read twice.",
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <div className="flex min-h-screen flex-1 flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            <span className="bg-gradient-to-r from-info to-accent bg-clip-text text-lg font-semibold tracking-tight text-transparent">
              metamarker
            </span>
          </motion.div>
          <div className="flex items-center gap-3">
            <PrimaryCTA className="h-9 px-4" />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex flex-1 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <AuroraGradient
            colors={[
              "var(--color-accent)",
              "var(--color-info)",
              "transparent",
              "var(--color-accent)",
            ]}
            duration={40}
            blur={110}
            className="opacity-[0.18]"
          />
          {/* vignette to focus the centre */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--color-bg)_78%)]" />
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="relative z-10 mx-auto max-w-3xl px-6 py-28 text-center"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated px-3 py-1 font-mono text-xs font-medium tracking-wide text-fg-muted"
          >
            <span className="size-1.5 animate-pulse rounded-full bg-accent" />
            metamarketing
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mt-8 text-5xl font-semibold leading-[1.04] tracking-tight text-fg sm:text-7xl"
          >
            Results that don&apos;t add up.
            <br />
            <span className="bg-gradient-to-r from-info to-accent bg-clip-text text-transparent">
              They compound.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-fg-muted"
          >
            Everyone else moves the needle a little. Metamarketing bends the curve — and you&apos;ll
            see the exact day it happens, and exactly why.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <PrimaryCTA />
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              href="#proof"
              className={cn(
                "inline-flex h-12 items-center justify-center rounded-xl px-6",
                "border border-border bg-bg-elevated text-fg font-medium text-sm",
                "hover:border-fg-subtle hover:bg-bg-subtle transition-colors duration-fast"
              )}
            >
              See the proof
            </motion.a>
          </motion.div>
        </motion.div>
      </section>

      {/* Proof — the curve */}
      <section id="proof" className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-semibold tracking-tight text-fg sm:text-5xl">
              Two businesses. Same starting line.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-fg-muted">
              One did marketing. One did metamarketing. Watch where they end up — and watch the
              moment the difference becomes impossible to argue with.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <ExponentialChart />
          </motion.div>
        </div>
      </section>

      {/* Clarity pillars */}
      <section className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 max-w-2xl"
          >
            <h2 className="text-3xl font-semibold tracking-tight text-fg sm:text-5xl">
              Nothing about it is ambiguous.
            </h2>
            <p className="mt-4 text-lg text-fg-muted">
              Marketing is supposed to be the line item nobody can measure. Not here. There will be
              no avoiding when your business transforms — or why.
            </p>
          </motion.div>

          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 gap-4 sm:grid-cols-3"
          >
            {pillars.map((p) => (
              <motion.li
                key={p.k}
                variants={itemVariants}
                whileHover={{ y: -4, boxShadow: "var(--shadow-lg)" }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl border border-border bg-bg-elevated p-6"
              >
                <h3 className="bg-gradient-to-r from-info to-accent bg-clip-text text-2xl font-semibold tracking-tight text-transparent">
                  {p.k}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{p.d}</p>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* Live simulator + the machine */}
      <section className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 max-w-2xl"
          >
            <h2 className="text-3xl font-semibold tracking-tight text-fg sm:text-5xl">
              We don&apos;t redesign websites.
              <br />
              <span className="text-fg-muted">We build the machine.</span>
            </h2>
            <p className="mt-4 text-lg text-fg-muted">
              A website tells. A web app does. We build living systems that work while you sleep —
              and a static page could never compound the way this one moves. Drag it. Prove it to
              yourself.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <GrowthSimulator />
          </motion.div>
        </div>
      </section>

      {/* The mystery + CTA */}
      <section id="apply" className="border-t border-border px-6 py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-fg-subtle">
            One last thing
          </p>
          <h2 className="mt-6 text-4xl font-semibold tracking-tight text-fg sm:text-6xl">
            So — what <em className="not-italic">is</em> metamarketing?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
            We&apos;re not going to tell you here. The businesses that need it find out. The rest
            keep guessing — and keep adding, one needle-nudge at a time.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-fg">
            There&apos;s only one way through that door.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <PrimaryCTA />
            <span className="font-mono text-xs text-fg-subtle">
              By application. We take on a limited number.
            </span>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-fg-muted sm:flex-row">
          <span className="bg-gradient-to-r from-info to-accent bg-clip-text font-semibold text-transparent">
            metamarker
          </span>
          <p>Results that compound. © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
