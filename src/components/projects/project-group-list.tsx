"use client";

import Link from "next/link";
import { Building2 } from "lucide-react";
import ProjectCard from "./project-card";
import { PortfolioProject } from "./types";

export default function ProjectGroupList({
  projects,
}: {
  projects: PortfolioProject[];
}) {
  if (projects.length === 0) {
    return (
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 px-6 py-20 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800/80">
          <Building2 className="h-7 w-7 text-amber-400/80" />
        </div>
        <h3 className="text-xl font-bold text-zinc-100">
          Nothing published here yet
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm text-zinc-400">
          This collection is still being put together. Have a look at the rest
          of the portfolio in the meantime.
        </p>
        <Link
          href="/projects"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#fbe575] px-6 py-3 text-sm font-semibold text-black transition-transform duration-200 hover:scale-[1.03]"
        >
          Browse all projects
        </Link>
      </div>
    );
  }

  const lead = projects.find((project) => project.featured);
  const rest = lead
    ? projects.filter((project) => project.id !== lead.id)
    : projects;

  return (
    <div>
      {lead && (
        <div className="mb-10 lg:mb-14">
          <ProjectCard project={lead} featured />
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
        {rest.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </div>
  );
}
