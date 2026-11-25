"use client";

// The square wipe (animations/pageTransition.js): the intro loader and every
// page-to-page transition. Lives in the root layout, so it stays mounted
// (and keeps its state) while pages change underneath it.
// Styles: app/styles/ui/transition.css
import { useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { INTRO_STYLE, setupPageTransition } from "@/animations/pageTransition";

export default function PageTransition() {
  const root = useRef(null);
  const controller = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  useLayoutEffect(() => {
    controller.current = setupPageTransition({ root: root.current, router });
    return () => {
      controller.current.destroy();
      controller.current = null;
    };
    // the router is stable; set up once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Back/forward navigation (the wipe's own navigations are ignored here).
  // A layout effect, so it covers before the new page is painted.
  useLayoutEffect(() => {
    controller.current?.routeChanged();
  }, [pathname]);

  return (
    // data-intro: the layers start on screen for the first paint (CSS)
    <div ref={root} className="wipe" data-intro={INTRO_STYLE === "squares" ? "" : undefined} aria-hidden="true">

      {/* each layer's caps: the rounded top edge it leads with as it sweeps
          up to cover, and the rounded bottom end it grows as it lifts off */}
      <div className="wipe-layer wipe-layer--orange"><span className="wipe-cap-top" /><span className="wipe-cap" /></div>
      <div className="wipe-layer wipe-layer--teal"><span className="wipe-cap-top" /><span className="wipe-cap" /></div>
      <div className="wipe-layer wipe-layer--yellow">
        <span className="wipe-cap-top" />
        <span className="wipe-cap" />
        {/* Rides with the front layer: the loading count and bar, filled
            by animations/pageTransition.js */}
        <div className="wipe-stage">
          <p className="wipe-count">
            <span className="wipe-count-value">0</span>
            <span className="wipe-count-unit">%</span>
          </p>
          <div className="wipe-bar">
            <div className="wipe-bar-fill" />
          </div>
        </div>
      </div>
    </div>
  );
}
