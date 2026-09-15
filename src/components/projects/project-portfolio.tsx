"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { PROJECT_CATEGORIES } from "@/constants/projects";
import ProjectCard from "./project-card";
import { PortfolioProject, getProjectSummary } from "./types";

const PAGE_SIZE = 9;

const STATUS_FILTERS = [
  { id: "all", label: "Any status" },
  { id: "COMPLETED", label: "Completed" },
  { id: "UNDER_CONSTRUCTION", label: "Under construction" },
] as const;

type StatusFilter = (typeof STATUS_FILTERS)[number]["id"];

export default function ProjectPortfolio({
  projects,
  /** Give the first featured project a wide lead card (listing page only). */
  showLeadCard = false,
}: {
  projects: PortfolioProject[];
  showLeadCard?: boolean;
}) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  // Only offer categories that actually have projects behind them.
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((p) => {
      if (!p.category) return;
      counts.set(p.category, (counts.get(p.category) || 0) + 1);
    });
    return [
      { id: "all", label: "All projects", count: projects.length },
      ...PROJECT_CATEGORIES.filter((c) => counts.has(c.id)).map((c) => ({
        id: c.id as string,
        label: c.label as string,
        count: counts.get(c.id) || 0,
      })),
    ];
  }, [projects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((project) => {
      if (activeCategory !== "all" && project.category !== activeCategory)
        return false;
      if (status !== "all" && project.status !== status) return false;
      if (!q) return true;
      return [project.title, project.location, getProjectSummary(project)]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(q));
    });
  }, [projects, activeCategory, status, query]);

  const isFiltered =
    activeCategory !== "all" || status !== "all" || query.trim().length > 0;

  // A new filter should always show results from the top.
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [activeCategory, status, query]);

  const leadProject =
    showLeadCard && !isFiltered
      ? filtered.find((p) => p.featured) || null
      : null;
  const rest = leadProject
    ? filtered.filter((p) => p.id !== leadProject.id)
    : filtered;
  const shown = rest.slice(0, visible);

  const resetFilters = () => {
    setActiveCategory("all");
    setStatus("all");
    setQuery("");
  };

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-10 space-y-5 border-b border-zinc-800/80 pb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const active = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                    active
                      ? "border-transparent bg-[#fbe575] text-black shadow-lg shadow-amber-500/10"
                      : "border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700 hover:text-white"
                  }`}
                >
                  {category.label}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-xs tabular-nums ${
                      active ? "bg-black/10 text-black/70" : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {category.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full shrink-0 lg:w-72">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects or locations"
              aria-label="Search projects"
              className="w-full rounded-full border border-zinc-800 bg-zinc-900/60 py-3 pl-11 pr-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-400/60 focus:outline-none focus:ring-1 focus:ring-amber-400/40"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="sr-only">Filter by status</span>
            <div className="flex flex-wrap gap-1.5">
              {STATUS_FILTERS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setStatus(option.id)}
                  aria-pressed={status === option.id}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    status === option.id
                      ? "bg-zinc-800 text-amber-300"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <p className="ml-auto text-sm text-zinc-500">
            <span className="font-semibold text-zinc-200 tabular-nums">
              {filtered.length}
            </span>{" "}
            {filtered.length === 1 ? "project" : "projects"}
            {isFiltered && (
              <button
                type="button"
                onClick={resetFilters}
                className="ml-3 inline-flex items-center gap-1 text-amber-400 transition-colors hover:text-amber-300"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </button>
            )}
          </p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 px-6 py-20 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800/80">
            <Search className="h-7 w-7 text-zinc-500" />
          </div>
          <h3 className="text-xl font-bold text-zinc-100">
            No projects match those filters
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm text-zinc-400">
            Try a different category or clear your search to see the full
            portfolio.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#fbe575] px-6 py-3 text-sm font-semibold text-black transition-transform duration-200 hover:scale-[1.03]"
          >
            Show all projects
          </button>
        </div>
      ) : (
        <>
          {leadProject && (
            <div className="mb-10 lg:mb-14">
              <ProjectCard project={leadProject} featured />
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {shown.map((project, index) => (
              <ProjectCard
                key={`${activeCategory}-${status}-${project.id}`}
                project={project}
                index={index % PAGE_SIZE}
              />
            ))}
          </div>

          {rest.length > visible && (
            <div className="mt-14 flex justify-center">
              <button
                type="button"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-8 py-3.5 text-sm font-semibold text-zinc-200 transition-colors hover:border-amber-400/60 hover:text-amber-300"
              >
                Load more
                <span className="text-zinc-500 tabular-nums">
                  ({rest.length - visible})
                </span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
