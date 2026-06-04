/**
 * Encore Dermatology — generated brand imagery manifest.
 *
 * Brand-faithful AI photography (nano_banana_pro / gpt_image_2), 2K, anchored to
 * the user-selected aqua-teal + champagne palette anchor. SWAPPABLE: each slot has
 * a `primary` (in use) and an `alt` (fallback). Swap by pointing the slot's
 * component at `alt`, or replace with a real client photo later.
 *
 * All imagery is illustrative/sample for the pitch preview; before/after carries a
 * baked-in "SAMPLE — illustrative" label.
 */
const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_39eFB6nCaTkROVDLzQSzBJuQA8v";

export const encoreImages = {
  /** Palette ANCHOR + clinical-luxe treatment room (medical-derm side). */
  treatmentRoom: {
    primary: `${CDN}/hf_20260604_230635_5dab1421-0eaf-44bc-9c55-181cbed870d1.png`,
    alt: `${CDN}/hf_20260604_230636_10e4d68a-441f-49c1-adbd-4b7bfa4bed94.png`,
    aspect: "16:9",
    altText: "Clinical-luxe dermatology treatment room in aqua-teal and champagne, cinematic light",
  },
  /** Laser / Sciton-Halo device moment (Spa at Encore / lasers). */
  laser: {
    primary: `${CDN}/hf_20260604_231843_32390c9b-0f7c-4401-b97c-974527107b12.png`,
    alt: `${CDN}/hf_20260604_231843_9c5e0aa3-7a49-4a9e-9643-25605133a81c.png`,
    aspect: "4:3",
    altText: "Advanced aesthetic laser handpiece in use, clinical-luxe close-up",
  },
  /** Cosmetic-derm injectable moment (injectables). */
  injectable: {
    primary: `${CDN}/hf_20260604_231847_e837a0eb-efbe-4721-b959-b81424fc1b89.png`,
    alt: `${CDN}/hf_20260604_231847_0e6a1b16-3015-48d8-ba16-7743dac2ee6f.png`,
    aspect: "4:3",
    altText: "Precise dermatological injectable treatment, cropped clinical close-up",
  },
  /** "Spa at Encore" facial / treatment ambiance (the under-marketed spa side). */
  facial: {
    primary: `${CDN}/hf_20260604_231851_60c40212-c80b-43a9-89ab-7eae40b02307.png`,
    alt: `${CDN}/hf_20260604_231851_7eed2792-bc93-4504-9422-74b23851c070.png`,
    aspect: "16:9",
    altText: "Serene luxury facial treatment moment at The Spa at Encore",
  },
  /** Authority / academic-prestige consultation interior (Dr. Londeree / Why Encore). */
  authority: {
    primary: `${CDN}/hf_20260604_231906_1acf08d4-99e9-43f1-8b59-5767f8b46fd8.png`,
    alt: `${CDN}/hf_20260604_231906_1acf08d4-99e9-43f1-8b59-5767f8b46fd8.png`,
    aspect: "16:9",
    altText: "Sophisticated dermatology consultation space conveying medical authority and prestige",
  },
  /** Representative before/after (carries baked-in SAMPLE label). */
  beforeAfter: {
    primary: `${CDN}/hf_20260604_232053_1938dcd2-143c-4cf4-96f3-06f816732960.png`,
    alt: `${CDN}/hf_20260604_232053_1938dcd2-143c-4cf4-96f3-06f816732960.png`,
    aspect: "3:2",
    altText: "Sample before-and-after dermatology skin improvement (illustrative)",
  },
} as const;

export type EncoreSlot = keyof typeof encoreImages;
