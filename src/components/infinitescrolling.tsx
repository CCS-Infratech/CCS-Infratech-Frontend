"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

interface Project {
  id: string;
  title:
    | string
    | {
        type: "image";
        src: string;
        alt: string;
        width: number;
        height: number;
      };
  status: "COMPLETED" | "UNDER CONSTRUCTION"| "ONGOING";
  excerpt: string;
  location: string;
  image: string;
  slug: string;
  /** Set when the project lives on its own site instead of /projects/<slug>. */
  externalUrl?: string;
}

/** Where a project card points, and whether it should open in a new tab. */
function projectLink(project: Project) {
  return project.externalUrl
    ? { href: project.externalUrl, external: true as const }
    : { href: `/projects/${project.slug}`, external: false as const };
}

// Sample project data
const projects: Project[] = [
  {
    id: "1",
    title: {
      type: "image",
      src: "/logo/Amor.png",
      alt: "Amor",
      width: 300,
      height: 80,
    },
    status: "ONGOING",
    excerpt:
      "AMOR represents our ambition to redefine modern living. As Lucknow's first AI-powered villa community, this RERA-approved project features 105 luxurious villas that blend Roman-inspired architecture with cutting-edge smart home technology.",
    location: "Lucknow, UP",
    image: "/images/optimized/Clubhouse.webp",
    slug: "amor-reality",
    externalUrl: "https://www.ccsamorlucknow.com/",
  },
  {
    id: "2",
    title: "Cold Storage",
    status: "COMPLETED",
    excerpt:
      "Our journey from agricultural trade to cold storage reflects our ability to evolve while staying true to our core values of integrity, innovation, and excellence in preserving quality.",
    location: "Lucknow, UP",
    image: "/images/COLD-STORAGE.jpg",
    slug: "chisti-cold-storage",
  },
  {
    id: "3",
    title: "CCS Cricket Academy",
    status: "ONGOING",
    excerpt:
      "CCS Cricket Academy is dedicated to developing young and aspiring cricketers through professional training, structured coaching, fitness, discipline, and performance-focused programs.",
    location: "Lucknow, UP",
    image: "/images/optimized/ccs-academy-1.webp",
    slug: "ccs-cricket-academy",
    externalUrl: "https://www.ccsacademylucknow.com/",
  },
];

// Stacked Project Card Component
const StackedProjectCard = ({
  project,
  index,
  totalCards,
}: {
  project: Project;
  index: number;
  totalCards: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const link = projectLink(project);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "start start"],
  });

  const cardIndex = totalCards - index;
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, 1 - cardIndex * 0.05]
  );

  const y = useTransform(scrollYProgress, [0, 1], [0, -cardIndex * 20]);

  return (
    <motion.div
      ref={cardRef}
      style={{
        scale,
        y,
        position: "sticky",
        top: `${index * 40 + 80}px`,
        zIndex: totalCards - index,
      }}
      className="w-full h-[90vh] rounded-[48px] overflow-hidden"
    >
      <div className="relative w-full h-full">
        {/* Background Image - Full Card */}
        <Image
          src={project.image}
          alt={
            typeof project.title === "string"
              ? project.title
              : project.title.alt
          }
          fill
          className="object-cover"
          sizes="100vw"
          priority={index === 0}
        />

        {/* Floating White Content Card */}
        <div className="absolute top-[15%] right-[5%] md:right-[8%] w-[85%] sm:w-[500px] md:w-[580px] lg:w-[620px]">
          {/* Main white card */}
          <div className="bg-white rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] p-10 md:p-12 lg:p-14 relative">
            {/* Status Badge */}
            <div className="mb-7">
              <span className="inline-block px-7 py-2.5 bg-amber-500 text-white text-[11px] md:text-xs font-bold uppercase tracking-[0.15em] rounded-full">
                {project.status}
              </span>
            </div>

            {/* Title - Now supports text or image with controlled dimensions */}
            <div className="mb-8">
              <Link
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className={`${
                  typeof project.title === "string"
                    ? "hover:text-amber-600 transition-colors"
                    : ""
                }`}
              >
                {typeof project.title === "string" ? (
                  <h3 className="text-[32px] md:text-[40px] lg:text-[48px] font-bold text-zinc-800 leading-[1.15] tracking-tight">
                    {project.title}
                  </h3>
                ) : (
                  <div className="max-h-12 md:max-h-12 flex items-center">
                    <Image
                      src={project.title.src}
                      alt={project.title.alt}
                      width={project.title.width}
                      height={project.title.height}
                      className="h-auto w-auto max-h-full object-contain"
                      style={{ maxWidth: "100px" }}
                    />
                  </div>
                )}
              </Link>
            </div>

            {/* Excerpt */}
            <p className="text-zinc-600 font-sans leading-[1.7] mb-8 text-[15px] md:text-base font-normal">
              {project.excerpt}
            </p>

            {/* Location with icon */}
            <div className="flex items-center text-zinc-800">
              <svg
                className="w-5 h-5 mr-2.5 text-amber-500 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <Link
                href={`/projects?location=${project.location}`}
                className="text-base md:text-lg font-bold hover:text-amber-600 transition-colors"
              >
                {project.location}
              </Link>
            </div>

            {/* Arrow Button - Changed color to bg-[#e0d089] */}
            <div className="absolute -bottom-8 -right-8 md:-bottom-9 md:-right-9">
              <Link
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                aria-label={`Open ${
                  typeof project.title === "string"
                    ? project.title
                    : project.title.alt
                }`}
                className="flex items-center justify-center w-[72px] h-[72px] md:w-20 md:h-20 rounded-full bg-[#e0d089] text-zinc-800 hover:bg-[#d4c47d] shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-105 group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="52"
                  height="52"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="0.75"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-arrow-up-right-icon lucide-arrow-up-right"
                >
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Company Logos Scrolling Component
const CompanyLogosScroll = () => {
  const logos = ["Logo 1", "Logo 2", "Logo 3", "Logo 4", "Logo 5", "Logo 6"];

  return (
    <div className="relative w-full overflow-hidden py-16 bg-gray-50">
      <div className="flex animate-scroll-left-slow hover:pause-animation">
        {[...Array(3)].map((_, groupIndex) => (
          <div
            key={groupIndex}
            className="flex items-center gap-16 md:gap-24 px-8 md:px-16 flex-shrink-0"
          >
            {logos.map((logo, logoIndex) => (
              <div
                key={`${groupIndex}-${logoIndex}`}
                className="flex-shrink-0 w-24 h-16 md:w-32 md:h-20 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity duration-300"
              >
                <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                  {logo}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Component
const ProjectsShowcase = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);

  return (
    <section ref={sectionRef} className="w-full bg-gray-50 overflow-hidden">
      {/* Section Heading */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-10 md:mt-14 mb-16 md:mb-20"
        >
          <span className="inline-block px-4 py-2 bg-amber-500 text-white rounded-full text-xs font-bold uppercase tracking-wider mb-6">
            WHO WE ARE
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-800 mb-8 leading-tight">
            Building More Than Structures,
            <br />
            We're Creating <span className="text-amber-500">Lifestyles</span>
          </h2>
          <p className="text-zinc-600 font-sans max-w-3xl mx-auto leading-relaxed text-lg">
            Our journey from agricultural trade to cold storage to premium real
            estate development reflects our ability to evolve while staying true
            to our core values of integrity, innovation, and excellence.
          </p>
        </motion.div>
      </div>

      {/* Stacked Cards Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div
          className="relative"
          style={{ height: `calc(${projects.length * 90}vh + 160px)` }}
        >
          {projects.map((project, index) => (
            <StackedProjectCard
              key={project.id}
              project={project}
              index={index}
              totalCards={projects.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsShowcase;
