"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Download,
  Hammer,
  Layers,
  MapPin,
  SearchX,
} from "lucide-react";
import Wrapper from "@/components/global/wrapper";
import PageHero, { HeroMetaChip } from "@/components/projects/page-hero";
import SectionHeading from "@/components/projects/section-heading";
import ProjectSectionNav, {
  SectionLink,
} from "@/components/projects/project-section-nav";
import ProjectGallery from "@/components/projects/project-gallery";
import ProjectPlans, { ProjectPlan } from "@/components/projects/project-plans";
import ProjectCard from "@/components/projects/project-card";
import { ProjectDetailSkeleton } from "@/components/projects/skeletons";
import ResetScrollOnReload from "@/components/projects/reset-scroll-on-reload";
import {
  AmenitiesSection,
  LocationSection,
  ProjectAmenity,
  ProjectSpec,
  QuickFact,
  QuickFacts,
  SpecificationsSection,
} from "@/components/projects/project-detail-sections";
import {
  PortfolioProject,
  PROJECT_FALLBACK_IMAGE,
  getStatusLabel,
} from "@/components/projects/types";
import { formatProjectCategory } from "@/constants/projects";
import { projectService } from "@/http/projects";

interface ProjectDetail {
  id: string;
  title: string;
  slug?: string;
  tagline: string;
  category: string;
  status: string;
  location: string;
  year: string | null;
  description: string;
  overview: string[];
  overviewHeadline?: string;
  mainImage: string;
  images: string[];
  specifications: ProjectSpec[];
  amenities: ProjectAmenity[];
  plans: ProjectPlan[];
  address: string;
  mapUrl?: string;
  nearbyAttractions: string[];
  logoUrl?: string;
  brochureUrl?: string;
  group?: { name?: string; slug?: string } | null;
}

function transformProject(apiData: any): ProjectDetail {
  const images: string[] =
    apiData.images?.map((img: any) => img.url).filter(Boolean) || [];

  const plans: ProjectPlan[] = [];
  const addPlan = (
    image: string | undefined,
    headline: string | undefined,
    fallbackTitle: string,
    description: string,
    brochureUrl?: string,
  ) => {
    if (!image) return;
    plans.push({
      title: headline || fallbackTitle,
      subtitle: headline || fallbackTitle,
      description,
      image,
      brochureUrl,
    });
  };

  addPlan(
    apiData.sitePlanImage,
    apiData.sitePlanHeadline,
    "Site plan",
    "The layout of the whole development.",
    apiData.sitePlanBrochureUrl,
  );
  addPlan(
    apiData.currentPlanImage,
    apiData.currentPlanHeadline,
    "Cluster plan",
    "How the blocks and clusters sit together.",
    apiData.currentPlanBrochureUrl,
  );
  addPlan(
    apiData.unitPlanImage,
    apiData.unitPlanHeadline,
    "Unit plan",
    "Room-by-room layout of an individual unit.",
    apiData.unitPlanBrochureUrl,
  );

  const title = apiData.title?.includes(":")
    ? apiData.title.split(":")[0].trim()
    : apiData.title;

  const overview: string[] = apiData.content
    ? String(apiData.content)
        .split("\n\n")
        .map((p: string) => p.trim())
        .filter(Boolean)
    : [apiData.overviewDescription || apiData.description].filter(Boolean);

  const completionYear = apiData.completionDate
    ? String(new Date(apiData.completionDate).getFullYear())
    : null;

  return {
    id: apiData.id,
    title,
    slug: apiData.slug,
    tagline: apiData.overviewDescription || apiData.description || "",
    category: apiData.category || "RESIDENTIAL",
    status: apiData.status || "UNDER_CONSTRUCTION",
    location: apiData.location || "",
    year: completionYear,
    description: apiData.description || "",
    overview,
    overviewHeadline: apiData.overviewHeadline || undefined,
    mainImage: images[0] || apiData.logoUrl || PROJECT_FALLBACK_IMAGE,
    images,
    specifications:
      apiData.specifications?.map((spec: any) => ({
        title: spec.title,
        description: spec.description,
        image: spec.imageUrl,
      })) || [],
    amenities:
      apiData.amenities?.map((amenity: any) => ({
        title: amenity.name,
        icon: amenity.imageUrl,
      })) || [],
    plans,
    address:
      apiData.locationDetails ||
      [title, apiData.location].filter(Boolean).join(", "),
    mapUrl: apiData.mapUrl || undefined,
    nearbyAttractions: apiData.nearbyAttractions
      ? String(apiData.nearbyAttractions)
          .split(",")
          .map((item: string) => item.trim())
          .filter(Boolean)
      : [],
    logoUrl: apiData.logoUrl || undefined,
    brochureUrl:
      apiData.sitePlanBrochureUrl ||
      apiData.currentPlanBrochureUrl ||
      apiData.unitPlanBrochureUrl ||
      undefined,
    group: apiData.group || null,
  };
}

function openBrochure(url?: string) {
  if (!url) return;
  window.open(url, "_blank", "noopener,noreferrer");
}

export default function ProjectDetailPage() {
  const params = useParams();
  const identifier = params.id as string;

  const { data: project, isLoading, isError } = useQuery<ProjectDetail | null>({
    queryKey: ["published-project", identifier],
    queryFn: async () => {
      const response = await projectService.getPublishedProject(identifier);
      if (!response?.data) return null;
      return transformProject(response.data);
    },
    enabled: Boolean(identifier),
  });

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

  const related = useMemo(() => {
    if (!project) return [];
    const others = allProjects.filter((item) => item.id !== project.id);
    const sameGroup = project.group?.slug
      ? others.filter((item) => item.group?.slug === project.group?.slug)
      : [];
    const sameCategory = others.filter(
      (item) =>
        item.category === project.category &&
        !sameGroup.some((g) => g.id === item.id),
    );
    return [...sameGroup, ...sameCategory, ...others]
      .filter(
        (item, index, list) =>
          list.findIndex((other) => other.id === item.id) === index,
      )
      .slice(0, 3);
  }, [allProjects, project]);

  const sections = useMemo<SectionLink[]>(() => {
    if (!project) return [];
    const list: SectionLink[] = [{ id: "overview", label: "Overview" }];
    if (project.specifications.length)
      list.push({ id: "specifications", label: "Specifications" });
    if (project.amenities.length)
      list.push({ id: "amenities", label: "Amenities" });
    if (project.plans.length) list.push({ id: "plans", label: "Plans" });
    if (project.images.length) list.push({ id: "gallery", label: "Gallery" });
    list.push({ id: "location", label: "Location" });
    return list;
  }, [project]);

  // Mounted in every branch: the scroll fix has to run while the skeleton is
  // still on screen, which is exactly when the browser attempts its restore.
  if (isLoading) {
    return (
      <>
        <ResetScrollOnReload />
        <ProjectDetailSkeleton />
      </>
    );
  }

  if (isError || !project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 py-32 text-center">
        <ResetScrollOnReload />
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-900">
          <SearchX className="h-9 w-9 text-amber-400/80" />
        </div>
        <h1 className="text-3xl font-bold text-zinc-50 sm:text-4xl">
          We couldn&apos;t find that project
        </h1>
        <p className="mt-4 max-w-md text-base text-zinc-400">
          It may have been unpublished or the link may be out of date.
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

  const facts: QuickFact[] = [
    {
      label: "Sector",
      value: formatProjectCategory(project.category),
      icon: <Building2 className="h-3.5 w-3.5 text-amber-500" />,
    },
    {
      label: "Status",
      value: getStatusLabel(project.status),
      icon: <Hammer className="h-3.5 w-3.5 text-amber-500" />,
    },
  ];
  if (project.location) {
    facts.push({
      label: "Location",
      value: project.location,
      icon: <MapPin className="h-3.5 w-3.5 text-amber-500" />,
    });
  }
  if (project.year) {
    facts.push({
      label: "Completion",
      value: project.year,
      icon: <CalendarDays className="h-3.5 w-3.5 text-amber-500" />,
    });
  } else if (project.amenities.length) {
    facts.push({
      label: "Amenities",
      value: `${project.amenities.length}+`,
      icon: <Layers className="h-3.5 w-3.5 text-amber-500" />,
    });
  }

  const overviewImage = project.images[1] || project.images[0];

  return (
    <div className="min-h-screen overflow-x-hidden bg-black">
      <ResetScrollOnReload />
      <PageHero
        image={project.mainImage}
        backHref={
          project.group?.slug
            ? `/projects/groups/${project.group.slug}`
            : "/projects"
        }
        backLabel={project.group?.name || "All projects"}
        eyebrow={
          project.logoUrl ? (
            <div className="relative mx-auto h-20 w-48 sm:h-24 sm:w-56">
              <Image
                src={project.logoUrl}
                alt={project.title}
                fill
                sizes="224px"
                className="object-contain"
                priority
              />
            </div>
          ) : (
            formatProjectCategory(project.category)
          )
        }
        title={project.title}
        subtitle={project.tagline}
        meta={
          <>
            <HeroMetaChip
              tone={project.status === "COMPLETED" ? "success" : "progress"}
            >
              {getStatusLabel(project.status)}
            </HeroMetaChip>
            {project.location && (
              <HeroMetaChip icon={<MapPin className="h-4 w-4 text-amber-300" />}>
                {project.location}
              </HeroMetaChip>
            )}
            {project.year && (
              <HeroMetaChip
                icon={<CalendarDays className="h-4 w-4 text-amber-300" />}
              >
                {project.year}
              </HeroMetaChip>
            )}
          </>
        }
        actions={
          <>
            <Link
              href="#overview"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#fbe575] px-7 py-3.5 text-sm font-bold text-black shadow-xl transition-transform duration-300 hover:scale-[1.03] sm:w-auto"
            >
              Explore this project
            </Link>
            {project.brochureUrl ? (
              <button
                type="button"
                onClick={() => openBrochure(project.brochureUrl)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-white/70 px-7 py-3.5 text-sm font-bold text-white transition-colors duration-300 hover:border-white hover:bg-white/10 sm:w-auto"
              >
                <Download className="h-4 w-4" />
                Download brochure
              </button>
            ) : (
              <Link
                href="/contact-us"
                className="inline-flex w-full items-center justify-center rounded-full border-2 border-white/70 px-7 py-3.5 text-sm font-bold text-white transition-colors duration-300 hover:border-white hover:bg-white/10 sm:w-auto"
              >
                Enquire about this project
              </Link>
            )}
          </>
        }
        scrollCueHref="#overview"
      />

      <ProjectSectionNav sections={sections} />

      <Wrapper className="mx-auto max-w-7xl px-4">
        {/* Overview */}
        <section id="overview" className="scroll-mt-36 py-16 md:py-24">
          <QuickFacts facts={facts} />

          <div className="mt-14 grid items-center gap-10 lg:mt-20 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
            >
              <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.28em] text-amber-400">
                Project overview
              </span>
              <h2 className="text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl">
                {project.overviewHeadline || `Inside ${project.title}`}
              </h2>
              <div className="mt-6 space-y-4">
                {project.overview.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-base leading-relaxed text-zinc-400"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {project.brochureUrl && (
                <button
                  type="button"
                  onClick={() => openBrochure(project.brochureUrl)}
                  className="mt-8 inline-flex items-center gap-2 rounded-full border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-amber-400/60 hover:text-amber-300"
                >
                  <Download className="h-4 w-4" />
                  Project brochure
                </button>
              )}
            </motion.div>

            {overviewImage && (
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6 }}
                className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-zinc-800 lg:aspect-[3/4] lg:max-h-[560px]"
              >
                <Image
                  src={overviewImage}
                  alt={`${project.title} overview`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <span className="inline-block rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                    {formatProjectCategory(project.category)}
                  </span>
                  <p className="mt-3 text-lg font-medium text-white sm:text-xl">
                    {project.overviewHeadline ||
                      "Architectural brilliance in every detail"}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        <SpecificationsSection specs={project.specifications} />

        <AmenitiesSection
          amenities={project.amenities}
          projectTitle={project.title}
        />

        {project.plans.length > 0 && (
          <section id="plans" className="scroll-mt-36 py-20 md:py-28">
            <ProjectPlans
              plans={project.plans}
              backgroundImage={project.images[2] || project.images[0]}
              onDownload={openBrochure}
            />
          </section>
        )}

        {project.images.length > 0 && (
          <section id="gallery" className="scroll-mt-36 py-20 md:py-28">
            <SectionHeading
              eyebrow="Visual journey"
              title={
                <>
                  Project <span className="text-amber-400">gallery</span>
                </>
              }
              description={`A closer look at ${project.title}.`}
            />
            <ProjectGallery
              images={project.images}
              projectTitle={project.title}
            />
          </section>
        )}

        <LocationSection
          projectTitle={project.title}
          location={project.location}
          address={project.address}
          mapUrl={project.mapUrl}
          nearbyAttractions={project.nearbyAttractions}
        />

        {related.length > 0 && (
          <section className="border-t border-zinc-800/80 py-20 md:py-28">
            <SectionHeading
              eyebrow="Keep looking"
              title={
                <>
                  More from our{" "}
                  <span className="text-amber-400">portfolio</span>
                </>
              }
              action={
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-amber-400/60 hover:text-amber-300"
                >
                  All projects
                  <ArrowRight className="h-4 w-4" />
                </Link>
              }
            />
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
              {related.map((item, index) => (
                <ProjectCard key={item.id} project={item} index={index} />
              ))}
            </div>
          </section>
        )}

        <div className="pb-24 md:pb-32">
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 px-6 py-14 text-center sm:px-12 sm:py-20">
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-zinc-50 sm:text-4xl">
                Interested in {project.title}?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-zinc-400">
                Book a site visit or ask us anything about availability,
                specifications and timelines.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <Link
                  href="/contact-us"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#fbe575] px-8 py-4 text-base font-bold text-black shadow-xl transition-transform duration-300 hover:scale-[1.03] sm:w-auto"
                >
                  Get in touch
                  <ArrowRight className="h-5 w-5" />
                </Link>
                {project.brochureUrl && (
                  <button
                    type="button"
                    onClick={() => openBrochure(project.brochureUrl)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-zinc-700 px-8 py-4 text-base font-semibold text-zinc-200 transition-colors hover:border-amber-400/60 hover:text-amber-300 sm:w-auto"
                  >
                    <Download className="h-5 w-5" />
                    Brochure
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
