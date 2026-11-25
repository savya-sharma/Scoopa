// Decorative shapes and the Product Details composition pop in, once, as
// they scroll into view. Markup: components/ui/Shapes.js, components/sections/.
import gsap from "gsap";

export function setupDecor({ reduceMotion }) {
  if (reduceMotion) return () => {};
  const tweens = [];

  document.querySelectorAll(".shape").forEach((el, i) => {
    tweens.push(gsap.from(el, {
      scale: 0.4,
      rotation: i % 2 ? 25 : -25,
      autoAlpha: 0,
      duration: 0.9,
      ease: "back.out(1.8)",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    }));
  });

  // Product Details: the sun behind the heading grows in (it never turns)
  const sun = document.querySelector(".details-sun");
  if (sun) {
    tweens.push(gsap.from(sun, {
      scale: 0.5, autoAlpha: 0, duration: 1.1, ease: "back.out(1.6)",
      scrollTrigger: { trigger: sun, start: "top 85%", once: true },
    }));
  }

  // Product Details, row by row: the disc grows, the bowl drops onto it, the
  // day badge pops on and the details rise in (the starburst is a .shape,
  // above). The name on its arc fades in with the disc.
  document.querySelectorAll(".details-item").forEach((item) => {
    const q = gsap.utils.selector(item);
    const tl = gsap.timeline({ scrollTrigger: { trigger: item, start: "top 78%", once: true } })
      .from(q(".details-disc"), { scale: 0, duration: 0.8, ease: "back.out(1.4)" })
      .from(q(".details-curve"), { autoAlpha: 0, rotation: -25, transformOrigin: "50% 50%", duration: 0.8, ease: "power3.out" }, 0.1)
      .from(q(".details-bowl"), { y: -60, autoAlpha: 0, duration: 0.8, ease: "bounce.out" }, 0.2)
      .from(q(".details-day"), { scale: 0, rotation: -90, duration: 0.6, ease: "back.out(2.2)" }, 0.55)
      .from(q(".details-copy > *"), { y: 30, autoAlpha: 0, duration: 0.6, ease: "power3.out", stagger: 0.08 }, 0.3);
    tweens.push(tl);
  });

  return () => tweens.forEach((t) => {
    t.scrollTrigger?.kill();
    t.kill();
  });
}
