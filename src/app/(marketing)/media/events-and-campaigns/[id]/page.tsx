"use client";

import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Wrapper from "@/components/global/wrapper";
import { useQuery } from "@tanstack/react-query";
import { gallaryService } from "@/http/events";
import { useParams } from "next/navigation";

const EventPage = () => {
  const params = useParams();
  const galleryId = params?.id as string;

  const {
    data: galleryData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["published-gallery", galleryId],
    queryFn: () => gallaryService.getPublishedgallaryById(galleryId),
    enabled: !!galleryId,
    staleTime: 5 * 60 * 1000,
  });

  const gallery = galleryData?.data;

  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Memoized callbacks to prevent re-renders
  const openLightbox = useCallback((index: number) => {
    setCurrentImageIndex(index);
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentImageIndex((prevIndex) => {
      const length = gallery?.images?.length || 1;
      return prevIndex === 0 ? length - 1 : prevIndex - 1;
    });
  }, [gallery?.images?.length]);

  const goToNext = useCallback(() => {
    setCurrentImageIndex((prevIndex) => {
      const length = gallery?.images?.length || 1;
      return prevIndex === length - 1 ? 0 : prevIndex + 1;
    });
  }, [gallery?.images?.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeLightbox, goToPrevious, goToNext]);

  // Loading State
  if (isLoading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
          <p className="text-gray-500 text-lg">Loading gallery...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (isError || !gallery) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Gallery Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error instanceof Error
              ? error.message
              : "The gallery you're looking for doesn't exist or has been removed."}
          </p>
          <a
            href="/media/events-and-campaigns"
            className="inline-flex items-center gap-2 bg-[#fae475] hover:bg-[#f5d84a] text-black font-semibold px-6 py-3 rounded-full transition-colors duration-300"
          >
            Back to Events
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Wrapper className="bg-gray-50 py-20">
        <div className="max-w-7xl mt-8 mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {gallery.name}
            </h1>
            <div className="w-20 h-1 bg-amber-400 mx-auto mb-4"></div>
            {gallery.description && (
              <p className="text-gray-600 font-sans max-w-3xl mx-auto text-base">
                {gallery.description}
              </p>
            )}
          </motion.div>

          {gallery.images && gallery.images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {gallery.images.map((image: any, index: number) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.4,
                    delay: Math.min(index * 0.05, 0.3),
                  }}
                  className="cursor-pointer overflow-hidden rounded-xl shadow-md h-72 relative group"
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || image.caption || gallery.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    loading={index < 6 ? "eager" : "lazy"}
                    quality={75}
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-white text-lg font-medium">
                      View Image
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No images in this gallery yet.
              </p>
            </div>
          )}
        </div>
      </Wrapper>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isOpen && gallery.images && gallery.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 md:top-6 md:right-6 text-white p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors z-50"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <X size={24} />
            </button>

            {/* Navigation arrows */}
            {gallery.images.length > 1 && (
              <>
                <button
                  className="absolute left-2 md:left-4 text-white p-2 md:p-3 rounded-full bg-black/20 hover:bg-black/40 transition-colors z-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={30} />
                </button>

                <button
                  className="absolute right-2 md:right-4 text-white p-2 md:p-3 rounded-full bg-black/20 hover:bg-black/40 transition-colors z-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  aria-label="Next image"
                >
                  <ChevronRight size={30} />
                </button>
              </>
            )}

            {/* Image container */}
            <motion.div
              key={currentImageIndex}
              className="relative h-[80vh] w-full max-w-5xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={gallery.images[currentImageIndex].url}
                alt={
                  gallery.images[currentImageIndex].alt ||
                  gallery.images[currentImageIndex].caption ||
                  gallery.name
                }
                fill
                sizes="100vw"
                className="object-contain"
                quality={90}
                priority
              />

              {/* Caption */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent text-white p-4 text-center">
                <p className="text-lg font-medium">
                  {currentImageIndex + 1} / {gallery.images.length}
                </p>
                {gallery.images[currentImageIndex].caption && (
                  <p className="text-sm opacity-80 mt-1">
                    {gallery.images[currentImageIndex].caption}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventPage;
