"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Maximize2 } from "lucide-react";

export interface ProjectPlan {
  title: string;
  description: string;
  image: string;
  subtitle: string;
  brochureUrl?: string;
}

export default function ProjectPlans({
  plans,
  backgroundImage,
  onDownload,
}: {
  plans: ProjectPlan[];
  backgroundImage?: string;
  onDownload: (url?: string) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (plans.length === 0) return null;
  const plan = plans[Math.min(activeIndex, plans.length - 1)];

  return (
    <section className="relative overflow-hidden rounded-3xl border border-zinc-800">
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/80" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/60" />

      <div className="relative px-5 py-14 sm:px-10 lg:px-14 lg:py-20">
        <div className="text-center">
          <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.28em] text-amber-400">
            Layouts
          </span>
          <h2 className="text-3xl font-bold text-zinc-50 sm:text-4xl lg:text-5xl">
            Plans &amp; pricing
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-zinc-300">
            Explore how the site, clusters and individual units are laid out.
          </p>
        </div>

        {plans.length > 1 && (
          <div
            role="tablist"
            aria-label="Project plans"
            className="mx-auto mt-10 flex max-w-full flex-wrap justify-center gap-2"
          >
            {plans.map((item, index) => (
              <button
                key={`${item.title}-${index}`}
                role="tab"
                type="button"
                aria-selected={index === activeIndex}
                onClick={() => setActiveIndex(index)}
                className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  index === activeIndex
                    ? "border-transparent bg-[#fbe575] text-black"
                    : "border-white/20 text-zinc-300 hover:border-white/40 hover:text-white"
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            className="mt-12 grid items-center gap-8 lg:grid-cols-2 lg:gap-12"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            <a
              href={plan.image}
              target="_blank"
              rel="noopener noreferrer"
              className="group mx-auto block w-full max-w-lg rounded-2xl bg-white p-4 shadow-2xl transition-transform duration-300 hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:p-5"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-zinc-100">
                <Image
                  src={plan.image}
                  alt={plan.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-contain"
                />
                <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <Maximize2 className="h-3.5 w-3.5" />
                  Full size
                </span>
              </div>
              <p className="mt-4 text-left text-lg font-bold text-zinc-900">
                {plan.title}
              </p>
            </a>

            <div className="space-y-4">
              <div className="rounded-2xl border border-amber-500/40 bg-white/5 p-5 backdrop-blur-sm sm:p-6">
                <p className="text-lg font-semibold text-zinc-50 sm:text-xl">
                  {plan.subtitle}
                </p>
                <p className="mt-2 text-sm text-amber-200/90 sm:text-base">
                  {plan.description}
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-2xl border border-amber-500/40 bg-white/5 p-5 backdrop-blur-sm sm:p-6">
                <p className="text-base text-zinc-300 sm:text-lg">
                  Starting price
                </p>
                <p className="whitespace-nowrap text-lg font-semibold text-zinc-50 sm:text-xl">
                  On request
                </p>
              </div>

              {plan.brochureUrl && (
                <button
                  type="button"
                  onClick={() => onDownload(plan.brochureUrl)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#fbe575] px-6 py-4 text-sm font-bold text-black transition-transform duration-300 hover:scale-[1.02] sm:w-auto"
                >
                  <Download className="h-4 w-4" />
                  Download {plan.title.toLowerCase()} brochure
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
