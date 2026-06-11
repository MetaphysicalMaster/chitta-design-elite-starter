/**
 * fizz-bus — a tiny mutable channel between the Lenis smooth-scroll loop and
 * the WebGL champagne-fizz scene ("Happy-Hour physics").
 *
 * SmoothScroll writes the live Lenis scroll velocity here every GSAP tick;
 * BubbleScene reads it inside useFrame and converts it into buoyancy — scroll
 * down and the fizz surges upward, the micro-bubble emission rate climbs, and
 * everything settles the moment the page does. A plain mutable object (not
 * React state) so the 60fps loops never trigger renders.
 */
export const fizzBus = {
  /** Lenis scroll velocity (signed; + = scrolling down). Decays to 0 at rest. */
  velocity: 0,
};
