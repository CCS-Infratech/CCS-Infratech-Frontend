"use client";

import { ReactNode, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export default function PageHero({
  image,
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  image: string;
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <motion.div
      ref={heroRef}
      className="relative flex h-[85vh] w-full items-center justify-center overflow-hidden rounded-b-[80px] sm:h-[90vh] sm:rounded-b-[120px] lg:h-screen lg:rounded-b-[200px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      <motion.div
        className="absolute inset-0 z-0"
        style={{ scale: heroScale, y: heroY }}
      >
        <Image
          src={image}
          alt=""
          fill
          className="object-cover brightness-[0.5]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 mix-blend-multiply" />
      </motion.div>

      <div className="relative z-20 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-4 sm:mb-6"
          >
            <span className="inline-block rounded-full bg-amber-500/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm sm:px-4 sm:py-1.5 sm:text-sm">
              {eyebrow}
            </span>
          </motion.div>
        )}
        <motion.h1
          className="mb-4 text-4xl font-thin tracking-tighter text-white sm:mb-6 sm:text-5xl md:text-6xl lg:mb-8 lg:text-7xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            className="mx-auto mb-8 max-w-2xl px-4 font-sans text-base font-light text-gray-100 sm:mb-12 sm:text-lg lg:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            {subtitle}
          </motion.p>
        )}
        {actions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          >
            {actions}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
