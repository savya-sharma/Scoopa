// The inner pages' entrance (every page without the homepage hero): what
// animations/hero.js does for the homepage. Once the square wipe opens
// (animations/pageTransition.js), the header and menu tab come in, the title
// band's lines rise, its tag pops on, the starburst spins up and the
// character swings into place, then floats; scrolling unlocks part-way through.
// Markup: components/layout/PageHero.js (start states in its CSS).
// Run inside Experience's gsap.context; returns a cleanup for what outlives it.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { whenRevealed } from "@/animations/pageTransition";

export function setupPageIntro({ lenis, reduceMotion }) {
  const band = document.querySelector(".page-hero");
  const d = reduceMotion ? 0 : 1; // durations collapse with reduced motion
  let alive = true;
  let float = null;

  const tl = gsap.timeline({ paused: true });

  // the header's wordmark slides up, the menu button drops in (as on the homepage)
  tl.to("nav img", { y: "0%", opacity: 1, duration: 1 * d, ease: "power4.out" }, 0.1);
  tl.to(".menu", { y: 0, opacity: 1, duration: 1 * d, ease: "back.out(1.6)" }, 0.2);

  if (band) {
    const q = gsap.utils.selector(band);
    tl.to(q(".page-hero-line > span"), { y: "0%", duration: 1.1 * d, ease: "power4.out", stagger: 0.12 * d }, 0.2);
    tl.fromTo(q(".page-hero-label"),
      { scale: 0.4, rotation: -14, autoAlpha: 0 },
      { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.7 * d, ease: "back.out(2)" }, 0.35);
    tl.to(q(".page-hero-intro"), { y: 0, autoAlpha: 1, duration: 0.9 * d, ease: "power3.out" }, 0.6);
    tl.fromTo(q(".page-hero-burst"),
      { scale: 0.3, rotation: -60, autoAlpha: 0 },
      { scale: 1, rotation: 0, autoAlpha: 1, duration: 1.1 * d, ease: "back.out(1.5)" }, 0.4);
    tl.to(q(".page-hero-art"), { y: 0, rotation: 0, autoAlpha: 1, duration: 1.2 * d, ease: "power3.out" }, 0.45);
    // then the character floats, gently, for as long as the page is open
    if (!reduceMotion) {
      tl.call(() => {
        if (alive) float = gsap.to(q(".page-hero-art"), { y: -12, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
      }, null, ">");
    }
  }

  // Unlock scrolling as the entrance gets going (refresh: the scrollbar
  // appearing narrows the page, so re-measure)
  tl.call(() => {
    document.documentElement.classList.remove("is-loading");
    lenis.start();
    ScrollTrigger.refresh();
  }, null, 0.6 * d);

  // starts as the wipe has opened enough of the page to see it (the layers
  // take a moment to clear the band); at once with reduced motion
  whenRevealed().then(() => gsap.delayedCall(reduceMotion ? 0 : 0.7, () => alive && tl.play()));

  return () => {
    alive = false;
    tl.kill();
    float?.kill();
  };
}
