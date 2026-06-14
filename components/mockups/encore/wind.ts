/**
 * windBus — a tiny shared channel for the visitor's SCROLL VELOCITY, so the
 * signature tree's leaves drift with the reader's own motion (a breeze through
 * the canopy). SmoothScroll publishes Lenis's signed velocity here; the tree
 * scene reads + eases it each frame. Pure module-level state — zero React,
 * zero allocation in the hot path.
 */
export const windBus = {
  /** signed Lenis scroll velocity (down = positive); decays toward 0. */
  velocity: 0,
  /** eased 0..1 gust strength, written back by the scene for shared rigs. */
  gust: 0,
};
