/**
 * nap.ts — single source of truth for Eternity Med Spa Name / Address / Phone
 * data, under ONE branded domain. Centralizing it is part of the pitch: today
 * the brand lives on a blog-themed WordPress site on a leftover free
 * `eternitymedspa.wordpress.com` subdomain with phone-only booking. This
 * consolidates the NAP into one authoritative source the whole site reads from,
 * retiring the free subdomain for a single branded home.
 *
 * Phone number + corridor + owner + tenure + review stats are real-facts-
 * grounded; the street number and exact hours are illustrative samples.
 */

export const BRAND = {
  name: "Eternity Med Spa",
  shortName: "Eternity",
  owner: "Michelle",
  ownerTitle: "Founder & Lead Aesthetic Provider",
  instagram: "@eternitymedspa",
  instagramUrl: "https://instagram.com/eternitymedspa",
  /** The branded domain that retires the free wordpress.com subdomain. */
  domain: "eternitymedspa.com",
  /** The legacy free subdomain being retired — named in the pitch. */
  legacyDomain: "eternitymedspa.wordpress.com",
  phone: "(314) 469-2946",
  tel: "+13144692946",
  metroLabel: "St. Louis · Creve Coeur",
  corridor: "Olive Blvd corridor",
  city: "Creve Coeur",
  region: "St. Louis",
  state: "MO",
  street: "Olive Blvd",
  zip: "63141",
  hours: "Tue–Fri 9–6 · Sat 9–3",
  mapsQuery: "Eternity+Med+Spa+Creve+Coeur+St+Louis+MO",
  years: 18,
  reviews: 221,
  rating: 4.6,
} as const;
