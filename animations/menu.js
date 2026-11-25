// The menu: a yellow "MENU" pill. Press it and a yellow rounded-corner panel
// grows out of the top-right corner, under the button, then the links rise
// in one after another; the button turns navy and reads "CLOSE". Press it
// again, press Escape, click outside the panel or pick a link and the links
// drop away and the panel shrinks back into the corner.
// Markup: components/layout/Menu.js. Returns a cleanup that removes every
// listener.
import gsap from "gsap";

export function setupMenu({ lenis, reduceMotion }) {
  const menu = document.querySelector(".menu");
  const toggle = menu?.querySelector(".menu-toggle");
  const card = document.querySelector(".menu-card");
  if (!toggle || !card) return () => {};
  const backdrop = document.querySelector(".menu-backdrop");
  const labels = [...card.querySelectorAll(".menu-label > span")];
  const links = [...card.querySelectorAll(".menu-link")];
  const listeners = new AbortController();
  const { signal } = listeners;
  let open = false;
  let tl = null;

  gsap.set(labels, { yPercent: 110 });

  const openMenu = () => {
    if (open || document.documentElement.classList.contains("is-loading")) return;
    open = true;
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", toggle.querySelectorAll(".menu-toggle-word")[1].textContent);
    menu.classList.add("is-open");
    card.inert = false;

    tl?.kill();
    // the screen behind darkens
    gsap.to(backdrop, { autoAlpha: 1, duration: reduceMotion ? 0 : 0.4, ease: "power2.out", overwrite: true });
    tl = gsap.timeline();
    tl.set(card, { visibility: "visible" });
    if (reduceMotion) {
      tl.set(card, { scale: 1 }).set(labels, { yPercent: 0 });
      return;
    }
    // grows out of the corner with a little overshoot, the links following
    tl.fromTo(card, { scale: 0 }, { scale: 1, duration: 0.55, ease: "back.out(1.3)" })
      .to(labels, { yPercent: 0, duration: 0.55, ease: "power4.out", stagger: 0.06 }, 0.18);
  };

  // `then` runs once the panel has shrunk away (used to scroll to a section)
  const closeMenu = (then) => {
    if (!open) return;
    open = false;
    toggle.setAttribute("aria-expanded", "false");
    toggle.removeAttribute("aria-label");
    menu.classList.remove("is-open");
    // keep focus on the button when it was inside the menu
    if (card.contains(document.activeElement)) toggle.focus({ preventScroll: true });
    card.inert = true;

    tl?.kill();
    // the screen behind brightens again as the panel shrinks
    gsap.to(backdrop, { autoAlpha: 0, duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : 0.15, ease: "power2.inOut", overwrite: true });
    const done = () => (gsap.set(card, { visibility: "hidden" }), then?.());
    if (reduceMotion) {
      gsap.set(card, { scale: 0 });
      gsap.set(labels, { yPercent: 110 });
      return done();
    }
    tl = gsap
      .timeline({ onComplete: done })
      .to([...labels].reverse(), { yPercent: 110, duration: 0.25, ease: "power3.in", stagger: 0.03 }, 0)
      .to(card, { scale: 0, duration: 0.4, ease: "power3.in" }, 0.12);
  };

  toggle.addEventListener("click", () => (open ? closeMenu() : openMenu()), { signal });

  // ----- Links -----
  // To another page: close (the square wipe, animations/pageTransition.js,
  // has already taken over the navigation). To this page: close and glide
  // back to the top, rather than reloading it. To a #section: close, then
  // glide to it.
  links.forEach((a) => {
    a.addEventListener("click", (e) => {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
      const href = a.getAttribute("href");
      if (!href.startsWith("#")) {
        if (new URL(a.href).pathname !== window.location.pathname) return closeMenu();
        e.preventDefault();
        closeMenu(() => lenis.scrollTo(0, { duration: reduceMotion ? 0 : 1.4, immediate: reduceMotion }));
        return;
      }
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      closeMenu(() => lenis.scrollTo(target, { duration: reduceMotion ? 0 : 1.4, immediate: reduceMotion }));
      history.replaceState(null, "", href);
      // keyboard and screen-reader users continue from the section
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }, { signal });
  });

  // Escape, or a click anywhere outside the panel and the button, closes it
  document.addEventListener("keydown", (e) => {
    if (open && e.key === "Escape") {
      closeMenu();
      toggle.focus({ preventScroll: true });
    }
  }, { signal });
  document.addEventListener("pointerdown", (e) => {
    if (open && !card.contains(e.target) && !toggle.contains(e.target)) closeMenu();
  }, { signal });

  return () => {
    listeners.abort();
    tl?.kill();
    gsap.killTweensOf([card, backdrop, ...labels]);
    menu.classList.remove("is-open");
    card.inert = true;
    gsap.set(card, { scale: 0, visibility: "hidden" });
    gsap.set(backdrop, { autoAlpha: 0 });
  };
}
