"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Calendar, MapPin, ArrowUpRight, Loader2 } from "lucide-react";
import { useRef } from "react";
import Wrapper from "@/components/global/wrapper";
import { useQuery } from "@tanstack/react-query";
import { gallaryService } from "@/http/events";

export default function EventsSection() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const {
    data: galleriesData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["published-galleries"],
    queryFn: () => gallaryService.getPublishedgallary(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const galleries = galleriesData?.data || [];

  return (
    <section className="w-full bg-black">
      {/* Hero Section */}
      <motion.div
        ref={heroRef}
        className="relative h-[70vh] md:h-[100vh] rounded-b-[200px] w-full overflow-hidden flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <motion.div
          className="absolute inset-0 z-0"
          style={{ scale: heroScale, y: heroY }}
        >
          <Image
            src="/images/optimized/DayView2.webp"
            alt="Events and Campaigns"
            fill
            className="object-cover brightness-[0.3]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
        </motion.div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-zinc-50 mb-4 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Events & <span className="text-amber-400">Campaigns</span>
          </motion.h1>

          <motion.p
            className="text-zinc-300 font-sans text-lg md:text-base max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            Creating memorable experiences that bring communities together
          </motion.p>
        </div>
      </motion.div>

      {/* Gallery Section */}
      <Wrapper className="max-w-7xl mx-auto px-4 py-20 md:py-28">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl md:text-4xl lg:text-5xl font-bold text-zinc-50 leading-tight">
              Discover inspiration
              <br />
              and trends
            </h2>
          </motion.div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 md:py-32">
            <Loader2 className="w-12 h-12 text-amber-400 animate-spin mb-4" />
            <p className="text-zinc-400 text-lg">Loading galleries...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center py-20 md:py-32"
          >
            <div className="relative w-48 h-48 md:w-64 md:h-64 mb-8">
              <div className="absolute inset-0 bg-red-900/40 rounded-full opacity-40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Calendar
                  className="w-20 h-20 md:w-24 md:h-24 text-red-400/60"
                  strokeWidth={1.5}
                />
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-zinc-50 mb-3 text-center">
              Failed to Load Galleries
            </h3>
            <p className="text-zinc-400 text-base md:text-lg text-center max-w-md mb-8">
              {error instanceof Error ? error.message : "Something went wrong"}
            </p>
          </motion.div>
        )}

        {/* Galleries Grid or Empty State */}
        {!isLoading && !isError && (
          <>
            {galleries.length > 0 ? (
              <div
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${
                  galleries.length === 1 ? "md:max-w-xl lg:max-w-xl mx-auto" : ""
                }`}
              >
                {galleries.map((gallery: any, idx: number) => {
                  const thumbnailImage = gallery.images?.[0];

                  return (
                    <motion.a
                      key={gallery.id}
                      href={`/media/events-and-campaigns/${gallery.id}`}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                      className="group block"
                    >
                      <article className="h-full flex flex-col">
                        {/* Image Container */}
                        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-3xl mb-6 bg-zinc-900 border border-zinc-800">
                          {thumbnailImage ? (
                            <Image
                              src={thumbnailImage.url}
                              alt={
                                thumbnailImage.alt ||
                                gallery.name ||
                                "Gallery image"
                              }
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                              <Calendar className="w-16 h-16 text-zinc-600" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-grow">
                          {/* Category and Date */}
                          <div className="flex items-center justify-between mb-4">
                            <span className="inline-block bg-[#e0d089] text-black px-4 py-1.5 rounded-full text-sm font-semibold">
                              Gallery
                            </span>
                            <span className="text-zinc-400 text-sm font-medium">
                              {new Date(gallery.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-2xl md:text-3xl font-bold text-zinc-50 leading-tight group-hover:text-amber-400 transition-colors duration-300">
                            {gallery.name}
                          </h3>

                          {/* Description (optional) */}
                          {gallery.description && (
                            <p className="text-zinc-400 mt-3 line-clamp-2">
                              {gallery.description}
                            </p>
                          )}
                        </div>
                      </article>
                    </motion.a>
                  );
                })}
              </div>
            ) : (
              // Empty State
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center justify-center py-20 md:py-32"
              >
                <div className="relative w-48 h-48 md:w-64 md:h-64 mb-8">
                  <div className="absolute inset-0 bg-amber-500/20 rounded-full opacity-40 animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Calendar
                      className="w-20 h-20 md:w-24 md:h-24 text-amber-400/70"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-zinc-50 mb-3 text-center">
                  No Events Yet
                </h3>

                <p className="text-zinc-400 text-base md:text-lg text-center max-w-md mb-8">
                  We're working on exciting events and campaigns. Check back
                  soon for updates!
                </p>

                <motion.a
                  href="/"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 bg-[#fae475] hover:bg-[#f7dd5e] text-black font-semibold px-6 py-3 rounded-full transition-colors duration-300"
                >
                  <span>Back to Home</span>
                  <ArrowUpRight className="w-5 h-5" />
                </motion.a>
              </motion.div>
            )}
          </>
        )}
      </Wrapper>
    </section>
  );
}
