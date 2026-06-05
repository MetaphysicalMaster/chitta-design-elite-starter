/**
 * Single source of truth for Name-Address-Phone data across the Beautox Bar
 * mockup. One brand record + the location list, so the multi-location grid,
 * the booking scheduler and the footer all stay in sync — and adding location
 * 4/5/6 is a one-line edit (the "growth-ready" pitch, made literal).
 *
 * Addresses/phones are representative samples for the pitch mockup, clearly
 * presented as such; real NAP is dropped in before launch.
 */

export const BRAND = {
  name: "Beautox Bar",
  tagline: "Botox without the boring.",
  foundedYear: 2018,
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
  blurb: string;
  /** opening status — drives the badge on the location card. */
  status: "open" | "coming-soon";
  flagship?: boolean;
};

export const LOCATIONS: Location[] = [
  {
    id: "maple-grove",
    city: "Maple Grove",
    region: "Northwest Metro",
    state: "MN",
    street: "Main St N",
    zip: "55369",
    phone: "(763) 555-0148",
    tel: "+17635550148",
    hours: "Mon–Fri 9–7 · Sat 9–4",
    blurb: "The original bar — the full injectables-led menu where it all started.",
    status: "open",
    flagship: true,
  },
  {
    id: "champlin",
    city: "Champlin",
    region: "North Metro",
    state: "MN",
    street: "Anoka St",
    zip: "55316",
    phone: "(763) 555-0172",
    tel: "+17635550172",
    hours: "Mon–Fri 9–7 · Sat 9–4",
    blurb: "Tox, filler & glow — your neighborhood bar just north of the river.",
    status: "open",
  },
  {
    id: "white-bear-township",
    city: "White Bear Township",
    region: "East Metro",
    state: "MN",
    street: "Hwy 96 E",
    zip: "55110",
    phone: "(651) 555-0119",
    tel: "+16515550119",
    hours: "Opening 2026 · Waitlist open",
    blurb: "Our brand-new third bar — now taking the founding-member waitlist.",
    status: "coming-soon",
  },
];

/** The primary booking/contact number shown in nav + footer. */
export const PRIMARY_PHONE_DISPLAY = "(763) 555-0148";
export const PRIMARY_PHONE_TEL = "+17635550148";
