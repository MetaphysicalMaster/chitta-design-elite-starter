/**
 * NAP + shared practice facts for the Encore Dermatology mockup.
 * Real, verifiable details from encoredermatology.com — single source of truth
 * so every surface (nav, footer, concierge, schema) stays consistent.
 */

export const PRACTICE = {
  name: "Encore Dermatology",
  spa: "The Spa at Encore",
  tagline: "The Science of Dermatology · The Environment of a Spa",
  street: "4900 Gettysburg Rd",
  city: "Columbus",
  region: "OH",
  postal: "43220",
  area: "Northwest Columbus",
  phoneDisplay: "(614) 442-1012",
  phoneHref: "tel:+16144421012",
  email: "skincare@encoredermatology.com",
} as const;

export const PRIMARY_PHONE_DISPLAY = PRACTICE.phoneDisplay;
export const PRIMARY_PHONE_HREF = PRACTICE.phoneHref;
