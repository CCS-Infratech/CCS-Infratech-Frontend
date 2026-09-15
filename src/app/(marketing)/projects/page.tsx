"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Wrapper from "@/components/global/wrapper";
import Link from "next/link";
import { toast } from "sonner";
import { projectService } from "@/http/projects";
import ProjectPortfolio from "@/components/projects/project-portfolio";
import { PortfolioProject } from "@/components/projects/project-card";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await projectService.getPublishedProjects({
          page: 1,
          limit: 100,
        });

        if (response.success) {
          setProjects(response.data || []);
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("Failed to load projects");
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const featuredProject = projects.find((p) => p.featured) || projects[0];

  return (
    <div className="bg-black min-h-screen overflow-x-hidden">
      <motion.div
        ref={heroRef}
        className="relative rounded-b-[200px] h-screen w-full overflow-hidden flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <motion.div
          className="absolute inset-0 z-0"
          style={{ scale: heroScale, y: heroY }}
        >
          <Image
            src={
              typeof featuredProject?.images?.[0] === "string"
                ? featuredProject.images[0]
                : featuredProject?.images?.[0]?.url || "/images/4.avif"
            }
            alt="Projects Showcase"
            fill
            className="object-cover brightness-[0.4]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80 mix-blend-multiply" />
        </motion.div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-1 bg-amber-500/90 text-white rounded-full text-sm font-medium mb-6 backdrop-blur-sm shadow-lg shadow-amber-500/30">
              OUR PORTFOLIO
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl tracking-tighter font-thin text-white mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Exceptional <span className="text-amber-400">Projects</span>
            <div className="mt-6"> Built to Last</div>
          </motion.h1>
          <motion.p
            className="text-xl md:text-xl font-sans text-gray-300 max-w-3xl mx-auto mb-12 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            Browse our showcase of award-winning construction projects spanning
            residential, commercial, and industrial sectors.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
          >
            {featuredProject && (
              <Link
                href={`/projects/${featuredProject.slug || featuredProject.id}`}
              >
                <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-2xl transition-all duration-300 hover:shadow-amber-500/40 hover:scale-105 mr-4">
                  Explore {featuredProject.title}
                </button>
              </Link>
            )}
            <Link href="/contact-us">
              <button className="bg-transparent text-white border-2 border-white/80 px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 hover:bg-white/10 hover:border-white">
                Contact Us
              </button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <Wrapper className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-6xl font-bold text-white mb-6">
              Discover Our <span className="text-amber-500">Portfolio</span>
            </h2>
            <p className="text-gray-400 font-sans max-w-2xl mx-auto text-lg">
              Each project represents our commitment to excellence, innovation,
              and client satisfaction.
            </p>
          </div>

          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
          )}

          {!isLoading && <ProjectPortfolio projects={projects} />}
        </motion.div>
      </Wrapper>
    </div>
  );
}
