"use client";

import { motion } from "motion/react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const features = [
  {
    title: "Tailwind v4",
    description: "CSS-first config. @theme blocks. OKLch tokens by default.",
  },
  {
    title: "Framer Motion",
    description: "motion/react. Spring physics. Stagger. View Transitions ready.",
  },
  {
    title: "shadcn/ui",
    description: "Radix-powered primitives. Composable. Owned by you.",
  },
  {
    title: "Aceternity + Magic UI",
    description: "Wow-factor patterns when warranted. Background beams, marquees, particles.",
  },
  {
    title: "Geist + Inter",
    description: "Premium typography baked in via next/font.",
  },
  {
    title: "WCAG 2.2 AA floor",
    description: "axe-clean. Reduced-motion honored. Focus visible. Touch targets ≥44.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-lg">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2"
          >
            <div className="size-7 rounded-lg bg-gradient-to-br from-accent to-info" />
            <span className="font-semibold tracking-tight text-fg">
              chitta · design · elite
            </span>
          </motion.div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex-1 flex items-center justify-center overflow-hidden">
        {/* Subtle gradient orb backdrop */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-accent-subtle blur-3xl"
            style={{ opacity: 0.4 }}
          />
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="relative z-10 mx-auto max-w-3xl px-6 py-24 text-center"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated px-3 py-1 text-xs font-medium text-fg-muted"
          >
            <span className="size-1.5 rounded-full bg-success animate-pulse" />
            $10K-quality starter · v0.1
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mt-8 text-5xl sm:text-7xl font-semibold tracking-tight text-fg leading-[1.05]"
          >
            Build like Linear.
            <br />
            <span className="bg-gradient-to-r from-accent to-info bg-clip-text text-transparent">
              Ship like Vercel.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 mx-auto max-w-xl text-lg text-fg-muted leading-relaxed"
          >
            Next.js 16 · Tailwind v4 · Framer Motion · shadcn/ui · Aceternity UI · Magic UI · Geist.
            Lighthouse 100 baseline. Reduced-motion honored. WCAG 2.2 AA floor.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <motion.a
              whileHover={{
                scale: 1.02,
                boxShadow: "var(--shadow-lg)",
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              href="#features"
              className={cn(
                "inline-flex h-11 items-center justify-center rounded-lg px-6",
                "bg-fg text-bg font-medium text-sm",
                "hover:bg-fg-muted transition-colors duration-fast"
              )}
            >
              Get started
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              href="https://github.com/MetaphysicalMaster/chitta-design-elite-starter"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex h-11 items-center justify-center rounded-lg px-6",
                "border border-border bg-bg-elevated text-fg font-medium text-sm",
                "hover:border-fg-subtle hover:bg-bg-subtle transition-colors duration-fast"
              )}
            >
              View source
            </motion.a>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-fg">
              Stack curated for $10K work
            </h2>
            <p className="mt-4 text-lg text-fg-muted max-w-2xl mx-auto">
              Every dependency earns its place. Every default is the right default.
            </p>
          </motion.div>

          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {features.map((feature) => (
              <motion.li
                key={feature.title}
                variants={itemVariants}
                whileHover={{
                  y: -4,
                  boxShadow: "var(--shadow-lg)",
                }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "rounded-2xl border border-border bg-bg-elevated p-6",
                  "hover:border-border-subtle"
                )}
              >
                <h3 className="font-semibold text-fg tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-fg-muted leading-relaxed">
                  {feature.description}
                </p>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-fg-muted">
          <p>chitta · design · elite — $10K-quality starter</p>
          <p>
            Built with{" "}
            <a
              href="https://github.com/MetaphysicalMaster/chitta-design-elite-starter"
              className="text-fg hover:text-accent transition-colors duration-fast"
            >
              DesignGod
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
