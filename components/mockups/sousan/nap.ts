/**
 * NAP — the single source of truth for Sousan Med Spa's Name, Address & Phone.
 *
 * The entire point of this mockup is ONE clean, authoritative listing. So every
 * surface that shows contact details (Legacy fix block, Booking scheduler,
 * footer) imports from HERE — there is structurally no way for the address to
 * conflict across the page, which is precisely the trust gap the live site has.
 *
 * Note: street address is a representative River Oaks placeholder for the
 * mockup; the real verified address would be slotted in. Phone is the real
 * published line.
 */
export const NAP = {
  name: "Sousan Med Spa",
  street: "1900 West Gray Street, Suite 240",
  city: "Houston",
  state: "TX",
  zip: "77019",
  neighborhood: "River Oaks",
  phoneDisplay: "(713) 527-9878",
  phoneTel: "+17135279878",
  email: "hello@sousanmedspa.com",
  hours: "Tue–Sat · 10am–6pm · By appointment",
  mapsQuery:
    "Sousan Med Spa, 1900 West Gray Street, Houston, TX 77019",
} as const;
