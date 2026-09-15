"use client";

import { useEffect } from "react";

/**
 * These pages fetch their content on the client, so at the moment the browser
 * restores the previous scroll position the document is still just skeletons
 * and only a fraction of its final height. The restore gets clamped to that
 * short document's maximum — which, once the real content renders, leaves the
 * reader parked at the footer.
 *
 * On a reload we take over: disable the browser's own restoration, start at the
 * top, and hand restoration back when the page unmounts. Back/forward
 * navigation is untouched, and an incoming #hash is left alone so anchor links
 * still work.
 */
export default function ResetScrollOnReload() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const [entry] = window.performance.getEntriesByType(
      "navigation",
    ) as PerformanceNavigationTiming[];

    if (entry?.type !== "reload") return;
    if (window.location.hash) return;

    const previous = window.history.scrollRestoration;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    return () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = previous || "auto";
      }
    };
  }, []);

  return null;
}
