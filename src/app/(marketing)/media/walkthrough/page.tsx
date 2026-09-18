"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Play, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import Wrapper from "@/components/global/wrapper";
import { WALKTHROUGHS } from "@/constants/walkthroughs";
import {
  walkthroughService,
  type Walkthrough,
} from "@/http/walkthrough";

function VideoDialog({
  walkthrough,
  onClose,
}: {
  walkthrough: Walkthrough | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!walkthrough) return;

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, walkthrough]);

  return (
    <AnimatePresence>
      {walkthrough && (
        <motion.div
          aria-modal="true"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-label={`${walkthrough.title} video`}
        >
          <motion.div
            className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-black shadow-2xl"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              aria-label="Close video"
              className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 text-white transition-colors hover:bg-black"
              onClick={onClose}
              type="button"
            >
              <X className="h-5 w-5" />
            </button>

            <video
              autoPlay
              className="aspect-video w-full"
              controls
              playsInline
              poster={walkthrough.thumbnail}
              src={walkthrough.videoUrl}
            >
              Your browser does not support video playback.
            </video>

            <div className="bg-zinc-950 px-5 py-4 text-white">
              <h2 className="text-xl font-bold">
                {walkthrough.title}
              </h2>

              <p className="mt-1 text-sm text-zinc-300">
                {walkthrough.description}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function WalkthroughPage() {
  const heroRef = useRef(null);

  const [walkthroughs, setWalkthroughs] =
    useState<Walkthrough[]>(WALKTHROUGHS);

  const [selectedWalkthrough, setSelectedWalkthrough] =
    useState<Walkthrough | null>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, 1.1]
  );

  const heroY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 100]
  );

  useEffect(() => {
    let mounted = true;

    const loadWalkthroughs = async () => {
      try {
        const data =
          await walkthroughService.getPublishedWalkthroughs();

        if (mounted && data.length > 0) {
          setWalkthroughs(data);
        }
      } catch (error) {
        console.error(
          "Failed to load walkthroughs from API:",
          error
        );
      }
    };

    loadWalkthroughs();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="min-h-screen w-full bg-zinc-950">
      <motion.div
        ref={heroRef}
        className="relative flex h-[70vh] w-full items-center justify-center overflow-hidden rounded-b-[200px] md:h-[100vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ scale: heroScale, y: heroY }}
        >
          <Image
            alt="CCS Infratech walkthroughs"
            className="object-cover brightness-[0.35]"
            fill
            priority
            src="/images/DayView2.png"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/80" />
        </motion.div>

        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <motion.h1
            className="text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Project{" "}
            <span className="text-amber-400">
              Walkthroughs
            </span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-4 max-w-2xl text-sm text-zinc-300 md:text-base"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            Experience our spaces, amenities, and communities
            from wherever you are.
          </motion.p>
        </div>
      </motion.div>

      <Wrapper className="mx-auto max-w-7xl px-4 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
            Watch and explore
          </p>

          <h2 className="text-4xl font-bold leading-tight text-white md:text-5xl">
            See CCS Infratech projects in motion
          </h2>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {walkthroughs.map((walkthrough, index) => (
            <motion.button
              className="group text-left"
              initial={{ opacity: 0, y: 40 }}
              key={walkthrough.id}
              onClick={() =>
                setSelectedWalkthrough(walkthrough)
              }
              transition={{
                duration: 0.55,
                delay: index * 0.1,
              }}
              type="button"
              viewport={{
                once: true,
                margin: "-50px",
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
            >
              <article className="h-full overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 transition-colors duration-300 group-hover:border-amber-400/70">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    alt={walkthrough.title}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    src={walkthrough.thumbnail}
                  />

                  <div className="absolute inset-0 bg-black/25 transition-colors duration-300 group-hover:bg-black/40" />

                  <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-amber-400 text-black shadow-xl transition-transform duration-300 group-hover:scale-110">
                    <Play className="ml-1 h-7 w-7 fill-current" />
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white transition-colors group-hover:text-amber-400">
                    {walkthrough.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    {walkthrough.description}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-amber-400">
                    Watch walkthrough{" "}
                    <Play className="h-4 w-4 fill-current" />
                  </span>
                </div>
              </article>
            </motion.button>
          ))}
        </div>
      </Wrapper>

      <VideoDialog
        walkthrough={selectedWalkthrough}
        onClose={() => setSelectedWalkthrough(null)}
      />
    </section>
  );
}
