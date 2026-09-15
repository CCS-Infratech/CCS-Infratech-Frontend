"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  action?: ReactNode;
  className?: string;
}) {
  const centered = align === "center";

  return (
    <div
      className={`mb-10 flex flex-col gap-6 md:mb-14 ${
        centered
          ? "items-center text-center"
          : "md:flex-row md:items-end md:justify-between"
      } ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className={centered ? "max-w-2xl" : "max-w-2xl"}
      >
        {eyebrow && (
          <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.28em] text-amber-400">
            {eyebrow}
          </span>
        )}
        <h2 className="text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        {description && (
          <p className="mt-4 text-base leading-relaxed text-zinc-400">
            {description}
          </p>
        )}
      </motion.div>

      {action && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="shrink-0"
        >
          {action}
        </motion.div>
      )}
    </div>
  );
}
