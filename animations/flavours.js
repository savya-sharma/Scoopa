// Flavour slider: equal bowls on a gentle smile-shaped arc, the centre of the
// screen falling between two of them; towards the edges each bowl rises and
// tilts outwards a little (its name with it). On wide screens two bowls sit
// either side of the centre, the outer ones cut off by the screen's edges;
// on phones, one either side. The arrows (or a swipe) glide the row one bowl
// along, and it loops round.
// (Decorations bursting from behind a bowl at the centre are still supported,
// should the markup include them; the current design doesn't.)
// Markup: components/sections/Flavours.js · decorations: data/products.js
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const GAP = 1.15; // centre-to-centre spacing, in bowl widths
// bowl spacing: the screen's width ÷ this. 3: the outer bowls of four sit
// centred on the screen's edges (half cut off); 2: two bowls fill a phone
const SLOTS = { wide: 3, narrow: 2 };
const MAX_BOWL = 380; // px: never larger (the bowl photos are ~450 px)
const LIFT = 0.16; // how far the arc rises at the screen edges (× screen width)
const TILT = 12; // degrees of tilt at the screen edges
const SIDE = 1; // size of the bowls either side of the centre, relative to it

export function setupFlavourSlider({ reduceMotion }) {
  const slider = document.querySelector(".flavour-slider");
  if (!slider) return () => {};
  const items = [...slider.querySelectorAll(".flavour-item")];
  const n = items.length;
  const listeners = new AbortController();
  const { signal } = listeners;
  // Where the row is (in bowls; fractional while moving). x.5 puts the centre
  // between two bowls: 1.5 shows the first four flavours, left to right.
  const state = { pos: 1.5 };
  let tween = null;

  const layout = () => {
    const w = slider.offsetWidth;
    const slots = w < 700 ? SLOTS.narrow : SLOTS.wide;
    const step = Math.min(w / slots, MAX_BOWL * GAP);
    slider.style.setProperty("--bowl", `${step / GAP}px`);
    items.forEach((el, i) => {
      let o = (((i - state.pos) % n) + n) % n; // 0..n
      if (o >= n / 2) o -= n; // -n/2..n/2, so bowls wrap round off-screen
      const x = o * step;
      const u = x / w; // -0.5..0.5 across the screen
      gsap.set(el, {
        x,
        xPercent: -50,
        y: -LIFT * w * u * u,
        rotate: gsap.utils.clamp(-10, 10, TILT * u),
        scale: 1 - (1 - SIDE) * Math.min(1, Math.abs(o)),
        // shown while any of it is on screen, fading out just beyond the edges
        autoAlpha: gsap.utils.clamp(0, 1, (w / 2 + step * 0.6 - Math.abs(x)) / (step * 0.3)),
      });
    });
  };

  // ----- The centre bowl's decorations -----
  const pops = items.map((el) => [...el.querySelectorAll(".flavour-pop")]);
  const shows = new Map(); // item index → its running timeline
  let active = -1;
  const centre = () => ((Math.round(state.pos) % n) + n) % n;

  // Out: from the bowl's centre, each to its own spot, with its own delay,
  // overshooting and bouncing into place
  const burst = (i) => {
    const list = pops[i];
    if (!list.length) return;
    shows.get(i)?.kill();
    const W = items[i].querySelector(".flavour-bowl").offsetWidth;
    const tl = gsap.timeline();
    list.forEach((p, k) => {
      const x = Number(p.dataset.x) * W;
      const y = Number(p.dataset.y) * W;
      const rot = Number(p.dataset.rot);
      tl.fromTo(p,
        { x: 0, y: 0, scale: 0.2, rotation: rot - (x < 0 ? 40 : -40), autoAlpha: 1 },
        { x, y, scale: 1, rotation: rot, duration: reduceMotion ? 0 : 0.9 + k * 0.06, ease: "back.out(2.6)" },
        reduceMotion ? 0 : k * 0.07);
    });
    shows.set(i, tl);
  };

  // After a resize: straight to their resting spots for the new bowl size
  // (no replay: phones fire resize while scrolling, as their toolbars move)
  const place = (i) => {
    const W = items[i].querySelector(".flavour-bowl").offsetWidth;
    shows.get(i)?.kill();
    pops[i].forEach((p) => gsap.set(p, { x: Number(p.dataset.x) * W, y: Number(p.dataset.y) * W, scale: 1, rotation: Number(p.dataset.rot), autoAlpha: 1 }));
  };

  // In: they tuck back behind the bowl, quickly
  const tuck = (i) => {
    const list = pops[i];
    if (!list?.length) return;
    shows.get(i)?.kill();
    shows.set(i, gsap.to(list, {
      x: 0,
      y: 0,
      scale: 0.2,
      autoAlpha: 0,
      duration: reduceMotion ? 0 : 0.3,
      ease: "power2.in",
      stagger: reduceMotion ? 0 : 0.03,
    }));
  };

  // Settled on a bowl: if it's a new one, the old one's go in and its come out
  const settle = () => {
    const i = centre();
    if (i === active) return;
    if (active >= 0) tuck(active);
    active = i;
    burst(i);
  };

  const go = (dir) => {
    // one bowl along, landing back on the x.5 grid (the centre between two bowls)
    const target = Math.round(state.pos - 0.5) + 0.5 + dir;
    // leaving the centre: its decorations tuck in straight away
    if (active >= 0) {
      tuck(active);
      active = -1;
    }
    tween?.kill();
    tween = gsap.to(state, {
      pos: target,
      duration: reduceMotion ? 0 : 0.8,
      ease: "power3.inOut",
      onUpdate: layout,
      onComplete: settle, // only once it has arrived (a newer move cancels this)
    });
  };

  slider.querySelectorAll(".flavour-arrow").forEach((btn) =>
    btn.addEventListener("click", () => go(Number(btn.dataset.dir)), { signal }),
  );

  // Swipe or drag sideways on the bowls
  const track = slider.querySelector(".flavour-track");
  let downX = null;
  track.addEventListener("pointerdown", (e) => (downX = e.clientX), { signal });
  track.addEventListener(
    "pointerup",
    (e) => {
      if (downX === null) return;
      const dx = e.clientX - downX;
      downX = null;
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    },
    { signal },
  );

  // A resize re-places the bowls, and the centre bowl's decorations, which
  // are sized from its width
  const resize = () => {
    layout();
    if (active >= 0) place(active);
  };

  layout();
  window.addEventListener("resize", resize, { signal });

  // The first burst plays when the slider comes into view
  const intro = ScrollTrigger.create({ trigger: slider, start: "top 75%", once: true, onEnter: settle });

  return () => {
    listeners.abort();
    tween?.kill();
    intro.kill();
    shows.forEach((t) => t.kill());
  };
}
