// Footer ingredients: a small physics loop. Each ingredient is launched from
// below the footer's bottom edge with its own upward speed, so it reaches its
// own height; gravity pulls it back, it bounces once on the bottom edge
// (losing some energy, its spin knocked about), then falls back out through
// the bottom and waits a moment before launching again. Every launch draws
// fresh values, so the loop never repeats in step.
// Markup: components/layout/Footer.js (.footer-ingredients) · styles:
// styles/ui/ingredients.css. Runs only while the footer is on screen; off
// (nothing shown) with reduced motion. Returns a cleanup.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const { random } = gsap.utils;

export function setupIngredients({ reduceMotion }) {
  const layer = document.querySelector(".footer-ingredients");
  if (!layer || reduceMotion) return () => {};
  const pool = [...layer.querySelectorAll(".footer-ingredient")];

  // Sizes from the footer's width and height, re-read on resize
  let W = 0;
  let H = 0;
  let base = 0; // an ingredient's drawn width, before its own scale
  let g = 0; // gravity, px/s²
  let active = 0; // how many are in play (fewer on narrow screens)
  const measure = () => {
    W = layer.clientWidth;
    H = layer.clientHeight;
    base = gsap.utils.clamp(44, 110, W * 0.055);
    g = gsap.utils.clamp(1400, 2600, H * 3.2);
    active = W < 700 ? 6 : W < 1100 ? 8 : pool.length;
  };
  measure();

  // One body per pooled image. y: its centre's height above the bottom edge.
  const bodies = pool.map((el, i) => ({
    el,
    scale: Number(el.dataset.scale) || 1,
    ratio: (Number(el.getAttribute("height")) || 1) / (Number(el.getAttribute("width")) || 1),
    flying: false,
    wait: random(0, 3.5), // staggered first launches
    x: 0, y: 0, vx: 0, vy: 0, rot: 0, vr: 0, w: 0, h: 0, bounces: 0, floor: 0,
    index: i,
  }));

  const launch = (b) => {
    b.w = base * b.scale * random(0.85, 1.15);
    b.h = b.w * b.ratio;
    b.el.style.width = `${b.w}px`;
    b.x = random(0.04, 0.96) * W;
    b.y = -b.h; // just below the edge
    // up to a height between a quarter and three quarters of the footer
    const peak = random(0.25, 0.75) * H;
    b.vy = Math.sqrt(2 * g * (peak + b.h));
    b.vx = random(-0.04, 0.04) * W; // a little sideways drift
    b.rot = random(0, 360);
    b.vr = random(90, 320) * (Math.random() < 0.5 ? -1 : 1); // deg/s
    b.bounces = 1; // one bounce on the bottom edge, then down and out
    b.floor = b.h * 0.42; // where it lands: mostly above the edge
    b.flying = true;
    b.el.style.visibility = "visible";
  };

  const land = (b) => {
    if (b.bounces > 0) {
      // bounce: a fraction of the speed back (0.55–0.72), spin knocked about
      b.bounces -= 1;
      b.y = b.floor;
      b.vy = -b.vy * random(0.55, 0.72);
      b.vr = b.vr * random(-0.9, 0.6) + random(-60, 60);
      b.vx *= 0.7;
    }
    // no bounces left: it carries on down, out of sight
  };

  const step = (dt) => {
    bodies.forEach((b) => {
      if (!b.flying) {
        if (b.index >= active) return; // out of play on this screen size
        b.wait -= dt;
        if (b.wait <= 0) launch(b);
        return;
      }
      b.vy -= g * dt;
      b.y += b.vy * dt;
      b.x += b.vx * dt;
      b.rot += b.vr * dt;
      if (b.vy < 0 && b.y <= b.floor && b.bounces > 0) land(b);
      if (b.y < -b.h * 1.2) {
        // gone below the edge: rest, then go again
        b.flying = false;
        b.wait = random(0.3, 2.6);
        b.el.style.visibility = "hidden";
        return;
      }
      b.el.style.transform = `translate3d(${b.x - b.w / 2}px, ${-b.y + b.h / 2}px, 0) rotate(${b.rot}deg)`;
    });
  };

  // gsap's ticker: one frame loop for the whole site; dt capped so a
  // stalled tab doesn't fling everything on return
  const tick = (time, deltaMs) => step(Math.min(deltaMs, 50) / 1000);
  let running = false;
  const start = () => !running && (running = true, gsap.ticker.add(tick));
  const stop = () => running && (running = false, gsap.ticker.remove(tick));

  // only while the footer is on screen
  const trigger = ScrollTrigger.create({
    trigger: layer.parentElement,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => (self.isActive ? start() : stop()),
    onRefresh: measure,
  });
  if (trigger.isActive) start();
  window.addEventListener("resize", measure);

  return () => {
    stop();
    trigger.kill();
    window.removeEventListener("resize", measure);
    pool.forEach((el) => {
      el.style.visibility = "";
      el.style.transform = "";
      el.style.width = "";
    });
  };
}
