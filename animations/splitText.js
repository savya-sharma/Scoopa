// Split-text reveals, on every page: any element marked data-split is split
// (GSAP's SplitText) and its pieces rise out of line masks one after another.
//   data-split="chars": letter by letter (headings)
//   data-split="lines": line by line (short text)
// Nothing plays until the page transition is over (the wipe has lifted fully
// off the screen); then each element reveals as it comes into view, once.
// Text already on screen when the wipe lifts reveals straight away.
// (The hero heading, the Brand Personality heading, Our Story and the inner
// pages' title band have their own reveals, so they aren't marked.)
// Screen readers get the whole text (SplitText's aria: the element is
// labelled, the pieces hidden). Off with reduced motion. Returns a cleanup.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { whenCleared } from "@/animations/pageTransition";

gsap.registerPlugin(SplitText);

const CHARS = { duration: 0.75, stagger: 0.02, ease: "power4.out" };
const LINES = { duration: 0.9, stagger: 0.1, ease: "power4.out" };

export function setupSplitText({ reduceMotion }) {
  const els = [...document.querySelectorAll("[data-split]")];
  if (!els.length || reduceMotion) return () => {};
  let alive = true;

  const items = els.map((el) => {
    const chars = el.dataset.split === "chars";
    const item = { el, chars, revealed: false, pieces: [], split: null, trigger: null };
    item.split = SplitText.create(el, {
      type: chars ? "lines,chars" : "lines",
      mask: "lines", // each line a mask its pieces rise out of
      autoSplit: true, // re-split when the width (or font) changes the line breaks
      onSplit(self) {
        item.pieces = chars ? self.chars : self.lines;
        // hidden below their lines until revealed (shown again at once if a
        // resize re-splits text that's already been revealed)
        gsap.set(item.pieces, { yPercent: item.revealed ? 0 : 110 });
      },
    });
    return item;
  });

  const reveal = (item) => {
    item.revealed = true;
    gsap.to(item.pieces, { yPercent: 0, ...(item.chars ? CHARS : LINES) });
  };

  // after the page transition, each as it comes into view
  whenCleared().then(() => {
    if (!alive) return;
    items.forEach((item) => {
      item.trigger = ScrollTrigger.create({
        trigger: item.el,
        start: "top 88%",
        once: true,
        onEnter: () => reveal(item),
      });
    });
  });

  return () => {
    alive = false;
    items.forEach((item) => {
      item.trigger?.kill();
      gsap.killTweensOf(item.pieces);
      item.split.revert();
    });
  };
}
