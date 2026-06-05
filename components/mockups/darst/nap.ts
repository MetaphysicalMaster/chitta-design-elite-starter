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
 * Note: street address is a representative Charlotte placeholder for the
 * mockup; the real verified address would be slotted in. Dr. Darst, the
 * double board-certification and Charlotte are real facts.
 */
export const NAP = {
  name: "Darst Dermatology",
  doctor: "Dr. Marc A. Darst, MD",
  street: "2711 Randolph Road, Suite 300",
  city: "Charlotte",
  state: "NC",
  zip: "28207",
  phoneDisplay: "(704) 943-3714",
  phoneTel: "+17049433714",
  email: "hello@darstdermatology.com",
  hours: "Mon–Fri · 8am–5pm · By appointment",
  mapsQuery: "Darst Dermatology, 2711 Randolph Road, Charlotte, NC 28207",
} as const;
