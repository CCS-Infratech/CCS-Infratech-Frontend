"use client";

import { ReactNode, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ChevronDown } from "lucide-react";

type HeroSize = "full" | "compact";

const SIZES: Record<HeroSize, string> = {
  full: "h-[88vh] min-h-[560px] lg:h-screen",
  compact: "h-[66vh] min-h-[460px] lg:h-[74vh]",
};

export default function PageHero({
  image,
  eyebrow,
  title,
  subtitle,
  meta,
  actions,
  backHref,
  backLabel = "All projects",
  size = "full",
  scrollCueHref,
  priority = true,
}: {
  image: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Small chips under the title — location, year, status… */
  meta?: ReactNode;
  actions?: ReactNode;
  backHref?: string;
  backLabel?: string;
  size?: HeroSize;
  /** Anchor the bounce-arrow scrolls to, e.g. "#overview". */
  scrollCueHref?: string;
  priority?: boolean;
}) {
  const heroRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <motion.section
      ref={heroRef}
      className={`relative flex w-full items-center justify-center overflow-hidden rounded-b-[60px] sm:rounded-b-[100px] lg:rounded-b-[160px] ${SIZES[size]}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9 }}
    >
      <motion.div
        className="absolute inset-0 z-0"
        style={reduceMotion ? undefined : { scale: heroScale, y: heroY }}
      >
        <Image
          src={image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover brightness-[0.42]"
          priority={priority}
        />
        {/* Layered scrim keeps text legible on any photograph. */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/45 to-black/90" />
        <div className="absolute inset-0 bg-black/20" />
      </motion.div>

      <div className="relative z-20 mx-auto w-full max-w-5xl px-4 pb-10 pt-24 text-center sm:px-6 lg:px-8">
        {backHref && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-zinc-200 backdrop-blur-sm transition-colors hover:border-amber-400/50 hover:text-amber-300"
            >
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </Link>
          </motion.div>
        )}

        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mb-5"
          >
            {typeof eyebrow === "string" ? (
              <span className="inline-block rounded-full bg-amber-500/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-amber-500/20 backdrop-blur-sm">
                {eyebrow}
              </span>
            ) : (
              eyebrow
            )}
          </motion.div>
        )}

        <motion.h1
          className="text-balance text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-zinc-200 sm:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {subtitle}
          </motion.p>
        )}

        {meta && (
          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            {meta}
          </motion.div>
        )}

        {actions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          >
            {actions}
          </motion.div>
        )}
      </div>

      {scrollCueHref && (
        <motion.a
          href={scrollCueHref}
          aria-label="Scroll to content"
          className="absolute bottom-24 left-1/2 z-20 hidden -translate-x-1/2 rounded-full border border-white/20 p-2.5 text-white/70 transition-colors hover:border-amber-400/60 hover:text-amber-300 lg:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: reduceMotion ? 0 : [0, 8, 0] }}
          transition={{
            opacity: { duration: 0.6, delay: 1 },
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.a>
      )}
    </motion.section>
  );
}

/** Pill used in the hero `meta` slot. */
export function HeroMetaChip({
  icon,
  children,
  tone = "default",
}: {
  icon?: ReactNode;
  children: ReactNode;
  tone?: "default" | "success" | "progress";
}) {
  const tones = {
    default: "border-white/15 bg-white/5 text-zinc-200",
    success: "border-emerald-400/40 bg-emerald-500/15 text-emerald-200",
    progress: "border-amber-400/40 bg-amber-500/15 text-amber-200",
  } as const;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-sm ${tones[tone]}`}
    >
      {icon}
      {children}
    </span>
  );
}
