// The square wipe: Scoopa's page transition and (by default) its intro loader.
// Markup: components/layout/PageTransition.js · styles: app/styles/ui/transition.css
//
// Three full-screen layers, back to front: orange, teal, yellow. To cover, they
// swipe up from the bottom one after another (orange first, yellow last, so
// bands of each colour lead the way), each leading with a rounded top edge,
// its centre ahead of its sides. On the first load, a thick progress bar
// fills along the bottom of the yellow, with its count in the bottom-left
// corner (page changes wait without it). Then they keep going up and off the
// top, front first (yellow, teal, orange), each trailing a rounded bottom end,
// so the colours trail off and the page shows from the bottom up.
//
// One controller (one timeline at a time) runs every transition, so they can
// never overlap. Navigating while covered just changes where we're going;
// navigating while revealing fast-forwards the reveal, then covers again, so
// the layers always travel upward.
import gsap from "gsap";

// One timing for every layer move, in and out. power3.inOut: eases away from
// rest, carries speed through the middle, settles gently; no hard starts or
// stops. The reveal is a touch longer because it travels further (-125%
// against 101%), so both read at the same speed. A slow, unhurried sweep,
// with enough stagger that the colours read as separate layers.
const LAYER = { ease: "power3.inOut", cover: 1.6, reveal: 1.8, stagger: 0.11 };
const FADE = 0.9; // reduced motion: the layers fade instead

// Waiting for the page to load. Only the first load shows the progress bar
// (count and bar); page changes wait silently under the layers.
//   minTime: never sooner than this (seconds); the bar never fills faster,
//            and a page change holds the cover at least this long
//   cap:     gives up waiting after this, so a stuck image never holds the page
const PROGRESS = {
  intro: { minTime: 1.6, cap: 8, show: true },
  // page changes: lift the moment the page is in, without waiting for its
  // images (its entrance plays as they arrive), so the cover never pauses
  navigate: { minTime: 0, cap: 0, show: false },
  back: { minTime: 0, cap: 0, show: false },
};

// How the site first loads:
//   "squares" — this wipe (the layers start over the screen, then lift off onto the page)
//   "circles" — the hero's three concentric circles (animations/hero.js)
// Page-to-page navigation always uses the wipe.
export const INTRO_STYLE = "squares";

// ---------- Shared state, read by the pages (e.g. animations/hero.js) ----------

// false while the wipe covers the page; the page's entrances wait for it
let revealed = INTRO_STYLE !== "squares";
let waiting = [];
let navigations = 0;
let controller = null;

// false until the wipe has lifted fully off the screen
let cleared = revealed;
let clearWaiting = [];

// Resolves as the wipe starts opening onto the current page (at once if it
// already has). Pages start their entrance animations from here.
export function whenRevealed() {
  return revealed ? Promise.resolve() : new Promise((resolve) => waiting.push(resolve));
}

// Resolves once the wipe has lifted fully off the screen (at once if it
// already has): for entrances that should play only once nothing covers them
export function whenCleared() {
  return cleared ? Promise.resolve() : new Promise((resolve) => clearWaiting.push(resolve));
}

// true until the first page-to-page navigation
export const isFirstLoad = () => navigations === 0;

// Navigate with the wipe from code (links are picked up automatically).
export function navigate(href) {
  if (controller) controller.navigate(href);
  else window.location.assign(href);
}

function setRevealed(value) {
  revealed = value;
  if (!value) return (cleared = false); // covered again: not clear either
  const fns = waiting;
  waiting = [];
  fns.forEach((fn) => fn());
}

function setCleared() {
  cleared = true;
  const fns = clearWaiting;
  clearWaiting = [];
  fns.forEach((fn) => fn());
}

// ---------- Helpers ----------

// a page's identity: path + query (the #hash only scrolls within it)
const urlKey = (url) => (url.pathname.replace(/\/$/, "") || "/") + url.search;
const page = (key) => key.split("#")[0];
const frame = () => new Promise((resolve) => requestAnimationFrame(resolve));

// What the page needs before it's shown: the images in its first screen
// (lazy ones excluded; the wipe's own never count)
function firstScreenImages(root) {
  return [...document.querySelectorAll("img")].filter((img) => {
    if (root.contains(img) || img.loading === "lazy") return false;
    const r = img.getBoundingClientRect();
    return r.top < window.innerHeight * 1.2 && r.bottom > -window.innerHeight * 0.2;
  });
}

// ---------- The controller ----------

// root: the .wipe element · router: Next's router (for client-side navigation)
export function setupPageTransition({ root, router }) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const q = gsap.utils.selector(root);
  const layers = q(".wipe-layer"); // back to front: orange, teal, yellow
  const caps = q(".wipe-cap"); // their rounded bottom ends, same order
  const tops = q(".wipe-cap-top"); // their rounded top edges, same order
  const fill = q(".wipe-bar-fill")[0];
  const count = q(".wipe-count-value")[0];
  const meterParts = q(".wipe-count, .wipe-bar"); // fade out together at 100

  let alive = true;
  let state = "idle"; // idle | covering | covered | revealing
  let tl = null;
  let meter = null; // the progress bar's ticker callback, while it runs
  let shown = urlKey(window.location); // the page now on screen
  let target = shown; // the page we're heading for
  let running = false;

  // ----- The progress bar -----

  const setProgress = (v) => {
    gsap.set(fill, { scaleX: v });
    count.textContent = String(Math.round(v * 100));
  };
  const stopProgress = () => {
    if (meter) gsap.ticker.remove(meter);
    meter = null;
  };

  // Waits for the page's fonts and first-screen images (failed images count
  // as arrived). With `show`, the bar fills as they arrive, easing smoothly
  // towards each new value and never getting ahead of minTime; at 100 it
  // holds a beat, then the count and bar fade into the yellow, and it
  // resolves once they're gone (the layers lift next). Without, it waits
  // with the bar hidden and resolves as soon as the page is ready.
  function loadProgress({ minTime, cap, show }) {
    stopProgress();
    const imgs = firstScreenImages(root);
    let fontsIn = false;
    document.fonts.ready.then(() => (fontsIn = true));
    const total = imgs.length + 1;
    const started = performance.now();
    let value = 0;
    setProgress(0);
    gsap.killTweensOf(meterParts);
    gsap.set(meterParts, { autoAlpha: show ? 1 : 0 });
    return new Promise((resolve) => {
      meter = (_, deltaMs) => {
        if (!alive) return stopProgress();
        const elapsed = (performance.now() - started) / 1000;
        const loaded = elapsed > cap ? 1 : (imgs.filter((img) => img.complete).length + (fontsIn ? 1 : 0)) / total;
        const goal = minTime > 0 ? Math.min(loaded, elapsed / minTime) : loaded;
        if (!show) {
          if (goal >= 1) {
            stopProgress();
            resolve();
          }
          return;
        }
        value += (goal - value) * Math.min(1, (deltaMs / 1000) * (reduce ? 30 : 7));
        if (goal >= 1 && value > 0.995) value = 1;
        setProgress(value);
        if (value === 1) {
          stopProgress();
          gsap.to(meterParts, { autoAlpha: 0, duration: 0.45, delay: 0.2, ease: "sine.inOut", onComplete: resolve });
        }
      };
      gsap.ticker.add(meter);
    });
  }

  // Start states (the CSS has the same, for the first paint)
  const resetScene = () => {
    gsap.set(layers, { yPercent: 101, y: 0, autoAlpha: 1 });
    gsap.set([...caps, ...tops], { scaleY: 0 });
    stopProgress();
    setProgress(0);
    gsap.killTweensOf(meterParts);
    gsap.set(meterParts, { autoAlpha: 0 }); // hidden: only the first load shows them
  };

  // ----- Cover / reveal -----

  // Resolves as soon as the old page is hidden (the back layer has settled
  // over it), so the new page can start loading while the front layers are
  // still settling; `covered` resolves once they all have (wait for it
  // before revealing, so the sweep always completes).
  let covered = Promise.resolve();
  function cover() {
    return new Promise((resolve) => {
      tl?.kill();
      resetScene();
      setRevealed(false);
      state = "covering";
      root.dataset.state = "active";
      let settled;
      covered = new Promise((r) => (settled = r));
      tl = gsap.timeline({
        onComplete: () => {
          state = "covered";
          resolve(); // (already, unless the timeline was cut short)
          settled();
        },
      });
      // Nothing of the old page shows any more: the back layer, with its
      // curved edge, has closed off even the screen's corners about 78% of
      // the way through its sweep. The new page starts loading here, while
      // the front layers settle, so it's in by the time they have.
      tl.call(resolve, null, reduce ? FADE : LAYER.cover * 0.78);
      if (reduce) {
        tl.set(layers, { yPercent: 0, autoAlpha: 0 });
        tl.to(layers, { autoAlpha: 1, duration: FADE, ease: "sine.inOut" });
      } else {
        // Each layer sweeps up, back first, leading with its rounded top
        // edge: the curve swells (sine) as the layer gathers speed, fullest
        // halfway (power3.inOut's fastest point), and flattens as it
        // settles, so the screen ends fully, flatly covered.
        // The same curve, on the same rhythm, as the lift-off: it swells
        // (sine) with the layer's speed, fullest halfway, and relaxes as the
        // layer slows; here all the way to flat, so the cover ends complete.
        // Every layer bends alike, so the colour bands between them stay even.
        const half = LAYER.cover / 2;
        layers.forEach((layer, i) => {
          const at = i * LAYER.stagger;
          tl.to(layer, { yPercent: 0, duration: LAYER.cover, ease: LAYER.ease }, at);
          tl.to(tops[i], { scaleY: 1, duration: half, ease: "sine.inOut" }, at);
          tl.to(tops[i], { scaleY: 0, duration: half, ease: "sine.inOut" }, at + half);
        });
      }
    });
  }

  // prompt: a page change. The layers have only just settled, so they set
  // straight off again (no delay, a quicker start than power3's), and the
  // cover never reads as a pause. The first load keeps the slow, even lift.
  function reveal({ prompt = false } = {}) {
    return new Promise((resolve) => {
      tl?.kill();
      state = "revealing";
      setRevealed(true); // the page's entrances start now
      tl = gsap.timeline({
        onComplete: () => {
          state = "idle";
          resetScene();
          delete root.dataset.state;
          document.documentElement.classList.remove("is-loading");
          prefetchLinks(); // so the next click finds its page ready
          if (!cleared) setCleared(); // (normally already called, as the last layer cleared the screen)
          resolve();
        },
      });
      if (reduce) {
        tl.to(layers, { autoAlpha: 0, duration: FADE, ease: "sine.inOut" });
        return;
      }
      // Each layer lifts off front first, and its bottom end bends with its
      // speed: power3.inOut is fastest halfway, so the curve swells (sine)
      // to its fullest there and relaxes as the layer slows, the two always
      // in step. -125%: far enough that the rounded end clears the top too.
      const lift = [...layers].reverse();
      const ends = [...caps].reverse();
      const half = LAYER.reveal / 2;
      const ease = prompt ? "power2.inOut" : LAYER.ease;
      lift.forEach((layer, i) => {
        const at = (prompt ? 0 : 0.05) + i * LAYER.stagger;
        // the last layer off: the moment its curved end (hanging below it)
        // clears the top of the screen, the page is uncovered, though the
        // tween runs on a little out of sight
        const last = i === lift.length - 1;
        const onUpdate = last ? () => !cleared && ends[i].getBoundingClientRect().bottom <= 0 && setCleared() : undefined;
        tl.to(layer, { yPercent: -125, duration: LAYER.reveal, ease, onUpdate }, at);
        tl.to(ends[i], { scaleY: 1, duration: half, ease: "sine.inOut" }, at);
        tl.to(ends[i], { scaleY: 0.3, duration: half, ease: "sine.inOut" }, at + half);
      });
    });
  }

  // ----- Navigation -----

  // Waits until the router has put the new page on screen (Next updates the
  // URL as it commits it), checked every frame, or gives up after a few seconds.
  function routeCommitted(key) {
    const started = performance.now();
    return new Promise((resolve) => {
      const check = () => {
        if (!alive || urlKey(window.location) === key || performance.now() - started > 6000) {
          gsap.ticker.remove(check);
          resolve();
        }
      };
      gsap.ticker.add(check);
      check();
    });
  }

  // Fetches every page the current one links to in the background (Next
  // prefetches in production builds only), so a click finds it ready and
  // the cover lifts almost at once
  function prefetchLinks() {
    const seen = new Set();
    document.querySelectorAll("a[href^='/']").forEach((a) => {
      if (root.contains(a)) return;
      const url = new URL(a.href);
      const key = urlKey(url);
      if (url.origin !== window.location.origin || key === urlKey(window.location) || seen.has(key)) return;
      seen.add(key);
      router.prefetch?.(key);
    });
  }

  // Covers, swaps pages (to the latest target if clicks keep coming), fills
  // the bar as the new page loads, then reveals. Loops if another navigation
  // came in during the reveal.
  async function run() {
    if (running) return;
    running = true;
    while (alive && target !== shown) {
      await cover();
      while (alive && target !== shown) {
        shown = target;
        window.scrollTo(0, 0);
        router.push(shown, { scroll: false });
        await routeCommitted(page(shown));
      }
      if (!alive) break;
      await frame(); // let the new page lay out, so its first screen can be measured
      await Promise.all([loadProgress(PROGRESS.navigate), covered]);
      const hash = window.location.hash.slice(1);
      if (hash) document.getElementById(decodeURIComponent(hash))?.scrollIntoView();
      if (!alive) break;
      await reveal({ prompt: true });
    }
    running = false;
  }

  function go(href) {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return window.location.assign(href);
    navigations++;
    target = urlKey(url) + url.hash;
    router.prefetch?.(urlKey(url));
    if (state === "revealing") tl?.timeScale(3); // finish opening quickly, then cover again
    run();
  }

  // Internal links to another page go through the wipe. Left alone: other
  // sites, new tabs/windows, downloads, same-page anchors and
  // data-transition="off".
  function onClick(e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest?.("a[href]");
    if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download") || a.dataset.transition === "off") return;
    const url = new URL(a.href, window.location.href);
    if (url.origin !== window.location.origin) return;
    if (urlKey(url) === urlKey(window.location)) return; // same page (maybe a #section)
    e.preventDefault();
    go(url.href);
  }
  window.addEventListener("click", onClick, true);

  // Puts every layer over the screen at once (no swipe in)
  function coverInstantly() {
    tl?.kill();
    resetScene();
    setRevealed(false);
    state = "covered";
    root.dataset.state = "active";
    gsap.set(layers, { yPercent: 0 });
  }

  // Back/forward: the router has already swapped the page (before paint), so
  // cover instantly, fill the bar and open onto it.
  async function routeChanged() {
    const key = urlKey(window.location);
    if (running || key === page(shown)) return;
    shown = target = key;
    coverInstantly();
    running = true;
    window.scrollTo(0, 0);
    await loadProgress(PROGRESS.back);
    running = false;
    if (alive && state === "covered") reveal({ prompt: true }).then(() => target !== shown && run());
  }

  // ----- The intro -----

  // The site opens already covered (the CSS starts the layers on screen for
  // the first paint): the bar fills as the page loads, then the layers lift
  // off one after another, yellow first.
  async function intro() {
    running = true;
    coverInstantly();
    await loadProgress(PROGRESS.intro);
    if (!alive) return;
    await reveal();
    running = false;
    if (target !== shown) run();
  }

  resetScene();
  if (INTRO_STYLE === "squares" && navigations === 0) intro();

  const api = { navigate: go, routeChanged };
  controller = api;

  return {
    ...api,
    destroy() {
      alive = false;
      if (controller === api) controller = null;
      window.removeEventListener("click", onClick, true);
      tl?.kill();
      stopProgress();
      gsap.killTweensOf([root, ...root.querySelectorAll("*")]);
    },
  };
}
