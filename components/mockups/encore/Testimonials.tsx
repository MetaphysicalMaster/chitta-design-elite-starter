"use client";

/**
 * Testimonials — social proof drawn from the practice's strong Zocdoc
 * reputation (4.81★ / 404 reviews). Quotes are representative samples for the
 * mockup, clearly framed as illustrative.
 */

import { motion, useReducedMotion } from "motion/react";
import { Section, SectionHeading } from "./primitives";

const QUOTES = [
  {
    quote:
      "Dr. Londeree caught a melanoma early that two other doctors had dismissed. I genuinely believe she saved my life.",
    name: "Patient, Upper Arlington",
    tag: "Medical",
  },
  {
    quote:
      "My Halo results are unreal — my skin hasn't looked this good since my twenties. The whole spa feels like a five-star hotel.",
    name: "Patient, Dublin",
    tag: "The Spa",
  },
  {
    quote:
      "You can tell she actually teaches this. Thorough, calm, and never rushes you. Easily the best derm in Columbus.",
    name: "Patient, Worthington",
    tag: "Medical",
  },
  {
    quote:
      "Natural Botox, zero pressure, and they explained financing without me even asking. I finally feel like myself.",
    name: "Patient, Bexley",
    tag: "The Spa",
  },
];

export function Testimonials() {
  const prefersReduced = useReducedMotion();
  return (
    <Section labelledBy="testimonials-heading">
      <SectionHeading
        id="testimonials-heading"
        eyebrow="4.81★ · 404 reviews"
        title={<>Columbus <span className="italic">trusts</span> Encore.</>}
        lede="Representative of the reviews behind our 4.81-star reputation. Quotes shown are illustrative samples for this mockup."
      />
      <div className="mt-12 columns-1 gap-5 sm:columns-2">
        {QUOTES.map((q, i) => (
          <motion.figure
            key={q.quote}
            initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: prefersReduced ? 0 : (i % 2) * 0.08 }}
            className="mb-5 break-inside-avoid rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)]/55 p-7"
          >
            <div className="flex items-center gap-1 text-[var(--gold)]" aria-hidden>
              {"★★★★★"}
            </div>
            <blockquote className="mt-4 font-display text-lg leading-relaxed text-[var(--color-fg)]">
              &ldquo;{q.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-5 flex items-center justify-between text-xs">
              <span className="text-[var(--color-fg-muted)]">{q.name}</span>
              <span className="rounded-full border border-[var(--color-border)] px-2.5 py-1 font-semibold uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                {q.tag}
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </Section>
  );
}
