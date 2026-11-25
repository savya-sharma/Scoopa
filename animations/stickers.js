// Stickers: a curled corner peels open as the page scrolls (ScrollTrigger,
// scrub: true), and folds back over again when scrolling up.
// Markup: components/ui/Sticker.js · styles: styles/ui/stickers.css
//
// How the peel is built
//   A fold line crosses the sticker at right angles to the direction of its
//   peel corner. s = distance from the sticker's centre towards that corner.
//   • s ≤ fold: stuck to the page (the original image, clipped at the fold)
//   • s > fold: the flap. It's drawn as a chain of strips, each hinged to the
//     one before: the first few bend a little each, together making a round
//     curl of radius r up off the surface and back over; the last strip is
//     the flat tail beyond the curl. Each strip shows the artwork on its front
//     and the sticker's paper underside on its back, so the folded part shows
//     its underside. Strips are lit by how far they face the viewer.
//   • A shadow layer darkens the sticker under the folded flap and the page
//     around the curl, deeper as the flap lifts higher.
//
// Scroll progress p (0 → 1) moves the fold from near the centre to the
// corner (the flap shrinks to nothing: fully revealed), lifts the flap from
// almost flat-folded to well off the surface, and widens the curl.
import gsap from "gsap";

// Unit direction from the centre towards each corner (x right, y down)
const R = Math.SQRT1_2;
const CORNERS = { tl: [-R, -R], tr: [R, -R], bl: [-R, R], br: [R, R] };

const CURL = 8; // strips in the curl (the rest of the flap is one flat tail)
const FOLD_START = 0.32; // fold position at p = 0, as a share of the artwork's
// extent along the peel direction (0.5: folded flat, the corner would just
// reach the opposite edge)
const ANGLE_START = 168; // how far the flap is folded over at p = 0, degrees (180 = flat on top)
const ANGLE_END = 112; // … and as it reaches the corner: lifted well off the surface
const RADIUS_START = 0.05; // curl radius at p = 0, × sticker size
const RADIUS_END = 0.1;

const ease = gsap.parseEase("sine.inOut");
const lerp = (a, b, t) => a + (b - a) * t;

// The sticker's square, in units of its size, cut by the fold at s = m:
// the stuck side, as a clip-path polygon. (Cut from a square with a margin,
// so the clip only ever cuts along the fold, never through the sticker's
// shadow at its outer edges.)
function stuckClip([ux, uy], m) {
  const square = [[-0.25, -0.25], [1.25, -0.25], [1.25, 1.25], [-0.25, 1.25]];
  const side = ([x, y]) => (x - 0.5) * ux + (y - 0.5) * uy - m;
  const out = [];
  square.forEach((p, i) => {
    const q = square[(i + 1) % 4];
    if (side(p) <= 0) out.push(p);
    if (side(p) <= 0 !== side(q) <= 0) {
      const t = side(p) / (side(p) - side(q));
      out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]);
    }
  });
  return `polygon(${out.map(([x, y]) => `${x * 100}% ${y * 100}%`).join(",")})`;
}

// How far the artwork's opaque pixels reach along u, from the centre, as a
// share of the sticker size ([near, far]). The fold travels over this span, so
// the peel uses the whole scroll whatever the sticker's shape.
function extent(img, [ux, uy]) {
  const N = 64; // sampled at low resolution: plenty for this
  const c = document.createElement("canvas");
  c.width = c.height = N;
  const g = c.getContext("2d", { willReadFrequently: true });
  // drawn as "contain" in the square, like the CSS
  const k = Math.min(N / img.naturalWidth, N / img.naturalHeight);
  const w = img.naturalWidth * k, h = img.naturalHeight * k;
  g.drawImage(img, (N - w) / 2, (N - h) / 2, w, h);
  const a = g.getImageData(0, 0, N, N).data;
  let lo = Infinity, hi = -Infinity;
  for (let y = 0; y < N; y++)
    for (let x = 0; x < N; x++) {
      if (a[(y * N + x) * 4 + 3] < 40) continue;
      const s = ((x + 0.5) / N - 0.5) * ux + ((y + 0.5) / N - 0.5) * uy;
      lo = Math.min(lo, s);
      hi = Math.max(hi, s);
    }
  return hi > lo ? [lo, hi + 0.5 / N] : [-R, R];
}

// Builds the draw function for one sticker: draw(p) poses it at progress p
function makeRig(sticker) {
  const peel = sticker.querySelector(".peel");
  const face = peel.querySelector(".peel-face");
  const shadow = peel.querySelector(".peel-shadow");
  const frame = peel.querySelector(".peel-frame");
  const strips = [...peel.querySelectorAll(".peel-strip")];
  const sides = strips.map((s) => [...s.querySelectorAll(":scope > .peel-side")]);
  const arts = sides.map(([front, back]) => [front.firstElementChild, back.firstElementChild]);
  const u = CORNERS[sticker.dataset.corner] ?? CORNERS.tr;
  const [ux, uy] = u;
  const turn = Math.atan2(uy, ux); // the frame's x axis points at the peel corner
  const gradAngle = (Math.atan2(ux, -uy) * 180) / Math.PI; // CSS gradient towards the corner

  // the frame is turned towards the corner; the art inside is turned back,
  // so it lines up with the stuck part (and mirrored on the underside)
  frame.style.transform = `rotate(${turn}rad)`;
  arts.forEach(([front, back]) => {
    front.style.transform = `rotate(${-turn}rad)`;
    back.style.transform = `scaleX(-1) rotate(${-turn}rad)`;
  });

  // the artwork's span along u (until the image has loaded: the whole square)
  let span = [-R, R];
  const measure = () => {
    try {
      span = extent(face, u);
    } catch {
      /* keep the square */
    }
  };
  if (face.complete && face.naturalWidth) measure();

  let size = 0;
  const draw = (p) => {
    const S = peel.offsetWidth;
    if (!S) return;
    const half = S * R; // centre to corner, px
    if (S !== size) {
      size = S;
      peel.style.setProperty("--peel-s", `${S}px`);
      peel.style.setProperty("--peel-d", `${2 * half}px`);
    }

    const e = ease(p);
    const [near, far] = span;
    const fold = lerp(near + (far - near) * FOLD_START, far, e) * S; // px from the centre
    const flap = half - fold; // flap length to the square's corner, px

    // fully revealed: just the artwork, its shadow unclipped
    if (fold >= far * S - 0.5) {
      face.style.clipPath = "";
      frame.style.visibility = shadow.style.visibility = "hidden";
      return;
    }
    frame.style.visibility = shadow.style.visibility = "visible";
    face.style.clipPath = stuckClip(u, fold / S);

    // the curl: CURL strips bend through `bend` radians around radius r;
    // whatever flap is left over is the flat tail
    const total = (lerp(ANGLE_START, ANGLE_END, e) * Math.PI) / 180;
    const r = lerp(RADIUS_START, RADIUS_END, e) * S;
    const arc = Math.min(flap, total * r);
    const step = arc / r / CURL; // bend per curl strip
    const lens = [...Array(CURL).fill(arc / CURL), flap - arc];

    let s = fold; // where the current strip starts, unfolded
    strips.forEach((strip, k) => {
      const len = lens[k];
      const rel = k < CURL ? step : 0;
      const along = k === 0 ? fold : lens[k - 1];
      strip.style.width = `${len}px`;
      strip.style.transform = `translateX(${along}px) rotateY(${-rel}rad)`;
      arts[k][0].style.left = `${-s}px`;
      arts[k][1].style.left = `${len + s}px`;
      // light: brightest facing the viewer, darkest edge-on in the curl
      const facing = Math.cos(Math.min(k + 0.5, CURL) * step);
      sides[k][0].style.filter = `brightness(${0.62 + 0.38 * Math.max(facing, 0)})`;
      sides[k][1].style.filter = `brightness(${0.7 + 0.3 * Math.max(-facing, 0)})`;
      s += len;
    });

    // shadow: under the folded-back flap and around the curl, deeper and
    // softer the higher it lifts, fading as the flap shrinks away
    const pct = (x) => ((x + half) / (2 * half)) * 100;
    const lift = 1 - Math.cos(Math.PI - total); // 0 flat on top → ~0.6 lifted
    const strength = (0.18 + 0.3 * lift) * Math.min(1, flap / (0.25 * S));
    const soft = S * (0.04 + 0.1 * lift);
    const reach = Math.min(flap, Math.max(arc, (flap - arc) * Math.abs(Math.cos(total)) + arc * 0.6));
    shadow.style.background = `linear-gradient(${gradAngle}deg,
      #0000 ${pct(fold - reach - soft)}%,
      rgb(16 32 112 / ${strength * 0.7}) ${pct(fold - reach)}%,
      rgb(16 32 112 / ${strength}) ${pct(fold)}%,
      rgb(16 32 112 / ${strength * 0.6}) ${pct(fold + r * 0.5)}%,
      #0000 ${pct(fold + r + soft)}%)`;
  };
  return { draw, onImage: (redraw) => face.complete || face.addEventListener("load", () => (measure(), redraw()), { once: true }) };
}

// The scroll positions where a sticker's top reaches the bottom of the
// screen and 40% of the way down it
function range(sticker) {
  const top = sticker.getBoundingClientRect().top + window.scrollY;
  return [top - innerHeight, top - innerHeight * 0.4];
}

export function setupStickers({ reduceMotion }) {
  const stickers = [...document.querySelectorAll(".sticker")];
  const made = [];

  stickers.forEach((sticker) => {
    const peel = sticker.querySelector(".peel");
    const { draw, onImage } = makeRig(sticker);
    gsap.set(peel, { rotation: Number(sticker.dataset.rot) }); // resting tilt

    // reduced motion: no peel, the sticker simply sits flat
    if (reduceMotion) return draw(1), onImage(() => draw(1));

    // a pop sticker (data-pop: its delay, s): no peel, it sits flat and pops
    // onto the page (scales up from nothing with a springy overshoot and a
    // little twist) as it scrolls into view, once
    if (sticker.dataset.pop !== undefined) {
      draw(1);
      onImage(() => draw(1));
      gsap.set(sticker, { scale: 0, rotation: -18, autoAlpha: 0 });
      made.push(
        gsap.to(sticker, {
          scale: 1,
          rotation: 0,
          autoAlpha: 1,
          duration: 0.7,
          delay: Number(sticker.dataset.pop) || 0,
          ease: "back.out(2.2)",
          scrollTrigger: { trigger: sticker, start: "top 85%", once: true },
        }),
      );
      return;
    }

    const state = { p: 0 };
    draw(0);
    onImage(() => draw(state.p));
    made.push(
      gsap.to(state, {
        p: 1,
        ease: "none",
        onUpdate: () => draw(state.p),
        scrollTrigger: {
          trigger: sticker,
          // starts peeling as it comes into view, fully open a little above the
          // middle of the screen. A sticker already on screen when the page
          // loads (phones: Flavours) peels over the first stretch of scrolling.
          start: () => Math.max(0, range(sticker)[0]),
          end: () => Math.max(range(sticker)[1], Math.max(0, range(sticker)[0]) + innerHeight * 0.6),
          scrub: true,
          onRefresh: () => draw(state.p), // re-measure after a resize
        },
      }),
    );
  });

  return () =>
    made.forEach((t) => {
      t.scrollTrigger?.kill();
      t.kill();
    });
}
