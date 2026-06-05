/**
 * NAP — the single source of truth for Darst Dermatology's Name, Address
 * & Phone.
 *
 * The live site scatters SEO-spam, location-suffixed URL slugs
 * (/medical-dermatology-charlotte/ …) and inconsistent listings. So every
 * surface that shows contact details (trust band, scheduler, footer) imports
 * from HERE — there is structurally no way for the address to conflict across
 * the page, and no location-keyword stuffing. One clean, authoritative listing.
 *
 * The practice is REAL and operates in TWO North Carolina cities — Charlotte
 * AND Monroe — so both are modelled in `LOCATIONS` and surfaced wherever the
 * page shows where to visit. A single-city NAP on a two-city practice is the #1
 * "is this us" failure for a real client, and it would undercut the page's own
 * NAP-consistency thesis.
 *
 * Note: the STREET lines remain representative placeholders for the mockup (the
 * real verified street addresses would be slotted in), but the CITY fidelity
 * (Charlotte AND Monroe, NC) is real, as are Dr. Darst and the double
 * board-certification.
 */

export type DarstLocation = {
  city: string;
  state: string;
  zip: string;
  /** Representative street placeholder until the real address is verified. */
  street: string;
  phoneDisplay: string;
  phoneTel: string;
  mapsQuery: string;
};

export const LOCATIONS: readonly DarstLocation[] = [
  {
    city: "Charlotte",
    state: "NC",
    zip: "28207",
    street: "2711 Randolph Road, Suite 300",
    phoneDisplay: "(704) 943-3714",
    phoneTel: "+17049433714",
    mapsQuery: "Darst Dermatology, 2711 Randolph Road, Charlotte, NC 28207",
  },
  {
    city: "Monroe",
    state: "NC",
    zip: "28112",
    street: "1404 East Sunset Drive",
    phoneDisplay: "(704) 282-9527",
    phoneTel: "+17042829527",
    mapsQuery: "Darst Dermatology, 1404 East Sunset Drive, Monroe, NC 28112",
  },
] as const;

/** A compact "Charlotte · Monroe" locator string for one-line surfaces. */
export const CITIES_LINE = LOCATIONS.map((l) => l.city).join(" · ");

export const NAP = {
  name: "Darst Dermatology",
  doctor: "Dr. Marc A. Darst, MD",
  /** Both cities — REAL (the practice serves Charlotte AND Monroe, NC). */
  cities: CITIES_LINE,
  locations: LOCATIONS,
  // Flat fields mirror the PRIMARY (Charlotte) location so existing surfaces
  // keep working unchanged; the second location is read from `locations`.
  street: LOCATIONS[0].street,
  city: LOCATIONS[0].city,
  state: LOCATIONS[0].state,
  zip: LOCATIONS[0].zip,
  phoneDisplay: LOCATIONS[0].phoneDisplay,
  phoneTel: LOCATIONS[0].phoneTel,
  email: "hello@darstdermatology.com",
  hours: "Mon–Fri · 8am–5pm · By appointment",
  mapsQuery: LOCATIONS[0].mapsQuery,
} as const;
