"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Building2, CheckCircle2, SearchX } from "lucide-react";
import Wrapper from "@/components/global/wrapper";
import PageHero, { HeroMetaChip } from "@/components/projects/page-hero";
import SectionHeading from "@/components/projects/section-heading";
import ProjectGroupList from "@/components/projects/project-group-list";
import CollectionsStrip from "@/components/projects/collections-strip";
import { ProjectGridSkeleton } from "@/components/projects/skeletons";
import ResetScrollOnReload from "@/components/projects/reset-scroll-on-reload";
import {
  PortfolioProject,
  ProjectGroupSummary,
  getProjectImage,
  PROJECT_FALLBACK_IMAGE,
} from "@/components/projects/types";
import { projectGroupService } from "@/http/project-groups";
import { projectService } from "@/http/projects";

function getHeroImage(
  group: ProjectGroupSummary | null | undefined,
  projects: PortfolioProject[],
) {
  if (group?.coverImageUrl) return group.coverImageUrl;
  const featured = projects.find((project) => project.featured) || projects[0];
  return featured ? getProjectImage(featured) : PROJECT_FALLBACK_IMAGE;
}

function HeroSkeleton() {
  return (
    <div className="relative flex h-[66vh] min-h-[460px] w-full animate-pulse items-center justify-center overflow-hidden rounded-b-[60px] bg-zinc-900 sm:rounded-b-[100px] lg:h-[74vh] lg:rounded-b-[160px]">
      <div className="w-full max-w-2xl space-y-6 px-6 text-center">
        <div className="mx-auto h-9 w-40 rounded-full bg-zinc-800" />
        <div className="mx-auto h-14 w-3/4 rounded-full bg-zinc-800" />
        <div className="mx-auto h-4 w-full rounded-full bg-zinc-800" />
        <div className="mx-auto h-4 w-2/3 rounded-full bg-zinc-800" />
      </div>
    </div>
  );
}

export default function ProjectGroupPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["published-project-group", slug],
    queryFn: async () => {
      const response = await projectGroupService.getPublishedGroup(slug);
      if (!response?.success || !response.data) return null;
      return response.data as ProjectGroupSummary;
    },
    enabled: Boolean(slug),
  });

  const { data: allGroups = [] } = useQuery<ProjectGroupSummary[]>({
    queryKey: ["published-project-groups"],
    queryFn: async () => {
      const response = await projectGroupService.getPublishedGroups();
      return Array.isArray(response?.data) ? response.data : [];
    },
  });

  // Shares its cache with the listing page; used only for collection cover art.
  const { data: allProjects = [] } = useQuery<PortfolioProject[]>({
    queryKey: ["published-projects"],
    queryFn: async () => {
      const response = await projectService.getPublishedProjects({
        page: 1,
        limit: 100,
      });
      return response?.success ? response.data || [] : [];
    },
  });

  const projects = (data?.projects || []) as PortfolioProject[];
  const notFound = !isLoading && (isError || !data);
  const otherGroups = allGroups.filter((group) => group.slug !== slug);
  const completedCount = projects.filter(
    (project) => project.status === "COMPLETED",
  ).length;

  if (isLoading) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-black">
        <ResetScrollOnReload />
        <HeroSkeleton />
        <Wrapper className="mx-auto max-w-7xl px-4 py-20 md:py-28">
          <ProjectGridSkeleton count={3} />
        </Wrapper>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 py-32 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-900">
          <SearchX className="h-9 w-9 text-amber-400/80" />
        </div>
        <h1 className="text-3xl font-bold text-zinc-50 sm:text-4xl">
          This collection doesn&apos;t exist
        </h1>
        <p className="mt-4 max-w-md text-base text-zinc-400">
          It may have been renamed or unpublished. The full portfolio is still
          right here.
        </p>
        <Link
          href="/projects"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#fbe575] px-7 py-3.5 text-sm font-bold text-black transition-transform duration-300 hover:scale-[1.03]"
        >
          Browse all projects
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-black">
      <ResetScrollOnReload />
      <PageHero
        image={getHeroImage(data, projects)}
        size="compact"
        backHref="/projects"
        eyebrow="Collection"
        title={data?.name || "Collection"}
        subtitle={data?.description || undefined}
        meta={
          <>
            <HeroMetaChip icon={<Building2 className="h-4 w-4 text-amber-300" />}>
              {projects.length} {projects.length === 1 ? "project" : "projects"}
            </HeroMetaChip>
            {completedCount > 0 && (
              <HeroMetaChip
                icon={<CheckCircle2 className="h-4 w-4 text-emerald-300" />}
              >
                {completedCount} completed
              </HeroMetaChip>
            )}
          </>
        }
      />

      <Wrapper className="mx-auto max-w-7xl px-4 py-20 md:py-28">
        <SectionHeading
          eyebrow="Inside the collection"
          title={
            <>
              Projects in{" "}
              <span className="text-amber-400">{data?.name || "this collection"}</span>
            </>
          }
          action={
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-amber-400/60 hover:text-amber-300"
            >
              View the full portfolio
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />

        <ProjectGroupList projects={projects} />
      </Wrapper>

      {otherGroups.length > 0 && (
        <Wrapper className="mx-auto max-w-7xl px-4 pb-24 md:pb-32">
          <SectionHeading
            eyebrow="Keep exploring"
            title={
              <>
                Other <span className="text-amber-400">collections</span>
              </>
            }
          />
          <CollectionsStrip groups={otherGroups} projects={allProjects} />
        </Wrapper>
      )}
    </div>
  );
}
