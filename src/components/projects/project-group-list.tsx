"use client";

import Link from "next/link";
import Image from "next/image";
import { formatProjectCategory } from "@/constants/projects";
import { PortfolioProject } from "@/components/projects/project-card";

function getProjectImage(project: PortfolioProject) {
  const firstImg = project.images?.[0];
  if (typeof firstImg === "string") return firstImg;
  return firstImg?.url || project.logoUrl || "/images/4.avif";
}

function getProjectYear(project: PortfolioProject) {
  if (project.year) return String(project.year);
  if (project.completionDate) {
    return String(new Date(project.completionDate).getFullYear());
  }
  return null;
}

export default function ProjectGroupList({
  projects,
}: {
  projects: PortfolioProject[];
}) {
  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 px-6 py-20 text-center">
        <p className="text-gray-400">No projects in this collection yet.</p>
        <Link
          href="/projects"
          className="mt-4 inline-block text-sm text-amber-400 hover:text-amber-300"
        >
          Browse all projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-10">
      {projects.map((project, index) => {
        const image = getProjectImage(project);
        const year = getProjectYear(project);
        const summary =
          project.overviewDescription || project.description || "";
        const imageOnRight = index % 2 === 1;

        return (
          <Link
            key={project.id}
            href={`/projects/${project.slug || project.id}`}
            className="group grid overflow-hidden rounded-2xl bg-zinc-950 shadow-2xl shadow-black/40 ring-1 ring-white/10 transition duration-300 hover:ring-amber-500/50 lg:grid-cols-12"
          >
            <div
              className={`relative h-64 lg:col-span-7 lg:h-[420px] ${
                imageOnRight ? "lg:order-2" : ""
              }`}
            >
              <Image
                src={image}
                alt={project.title}
                fill
                className="object-cover brightness-90 transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {project.status && (
                <span
                  className={`absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-bold uppercase ${
                    project.status === "COMPLETED"
                      ? "bg-emerald-500 text-white"
                      : "bg-amber-600 text-white"
                  }`}
                >
                  {project.status === "COMPLETED"
                    ? "Completed"
                    : "Under Construction"}
                </span>
              )}
            </div>

            <div
              className={`flex flex-col justify-center px-6 py-8 sm:px-10 lg:col-span-5 ${
                imageOnRight ? "lg:order-1" : ""
              }`}
            >
              <span className="text-sm uppercase tracking-[0.2em] text-amber-400">
                {formatProjectCategory(project.category)}
              </span>
              <h2 className="mt-3 text-3xl font-thin tracking-tight text-white transition-colors group-hover:text-amber-400 md:text-4xl">
                {project.title}
              </h2>
              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-sm text-gray-400">
                <span>{project.location || "Location on request"}</span>
                {year && (
                  <>
                    <span className="text-amber-500/70">•</span>
                    <span>{year}</span>
                  </>
                )}
              </div>
              {summary && (
                <p className="mt-5 line-clamp-3 font-sans text-base font-light leading-relaxed text-gray-400">
                  {summary}
                </p>
              )}
              <span className="mt-8 inline-flex items-center text-sm font-medium text-amber-400">
                View project
                <svg
                  className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
