"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

export default function ProjectGallery({
  images,
  projectTitle,
}: {
  images: string[];
  projectTitle: string;
}) {
  const [openAt, setOpenAt] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const isOpen = openAt !== null;

  const close = useCallback(() => setOpenAt(null), []);
  const step = useCallback(
    (delta: number) =>
      setOpenAt((current) =>
        current === null
          ? current
          : (current + delta + images.length) % images.length,
      ),
    [images.length],
  );

  // Keyboard controls + scroll lock while the lightbox is open.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, close, step]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {images.map((image, index) => (
          <motion.button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setOpenAt(index)}
            aria-label={`Open image ${index + 1} of ${images.length}`}
            className={`group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
              index === 0 ? "col-span-2 row-span-2 md:col-span-2" : ""
            }`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: Math.min(index, 6) * 0.05 }}
          >
            <div
              className={`relative w-full ${
                index === 0 ? "aspect-square md:aspect-[4/3]" : "aspect-[4/3]"
              }`}
            >
              <Image
                src={image}
                alt={`${projectTitle} — image ${index + 1}`}
                fill
                sizes={
                  index === 0
                    ? "(max-width: 768px) 100vw, 50vw"
                    : "(max-width: 768px) 50vw, 25vw"
                }
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fbe575] text-black">
                  <Maximize2 className="h-5 w-5" />
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${projectTitle} gallery`}
            className="fixed inset-0 z-[100] flex flex-col bg-black/97 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
          >
            <div className="flex items-center justify-between px-4 py-4 sm:px-6">
              <span className="text-sm tabular-nums text-zinc-400">
                {(openAt ?? 0) + 1} / {images.length}
              </span>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Close gallery"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-700 text-zinc-300 transition-colors hover:border-amber-400/60 hover:text-amber-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              className="relative flex flex-1 items-center justify-center px-4 pb-4 sm:px-16"
              onClick={(e) => e.stopPropagation()}
            >
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous image"
                  className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:left-4"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={openAt}
                  className="relative h-full w-full"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image
                    src={images[openAt ?? 0]}
                    alt={`${projectTitle} — image ${(openAt ?? 0) + 1}`}
                    fill
                    sizes="100vw"
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next image"
                  className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:right-4"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
            </div>

            {images.length > 1 && (
              <div
                className="flex justify-center gap-2 overflow-x-auto px-4 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {images.map((image, index) => (
                  <button
                    key={`thumb-${index}`}
                    type="button"
                    onClick={() => setOpenAt(index)}
                    aria-label={`Show image ${index + 1}`}
                    className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                      index === openAt
                        ? "border-amber-400 opacity-100"
                        : "border-transparent opacity-50 hover:opacity-90"
                    }`}
                  >
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
