// Specials, inside the arch.
//
// The closing statement: as the arch comes into view its lines rise out of
// their masks and the copy follows; the treats around it pop in one after
// another, each from its own tilt, then float and sway gently (each at its
// own pace) and drift a little with the pointer, the nearer ones more.
// Markup: components/sections/Specials.js
import gsap from "gsap";

export function setupSpecials({ reduceMotion }) {
  const section = document.querySelector(".specials");
  if (!section) return () => {};

  const lines = section.querySelectorAll(".specials-line > span");
  const copyText = section.querySelector(".specials-text");
  const treats = [...section.querySelectorAll(".specials-treat")];
  const floats = treats.map((t) => t.querySelector(".specials-treat-float"));
  const made = [];
  treats.forEach((t) => gsap.set(t, { rotation: Number(t.dataset.rot) }));
  if (reduceMotion) return () => {};

  gsap.set(lines, { yPercent: 110 });
  gsap.set(copyText, { y: 24, autoAlpha: 0 });
  gsap.set(floats, { scale: 0, rotation: (i) => (i % 2 ? 30 : -30), autoAlpha: 0 });
  const enter = gsap.timeline({
    scrollTrigger: { trigger: section.querySelector(".specials-statement"), start: "top 80%", once: true },
    onComplete: idle,
  })
    .to(lines, { yPercent: 0, duration: 1, ease: "power4.out", stagger: 0.14 })
    .to(copyText, { y: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" }, 0.45)
    .to(floats, { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.9, ease: "back.out(1.8)", stagger: 0.08 }, 0.25);
  made.push(enter);

  // afterwards: each floats and sways at its own pace
  function idle() {
    floats.forEach((el, i) => {
      made.push(
        gsap.to(el, { y: -(6 + (i % 3) * 4), duration: 2.2 + (i % 4) * 0.45, ease: "sine.inOut", yoyo: true, repeat: -1 }),
        gsap.to(el, { rotation: i % 2 ? 5 : -5, duration: 3 + (i % 3) * 0.6, ease: "sine.inOut", yoyo: true, repeat: -1 }),
      );
    });
  }

  // they drift with the pointer, nearer (deeper) ones more
  const follow = treats.map((t) => ({
    depth: Number(t.dataset.depth) || 0.5,
    x: gsap.quickTo(t, "x", { duration: 0.9, ease: "power3.out" }),
    y: gsap.quickTo(t, "y", { duration: 0.9, ease: "power3.out" }),
  }));
  const onMove = (e) => {
    const r = section.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    const dy = (e.clientY - r.top) / r.height - 0.5;
    follow.forEach((f) => {
      f.x(dx * 36 * f.depth);
      f.y(dy * 24 * f.depth);
    });
  };
  if (window.matchMedia("(hover: hover)").matches) section.addEventListener("pointermove", onMove);

  return () => {
    section.removeEventListener("pointermove", onMove);
    made.forEach((t) => {
      t.scrollTrigger?.kill();
      t.kill();
    });
  };
}
