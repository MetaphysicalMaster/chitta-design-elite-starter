"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
/*  Two SVG paths — additive (flat-ish) vs exponential — with the      */
/*  inflection point where the gap becomes undeniable.                 */
/* ------------------------------------------------------------------ */

const CHART_W = 760;
const CHART_H = 360;
const PAD = 8;

function buildPaths() {
  const steps = 48;
  const additive: string[] = [];
  const exponential: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = PAD + t * (CHART_W - PAD * 2);
    const yAdd = CHART_H - PAD - t * (CHART_H * 0.18);
    const k = 4.1;
    const norm = (Math.exp(k * t) - 1) / (Math.exp(k) - 1);
    const yExp = CHART_H - PAD - norm * (CHART_H - PAD * 2);
    additive.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${yAdd.toFixed(1)}`);
    exponential.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${yExp.toFixed(1)}`);
  }
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
        className="h-auto w-full"
        role="img"
        aria-label="Two lines from the same origin. One climbs gently, almost straight. The other curves upward and tears away — and a marked point shows the moment the difference becomes impossible to miss."
      >
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

        <motion.g
          initial={reduce ? false : { opacity: 0, scale: 0.6 }}
          whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 1.4, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ transformOrigin: `${inflection.x}px ${inflection.y}px` }}
        >
          <circle cx={inflection.x} cy={inflection.y} r={7} className="fill-accent" />
          <circle
            cx={inflection.x}
            cy={inflection.y}
            r={13}
            className="fill-none stroke-accent"
            strokeWidth={1.5}
            opacity={0.5}
          />
        </motion.g>
      </svg>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex items-center gap-2 text-sm text-fg-muted">
          <span className="h-0.5 w-6 rounded bg-fg-subtle" />
          Everyone else — the line that <em className="not-italic text-fg">adds</em>
        </div>
        <div className="flex items-center gap-2 text-sm text-fg">
          <span className="h-1 w-6 rounded bg-gradient-to-r from-info to-accent" />
          Metamarketing — the line that{" "}
          <span className="bg-gradient-to-r from-info to-accent bg-clip-text font-semibold text-transparent">
            compounds
          </span>
        </div>
      </div>

      <p className="mt-4 text-sm text-fg-muted">
        You will never have to be told which line is yours. The day the curve bends, you feel it in
        the bank, in the calendar, in the room.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Living system — constellation                                      */
/*  A single ignition cascades through the connected field until the   */
/*  whole network is lit. One move; the whole system answers. The      */
/*  layout is deterministic (seeded), so it is SSR-safe and stable.    */
/* ------------------------------------------------------------------ */

const FIELD_W = 760;
const FIELD_H = 420;

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Node {
  x: number;
  y: number;
}

const COLS = 8;
const ROWS = 5;

const NODES: Node[] = (() => {
  const rand = mulberry32(20240617);
  const out: Node[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const jx = (rand() - 0.5) * 0.62;
      const jy = (rand() - 0.5) * 0.62;
      out.push({
        x: (c + 0.5 + jx) * (FIELD_W / COLS),
        y: (r + 0.5 + jy) * (FIELD_H / ROWS),
      });
    }
  }
  return out;
})();

const EDGES: { a: number; b: number }[] = (() => {
  const out: { a: number; b: number }[] = [];
  const seen = new Set<string>();
  NODES.forEach((n, i) => {
    const nearest = NODES.map((m, j) => ({ j, d: (m.x - n.x) ** 2 + (m.y - n.y) ** 2 }))
      .filter((o) => o.j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, 3);
    nearest.forEach((o) => {
      const a = Math.min(i, o.j);
      const b = Math.max(i, o.j);
      const key = `${a}-${b}`;
      if (!seen.has(key)) {
        seen.add(key);
        out.push({ a, b });
      }
    });
  });
  return out;
})();

const HOPS: number[][] = (() => {
  const adj: number[][] = NODES.map(() => []);
  EDGES.forEach(({ a, b }) => {
    adj[a].push(b);
    adj[b].push(a);
  });
  return NODES.map((_, src) => {
    const dist = NODES.map(() => Infinity);
    dist[src] = 0;
    const queue = [src];
    while (queue.length) {
      const u = queue.shift()!;
      for (const v of adj[u]) {
        if (dist[v] === Infinity) {
          dist[v] = dist[u] + 1;
          queue.push(v);
        }
      }
    }
    return dist.map((d) => (Number.isFinite(d) ? d : 6));
  });
})();

function NodeCircle({
  node,
  delay,
  igniteId,
  reduce,
}: {
  node: Node;
  delay: number;
  igniteId: number;
  reduce: boolean | null;
}) {
  const [lit, setLit] = useState(false);

  useEffect(() => {
    if (reduce || igniteId === 0) return;
    const on = setTimeout(() => setLit(true), delay);
    const off = setTimeout(() => setLit(false), delay + 520);
    return () => {
      clearTimeout(on);
      clearTimeout(off);
    };
  }, [igniteId, delay, reduce]);

  return (
    <motion.circle
      cx={node.x}
      cy={node.y}
      r={3.2}
      className={lit ? "fill-accent" : "fill-fg-subtle"}
      animate={{ scale: lit ? 2.2 : 1, opacity: lit ? 1 : 0.42 }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      style={{
        transformBox: "fill-box",
        transformOrigin: "center",
        filter: lit ? "drop-shadow(0 0 9px var(--color-accent))" : "none",
      }}
    />
  );
}

function Constellation() {
  const reduce = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const throttle = useRef(0);
  const [wave, setWave] = useState({ id: 0, origin: 0 });

  const ignite = useCallback((origin: number) => {
    setWave((w) => ({ id: w.id + 1, origin }));
  }, []);

  useEffect(() => {
    if (reduce) return;
    const first = setTimeout(() => ignite(Math.floor(Math.random() * NODES.length)), 700);
    const loop = setInterval(() => ignite(Math.floor(Math.random() * NODES.length)), 3600);
    return () => {
      clearTimeout(first);
      clearInterval(loop);
    };
  }, [reduce, ignite]);

  const handlePointer = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (reduce) return;
      const now = performance.now();
      if (now - throttle.current < 150) return;
      throttle.current = now;
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width) * FIELD_W;
      const py = ((e.clientY - rect.top) / rect.height) * FIELD_H;
      let best = 0;
      let bd = Infinity;
      NODES.forEach((n, i) => {
        const d = (n.x - px) ** 2 + (n.y - py) ** 2;
        if (d < bd) {
          bd = d;
          best = i;
        }
      });
      ignite(best);
    },
    [reduce, ignite]
  );

  const hops = HOPS[wave.origin];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-bg-elevated">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,var(--color-accent-subtle),transparent_70%)] opacity-50" />
      <svg
        ref={svgRef}
        viewBox={`0 0 ${FIELD_W} ${FIELD_H}`}
        onPointerMove={handlePointer}
        onPointerDown={handlePointer}
        className="relative h-auto w-full touch-none"
        role="img"
        aria-label="A field of connected points. A single spark ignites one point, then races outward across every connection until the entire system is alight."
      >
        {EDGES.map(({ a, b }, i) => (
          <line
            key={i}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
            className="stroke-border"
            strokeWidth={1}
            opacity={0.6}
          />
        ))}
        {NODES.map((n, i) => (
          <NodeCircle
            key={i}
            node={n}
            delay={Math.min(hops[i], 6) * 95}
            igniteId={wave.id}
            reduce={reduce}
          />
        ))}
      </svg>
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
    d: "You will know the exact day the curve bends. Not a quarter later in a report — the morning it happens.",
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

      {/* The system — constellation */}
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
              We don&apos;t redesign your website.
              <br />
              <span className="text-fg-muted">We build the system underneath it.</span>
            </h2>
            <p className="mt-4 text-lg text-fg-muted">
              A website is a picture of your business. A system is your business — alive, connected,
              and built so that a single move sets the whole of it in motion. That is the difference
              between something you own and something that works for you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Constellation />
          </motion.div>
        </div>
      </section>

      {/* The mystery — painted, not explained */}
      <section id="apply" className="relative overflow-hidden border-t border-border px-6 py-28">
        <div className="absolute inset-0 -z-10">
          <AuroraGradient
            colors={["var(--color-info)", "var(--color-accent)", "transparent"]}
            duration={50}
            blur={130}
            className="opacity-[0.12]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,var(--color-bg)_80%)]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-fg-subtle">
            The morning it turns
          </p>
          <h2 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-fg sm:text-6xl">
            There is a morning the work starts working without you.
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-fg-muted">
            The campaigns you ran months ago keep paying. The growth stops feeling like pushing a
            stone uphill and starts feeling like being pulled forward by it. You wake up and the
            numbers you used to chase are chasing you.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-fg">
            That morning is not luck. It has a cause — and the cause has a name. You meet it on the
            far side of one conversation.
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
