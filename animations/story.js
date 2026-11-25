// Our Story: as the statement comes into view, its lines rise out of their
// masks one after another, then the ribbon button pops in.
// With a mouse, stickers trail the pointer over the section: every so often
// along its path one pops up (growing from nothing with a springy twist and
// a little drift the way the pointer is heading), holds a moment, then pops
// away. They appear in turn along the path and vanish in the same order, so
// the trail fills in and clears out as a stagger; when the pointer leaves,
// whatever is left pops away one after another.
// Markup: components/sections/OurStory.js (the trail's stickers:
// siteContent.ourStory.trail).
import gsap from "gsap";

const SPACING = 110; // px the pointer travels between stickers
const HOLD = 0.55; // s a sticker stays fully up before it starts to go
const TILT = 22; // ± degrees: each sticker's resting tilt is random within this
const DRIFT = 0.35; // how far a sticker carries on the pointer's way (× SPACING)

export function setupStory({ reduceMotion }) {
  const section = document.querySelector(".story");
  if (!section || reduceMotion) return () => {};
  const q = gsap.utils.selector(section);

  gsap.set(q(".story-line > span"), { yPercent: 110 });
  gsap.set(q(".story-cta"), { scale: 0.4, autoAlpha: 0 });

  const tl = gsap.timeline({ scrollTrigger: { trigger: q(".story-text")[0], start: "top 80%", once: true } })
    .to(q(".story-line > span"), { yPercent: 0, duration: 1, ease: "power4.out", stagger: 0.12 })
    .to(q(".story-cta"), { scale: 1, autoAlpha: 1, duration: 0.6, ease: "back.out(2.2)" }, 0.55);

  const stopTrail = trail(section, q(".story-trail img"));

  return () => {
    stopTrail();
    tl.scrollTrigger?.kill();
    tl.kill();
  };
}

// ----- The sticker trail -----
function trail(section, pool) {
  if (!pool.length || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return () => {};

  gsap.set(pool, { xPercent: -50, yPercent: -50, transformOrigin: "50% 50%" });
  const live = []; // stickers up or on their way, oldest first: { el, tl }
  let next = 0; // the pool is used in turn, so the sticker art cycles too
  let lastX = null, lastY = null;
  let layer = 1;

  const release = (rec) => {
    const i = live.indexOf(rec);
    if (i > -1) live.splice(i, 1);
  };

  function place(x, y, dx, dy, delay = 0) {
    const el = pool[next];
    next = (next + 1) % pool.length;
    // still in use (the pointer outran the pool): take it over
    const old = live.find((r) => r.el === el);
    if (old) { old.tl.kill(); release(old); }

    const len = Math.hypot(dx, dy) || 1;
    const rot = gsap.utils.random(-TILT, TILT);
    const rec = { el };
    rec.tl = gsap.timeline({ delay, onComplete: () => release(rec) })
      .set(el, { x, y, scale: 0, rotation: rot - 35, autoAlpha: 1, zIndex: ++layer })
      // pop up: grow with a springy overshoot, untwisting to its tilt, and
      // carry on a little the way the pointer was going
      .to(el, {
        scale: 1,
        rotation: rot,
        x: x + (dx / len) * SPACING * DRIFT,
        y: y + (dy / len) * SPACING * DRIFT,
        duration: 0.6,
        ease: "back.out(2.4)",
      })
      // pop away: a quick wind-up, then shrink to nothing with a twist
      .to(el, {
        scale: 0,
        rotation: rot + gsap.utils.random([-1, 1]) * 30,
        duration: 0.45,
        ease: "back.in(2)",
      }, `+=${HOLD}`)
      .set(el, { autoAlpha: 0 });
    live.push(rec);
  }

  const listeners = new AbortController();
  const { signal } = listeners;

  section.addEventListener("pointermove", (e) => {
    const r = section.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    if (lastX === null) { lastX = x; lastY = y; return; }
    const dx = x - lastX, dy = y - lastY;
    // a sticker for every SPACING px travelled (several on a fast flick,
    // spread along the path so the trail has no gaps, each a beat after the
    // one before, so even a flick fills in as a stagger)
    const steps = Math.floor(Math.hypot(dx, dy) / SPACING);
    for (let s = 1; s <= steps; s++) {
      place(lastX + (dx * s) / steps, lastY + (dy * s) / steps, dx, dy, (s - 1) * 0.05);
    }
    if (steps) { lastX = x; lastY = y; }
  }, { signal });

  // the pointer's gone: what's left pops away in turn, oldest first
  section.addEventListener("pointerleave", () => {
    lastX = lastY = null;
    live.slice().forEach((rec, i) => {
      rec.tl.kill();
      rec.tl = gsap.timeline({ delay: i * 0.06, onComplete: () => release(rec) })
        .to(rec.el, { scale: 0, rotation: "+=30", duration: 0.4, ease: "back.in(2)" })
        .set(rec.el, { autoAlpha: 0 });
    });
  }, { signal });

  return () => {
    listeners.abort();
    live.forEach((rec) => rec.tl.kill());
    gsap.killTweensOf(pool);
    gsap.set(pool, { autoAlpha: 0 });
  };
}
