"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import Wrapper from "@/components/global/wrapper";
import { projectGroupService } from "@/http/project-groups";
import ProjectGroupList from "@/components/projects/project-group-list";
import { PortfolioProject } from "@/components/projects/project-card";

function getHeroImage(projects: PortfolioProject[]) {
  const featured = projects.find((project) => project.featured) || projects[0];
  if (!featured) return "/images/4.avif";
  const firstImg = featured.images?.[0];
  if (typeof firstImg === "string") return firstImg;
  return firstImg?.url || featured.logoUrl || "/images/4.avif";
}

export default function ProjectGroupPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        setIsLoading(true);
        const response = await projectGroupService.getPublishedGroup(slug);
        if (response.success && response.data) {
          setGroupName(response.data.name);
          setGroupDescription(response.data.description || "");
          setProjects(response.data.projects || []);
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error fetching project group:", error);
        toast.error("Failed to load project group");
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchGroup();
  }, [slug]);

  const heroImage = getHeroImage(projects);
  const projectCount = projects.length;

  return (
    <div className="min-h-screen overflow-x-hidden bg-black">
      <div className="relative flex h-[70vh] min-h-[520px] w-full items-center justify-center overflow-hidden rounded-b-[80px] sm:rounded-b-[140px] lg:rounded-b-[180px]">
        <Image
          src={heroImage}
          alt={groupName || "Project collection"}
          fill
          className="object-cover brightness-[0.4]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/85" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <Link
            href="/projects"
            className="mb-8 inline-flex items-center text-sm text-gray-300 transition-colors hover:text-amber-400"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            All projects
          </Link>

          <h1 className="text-5xl font-thin tracking-tighter text-white md:text-7xl">
            {isLoading ? "Loading..." : groupName || "Collection"}
          </h1>

          {groupDescription && (
            <p className="mx-auto mt-6 max-w-2xl font-sans text-lg font-light text-gray-300">
              {groupDescription}
            </p>
          )}

          {!isLoading && !notFound && (
            <p className="mt-8 text-sm uppercase tracking-[0.25em] text-amber-400">
              {projectCount} {projectCount === 1 ? "project" : "projects"}
            </p>
          )}
        </div>
      </div>

      <Wrapper className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-amber-500" />
          </div>
        )}

        {!isLoading && notFound && (
          <div className="py-20 text-center">
            <h2 className="text-2xl font-thin text-white">
              This collection could not be found
            </h2>
            <Link
              href="/projects"
              className="mt-4 inline-block text-amber-400 hover:text-amber-300"
            >
              Browse all projects
            </Link>
          </div>
        )}

        {!isLoading && !notFound && <ProjectGroupList projects={projects} />}
      </Wrapper>
    </div>
  );
}
