"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import Wrapper from "@/components/global/wrapper";
import { projectService } from "@/http/projects";
import { formatProjectCategory } from "@/constants/projects";

// Define interfaces for data structure
interface ProjectStat {
  label: string;
  value: string;
}

interface ProjectSpec {
  title: string;
  description: string;
  image: string;
}

interface ProjectAmenity {
  title: string;
  description: string;
  icon: string;
}

interface ProjectPlan {
  title: string;
  description: string;
  image: string;
  subtitle: string;
  brochureUrl?: string;
}

interface ProjectPricing {
  options: string[];
  prices: string[];
}

interface ProjectData {
  id: string;
  title: string;
  category: string;
  status: string;
  location: string;
  year: string;
  tagline: string;
  description: string;
  overview: string[];
  mainImage: string;
  images: string[];
  stats: ProjectStat[];
  specifications: ProjectSpec[];
  amenities: ProjectAmenity[];
  plans: {
    masterPlan: ProjectPlan[];
    clusterPlan: ProjectPlan[];
    unitPlan: ProjectPlan[];
  };
  planPrices: {
    master: ProjectPricing;
    cluster: ProjectPricing;
    unit: ProjectPricing;
  };
  gallery: string[];
  mapLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  featured: boolean;
  logoUrl?: string;
  brochureUrl?: string;
  mapUrl?: string;
  nearbyAttractions: string[];
  overviewHeadline?: string;
  allPlans: ProjectPlan[];
}

function AmenityCard({ icon, title }: any) {
  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8 lg:p-10 flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      <Image
        src={icon || "/icons/kitchen.png"}
        alt={title}
        width={70}
        height={70}
        className="mb-4 sm:mb-6 w-12 h-12 sm:w-16 sm:h-16 lg:w-[70px] lg:h-[70px]"
      />
      <p className="text-base sm:text-lg font-medium text-gray-800">{title}</p>
    </motion.div>
  );
}

export default function ProjectDetailPage() {
  type PlanTabs = "master" | "cluster" | "unit";
  const params = useParams();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<PlanTabs>("master");
  const [galleryView, setGalleryView] = useState<boolean>(false);
  const [activeGalleryImage, setActiveGalleryImage] = useState<number>(0);
  const [activePlanIndex, setActivePlanIndex] = useState<number>(0);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await projectService.getPublishedProject(
          params.id as string,
        );
        const apiData = response.data;

        // Parse nearby attractions from comma-separated string
        const nearbyAttractions = apiData.nearbyAttractions
          ? apiData.nearbyAttractions
              .split(",")
              .map((item: string) => item.trim())
          : [];

        // Parse overview from content (split by \n\n)
        const overviewParagraphs = apiData.content
          ? apiData.content.split("\n\n").filter((p: string) => p.trim())
          : [apiData.description];

        // Extract title (remove tagline part if exists)
        const projectTitle = apiData.title.includes(":")
          ? apiData.title.split(":")[0].trim()
          : apiData.title;

        // Collect all available plans
        const allPlans: ProjectPlan[] = [];

        // Add site plan (master plan)
        if (apiData.sitePlanImage) {
          allPlans.push({
            title: apiData.sitePlanHeadline || "Site Plan",
            description: "Comprehensive layout of the entire project",
            image: apiData.sitePlanImage,
            subtitle: apiData.sitePlanHeadline || "Site Layout",
            brochureUrl: apiData.sitePlanBrochureUrl,
          });
        }

        // Add current plan (cluster plan)
        if (apiData.currentPlanImage) {
          allPlans.push({
            title: apiData.currentPlanHeadline || "Current Plan",
            description: "Detailed plan view",
            image: apiData.currentPlanImage,
            subtitle: apiData.currentPlanHeadline || "Plan View",
            brochureUrl: apiData.currentPlanBrochureUrl,
          });
        }

        // Add unit plan
        if (apiData.unitPlanImage) {
          allPlans.push({
            title: apiData.unitPlanHeadline || "Unit Plan",
            description: "Individual unit layout",
            image: apiData.unitPlanImage,
            subtitle: apiData.unitPlanHeadline || "Unit Layout",
            brochureUrl: apiData.unitPlanBrochureUrl,
          });
        }

        // Transform API data to match component interface
        const transformedProject: ProjectData = {
          id: apiData.id,
          title: projectTitle,
          category: apiData.category || "RESIDENTIAL",
          status: apiData.status || "UNDER_CONSTRUCTION",
          location: apiData.location,
          year: apiData.completionDate
            ? new Date(apiData.completionDate).getFullYear().toString()
            : new Date().getFullYear().toString(),
          tagline: apiData.title,
          description: apiData.description,
          overview: overviewParagraphs,
          overviewHeadline: apiData.overviewHeadline,
          mainImage:
            apiData.images && apiData.images.length > 0
              ? apiData.images[0].url
              : "/images/aerial.png",
          images: apiData.images?.map((img: any) => img.url) || [],
          stats: [
            { label: "Total Villas", value: "105" },
            {
              label: "Amenities",
              value: `${apiData.amenities?.length || 30}+`,
            },
            { label: "Parks", value: "5" },
            { label: "Security", value: "AI-Enabled" },
          ],
          specifications:
            apiData.specifications?.map((spec: any) => ({
              title: spec.title,
              description: spec.description,
              image: spec.imageUrl,
            })) || [],
          amenities:
            apiData.amenities?.map((amenity: any) => ({
              title: amenity.name,
              description: amenity.name,
              icon: amenity.imageUrl,
            })) || [],
          plans: {
            masterPlan: apiData.sitePlanImage
              ? [
                  {
                    title: apiData.sitePlanHeadline || "Site Plan",
                    description: "Comprehensive layout of the entire project",
                    image: apiData.sitePlanImage,
                    subtitle: apiData.sitePlanHeadline || "Site Layout",
                    brochureUrl: apiData.sitePlanBrochureUrl,
                  },
                ]
              : [],
            clusterPlan: apiData.currentPlanImage
              ? [
                  {
                    title: apiData.currentPlanHeadline || "Current Plan",
                    description: "Detailed plan view",
                    image: apiData.currentPlanImage,
                    subtitle: apiData.currentPlanHeadline || "Plan View",
                    brochureUrl: apiData.currentPlanBrochureUrl,
                  },
                ]
              : [],
            unitPlan: apiData.unitPlanImage
              ? [
                  {
                    title: apiData.unitPlanHeadline || "Unit Plan",
                    description: "Individual unit layout",
                    image: apiData.unitPlanImage,
                    subtitle: apiData.unitPlanHeadline || "Unit Layout",
                    brochureUrl: apiData.unitPlanBrochureUrl,
                  },
                ]
              : [],
          },
          planPrices: {
            master: {
              options: [apiData.sitePlanHeadline || "Plan"],
              prices: ["Price on Request"],
            },
            cluster: {
              options: [apiData.currentPlanHeadline || "Plan"],
              prices: ["Price on Request"],
            },
            unit: {
              options: [apiData.unitPlanHeadline || "Plan"],
              prices: ["Price on Request"],
            },
          },
          gallery: apiData.images?.map((img: any) => img.url) || [],
          mapLocation: {
            lat: 26.8467,
            lng: 80.9462,
            address:
              apiData.locationDetails || `${projectTitle}, ${apiData.location}`,
          },
          featured: apiData.featured,
          logoUrl: apiData.logoUrl,
          brochureUrl:
            apiData.sitePlanBrochureUrl ||
            apiData.currentPlanBrochureUrl ||
            apiData.unitPlanBrochureUrl,
          mapUrl: apiData.mapUrl,
          nearbyAttractions: nearbyAttractions,
          allPlans: allPlans,
        };

        setProject(transformedProject);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project details");
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  useEffect(() => {
    if (typeof window !== "undefined" && mapRef.current) {
      // Map initialization code
    }
  }, [project?.mapLocation]);

  const planTypes: Record<PlanTabs, string> = {
    master: "SITE PLAN",
    cluster: "CLUSTER PLAN",
    unit: "UNIT PLAN",
  };

  const handleBrochureDownload = (brochureUrl?: string) => {
    const url = brochureUrl || project?.brochureUrl;
    if (url) {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.download = `${project?.title}-Brochure.pdf`;
      link.click();
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading project details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">
            {error || "Project not found"}
          </p>
          <Link
            href="/projects"
            className="text-amber-500 hover:text-amber-600 underline"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  // Use allPlans for navigation instead of tab-based plans
  const currentPlan =
    project.allPlans && project.allPlans.length > 0
      ? project.allPlans[activePlanIndex]
      : null;

  const nextPlan = () => {
    if (project.allPlans && project.allPlans.length > 0) {
      setActivePlanIndex((prev) =>
        prev === project.allPlans.length - 1 ? 0 : prev + 1,
      );
    }
  };

  const prevPlan = () => {
    if (project.allPlans && project.allPlans.length > 0) {
      setActivePlanIndex((prev) =>
        prev === 0 ? project.allPlans.length - 1 : prev - 1,
      );
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <motion.div
        className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Image
          src={project.mainImage}
          alt={project.title}
          fill
          className="object-cover brightness-[0.7]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/100 via-black/60 to-black/90" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-5xl mx-auto px-4 sm:px-6">
            <motion.div
              className="mb-4 sm:mb-6 flex justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {project.logoUrl && (
                <div className="relative h-28 sm:h-32 md:w-48 md:h-32 lg:h-36">
                  <Image
                    src={project.logoUrl}
                    alt={project.title}
                    fill
                    priority
                  />
                </div>
              )}
            </motion.div>
            {project.status && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mb-4"
              >
                <span
                  className={`inline-block px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg ${
                    project.status === "COMPLETED"
                      ? "bg-emerald-500 text-white shadow-emerald-500/30"
                      : "bg-amber-600 text-white shadow-amber-600/30"
                  }`}
                >
                  {project.status === "COMPLETED"
                    ? "Completed"
                    : "Under Construction"}
                </span>
              </motion.div>
            )}
            <motion.p
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {project.tagline}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <Link
                href="#overview"
                className="bg-[#fbe575] hover:bg-[#fbe575] text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full inline-flex items-center text-base sm:text-lg font-medium transition-all duration-300 shadow-lg shadow-amber-500/20"
              >
                Explore Project
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <Wrapper className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Overview Section */}
        <motion.section
          id="overview"
          className="mb-16 sm:mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 items-center">
            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="text-amber-500 text-xs sm:text-sm font-medium uppercase tracking-wider">
                Project Overview
              </span>
              {project.logoUrl && (
                <Image
                  src={project.logoUrl}
                  alt={project.title}
                  height={200}
                  width={200}
                  className="w-32 sm:w-48 lg:w-[200px] h-auto my-4"
                />
              )}
              {project.overview.map((paragraph: any, index: any) => (
                <p
                  key={index}
                  className="text-sm sm:text-base text-zinc-600 mb-4 font-sans leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
              <div className="flex flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-8">
                <div className="bg-amber-50 px-4 sm:px-5 py-2 sm:py-3 rounded-lg border border-amber-200 flex items-center">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 mr-2 sm:mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-xs font-sans font-normal sm:text-sm text-zinc-700">
                    Completed {project.year}
                  </span>
                </div>
                <div className="bg-amber-50 px-4 sm:px-5 py-2 sm:py-3 rounded-lg border border-amber-200 flex items-center">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 mr-2 sm:mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-xs font-sans font-normal sm:text-sm text-zinc-700">
                    {project.location}
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="lg:w-1/2 relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl w-full"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Image
                src={project.images[1] || project.images[0]}
                alt={`${project.title} overview`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
                <div className="inline-block px-3 sm:px-4 py-1 bg-amber-500 text-white rounded-lg text-xs sm:text-sm font-medium mb-2 sm:mb-3">
                  {formatProjectCategory(project.category)}
                </div>
                <p className="text-white text-base sm:text-lg lg:text-xl font-medium">
                  {project.overviewHeadline ||
                    "Architectural brilliance in every detail"}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Specifications Section */}
        {project.specifications.length > 0 && (
          <motion.section
            id="specifications"
            className="mb-16 sm:mb-20 relative py-12 sm:py-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Decorative elements */}
            <div className="absolute top-10 sm:top-20 left-10 w-48 h-48 sm:w-64 sm:h-64 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>
            <div className="absolute bottom-10 sm:bottom-20 right-10 w-56 h-56 sm:w-72 sm:h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>

            <div className="text-center mb-10 sm:mb-14">
              <motion.span
                className="inline-block text-amber-500 text-xs sm:text-sm font-medium uppercase tracking-wider px-3 sm:px-4 py-1 rounded-full bg-amber-50 border border-amber-100"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Building Details
              </motion.span>
              <motion.h2
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 mt-3 sm:mt-4 mb-3 sm:mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Specifications &{" "}
                <span className="text-amber-500">Features</span>
              </motion.h2>
              <motion.p
                className="text-sm sm:text-base text-zinc-600 font-sans max-w-3xl mx-auto px-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Our commitment to excellence is evident in every aspect of the
                building's design and construction, creating spaces that are as
                beautiful as they are functional.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 md:gap-8">
              {project.specifications.map((spec: any, index: any) => (
                <motion.div
                  key={index}
                  className={`rounded-2xl overflow-hidden ${
                    index % 3 === 0 ? "md:col-span-8" : "md:col-span-4"
                  } ${index % 4 === 3 ? "md:col-span-12" : ""}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
                >
                  <motion.div
                    className="relative h-64 sm:h-72 lg:h-80 w-full overflow-hidden group cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={spec.image}
                      alt={spec.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <motion.div
                        initial={{ y: 20 }}
                        whileHover={{ y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="inline-block px-2 sm:px-3 py-1 text-xs bg-amber-500 text-white rounded-full mb-2 sm:mb-3">
                          Feature {index + 1}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">
                          {spec.title}
                        </h3>
                        <p className="text-white/90 font-sans font-thin text-xs sm:text-sm mb-2 sm:mb-4">
                          {spec.description}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Amenities Section */}
        {project.amenities.length > 0 && (
          <motion.section
            id="amenities"
            className="w-full py-12 sm:py-16 lg:py-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#9b6b1b] font-normal mb-10 sm:mb-12 lg:mb-16 px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Club tower apartments are fully loaded
            </motion.h2>

            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {project.amenities
                  .slice(0, 3)
                  .map((amenity: any, index: any) => (
                    <AmenityCard
                      key={index}
                      icon={amenity.icon}
                      title={amenity.title}
                    />
                  ))}
              </div>

              {/* Row 2 */}
              {project.amenities.length > 3 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
                  {project.amenities
                    .slice(3)
                    .map((amenity: any, index: any) => (
                      <AmenityCard
                        key={index}
                        icon={amenity.icon}
                        title={amenity.title}
                      />
                    ))}
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* Plans Section - Now using allPlans array */}
        {project.allPlans.length > 0 && (
          <section
            className="relative w-full py-12 sm:py-16 lg:py-20 mb-16 sm:mb-20 text-white rounded-2xl sm:rounded-3xl overflow-hidden bg-cover bg-center"
            style={{
              backgroundImage: `url('${project.images[2] || project.images[0]}')`,
            }}
            id="plans"
          >
            <div className="absolute inset-0 bg-black/60"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-12 text-center">
              <motion.h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Plan & Price
              </motion.h2>

              <motion.p
                className="text-base sm:text-lg lg:text-xl mt-2 opacity-90 mb-8 sm:mb-10 lg:mb-12"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Explore our thoughtfully designed layouts
              </motion.p>

              {/* Plan Navigation Dots */}
              {project.allPlans.length > 1 && (
                <div className="flex justify-center gap-2 mb-6">
                  {project.allPlans.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActivePlanIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === activePlanIndex
                          ? "bg-amber-500 w-8"
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                      aria-label={`Go to plan ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              <AnimatePresence mode="wait">
                {currentPlan && (
                  <motion.div
                    key={activePlanIndex}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 mt-10 sm:mt-12 lg:mt-16 items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Floor Plan Image */}
                    <motion.div
                      className="bg-white rounded-xl p-4 sm:p-5 shadow-xl mx-auto w-full max-w-md"
                      initial={{ x: -30 }}
                      animate={{ x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="relative aspect-[4/3] w-full">
                        <Image
                          src={currentPlan.image}
                          alt={currentPlan.title}
                          fill
                          className="rounded-lg w-full object-cover"
                        />
                      </div>
                      <div className="mt-3 sm:mt-4 text-zinc-800 text-left">
                        <h3 className="text-lg sm:text-xl font-bold">
                          {currentPlan.title}
                        </h3>
                      </div>
                    </motion.div>

                    {/* Pricing Details */}
                    <motion.div
                      className="space-y-6 sm:space-y-8"
                      initial={{ x: 30 }}
                      animate={{ x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="border border-amber-500/80 rounded-xl p-4 sm:p-6 flex justify-between items-center">
                        <div>
                          <p className="text-lg sm:text-xl font-semibold">
                            {currentPlan.subtitle}
                          </p>
                          <p className="text-amber-300/90 font-sans mt-2 text-sm sm:text-base">
                            {currentPlan.description}
                          </p>
                        </div>
                      </div>

                      <div className="border border-amber-500/80 rounded-xl p-4 sm:p-6 flex justify-between items-center">
                        <div>
                          <p className="text-base font-sans sm:text-lg opacity-90">
                            Starting Price
                          </p>
                        </div>
                        <p className="text-lg sm:text-xl font-semibold whitespace-nowrap">
                          Price on Request
                        </p>
                      </div>

                      {currentPlan.brochureUrl && (
                        <div className="flex flex-wrap gap-4 sm:gap-8 mt-6 text-base sm:text-lg font-semibold">
                          <button
                            onClick={() =>
                              handleBrochureDownload(currentPlan.brochureUrl)
                            }
                            className="flex items-center gap-2 bg-white rounded-full px-4 sm:px-5 py-3 sm:py-4 text-amber-600 hover:text-amber-400 transition cursor-pointer text-sm sm:text-base"
                          >
                            <Download
                              size={16}
                              className="sm:w-[18px] sm:h-[18px]"
                            />{" "}
                            Download Brochure
                          </button>
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Arrows */}
              {project.allPlans.length > 1 && (
                <>
                  <button
                    onClick={prevPlan}
                    className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 sm:p-3 rounded-full transition"
                    aria-label="Previous plan"
                  >
                    <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </button>
                  <button
                    onClick={nextPlan}
                    className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 sm:p-3 rounded-full transition"
                    aria-label="Next plan"
                  >
                    <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </button>
                </>
              )}
            </div>
          </section>
        )}

        {/* Gallery Section */}
        {project.gallery.length > 0 && (
          <motion.section
            id="gallery"
            className="mb-16 sm:mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-10 sm:mb-14">
              <span className="text-amber-500 text-xs sm:text-sm font-medium uppercase tracking-wider">
                Visual Journey
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 mt-2 mb-3 sm:mb-4">
                Project Gallery
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 max-w-3xl font-sans font-normal mx-auto mb-8 sm:mb-10 px-4">
                Explore the beauty of {project.title} through our visual
                showcase.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {project.gallery.map((image: any, index: any) => (
                <motion.div
                  key={index}
                  className={`relative cursor-pointer overflow-hidden rounded-lg sm:rounded-xl ${
                    index === 0 || index === 3
                      ? "md:col-span-2 md:row-span-2"
                      : ""
                  }`}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    setGalleryView(true);
                    setActiveGalleryImage(index);
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <div className="relative aspect-[4/3] h-full w-full">
                    <Image
                      src={image}
                      alt={`Gallery image ${index + 1}`}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-white/80 backdrop-blur-sm p-2 rounded-full">
                        <svg
                          className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-800"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Map Location */}
        <motion.section
          id="location"
          className="mb-16 sm:mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-amber-500 text-xs sm:text-sm font-medium uppercase tracking-wider">
              Prime Location
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 mt-2 mb-3 sm:mb-4">
              Find Us on Map
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 font-sans font-normal max-w-3xl mx-auto mb-8 sm:mb-10 px-4">
              Located in {project.location}, {project.title} offers unparalleled
              access to the city's finest amenities.
            </p>
          </div>

          <div className="flex flex-col font-sans lg:flex-row gap-6 sm:gap-8 items-start">
            <motion.div
              className="w-full lg:w-1/3 bg-zinc-100 p-6 sm:p-8 rounded-xl"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h3 className="text-lg sm:text-xl font-bold text-zinc-800 mb-4">
                Location Details
              </h3>

              <div className="mb-6">
                <div className="flex items-start mb-3">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 mr-2 sm:mr-3 mt-1 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-sm sm:text-base text-zinc-900 font-medium">
                      Address:
                    </p>
                    <p className="text-xs sm:text-sm text-zinc-600">
                      {project.mapLocation.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start mb-3">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 mr-2 sm:mr-3 mt-1 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7m-7-7v14"
                    />
                  </svg>
                  <div>
                    <p className="text-sm sm:text-base text-zinc-900 font-medium">
                      Coordinates:
                    </p>
                    <p className="text-xs sm:text-sm text-zinc-600">
                      26°51'54.8"N 81°03'13.4"E
                    </p>
                  </div>
                </div>
              </div>

              {project.nearbyAttractions.length > 0 && (
                <>
                  <h4 className="text-base sm:text-lg font-medium text-zinc-800 mb-3">
                    Nearby Attractions:
                  </h4>
                  <ul className="text-xs sm:text-sm text-zinc-600 space-y-2">
                    {project.nearbyAttractions.map(
                      (attraction: string, index: number) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                          {attraction}
                        </li>
                      ),
                    )}
                  </ul>
                </>
              )}

              <button
                className="mt-6 sm:mt-8 w-full bg-[#fbe575] hover:bg-[#fbe575] text-black py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors"
                onClick={() =>
                  window.open(
                    "https://maps.app.goo.gl/Yh6mV5qXcTJjsCVg7",
                    "_blank",
                  )
                }
              >
                Get Directions
              </button>
            </motion.div>

            <motion.div
              className="w-full lg:w-2/3 h-[300px] sm:h-[400px] lg:h-[500px] bg-zinc-200 rounded-xl overflow-hidden shadow-lg relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="w-full h-full">
                <iframe
                  src={
                    project.mapUrl ||
                    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.210184298218!2d81.0513625748866!3d26.86506247667561!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be30073ba071b%3A0x8896bdcf3e070e32!2sAMOR!5e0!3m2!1sen!2sin!4v1767552270400!5m2!1sen!2sin"
                  }
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${project.title} Project Location`}
                ></iframe>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </Wrapper>

      {/* Gallery Modal */}
      <AnimatePresence>
        {galleryView && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setGalleryView(false)}
          >
            <button
              onClick={() => setGalleryView(false)}
              className="absolute top-4 right-4 text-white hover:text-amber-500 transition-colors z-10"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveGalleryImage((prev) =>
                  prev === 0 ? project.gallery.length - 1 : prev - 1,
                );
              }}
              className="absolute left-4 text-white hover:text-amber-500 transition-colors"
            >
              <ChevronLeft className="w-12 h-12" />
            </button>

            <div className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center">
              <Image
                src={project.gallery[activeGalleryImage]}
                alt={`Gallery ${activeGalleryImage + 1}`}
                fill
                className="object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveGalleryImage((prev) =>
                  prev === project.gallery.length - 1 ? 0 : prev + 1,
                );
              }}
              className="absolute right-4 text-white hover:text-amber-500 transition-colors"
            >
              <ChevronRight className="w-12 h-12" />
            </button>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
              {activeGalleryImage + 1} / {project.gallery.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
