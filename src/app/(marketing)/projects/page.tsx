"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowRight, Building2, CheckCircle2, Layers } from "lucide-react";
import Wrapper from "@/components/global/wrapper";
import PageHero, { HeroMetaChip } from "@/components/projects/page-hero";
import SectionHeading from "@/components/projects/section-heading";
import ProjectPortfolio from "@/components/projects/project-portfolio";
import CollectionsStrip, {
  CollectionsStripSkeleton,
} from "@/components/projects/collections-strip";
import {
  FilterBarSkeleton,
  ProjectGridSkeleton,
} from "@/components/projects/skeletons";
import ResetScrollOnReload from "@/components/projects/reset-scroll-on-reload";
import {
  PortfolioProject,
  ProjectGroupSummary,
  getProjectImage,
  PROJECT_FALLBACK_IMAGE,
} from "@/components/projects/types";
import { projectService } from "@/http/projects";
import { projectGroupService } from "@/http/project-groups";

export default function ProjectsPage() {
  const {
    data: projects = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<PortfolioProject[]>({
    queryKey: ["published-projects"],
    queryFn: async () => {
      const response = await projectService.getPublishedProjects({
        page: 1,
        limit: 100,
      });
      return response?.success ? response.data || [] : [];
    },
  });

  const { data: groups = [], isLoading: groupsLoading } = useQuery<
    ProjectGroupSummary[]
  >({
    queryKey: ["published-project-groups"],
    queryFn: async () => {
      const response = await projectGroupService.getPublishedGroups();
      return Array.isArray(response?.data) ? response.data : [];
    },
  });

  const featuredProject =
    projects.find((project) => project.featured) || projects[0];
  const completedCount = projects.filter(
    (project) => project.status === "COMPLETED",
  ).length;

  const heroImage = featuredProject
    ? getProjectImage(featuredProject)
    : PROJECT_FALLBACK_IMAGE;

  return (
    <div className="min-h-screen overflow-x-hidden bg-black">
      <ResetScrollOnReload />
      <PageHero
        image={heroImage}
        eyebrow="Our portfolio"
        title={
          <>
            Exceptional projects,
            <br className="hidden sm:block" />{" "}
            <span className="text-amber-400">built to last</span>
          </>
        }
        subtitle="A showcase of residential, commercial and industrial work — each one delivered with the same standard of craft, safety and finish."
        meta={
          projects.length > 0 ? (
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
              {groups.length > 0 && (
                <HeroMetaChip icon={<Layers className="h-4 w-4 text-amber-300" />}>
                  {groups.length}{" "}
                  {groups.length === 1 ? "collection" : "collections"}
                </HeroMetaChip>
              )}
            </>
          ) : null
        }
        actions={
          <>
            <Link
              href={groups.length > 0 ? "#collections" : "#portfolio"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#fbe575] px-7 py-3.5 text-sm font-bold text-black shadow-xl transition-transform duration-300 hover:scale-[1.03] sm:w-auto"
            >
              {groups.length > 0 ? "Explore collections" : "View the portfolio"}
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
            <Link
              href="/contact-us"
              className="inline-flex w-full items-center justify-center rounded-full border-2 border-white/70 px-7 py-3.5 text-sm font-bold text-white transition-colors duration-300 hover:border-white hover:bg-white/10 sm:w-auto"
            >
              Talk to our team
            </Link>
          </>
        }
        scrollCueHref="#portfolio"
      />

      <div id="portfolio" className="scroll-mt-24" />
      <Wrapper className="mx-auto max-w-7xl px-4 py-20 md:py-28">
        <SectionHeading
          eyebrow="The work"
          title={
            <>
              Discover our <span className="text-amber-400">portfolio</span>
            </>
          }
          description="Filter by sector, status or location to find work closest to what you're planning."
        />

        {isLoading && (
          <>
            <FilterBarSkeleton />
            <ProjectGridSkeleton />
          </>
        )}

        {!isLoading && isError && (
          <div className="rounded-3xl border border-red-500/20 bg-red-950/20 px-6 py-20 text-center">
            <AlertCircle className="mx-auto mb-5 h-12 w-12 text-red-400" />
            <h3 className="text-xl font-bold text-zinc-100">
              We couldn&apos;t load the portfolio
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm text-zinc-400">
              Something went wrong on our side. Please try again in a moment.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#fbe575] px-6 py-3 text-sm font-semibold text-black transition-transform duration-200 hover:scale-[1.03]"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !isError && projects.length === 0 && (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 px-6 py-20 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800/80">
              <Building2 className="h-7 w-7 text-amber-400/80" />
            </div>
            <h3 className="text-xl font-bold text-zinc-100">
              Our portfolio is being updated
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm text-zinc-400">
              New projects are on the way. In the meantime, our team can walk
              you through recent work directly.
            </p>
            <Link
              href="/contact-us"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#fbe575] px-6 py-3 text-sm font-semibold text-black transition-transform duration-200 hover:scale-[1.03]"
            >
              Get in touch
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {!isLoading && !isError && projects.length > 0 && (
          <ProjectPortfolio projects={projects} showLeadCard />
        )}
      </Wrapper>

      <div id="collections" className="scroll-mt-28" />
      {(groupsLoading || groups.length > 0) && (
        <Wrapper className="mx-auto max-w-7xl px-4 pb-20 md:pb-28">
          <SectionHeading
            eyebrow="Collections"
            title={
              <>
                Explore by <span className="text-amber-400">collection</span>
              </>
            }
            description="Related developments grouped together, so you can see a whole neighbourhood at once."
          />
          {groupsLoading ? (
            <CollectionsStripSkeleton />
          ) : (
            <CollectionsStrip groups={groups} projects={projects} />
          )}
        </Wrapper>
      )}

      <Wrapper className="mx-auto max-w-7xl px-4 pb-24 md:pb-32">
        <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 px-6 py-14 text-center sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-zinc-50 sm:text-4xl">
              Have a project in mind?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-zinc-400">
              Tell us about the site, the timeline and the brief — we&apos;ll
              come back with an approach and a realistic budget.
            </p>
            <Link
              href="/contact-us"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#fbe575] px-8 py-4 text-base font-bold text-black shadow-xl transition-transform duration-300 hover:scale-[1.03]"
            >
              Start a conversation
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
