// Magnetic buttons: while the pointer is over anything marked data-magnet, it
// leans towards the pointer, its label (or icon) following a little further
// for depth, and springs back when the pointer leaves it. Mouse and trackpad
// only; off with reduced motion.
// Markup: data-magnet on the button, its label in .magnet-label (or an svg).
import gsap from "gsap";

const PULL = 0.35; // how far the button follows the pointer (× its offset from the centre)
const LABEL = 0.18; // the label's extra follow

export function setupMagnets({ reduceMotion }) {
  if (reduceMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return () => {};
  const listeners = new AbortController();
  const { signal } = listeners;
  const parts = [];

  document.querySelectorAll("[data-magnet]").forEach((el) => {
    const label = el.querySelector(".magnet-label, svg");
    const both = [el, label].filter(Boolean);
    parts.push(...both);
    let follow = null;

    // Pointer arrives: stop any spring-back and start following. (The
    // followers are made afresh each time: the spring-back's tweens replace
    // them, so reusing old ones would leave the button stuck after one pull.)
    el.addEventListener("pointerenter", () => {
      gsap.killTweensOf(both, "x,y");
      const to = (target, prop) => gsap.quickTo(target, prop, { duration: 0.5, ease: "power3.out" });
      follow = { x: to(el, "x"), y: to(el, "y"), lx: label && to(label, "x"), ly: label && to(label, "y") };
    }, { signal });

    el.addEventListener("pointermove", (e) => {
      if (!follow) return;
      // measured without its own pull, so it doesn't chase itself
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2 - gsap.getProperty(el, "x"));
      const dy = e.clientY - (r.top + r.height / 2 - gsap.getProperty(el, "y"));
      // capped, so a wide button (SEND) only leans, never slides away
      const cap = Math.min(r.width, r.height) * 0.45;
      const clamp = gsap.utils.clamp(-cap, cap);
      follow.x(clamp(dx * PULL));
      follow.y(clamp(dy * PULL));
      follow.lx?.(clamp(dx * LABEL) * 0.6);
      follow.ly?.(clamp(dy * LABEL) * 0.6);
    }, { signal });

    // Pointer leaves: a springy return to rest
    el.addEventListener("pointerleave", () => {
      follow = null;
      gsap.to(both, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)", overwrite: "auto" });
    }, { signal });
  });

  return () => {
    listeners.abort();
    if (!parts.length) return; // a page without magnetic buttons
    gsap.killTweensOf(parts, "x,y");
    gsap.set(parts, { x: 0, y: 0 });
  };
}
