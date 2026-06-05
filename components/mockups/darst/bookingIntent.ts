/**
 * bookingIntent — a tiny, type-safe handoff so an aesthetic CTA can pre-select
 * the scheduler's reason without coupling to hash/URL semantics (which break
 * under the generic smooth-scroll resolver and reduced-motion native nav).
 *
 * The writer (an aesthetic CTA) calls selectBookingIntent("cosmetic"); the
 * reader (the Booking scheduler) consumes it on mount AND via the custom event
 * for same-page clicks, then maps the token to a concrete elective reason. This
 * is the "built for me" funnel personalization the female-luxury buyer feels.
 */

export type BookingIntent = "cosmetic" | "injectables" | "laser";

const KEY = "darst:booking-intent";
export const BOOKING_INTENT_EVENT = "darst:booking-intent";

/** Map an intent token → the exact scheduler reason label it should select. */
export const INTENT_REASON: Record<BookingIntent, string> = {
  cosmetic: "Cosmetic consult",
  injectables: "Injectables (Botox / filler)",
  laser: "Laser & skin rejuvenation",
};

/** Writer: record the elective intent + notify any mounted scheduler. */
export function selectBookingIntent(intent: BookingIntent) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(KEY, intent);
  } catch {
    // sessionStorage can throw (private mode / disabled) — the event still
    // covers the same-page click, so degrade quietly.
  }
  window.dispatchEvent(
    new CustomEvent<BookingIntent>(BOOKING_INTENT_EVENT, { detail: intent }),
  );
}

/** Reader: pull + CLEAR a pending intent (one-shot, so a later plain Book
 *  click doesn't re-trigger a stale cosmetic pre-select). Returns the mapped
 *  reason label, or null. */
export function consumeBookingReason(): string | null {
  if (typeof window === "undefined") return null;
  let token: string | null = null;
  try {
    token = window.sessionStorage.getItem(KEY);
    if (token) window.sessionStorage.removeItem(KEY);
  } catch {
    token = null;
  }
  if (token && token in INTENT_REASON) {
    return INTENT_REASON[token as BookingIntent];
  }
  return null;
}

/** Reader helper: map a live event token → reason label. */
export function reasonForIntent(intent: BookingIntent): string {
  return INTENT_REASON[intent];
}
