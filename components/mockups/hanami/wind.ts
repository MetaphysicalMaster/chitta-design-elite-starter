/**
 * windBus — a tiny module singleton carrying scroll-wind state from the Lenis
 * smooth-scroll loop (SmoothScroll.tsx) into the WebGL petal field
 * (PetalScene.tsx) without a single React re-render.
 *
 * THE SIGNATURE EXPERIENCE: "wind through the blossoms" — the visitor's own
 * scroll velocity becomes the breeze. A fast scroll is a gust that sweeps and
 * tumbles the petal field; stillness lets it settle back to the gentle fall.
 * Lenis writes `velocity` every scroll event (signed; scrolling down is
 * positive); the petal field reads it each R3F frame, eases it into gust /
 * sweep uniforms, and decays it back toward calm so the wind always dies down
 * after the reader pauses (mono no aware — the storm passes).
 */
export const windBus = {
  /** raw smooth-scroll velocity from Lenis (px/frame-ish; signed). */
  velocity: 0,
  /** smoothed 0..1 gust strength — written back by the petal field each frame
   *  so the BreezeRig (and any other consumer) shares one eased value. */
  gust: 0,
};
