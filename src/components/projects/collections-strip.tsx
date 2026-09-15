"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Layers } from "lucide-react";
import {
  PortfolioProject,
  ProjectGroupSummary,
  getProjectImage,
  PROJECT_FALLBACK_IMAGE,
} from "./types";

function groupCount(group: ProjectGroupSummary) {
  return group._count?.projects ?? group.projects?.length ?? 0;
}

export function CollectionsStripSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-56 animate-pulse rounded-3xl border border-zinc-800 bg-zinc-900"
        />
      ))}
    </div>
  );
}

export default function CollectionsStrip({
  groups,
  /** The group list endpoint returns counts but no images — borrow a cover from here. */
  projects = [],
}: {
  groups: ProjectGroupSummary[];
  projects?: PortfolioProject[];
}) {
  if (!groups.length) return null;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group, index) => {
        const count = groupCount(group);
        // An editor-chosen cover wins; otherwise borrow a project's photo.
        const sample =
          group.projects?.[0] ||
          projects.find((project) => project.group?.slug === group.slug);
        const cover =
          group.coverImageUrl ||
          (sample ? getProjectImage(sample) : PROJECT_FALLBACK_IMAGE);

        return (
          <motion.div
            key={group.id || group.slug}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: Math.min(index, 4) * 0.08 }}
          >
            <Link
              href={`/projects/groups/${group.slug}`}
              className="group relative block h-56 overflow-hidden rounded-3xl border border-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
            >
              <Image
                src={cover}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover brightness-[0.45] transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />

              <div className="relative flex h-full flex-col justify-between p-6">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-zinc-100 backdrop-blur-sm">
                  <Layers className="h-3.5 w-3.5 text-amber-300" />
                  {count} {count === 1 ? "project" : "projects"}
                </span>

                <div>
                  <h3 className="text-2xl font-bold text-white transition-colors group-hover:text-amber-300">
                    {group.name}
                  </h3>
                  {group.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-zinc-300">
                      {group.description}
                    </p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400">
                    Explore collection
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
