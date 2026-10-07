"use client";

import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { ArrowUpRight, X, AlertCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import Wrapper from "@/components/global/wrapper";
import { usePublishedPress } from "@/hooks/usePress";

/* =========================================================
   IMAGE MODAL
========================================================= */

const ImageModal = ({
  isOpen,
  onClose,
  imageSrc,
  title,
}: {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  title: string;
}) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [imageSrc]);

  if (!isOpen) return null;

  const hasImage =
    typeof imageSrc === "string" &&
    imageSrc.trim().length > 0 &&
    !imageError;

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
            {hasImage ? (
              <img
                src={imageSrc}
                alt={title || "Press coverage"}
                className="absolute inset-0 h-full w-full object-contain bg-gray-50 dark:bg-zinc-800"
                onError={() => setImageError(true)}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-zinc-800">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/70 dark:bg-black/30">
                  <ArrowUpRight className="h-9 w-9 text-gray-400" />
                </div>

                <p className="px-8 text-center text-gray-500 dark:text-gray-400">
                  Image unavailable for this press coverage
                </p>
              </div>
            )}
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

/* =========================================================
   PRESS CARD IMAGE
========================================================= */

const PressCardImage = ({
  src,
  title,
  onClick,
}: {
  src?: string | null;
  title: string;
  onClick: () => void;
}) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [src]);

  const hasImage =
    typeof src === "string" &&
    src.trim().length > 0 &&
    !imageError;

  return (
    <div
      className={`relative w-full aspect-[4/3] overflow-hidden rounded-3xl mb-6 bg-gray-100 dark:bg-zinc-800 ${
        hasImage ? "cursor-pointer" : "cursor-default"
      }`}
      onClick={() => {
        if (hasImage) {
          onClick();
        }
      }}
    >
      {hasImage ? (
        <img
          src={src!}
          alt={title || "Press coverage"}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-zinc-800 dark:via-zinc-850 dark:to-zinc-900">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/70 dark:bg-black/30">
            <ArrowUpRight className="h-7 w-7 text-gray-500 dark:text-gray-400" />
          </div>

          <span className="px-6 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
            Press Coverage
          </span>
        </div>
      )}

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
    </div>
  );
};

/* =========================================================
   LOADING SKELETON
========================================================= */

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, idx) => (
      <div key={idx} className="animate-pulse">
        <div className="w-full aspect-[4/3] bg-gray-200 dark:bg-zinc-800 rounded-3xl mb-6" />

        <div className="flex items-center justify-between mb-4 gap-4">
          <div className="h-8 w-24 bg-gray-200 dark:bg-zinc-800 rounded-full" />
          <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded" />
        </div>

        <div className="h-8 w-3/4 bg-gray-200 dark:bg-zinc-800 rounded mb-2" />
        <div className="h-8 w-1/2 bg-gray-200 dark:bg-zinc-800 rounded" />
      </div>
    ))}
  </div>
);

/* =========================================================
   ERROR STATE
========================================================= */

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

    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
      {message}
    </p>

    <button
      onClick={onRetry}
      className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300"
    >
      Try Again
    </button>
  </div>
);

/* =========================================================
   EMPTY STATE
========================================================= */

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

/* =========================================================
   MAIN PAGE
========================================================= */

export default function EventsSection() {
  const heroRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  /* =======================================================
     MODAL STATE
  ======================================================= */

  const [modalOpen, setModalOpen] = useState(false);

  const [selectedImage, setSelectedImage] = useState({
    src: "",
    title: "",
  });

  /* =======================================================
     PAGINATION
  ======================================================= */

  const CARDS_PER_PAGE = 15;

  const [currentPage, setCurrentPage] = useState(1);

  /* =======================================================
     FETCH PRESS DATA
  ======================================================= */

  const { data, isLoading, isError, error, refetch } = usePublishedPress();

  /* =======================================================
     IMAGE HANDLERS
  ======================================================= */

  const handleImageClick = (image: string, title: string) => {
    if (!image) return;

    setSelectedImage({
      src: image,
      title,
    });

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  /* =======================================================
     FLATTEN PRESS CATEGORIES
  ======================================================= */

  const allPressItems = useMemo(() => {
    return (
      data?.data?.flatMap((category: any) =>
        (category?.items || []).map((item: any) => ({
          ...item,
          category: category.name,
        })),
      ) || []
    );
  }, [data]);

  /* =======================================================
     TOTAL PAGES
  ======================================================= */

  const totalPages = Math.ceil(
    allPressItems.length / CARDS_PER_PAGE,
  );

  /* =======================================================
     PAGINATED ITEMS
  ======================================================= */

  const paginatedPressItems = useMemo(() => {
    const startIndex =
      (currentPage - 1) * CARDS_PER_PAGE;

    const endIndex =
      startIndex + CARDS_PER_PAGE;

    return allPressItems.slice(startIndex, endIndex);
  }, [allPressItems, currentPage]);

  /* =======================================================
     KEEP CURRENT PAGE VALID
  ======================================================= */

  useEffect(() => {
    if (totalPages === 0) {
      if (currentPage !== 1) {
        setCurrentPage(1);
      }

      return;
    }

    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  /* =======================================================
     SCROLL TO CARDS WHEN PAGE CHANGES
  ======================================================= */

  useEffect(() => {
    if (currentPage > 1) {
      window.scrollTo({
        top: Math.max(0, window.scrollY - 350),
        behavior: "smooth",
      });
    }
  }, [currentPage]);

  /* =======================================================
     PAGE NUMBERS
  ======================================================= */

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1,
      );
    }

    const pages = new Set<number>();

    pages.add(1);
    pages.add(totalPages);

    for (
      let page = Math.max(2, currentPage - 1);
      page <= Math.min(totalPages - 1, currentPage + 1);
      page++
    ) {
      pages.add(page);
    }

    return Array.from(pages).sort((a, b) => a - b);
  }, [currentPage, totalPages]);

  /* =======================================================
     CURRENT RANGE
  ======================================================= */

  const firstVisibleItem =
    allPressItems.length === 0
      ? 0
      : (currentPage - 1) * CARDS_PER_PAGE + 1;

  const lastVisibleItem = Math.min(
    currentPage * CARDS_PER_PAGE,
    allPressItems.length,
  );

  return (
    <section className="w-full bg-white dark:bg-zinc-950">

      {/* ===================================================
          HERO SECTION
      =================================================== */}

      <motion.div
        ref={heroRef}
        className="relative h-[70vh] md:h-[100vh] rounded-b-[200px] w-full overflow-hidden flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            scale: heroScale,
            y: heroY,
          }}
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
            transition={{
              duration: 1,
              delay: 0.5,
            }}
          >
            Press{" "}
            <span className="text-amber-400">
              Coverage
            </span>
          </motion.h1>

          <motion.p
            className="text-gray-300 text-xs font-sans md:text-base max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.7,
            }}
          >
            Our commitment to excellence recognized by leading
            publications
          </motion.p>
        </div>
      </motion.div>

      {/* ===================================================
          PRESS COVERAGE SECTION
      =================================================== */}

      <Wrapper className="max-w-7xl mx-auto px-4 py-20 md:py-28">

        {/* SECTION HEADER */}

        <div className="flex items-end justify-between mb-12 md:mb-16">
          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
            }}
          >
            <h2 className="text-xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              Discover inspiration
              <br />
              and trends
            </h2>
          </motion.div>
        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {isLoading && <LoadingSkeleton />}

        {/* =================================================
            ERROR
        ================================================= */}

        {isError && (
          <ErrorState
            message={
              error?.message ||
              "Something went wrong"
            }
            onRetry={() => refetch()}
          />
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {!isLoading &&
          !isError &&
          allPressItems.length === 0 && (
            <EmptyState />
          )}

        {/* =================================================
            PRESS CONTENT
        ================================================= */}

        {!isLoading &&
          !isError &&
          allPressItems.length > 0 && (
            <>
              {/* ===========================================
                  CARD GRID
              =========================================== */}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {paginatedPressItems.map(
                  (item: any, idx: number) => (
                    <motion.div
                      key={item.id}
                      initial={{
                        opacity: 0,
                        y: 50,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                        margin: "-50px",
                      }}
                      transition={{
                        duration: 0.6,
                        delay: idx * 0.1,
                      }}
                      className="group"
                    >
                      <article className="h-full flex flex-col">

                        {/* =================================
                            IMAGE
                        ================================= */}

                        <PressCardImage
                          src={item.imageUrl}
                          title={
                            item.title ||
                            "Press coverage"
                          }
                          onClick={() =>
                            handleImageClick(
                              item.imageUrl,
                              item.title,
                            )
                          }
                        />

                        {/* =================================
                            CONTENT
                        ================================= */}

                        <div className="flex-grow">

                          {/* PUBLICATION + DATE */}

                          <div className="flex items-center justify-between gap-4 mb-4">

                            <span className="inline-block bg-[#e0d089] text-black text-sm font-semibold px-4 py-1.5 rounded-full max-w-[60%] truncate">
                              {item.publicationName ||
                                "Publication"}
                            </span>

                            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium text-right shrink-0">
                              {item.publicationDate
                                ? new Date(
                                    item.publicationDate,
                                  ).toLocaleDateString(
                                    "en-US",
                                    {
                                      weekday:
                                        "long",
                                      year: "numeric",
                                      month:
                                        "long",
                                      day: "numeric",
                                    },
                                  )
                                : "Date unavailable"}
                            </span>

                          </div>

                          {/* TITLE + READ */}

                          <div className="flex justify-between items-start gap-4">

                            <h3 className="text-2xl md:text-xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors duration-300 mb-4">
                              {item.title
                                ? item.title.length >
                                  100
                                  ? item.title.substring(
                                      0,
                                      100,
                                    ) + "..."
                                  : item.title
                                : "Press Coverage"}
                            </h3>

                            {/* READ ARTICLE */}

                            {item.url && (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) =>
                                  e.stopPropagation()
                                }
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
                  ),
                )}

              </div>

              {/* =================================================
                  PAGINATION
              ================================================= */}

              {totalPages > 1 && (
                <div className="mt-16 flex flex-col items-center gap-6">

                  {/* RANGE */}

                  <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Showing{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {firstVisibleItem}
                    </span>{" "}
                    –{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {lastVisibleItem}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {allPressItems.length}
                    </span>{" "}
                    press coverage items
                  </div>

                  {/* CONTROLS */}

                  <div className="flex flex-wrap items-center justify-center gap-2">

                    {/* PREVIOUS */}

                    <button
                      type="button"
                      onClick={() => {
                        setCurrentPage((page) =>
                          Math.max(1, page - 1),
                        );
                      }}
                      disabled={currentPage === 1}
                      className="rounded-full border border-gray-300 dark:border-zinc-700 px-5 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    >
                      Previous
                    </button>

                    {/* PAGE NUMBERS */}

                    <div className="flex items-center gap-1">

                      {pageNumbers.map(
                        (
                          page,
                          index,
                        ) => {
                          const previousPage =
                            pageNumbers[
                              index - 1
                            ];

                          const showEllipsis =
                            previousPage &&
                            page -
                              previousPage >
                              1;

                          return (
                            <div
                              key={page}
                              className="flex items-center"
                            >
                              {showEllipsis && (
                                <span className="px-2 text-gray-400">
                                  ...
                                </span>
                              )}

                              <button
                                type="button"
                                onClick={() =>
                                  setCurrentPage(
                                    page,
                                  )
                                }
                                aria-current={
                                  currentPage ===
                                  page
                                    ? "page"
                                    : undefined
                                }
                                className={`h-10 min-w-10 rounded-full px-3 text-sm font-semibold transition-all ${
                                  currentPage ===
                                  page
                                    ? "bg-[#e0d089] text-black"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                                }`}
                              >
                                {page}
                              </button>
                            </div>
                          );
                        },
                      )}

                    </div>

                    {/* NEXT */}

                    <button
                      type="button"
                      onClick={() => {
                        setCurrentPage((page) =>
                          Math.min(
                            totalPages,
                            page + 1,
                          ),
                        );
                      }}
                      disabled={
                        currentPage ===
                        totalPages
                      }
                      className="rounded-full border border-gray-300 dark:border-zinc-700 px-5 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    >
                      Next
                    </button>

                  </div>
                </div>
              )}
            </>
          )}
      </Wrapper>

      {/* ===================================================
          IMAGE MODAL
      =================================================== */}

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
