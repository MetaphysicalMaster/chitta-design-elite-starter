/**
 * Blue Sky Med Spa — generated brand imagery manifest.
 *
 * Brand-faithful AI photography (nano_banana_pro / gpt_image_2), 2K, anchored to
 * the user-selected palette anchor. SWAPPABLE: each slot has a `primary` (in use)
 * and an `alt` (fallback the client/owner may prefer). To swap, point the slot's
 * component at `alt` (or replace the URL with a real client photo later).
 *
 * All imagery is illustrative/sample for the pitch preview; before/after carries a
 * baked-in "SAMPLE — illustrative" label.
 */
const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_39eFB6nCaTkROVDLzQSzBJuQA8v";

export const blueSkyImages = {
  /** Palette ANCHOR + treatment-room ambiance (hero/services backdrop). */
  treatmentRoom: {
    primary: `${CDN}/hf_20260604_225041_b917ee88-545a-410b-a336-e9dc4c8ed490.png`,
    alt: `${CDN}/hf_20260604_224851_930c6b85-f9c5-47fb-94c4-bbc69449a8a8.png`,
    aspect: "16:9",
    altText: "Serene sky-blue and champagne med spa treatment room bathed in soft morning light",
  },
  /** Injectable / Botox treatment moment (services). */
  injectable: {
    primary: `${CDN}/hf_20260604_231727_07ee63c9-a4d4-4377-b899-0df942027b7d.png`,
    alt: `${CDN}/hf_20260604_231727_988c97c4-3f8b-4c43-8f66-6521866e16db.png`,
    aspect: "4:3",
    altText: "Gentle professional cosmetic injectable treatment, cropped editorial close-up",
  },
  /** Radiant glowing-skin macro (hero accent / results). */
  glow: {
    primary: `${CDN}/hf_20260604_231730_a1e8f43b-e017-4820-acc7-64224ade1941.png`,
    alt: `${CDN}/hf_20260604_231730_0f2d6569-dff2-4767-a432-26e345e09e3d.png`,
    aspect: "4:3",
    altText: "Radiant healthy glowing skin close-up, dewy natural finish",
  },
  /** IV therapy / wellness lounge (services). */
  ivLounge: {
    primary: `${CDN}/hf_20260604_231822_29c65899-7091-4a69-8f72-d547d922ef2c.png`,
    alt: `${CDN}/hf_20260604_231822_4ac89db0-ed91-48b2-b1f2-da557f9e601c.png`,
    aspect: "16:9",
    altText: "Serene IV hydration and wellness lounge with sky-blue and champagne palette",
  },
  /** Warm reception / interior (founder "Our Story" section). */
  interior: {
    primary: `${CDN}/hf_20260604_231826_93c4b5ea-a9e1-4d55-9a03-326a50054c61.png`,
    alt: `${CDN}/hf_20260604_231826_ca1dd568-e382-4298-969a-04ff56525591.png`,
    aspect: "16:9",
    altText: "Warm inviting med spa reception with German Village charm and morning light",
  },
  /** Representative before/after (carries baked-in SAMPLE label). */
  beforeAfter: {
    primary: `${CDN}/hf_20260604_231831_93d4d945-3f9e-4040-bf99-f94295057ef2.png`,
    alt: `${CDN}/hf_20260604_231831_93d4d945-3f9e-4040-bf99-f94295057ef2.png`,
    aspect: "3:2",
    altText: "Sample before-and-after skin improvement (illustrative)",
  },
} as const;

export type BlueSkySlot = keyof typeof blueSkyImages;
