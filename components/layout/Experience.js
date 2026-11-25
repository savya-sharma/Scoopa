"use client";

// Runs everything that animates: Lenis smooth scrolling, the hero's loader and
// intro (animations/hero.js), the menu (animations/menu.js) and the flavour slider
// (animations/flavours.js). Renders nothing itself; it
// drives the markup rendered by Header, Menu and Hero.
import { useEffect } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { setupHero } from "@/animations/hero";
import { setupMenu } from "@/animations/menu";
import { setupFlavourSlider } from "@/animations/flavours";
import { setupJoy } from "@/animations/joy";
import { setupStickers } from "@/animations/stickers";
import { setupDecor } from "@/animations/decor";
import { setupSpecials } from "@/animations/specials";
import { setupMagnets } from "@/animations/magnet";
import { setupPageIntro } from "@/animations/pageIntro";
import { setupStory } from "@/animations/story";
import { setupIngredients } from "@/animations/ingredients";
import { setupSplitText } from "@/animations/splitText";

export default function Experience() {
  useEffect(() => {
    gsap.registerPlugin(CustomEase, ScrollTrigger);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;

    // Always start a reload at the top, so the intro isn't played half-scrolled
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    root.classList.add("is-loading");

    // Lenis: smooth scrolling. GSAP's ticker drives it, so Lenis and
    // ScrollTrigger update on the same frame; lagSmoothing off keeps them in
    // step after a hiccup. Stopped until the intro unlocks scrolling.
    // lerp: how much of the remaining distance each frame covers; lower
    // glides longer and softer (0.075: a slow, silky ease-out). With reduced
    // motion, lerp 1 = plain, unsmoothed scrolling. Touch keeps the device's
    // own momentum. Elements marked data-lenis-prevent scroll themselves.
    const lenis = new Lenis({ lerp: reduceMotion ? 1 : 0.075, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    lenis.stop();

    // Everything GSAP creates during setup is recorded here and reverted on
    // unmount (React's dev mode mounts twice, and hot reloads remount)
    const ctx = gsap.context(() => {});
    const cleanups = [];
    let cancelled = false;

    // Wait for the fonts, so the marquee is measured with the real one
    document.fonts.ready.then(() => {
      if (cancelled) return;
      ctx.add(() => {
        // the homepage's hero intro, or the inner pages' entrance
        const home = document.querySelector(".hero");
        cleanups.push(home ? setupHero(lenis) : setupPageIntro({ lenis, reduceMotion }));
        cleanups.push(setupMenu({ lenis, reduceMotion }));
        cleanups.push(setupFlavourSlider({ reduceMotion }));
        cleanups.push(setupJoy({ reduceMotion }));
        cleanups.push(setupStickers({ reduceMotion }));
        cleanups.push(setupDecor({ reduceMotion }));
        cleanups.push(setupSpecials({ reduceMotion }));
        cleanups.push(setupStory({ reduceMotion }));
        cleanups.push(setupIngredients({ reduceMotion }));
        cleanups.push(setupSplitText({ reduceMotion }));
        cleanups.push(setupMagnets({ reduceMotion }));
        // ⚠️ the contact form has no backend yet: keep it from reloading the page
        const form = document.querySelector("[data-contact-form]");
        const stop = (e) => e.preventDefault();
        form?.addEventListener("submit", stop);
        cleanups.push(() => form?.removeEventListener("submit", stop));
      });
    });

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
      ctx.revert();
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
