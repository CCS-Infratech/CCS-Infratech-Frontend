"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PROJECT_CATEGORIES } from "@/constants/projects";
import ProjectCard, { PortfolioProject } from "./project-card";

const CATEGORIES = [
  { id: "all", label: "All Projects" },
  ...PROJECT_CATEGORIES,
];

export default function ProjectPortfolio({
  projects,
}: {
  projects: PortfolioProject[];
}) {
  const [activeCategory, setActiveCategory] = useState("all");

  const visibleProjects = useMemo(() => {
    if (activeCategory === "all") return projects;
    return projects.filter((project) => project.category === activeCategory);
  }, [activeCategory, projects]);

  return (
    <>
      <div className="relative mb-10 flex flex-wrap justify-center gap-3">
        <div className="absolute inset-y-0 -left-4 -right-4 -z-10 rounded-full bg-zinc-800/50" />
        {CATEGORIES.map((category) => (
          <motion.button
            key={category.id}
            className={`rounded-full px-6 py-3 font-sans text-base font-thin transition-all duration-300 ${
              activeCategory === category.id
                ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                : "bg-zinc-800 text-gray-300 hover:bg-zinc-700 hover:text-white"
            }`}
            onClick={() => setActiveCategory(category.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {category.label}
          </motion.button>
        ))}
      </div>

      {visibleProjects.length === 0 ? (
        <div className="py-20 text-center text-gray-400">
          No projects available yet.
        </div>
      ) : (
        <div className="relative">
          <div className="flex snap-x snap-proximity gap-6 overflow-x-auto scroll-smooth px-1 py-4 [scrollbar-width:thin] [scrollbar-color:#f59e0b66_transparent]">
            {visibleProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          {visibleProjects.length > 2 && (
            <div className="pointer-events-none absolute inset-y-4 right-0 w-16 bg-gradient-to-l from-black to-transparent" />
          )}
        </div>
      )}
    </>
  );
}
