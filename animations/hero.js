// Hero: the loader (three concentric circles, or the square wipe in
// animations/pageTransition.js) and the intro timeline: the headline's
// letters rise, the wavy side lines draw down, the text stickers pop on,
// the yellow band fades in (its words running along it endlessly), and the
// friends and the "OO" come up.
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { INTRO_STYLE, isFirstLoad, whenCleared } from "@/animations/pageTransition";

// Loader: resolves once the hero's key images have loaded (failed ones
// count as done, so it never gets stuck), and never before minTime seconds,
// so the circles are always seen. Stops if alive() turns false (unmounted).
function waitForImages(alive, minTime) {
  const imgs = [...document.querySelectorAll(".hero-group, .hero-oo")];
  const started = performance.now();
  return new Promise((resolve) => {
    const check = () => {
      if (!alive()) return;
      const done = imgs.every((img) => img.complete);
      const waited = (performance.now() - started) / 1000 >= minTime;
      if (done && waited) resolve();
      else gsap.delayedCall(0.1, check);
    };
    check();
  });
}

// The yellow band's marquee: its words run along the curve endlessly. The
// text is several copies of one run; sliding it back by exactly one run's
// length and starting over loops seamlessly. Measured once the fonts are in
// (the run's length depends on them). Created here, inside the gsap.context.
const BAND_COPIES = 8; // copies of the run in the markup (components/sections/Hero.js)
const BAND_SPEED = 5; // viewBox units (% of the hero's width) per second

function bandMarquee() {
  const text = document.querySelector(".hero-band-text");
  const path = text?.querySelector("textPath");
  if (!path) return;
  const run = () => text.getComputedTextLength() / BAND_COPIES;
  const tween = gsap.to(path, { attr: { startOffset: () => -run() }, duration: () => run() / BAND_SPEED, ease: "none", repeat: -1 });
  // re-measure once the band's font has loaded
  document.fonts?.ready.then(() => tween.invalidate().restart());
}

// Timeline positions: number = exact time, "<" = with previous,
// "<0.125" = 0.125s after previous started, none = after previous ends.
// circles: play the concentric-circle loader; otherwise the square wipe
// (animations/pageTransition.js) covers the page and "loaded" is its reveal.
function playIntro(loaded, lenis, alive, circles) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) bandMarquee();
  // Created paused: nothing plays until the loading is over (below). (Not
  // addPause at the start: GSAP passes over a pause at time 0, so the intro
  // used to play unseen, under the loader.)
  const tl = gsap.timeline({
    paused: true,
    delay: circles ? 0.5 : 0,
    onComplete: () => {
      gsap.set("nav img, .hero-title-char, .hero-group, .hero-oo", { willChange: "auto" });
    },
  });

  const [orange, teal, navy] = ["orange", "teal", "navy"].map((c) => document.querySelector(`.loader-circle--${c}`));
  const overlay = document.querySelector(".hero-overlay");

  // 1. Hold until the loading is over: the circles loader's images are in,
  // or the square wipe has lifted fully off the screen. Then play.
  tl.addLabel("loaded");
  loaded.then(() => {
    if (!alive()) return;
    tl.play();
  });

  // 2. From the centre of the blank screen the rings grow as one: orange
  // first, teal a fixed band behind it, navy a band behind that, so even
  // bands of each colour show as they expand (like the reference); then, a
  // band behind navy, the opening onto the hero follows the same way.
  // One radius drives them all: ring k has radius R - k × band.
  if (!circles) {
    // the square wipe covers the page instead: no circles; "loaded" is the
    // wipe lifting fully off the screen, and the hero's entrances (heading
    // and all) start right then, with nothing left covering them
    gsap.set(overlay, { display: "none" });
    tl.addLabel("reveal", "loaded");
  } else if (reduce) {
    // reduced motion: no expansions, the loader fades away
    tl.to(overlay, { autoAlpha: 0, duration: 0.4 }, "loaded");
    tl.addLabel("reveal", "loaded");
  } else {
    const rings = [orange, teal, navy];
    const ring = { R: 0 };
    let band = 0;
    const draw = () => {
      rings.forEach((el, k) => gsap.set(el, { scale: (2 * Math.max(0, ring.R - k * band)) / (el.offsetWidth || 1) }));
      overlay.style.setProperty("--hole", `${ring.R - 3 * band}px`);
    };
    tl.fromTo(ring, { R: 0 }, {
      // until the opening (three bands behind) has cleared the corners
      R: () => {
        const half = Math.hypot(window.innerWidth, window.innerHeight) / 2;
        band = half * 0.24; // the width of each colour's band
        return half + 3 * band + 4;
      },
      duration: 2,
      ease: "power2.inOut",
      onUpdate: draw,
    }, "loaded");
    // the hero's own entrances start as the opening widens
    tl.addLabel("reveal", "loaded+=1.25");
  }



  // 4. The entrance: quick, everything at once, all on within about 0.8s.
  // The headline's letters rise out of their lines' masks one after another
  // straight away (each starts at translateY(110%) in CSS); the wavy side
  // lines draw down from the top
  const d = reduce ? 0 : 1; // durations collapse with reduced motion
  tl.to(".hero-title-char", { y: "0%", duration: 0.6 * d, ease: "power4.out", stagger: 0.012 * d }, "reveal");
  tl.to(".hero-squiggle-line", { strokeDashoffset: 0, duration: 0.8 * d, ease: "power2.inOut", stagger: 0.06 * d }, "reveal");
  tl.to("nav img", { y: "0%", opacity: 1, duration: 0.5 * d, ease: "power4.out" }, "reveal");
  // the menu button drops in from the top edge
  tl.to(".menu", { y: 0, opacity: 1, duration: 0.5 * d, ease: "back.out(1.6)" }, "reveal");
  // the yellow band fades in behind, its words already running
  tl.to(".hero-band", { opacity: 1, duration: 0.35 * d, ease: "power2.out" }, "reveal");
  // the "OO" comes up, then the friends onto it
  tl.to(".hero-oo, .hero-group", { y: "0%", opacity: 1, duration: 0.6 * d, ease: "power4.out", stagger: 0.05 * d }, "reveal+=0.05");
  // the text stickers pop onto the headline, one after another
  // (each settles at its own tilt, --rot in app/styles/sections/hero.css)
  const tagTilt = (i, el) => parseFloat(getComputedStyle(el).getPropertyValue("--rot")) || 0;
  // (centred on their points here: GSAP's transform replaces the CSS translate)
  gsap.set(".hero-tag", { translate: "none", xPercent: -50, yPercent: -50 });
  tl.fromTo(".hero-tag",
    { scale: 0, rotation: (i, el) => tagTilt(i, el) - 25 },
    { scale: 1, rotation: tagTilt, duration: 0.35 * d, ease: "back.out(2.4)", stagger: 0.06 * d }, "reveal+=0.3");
  // then each wobbles gently, out of step with the others: a few random
  // degrees either side of its tilt, at its own random pace, a new angle
  // each swing
  // (made here, paused, so the page's gsap.context cleans them up)
  if (!reduce) {
    const wobbles = gsap.utils.toArray(".hero-tag").map((el, i) => {
      const tilt = tagTilt(i, el);
      return gsap.to(el, {
        rotation: () => tilt + gsap.utils.random(-6, 6),
        duration: () => gsap.utils.random(1.1, 2),
        ease: "sine.inOut",
        repeat: -1,
        repeatRefresh: true, // a fresh random angle and pace each swing
        delay: gsap.utils.random(0, 0.6),
        paused: true,
      });
    });
    tl.call(() => wobbles.forEach((t) => t.play()), null, "reveal+=0.8");
  }

  // The overlay covers the whole window; remove it once it has opened, so it
  // never blocks clicks
  if (circles) tl.set(".hero-overlay", { display: "none" }, reduce ? "reveal+=0.45" : "loaded+=2");

  // 5. Unlock scrolling as the opening clears the screen
  // (refresh: the scrollbar appearing narrows the page, so re-measure)
  tl.call(
    () => {
      document.documentElement.classList.remove("is-loading");
      lenis.start();
      ScrollTrigger.refresh();
    },
    null,
    !circles ? "reveal" : reduce ? "reveal+=0.4" : "loaded+=1.9",
  );
}

// Run inside a gsap.context (components/layout/Experience.js), which reverts every
// tween on unmount. Returns a cleanup for the parts that outlive the context:
// the image wait and the "loaded" callback.
export function setupHero(lenis) {
  CustomEase.create("hop", "0.8, 0, 0.02, 1");
  let alive = true;

  // The circles only ever play on the first load; coming back to this page
  // from another one, the wipe is already covering it
  const circles = INTRO_STYLE === "circles" && isFirstLoad();
  const loaded = circles ? waitForImages(() => alive, 0.3) : whenCleared();
  playIntro(loaded, lenis, () => alive, circles);

  return () => {
    alive = false;
  };
}
