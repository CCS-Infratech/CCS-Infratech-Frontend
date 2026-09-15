"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface SectionLink {
  id: string;
  label: string;
}

/**
 * In-page navigation for long project pages. It is fixed rather than sticky so
 * it is unaffected by the `overflow-x: hidden` further up the document, and it
 * only appears once the hero has been scrolled past.
 */
export default function ProjectSectionNav({
  sections,
}: {
  sections: SectionLink[];
}) {
  const [active, setActive] = useState(sections[0]?.id);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.75);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (sections.length === 0) return;

    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const inView = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (inView[0]) setActive(inView[0].target.id);
      },
      // Bias the "current" section towards the upper third of the viewport.
      { rootMargin: "-25% 0px -60% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  if (sections.length < 2) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          aria-label="Project sections"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-x-0 top-[72px] z-40 border-y border-zinc-800/80 bg-black/90 backdrop-blur-md lg:top-[108px]"
        >
          <ul className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2.5 lg:px-20 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {sections.map((section) => {
              const isActive = active === section.id;
              return (
                <li key={section.id} className="shrink-0">
                  <a
                    href={`#${section.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`inline-block rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-zinc-800 text-amber-300"
                        : "text-zinc-400 hover:text-zinc-100"
                    }`}
                  >
                    {section.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
