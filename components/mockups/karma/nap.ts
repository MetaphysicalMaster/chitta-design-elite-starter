/**
 * nap.ts — single source of truth for Karma Beauty & Wellness Name / Address /
 * Phone data, under ONE canonical domain. Centralizing it here is the whole
 * pitch: today the brand is split across flat `.htm` pages, a still-indexed
 * `testkc.com` staging leak, and a bare Square booking page. This consolidates
 * both Kansas City–metro homes (Lee's Summit + Overland Park) into one
 * authoritative source the whole site reads from.
 *
 * Phone numbers, addresses, hours are real-facts-grounded; street numbers are
 * illustrative samples for the mockup.
 */

export type Metro = {
  id: "lees-summit" | "overland-park";
  city: string;
  region: string;
  state: string;
  street: string;
  zip: string;
  phone: string;
  tel: string;
  hours: string;
  /** A short positioning line that differentiates the two homes. */
  tagline: string;
  /** Service emphasis for this metro. */
  emphasis: string;
  flagship?: boolean;
  mapsQuery: string;
};

export const BRAND = {
  name: "Karma Beauty & Wellness",
  shortName: "Karma",
  owner: "Lenae Cammisano",
  ownerCreds: "RN, NP",
  instagram: "@karmamedspa",
  instagramUrl: "https://instagram.com/karmamedspa",
  /** The single canonical domain that retires the testkc.com staging leak. */
  domain: "karmabeautykc.com",
  metroLabel: "Kansas City metro",
} as const;

export const METROS: Metro[] = [
  {
    id: "lees-summit",
    city: "Lee's Summit",
    region: "East metro",
    state: "MO",
    street: "NW Chipman Rd",
    zip: "64081",
    phone: "(816) 434-5108",
    tel: "+18164345108",
    hours: "Mon–Fri 9–6 · Sat 9–2",
    tagline: "The original home — where Karma began.",
    emphasis: "Injectables · medical weight-loss · wellness",
    flagship: true,
    mapsQuery: "Karma+Beauty+Wellness+Lees+Summit+MO",
  },
  {
    id: "overland-park",
    city: "Overland Park",
    region: "Kansas side · 119th St",
    state: "KS",
    street: "W 119th St",
    zip: "66213",
    phone: "(913) 912-1001",
    tel: "+19139121001",
    hours: "Mon–Fri 9–6 · Sat by appt",
    tagline: "The Kansas-side home on 119th — same brand, same standard.",
    emphasis: "Injectables · medical weight-loss · wellness",
    mapsQuery: "Karma+Beauty+Wellness+Overland+Park+KS",
  },
];
