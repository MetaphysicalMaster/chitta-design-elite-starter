/**
 * NAP — the single source of truth for Sousan Medspa's Name, Address & Phone.
 *
 * Every surface that shows contact details (the nav, the Story contact block,
 * Booking scheduler, footer) imports from HERE — so the phone & address are
 * byte-identical everywhere and can never conflict across the page.
 *
 * Phone is the practice's REAL verified Houston number. The street address is a
 * representative Houston placeholder for the mockup; the verified suite would be
 * slotted in.
 */
export const NAP = {
  name: "Sousan Medspa",
  street: "5433 Westheimer Road, Suite 200",
  city: "Houston",
  state: "TX",
  zip: "77056",
  neighborhood: "Houston, TX",
  phoneDisplay: "(713) 527-9878",
  phoneTel: "+17135279878",
  email: "hello@sousanmedspahouston.net",
  hours: "Tue–Sat · 10am–6pm · By appointment",
  mapsQuery: "Sousan Medspa, 5433 Westheimer Road, Houston, TX 77056",
} as const;
