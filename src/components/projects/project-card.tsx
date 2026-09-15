"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin, Star } from "lucide-react";
import { formatProjectCategory } from "@/constants/projects";
import {
  PortfolioProject,
  getProjectHref,
  getProjectImage,
  getProjectSummary,
  getProjectYear,
  getStatusLabel,
  isCompleted,
} from "@/components/projects/types";

export type { PortfolioProject } from "@/components/projects/types";

export function StatusPill({
  status,
  className = "",
}: {
  status?: string;
  className?: string;
}) {
  if (!status) return null;
  const completed = status === "COMPLETED";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-md ${
        completed
          ? "border-emerald-400/40 bg-emerald-500/20 text-emerald-100"
          : "border-amber-400/40 bg-amber-500/20 text-amber-100"
      } ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          completed ? "bg-emerald-400" : "bg-amber-400"
        }`}
      />
      {getStatusLabel(status)}
    </span>
  );
}

export default function ProjectCard({
  project,
  index = 0,
  featured = false,
}: {
  project: PortfolioProject;
  index?: number;
  /** Wide, two-column treatment used for the lead project. */
  featured?: boolean;
}) {
  const image = getProjectImage(project);
  const year = getProjectYear(project);
  const summary = getProjectSummary(project);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: Math.min(index, 5) * 0.07 }}
      className={featured ? "sm:col-span-2" : ""}
    >
      <Link
        href={getProjectHref(project)}
        className="group block rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
      >
        <article
          className={`flex h-full flex-col ${
            featured ? "gap-6 lg:flex-row lg:items-center lg:gap-10" : ""
          }`}
        >
          <div
            className={`relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 ${
              featured
                ? "aspect-[16/10] w-full lg:aspect-[4/3] lg:w-[58%]"
                : "aspect-[4/3] w-full"
            }`}
          >
            <Image
              src={image}
              alt={project.title}
              fill
              sizes={
                featured
                  ? "(max-width: 1024px) 100vw, 58vw"
                  : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              }
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90" />

            <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
              {project.featured ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fbe575] px-3 py-1 text-xs font-bold uppercase tracking-wide text-black shadow-lg">
                  <Star className="h-3 w-3 fill-black" />
                  Featured
                </span>
              ) : (
                <span />
              )}
              <StatusPill status={project.status} />
            </div>

            <span className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-[#fbe575] text-black opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </div>

          <div className={featured ? "lg:w-[42%]" : "mt-6"}>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="rounded-full bg-zinc-800/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-amber-300">
                {formatProjectCategory(project.category)}
              </span>
              {year && (
                <span className="text-sm text-zinc-500">{year}</span>
              )}
            </div>

            <h3
              className={`mt-4 font-bold leading-tight text-zinc-50 transition-colors duration-300 group-hover:text-amber-300 ${
                featured ? "text-3xl lg:text-4xl" : "text-2xl"
              }`}
            >
              {project.title}
            </h3>

            {project.location && (
              <p className="mt-3 flex items-center gap-1.5 text-sm text-zinc-400">
                <MapPin className="h-4 w-4 shrink-0 text-amber-500/80" />
                {project.location}
              </p>
            )}

            {summary && (
              <p
                className={`mt-3 text-sm leading-relaxed text-zinc-400 ${
                  featured ? "line-clamp-4 sm:text-base" : "line-clamp-2"
                }`}
              >
                {summary}
              </p>
            )}

            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-amber-400">
              View project
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
