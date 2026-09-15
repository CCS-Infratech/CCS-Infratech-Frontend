"use client";

import Link from "next/link";
import Image from "next/image";
import { formatProjectCategory } from "@/constants/projects";

export interface PortfolioProject {
  id: string;
  title: string;
  slug?: string;
  category?: string;
  location?: string | null;
  year?: string | number | null;
  completionDate?: string | null;
  description?: string | null;
  overviewDescription?: string | null;
  featured?: boolean;
  status?: string;
  logoUrl?: string | null;
  images?: Array<string | { url?: string }>;
}

function getProjectImage(project: PortfolioProject) {
  const firstImg = project.images?.[0];
  if (typeof firstImg === "string") return firstImg;
  return firstImg?.url || project.logoUrl || "/images/placeholder.jpg";
}

function getProjectYear(project: PortfolioProject) {
  if (project.year) return project.year;
  if (project.completionDate) {
    return new Date(project.completionDate).getFullYear();
  }
  return "N/A";
}

export default function ProjectCard({ project }: { project: PortfolioProject }) {
  const projectImage = getProjectImage(project);
  const summary = project.overviewDescription || project.description || "";

  return (
    <Link
      href={`/projects/${project.slug || project.id}`}
      className="group relative block h-[400px] w-[min(380px,85vw)] shrink-0 snap-start rounded-2xl shadow-2xl shadow-black/50 ring-1 ring-white/10 transition duration-300 hover:ring-amber-500/50"
    >
      <article className="absolute inset-0 overflow-hidden rounded-2xl">
        <Image
          src={projectImage}
          alt={project.title}
          fill
          className="object-cover brightness-90 transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {project.featured && (
          <div className="absolute top-4 left-4 z-20">
            <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold uppercase text-white shadow-lg shadow-amber-500/30">
              Featured
            </span>
          </div>
        )}
        {project.status && (
          <div className="absolute top-4 right-4 z-20">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold uppercase shadow-lg ${
                project.status === "COMPLETED"
                  ? "bg-emerald-500 text-white shadow-emerald-500/30"
                  : "bg-amber-600 text-white shadow-amber-600/30"
              }`}
            >
              {project.status === "COMPLETED"
                ? "Completed"
                : "Under Construction"}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-95" />
        <div className="absolute inset-0 flex flex-col justify-end p-8">
          <span className="mb-2 text-sm uppercase tracking-wider text-amber-400">
            {formatProjectCategory(project.category)}
          </span>
          <h3 className="mb-2 text-2xl font-bold text-white transition-colors group-hover:text-amber-400">
            {project.title}
          </h3>
          <div className="flex items-center font-sans text-sm text-gray-400">
            <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            {project.location || "N/A"} • {getProjectYear(project)}
          </div>

          {summary && (
            <p className="mt-3 line-clamp-2 max-h-0 overflow-hidden font-sans text-sm text-gray-400 transition-all duration-300 group-hover:max-h-12">
              {summary}
            </p>
          )}

          <div className="mt-5 flex items-center text-sm font-medium text-amber-400">
            View Project Details
            <svg
              className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5"
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
          </div>
        </div>
      </article>
    </Link>
  );
}
