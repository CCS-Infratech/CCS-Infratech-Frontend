"use client";

import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { ArrowUpRight, X, Loader2, AlertCircle } from "lucide-react";
import { useRef, useState } from "react";
import Wrapper from "@/components/global/wrapper";
import { usePublishedPress } from "@/hooks/usePress";

const ImageModal = ({ isOpen, onClose, imageSrc, title }: any) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div className="relative max-w-5xl h-auto w-full">
        <button
          className="absolute -top-12 right-0 z-10 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-2xl"
        >
          <div className="relative w-full aspect-[16/10]">
            <Image
              src={imageSrc}
              alt={title || "Press coverage"}
              fill
              className="object-contain bg-gray-50 dark:bg-zinc-800"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          {title && (
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 py-4 px-6">
              <h3 className="text-xl font-semibold text-white">{title}</h3>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3].map((idx) => (
      <div key={idx} className="animate-pulse">
        <div className="w-full aspect-[4/3] bg-gray-200 dark:bg-zinc-800 rounded-3xl mb-6" />
        <div className="flex items-center justify-between mb-4">
          <div className="h-8 w-24 bg-gray-200 dark:bg-zinc-800 rounded-full" />
          <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded" />
        </div>
        <div className="h-8 w-3/4 bg-gray-200 dark:bg-zinc-800 rounded mb-2" />
        <div className="h-8 w-1/2 bg-gray-200 dark:bg-zinc-800 rounded" />
      </div>
    ))}
  </div>
);

// Error Component
const ErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
      Failed to Load Press Coverage
    </h3>
    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">{message}</p>
    <button
      onClick={onRetry}
      className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300"
    >
      Try Again
    </button>
  </div>
);

// Empty State Component
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-24 h-24 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
      <ArrowUpRight className="w-12 h-12 text-gray-400" />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
      No Press Coverage Yet
    </h3>
    <p className="text-gray-600 dark:text-gray-400">
      Check back soon for our latest press releases and media coverage.
    </p>
  </div>
);

export default function EventsSection() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({
    src: "",
    title: "",
  });

  // Fetch published press using TanStack Query
  const { data, isLoading, isError, error, refetch } = usePublishedPress();

  const handleImageClick = (image: string, title: string) => {
    setSelectedImage({ src: image, title });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const allPressItems =
    data?.data?.flatMap((category: any) =>
      category.items.map((item: any) => ({
        ...item,
        category: category.name,
      })),
    ) || [];

  return (
    <section className="w-full bg-white dark:bg-zinc-950">
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
            src="/images/optimized/EntryGate.webp"
            alt="Press Coverage"
            fill
            className="object-cover brightness-[0.35]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </motion.div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Press <span className="text-amber-400">Coverage</span>
          </motion.h1>

          <motion.p
            className="text-gray-300 text-xs font-sans md:text-base max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            Our commitment to excellence recognized by leading publications
          </motion.p>
        </div>
      </motion.div>

      {/* Press Coverage Section */}
      <Wrapper className="max-w-7xl mx-auto px-4 py-20 md:py-28">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              Discover inspiration
              <br />
              and trends
            </h2>
          </motion.div>
        </div>

        {/* Conditional Rendering */}
        {isLoading && <LoadingSkeleton />}

        {isError && (
          <ErrorState
            message={error?.message || "Something went wrong"}
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !isError && allPressItems.length === 0 && <EmptyState />}

        {!isLoading && !isError && allPressItems.length > 0 && (
          <>
            {/* Press Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allPressItems.map((item: any, idx: any) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="group"
                >
                  <article className="h-full flex flex-col">
                    {/* Image Container */}
                    <div
                      className="relative w-full aspect-[4/3] overflow-hidden rounded-3xl mb-6 bg-gray-100 dark:bg-zinc-800 cursor-pointer"
                      onClick={() =>
                        handleImageClick(item.imageUrl, item.title)
                      }
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      {/* Category and Date */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="inline-block bg-[#e0d089] text-black text-sm font-semibold px-4 py-1.5 rounded-full">
                          {item.publicationName}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                          {new Date(item.publicationDate).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>

                      {/* Title */}
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-2xl md:text-xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors duration-300 mb-4">
                          {item.title.length > 100
                            ? item.title.substring(0, 100) + "..."
                            : item.title}
                        </h3>

                        {/* Read Article Link */}
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex mb-3 items-center gap-2 text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400 font-semibold transition-colors duration-300 group/link shrink-0"
                          >
                            <span>Read</span>
                            <ArrowUpRight className="w-5 h-5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-300" />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </Wrapper>

      {/* Image Modal */}
      <AnimatePresence>
        {modalOpen && (
          <ImageModal
            isOpen={modalOpen}
            onClose={closeModal}
            imageSrc={selectedImage.src}
            title={selectedImage.title}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
