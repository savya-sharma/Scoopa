// Brand Personality: plays as the section comes into view.
//   The photo band: the heading's lines rise out of their masks, the round
//   badge spins in, the line and the button fade up (the sticker peels on
//   its own: animations/stickers.js).
//   The yellow band: the four cards fan out from a stack to their places,
//   each settling at its own tilt. After that, flick across a card and as the
//   pointer leaves it's thrown with that speed (InertiaPlugin), then springs
//   back to its place and tilt (mouse and trackpad only).
// Throughout: the photo drifts a little against the scroll, the giant line
// of type runs behind the cards as an endless marquee, and the badge's rim
// slowly turns.
// Markup: components/sections/BrandPersonality.js.
import gsap from "gsap";
import { InertiaPlugin } from "gsap/InertiaPlugin";

gsap.registerPlugin(InertiaPlugin);

const THROW = 40; // the pointer's last move (px per event) × this = the card's speed (px/s)
const SPIN = 2; // and × this = its spin (degrees/s)
const MAX_MOVE = 60; // px per event: caps a frantic flick, so a card is never flung off screen

export function setupJoy({ reduceMotion }) {
  const section = document.querySelector(".joy");
  if (!section) return () => {};
  const q = gsap.utils.selector(section);
  const photo = q(".joy-photo")[0];
  const cards = q(".joy-card");
  const row = q(".joy-card-row")[0];
  const made = [];

  // Resting tilts: set here, not in CSS (GSAP owns these elements'
  // transforms, and would otherwise overwrite a CSS rotate)
  const tilt = (el) => Number(el.dataset.rot) || 0;
  gsap.set(cards, { rotation: (i, el) => tilt(el) });
  if (reduceMotion) return () => {};

  // ----- The photo band -----
  gsap.set(q(".joy-line > span"), { yPercent: 110 });
  gsap.set(q(".joy-badge"), { scale: 0, rotation: -120 });
  gsap.set(q(".joy-text, .joy-cta"), { y: 24, autoAlpha: 0 });

  made.push(
    gsap.timeline({ scrollTrigger: { trigger: photo, start: "top 70%", once: true } })
      .to(q(".joy-line > span"), { yPercent: 0, duration: 1, ease: "power4.out", stagger: 0.12 })
      .to(q(".joy-badge"), { scale: 1, rotation: 0, duration: 1, ease: "back.out(1.7)" }, 0.35)
      .to(q(".joy-text, .joy-cta"), { y: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out", stagger: 0.12 }, 0.6),
  );

  // the photo drifts against the scroll, for a touch of depth
  made.push(gsap.fromTo(q(".joy-photo-bg"), { yPercent: -5 }, {
    yPercent: 5,
    ease: "none",
    scrollTrigger: { trigger: photo, start: "top bottom", end: "bottom top", scrub: true },
  }));

  // the badge sticker (sticker1) turns slowly about its centre
  made.push(gsap.to(q(".joy-badge-ring"), { rotation: 360, duration: 22, ease: "none", repeat: -1 }));

  // ----- The yellow band -----
  // from a stack at the row's centre (no tilt) out to their places
  const fromCentre = (el) => {
    const a = el.getBoundingClientRect();
    const b = row.getBoundingClientRect();
    return b.left + b.width / 2 - (a.left + a.width / 2);
  };
  made.push(gsap.fromTo(cards,
    { x: (i, el) => fromCentre(el), y: 60, rotation: 0, scale: 0.85, autoAlpha: 0 },
    {
      x: 0,
      y: 0,
      rotation: (i, el) => tilt(el), // each settles at its own tilt (data-rot)
      scale: 1,
      autoAlpha: 1,
      duration: 1.1,
      ease: "back.out(1.4)",
      stagger: 0.1,
      scrollTrigger: { trigger: row, start: "top 80%", once: true },
      onComplete: throwable, // once they've all landed
    }));

  // The giant line of type: an endless marquee. The track holds four
  // identical copies; moving it by one copy (25%) brings the next copy to
  // exactly where the first was, so the loop is seamless.
  made.push(gsap.fromTo(q(".joy-crave-track"), { xPercent: 0 }, { xPercent: -25, duration: 17, ease: "none", repeat: -1 }));

  // ----- Throwing the cards -----
  // Tracks the pointer's speed over a card; as it leaves, the card is thrown
  // that way (and spun), slows under friction and is drawn back to its place
  // and tilt: InertiaPlugin's `end` makes it finish exactly there.
  // The cards keep their stacking throughout (set in CSS); playing with one
  // doesn't bring it to the front.
  const listeners = new AbortController();
  function throwable() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const { signal } = listeners;
    const clamp = gsap.utils.clamp(-MAX_MOVE, MAX_MOVE);
    cards.forEach((card) => {
      const rest = tilt(card);
      let lastX = 0, lastY = 0, speedX = 0, speedY = 0;
      card.addEventListener("pointerenter", (e) => {
        speedX = speedY = 0;
        lastX = e.clientX;
        lastY = e.clientY;
      }, { signal });
      card.addEventListener("pointermove", (e) => {
        speedX = clamp(e.clientX - lastX);
        speedY = clamp(e.clientY - lastY);
        lastX = e.clientX;
        lastY = e.clientY;
      }, { signal });
      card.addEventListener("pointerleave", () => {
        gsap.to(card, {
          inertia: {
            x: { velocity: speedX * THROW, end: 0 },
            y: { velocity: speedY * THROW, end: 0 },
            rotation: { velocity: speedX * SPIN, end: rest },
            duration: { min: 0.6, max: 1.6 },
          },
          overwrite: "auto",
        });
      }, { signal });
    });
  }

  return () => {
    listeners.abort();
    gsap.killTweensOf(cards);
    made.forEach((t) => {
      t.scrollTrigger?.kill();
      t.kill();
    });
  };
}
