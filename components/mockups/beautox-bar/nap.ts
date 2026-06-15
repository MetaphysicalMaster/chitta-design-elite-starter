/**
 * Single source of truth for Name-Address-Phone data across the Beautox Bar
 * mockup. One brand record + the two real locations, so the location grid, the
 * booking scheduler and the footer all stay in sync.
 *
 * REAL DATA (beautoxbar.com): two Twin Cities bars — Maple Grove + White Bear
 * Lake, MN — sharing one booking number, (763) 205-6952. Happy-Hour windows are
 * taken from the brand's own Happy Hour artwork.
 */

export const BRAND = {
  name: "Beautox Bar",
  tagline: "Where Shots & Beauty Mingle.",
  foundedYear: 2019,
  bookingNote: "Real scheduling connects on launch.",
} as const;

export type Location = {
  id: string;
  city: string;
  region: string; // suburb / area descriptor
  state: string;
  street: string;
  zip: string;
  phone: string;
  tel: string;
  hours: string;
  /** the brand's signature Happy Hour window for this bar. */
  happyHour: string;
  blurb: string;
  /** opening status — both bars are open; kept for the card/badge system. */
  status: "open" | "coming-soon";
  flagship?: boolean;
  /** on-brand pink/black bar-interior photo (root-absolute, graded). */
  interior: string;
};

export const LOCATIONS: Location[] = [
  {
    id: "maple-grove",
    city: "Maple Grove",
    region: "Northwest Metro",
    state: "MN",
    street: "7372 Kirkwood Ct N",
    zip: "55369",
    phone: "(763) 205-6952",
    tel: "+17632056952",
    hours: "Mon–Sat · by appointment",
    happyHour: "Happy Hour 2–4PM · Mon–Thu",
    blurb: "Our Northwest-metro bar — the full injectables menu, tox to glow.",
    status: "open",
    flagship: true,
    interior: "/clients/beautox-bar/gen/loc-1.webp",
  },
  {
    id: "white-bear-lake",
    city: "White Bear Lake",
    region: "East Metro",
    state: "MN",
    street: "4503 Allendale Dr",
    zip: "55110",
    phone: "(763) 205-6952",
    tel: "+17632056952",
    hours: "Mon–Sat · by appointment",
    happyHour: "Happy Hour 11AM–2PM · Mon–Fri",
    blurb: "Our East-metro bar — same playful pour, same natural-looking results.",
    status: "open",
    interior: "/clients/beautox-bar/gen/loc-2.webp",
  },
];

/** The single booking/contact number shown in nav + footer (both bars share it). */
export const PRIMARY_PHONE_DISPLAY = "(763) 205-6952";
export const PRIMARY_PHONE_TEL = "+17632056952";
