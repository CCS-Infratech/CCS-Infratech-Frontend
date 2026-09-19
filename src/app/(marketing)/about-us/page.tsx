"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Wrapper from "@/components/global/wrapper";
import ProjectsShowcase from "@/components/infinitescrolling";
import TeamExperts from "@/components/teamexpert";
import ScheduleVisitModal from "@/components/schedulevisit-dialog";

export default function AboutUs() {
  const [activeTab, setActiveTab] = useState("residential");
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  const handleBrochureDownload = () => {
    const link = document.createElement("a");
    link.href = "/brochures/brochure.pdf";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.download = "Amor-Villa-Brochure.pdf";
    link.click();
  };

  return (
    <div className="bg-gradient-to-br from-zinc-50 to-stone-100 min-h-screen overflow-hidden">
      <motion.div
        ref={heroRef}
        className="relative rounded-b-[80px] sm:rounded-b-[120px] lg:rounded-b-[200px] h-[85vh] sm:h-[90vh] lg:h-screen w-full overflow-hidden flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <motion.div
          className="absolute inset-0 z-0"
          style={{ scale: heroScale, y: heroY }}
        >
          <Image
            src="/images/optimized/3.webp"
            alt="Construction Site"
            fill
            className="object-cover brightness-[0.5]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 mix-blend-multiply" />
        </motion.div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-4 sm:mb-6"
          >
            <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-amber-500/90 text-white rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm">
              QUALITY CONSTRUCTION SINCE 1965
            </span>
          </motion.div>
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tighter font-thin text-white mb-4 sm:mb-6 lg:mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Building <span className="text-amber-400">Legacies</span>
            <div className="mt-3 sm:mt-4 lg:mt-6">Not Just Spaces</div>
          </motion.h1>
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl font-sans text-gray-100 max-w-2xl mx-auto mb-6 sm:mb-8 lg:mb-12 font-light px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            From humble beginnings in trade to crafting premium AI-powered
            communities, our six-decade journey reflects our commitment to
            excellence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
          >
            <Link href={`/projects/amor-reality`}>
              <button className="w-full sm:w-auto bg-white hover:bg-amber-50 text-black px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm font-bold shadow-2xl transition-all duration-300 hover:shadow-amber-500/20 hover:scale-105">
                Explore AMOR Project
              </button>
            </Link>
            <Link href={`/contact-us`}>
              <button className="w-full sm:w-auto bg-transparent text-white border-2 border-white/80 px-5 py-2.5 sm:py-2 rounded-full text-sm font-bold transition-all duration-300 hover:bg-white/10">
                Contact Us
              </button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* About Us Content - Modernized */}
      <Wrapper className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-10 lg:pb-12">
        {/* Decorative elements */}
        <div className="absolute top-10 sm:top-20 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-amber-400/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-20 sm:bottom-40 left-0 w-56 h-56 sm:w-80 sm:h-80 bg-zinc-800/10 rounded-full blur-3xl -z-10" />

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center mb-12 sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="order-2 lg:order-1">
            <span className="inline-block px-3 py-1 bg-black text-amber-400 rounded-full text-xs font-semibold mb-4 sm:mb-6">
              OUR LEGACY
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-800 mb-4 sm:mb-6 lg:mb-8 leading-tight">
              A Journey Spanning <br />
              <span className="text-amber-500">Six Decades</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-zinc-600 font-sans mb-6 sm:mb-8 leading-relaxed">
              The story of CCS Infratech is deeply rooted in humble
              beginnings—tracing back to 1965 when two visionaries, Haji
              Mohammad Ishaq and Haji Mohammad Ali, began with trading potatoes.
              What started with agricultural trade evolved into HMMI's cold
              storage facilities in 1972, and has now transformed into premium
              real estate development.
            </p>
            <div className="flex flex-wrap gap-6 sm:gap-8 items-center justify-center lg:justify-start">
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-amber-500 mb-1">
                  105+
                </p>
                <p className="text-xs sm:text-sm text-zinc-500">
                  Premium Villas
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-amber-500 mb-1">
                  60+
                </p>
                <p className="text-xs sm:text-sm text-zinc-500">
                  Years of Legacy
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-amber-500 mb-1">
                  35+
                </p>
                <p className="text-xs sm:text-sm text-zinc-500">
                  Premium Amenities
                </p>
              </div>
            </div>
          </div>
          <div className="relative order-1 lg:order-2">
            <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/optimized/aerial.webp"
                alt="Our Legacy"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>

            <div className="absolute -top-6 -right-6 sm:-top-10 sm:-right-10 p-4 sm:p-6 backdrop-blur-xl bg-white/80 rounded-2xl shadow-xl border border-gray-200">
              <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center overflow-hidden relative">
               <Image
  src="/logo/amor-logo64.png"
  alt="AMOR Logo"
  width={120}
  height={120}
  className="w-full h-full object-contain"
  priority
/>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-zinc-700 text-center">
                Flagship Project
              </p>
            </div>
          </div>
        </motion.div>

        <ProjectsShowcase />

        <TeamExperts />

        {/* CTA - More striking */}
        <motion.div
          className="bg-zinc-900 mt-8 sm:mt-11 rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 text-center text-white relative overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-amber-500/20 rounded-full blur-3xl -z-0" />
          <div className="absolute bottom-0 left-0 w-56 h-56 sm:w-80 sm:h-80 bg-amber-700/10 rounded-full blur-3xl -z-0" />

          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span className="inline-block px-3 sm:px-4 py-1 bg-[#e0d089] text-black rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 backdrop-blur-sm">
              EXPERIENCE AMOR
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 lg:mb-8 leading-tight px-4">
              Ready to Live in Lucknow's First{" "}
              <br className="hidden sm:block" />
              <span className="text-[#e0d089] inline-block mt-2 sm:mt-4 lg:mt-6">
                AI-Powered Villa Community?
              </span>
            </h2>
            <p className="text-sm sm:text-base font-sans mb-6 sm:mb-8 lg:mb-10 max-w-2xl mx-auto text-gray-300 px-4">
              Join the exclusive community at AMOR, where Roman-inspired
              architecture meets cutting-edge AI technology. Experience 35+
              premium amenities in a fully secured, LDA and RERA-approved
              development.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center px-4">
              <motion.button
                onClick={() => setIsVisitModalOpen(true)}
                className="w-full sm:w-auto bg-[#e0d089] text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold shadow-xl transition-all duration-300 hover:shadow-amber-500/30 hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Book a Site Visit
              </motion.button>
              <motion.button
                className="w-full sm:w-auto bg-transparent text-white border-2 border-white/30 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold transition-all duration-300 hover:bg-white/10 hover:border-white/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBrochureDownload}
              >
                Download Brochure
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </Wrapper>

      {/* Schedule Visit Modal */}
      <ScheduleVisitModal
        open={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
      />
    </div>
  );
}
