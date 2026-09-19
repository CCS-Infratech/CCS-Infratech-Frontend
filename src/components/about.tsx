"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import Link from "next/link";

const CountingNumber = ({ value, suffix }: any) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  useEffect(() => {
    if (isInView) {
      let startValue = 0;
      const duration = 2000;
      const startTime = Date.now();

      const updateValue = () => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const currentValue = Math.floor(progress * value);

        if (progress < 1) {
          setDisplayValue(currentValue);
          requestAnimationFrame(updateValue);
        } else {
          setDisplayValue(value);
        }
      };

      requestAnimationFrame(updateValue);
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {displayValue}
      {suffix}
    </span>
  );
};

const AboutSection = () => {
  const controls = useAnimation();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      className="w-full bg-black text-white overflow-hidden"
      ref={sectionRef}
    >
      <div className="flex flex-col lg:flex-row">
        {/* LEFT IMAGE - Full width without margin/padding */}
        <motion.div
          className="relative w-full lg:w-1/2 h-[50vh] lg:h-screen order-2 lg:order-1"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10 opacity-40"></motion.div>

          <Image
            src="/images/optimized/about.webp"
            alt="Elegant building architecture"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="object-cover object-center"
            quality={90}
          />

          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ y: 0 }}
            animate={{ y: isInView ? "100%" : 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          ></motion.div>
        </motion.div>

        {/* RIGHT CONTENT */}
        <motion.div
          className="w-full lg:w-1/2 order-1 lg:order-2 px-6 lg:px-16 py-12 flex flex-col justify-center"
          variants={container}
          initial="hidden"
          animate={controls}
        >
          <motion.div
            variants={item as any}
            className="inline-block pb-1 mb-3 border-b border-[#d5b86a]"
          >
            <span className="text-sm tracking-widest uppercase text-[#d5b86a]">
              About Us
            </span>
          </motion.div>

          <div className="ml-14 mt-8">
            <motion.h2
              variants={item as any}
              className="text-3xl mt-3 md:text-4xl lg:text-5xl leading-[1.1] tracking-tight mb-6"
            >
              <span className="block">A trusted Real</span>
              <span className="block mt-2 md:mt-3">Estate Developer</span>
              <span className="block mt-2 md:mt-3 text-[#d5b86a] italic">
                in Lucknow
              </span>
            </motion.h2>
            <motion.p
              variants={item as any}
              className="text-white/80 font-sans text-sm leading-relaxed max-w-lg"
            >
              With decades of experience in real estate development, we've
              established ourselves as Lucknow's premier property developer. Our
              commitment to quality construction, innovative design, and
              customer satisfaction has made us the preferred choice for
              discerning property investors.
            </motion.p>
            {/* BUTTON */}
            <Link href={`/about-us`}>
              <motion.button
                variants={item as any}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(213, 184, 106, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                className="mt-8 px-8 py-3 rounded-full bg-gradient-to-r from-[#e1d18a] to-[#bfa45d] text-black font-medium shadow-lg transition-all duration-300"
              >
                Explore More
              </motion.button>
            </Link>
          </div>

          {/* STATS ROW */}
          <motion.div
            variants={item as any}
            className="mt-12 grid font-sans grid-cols-3 max-w-md border-t border-white/10 pt-8"
          >
            <div className="stat-item group">
              <h3 className="text-3xl md:text-4xl font-semibold text-[#d5b86a]">
                <CountingNumber value={105} suffix="+" />
              </h3>
              <motion.p
                className="text-sm text-white/70 mt-1 relative overflow-hidden"
                whileHover={{ color: "rgba(255, 255, 255, 0.9)" }}
              >
                Total Villas
                <motion.span
                  className="absolute mt-3 bottom-0 left-0 h-[1px] bg-[#d5b86a]"
                  initial={{ width: 0 }}
                  whileInView={{ width: "60%" }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </motion.p>
            </div>

            <div className="stat-item group">
              <h3 className="text-3xl md:text-4xl font-semibold text-[#d5b86a]">
                <CountingNumber value={35} suffix="+" />
              </h3>
              <motion.p
                className="text-sm text-white/70 mt-1 relative overflow-hidden"
                whileHover={{ color: "rgba(255, 255, 255, 0.9)" }}
              >
                Amenities
                <motion.span
                  className="absolute mt-3 bottom-0 left-0 h-[1px] bg-[#d5b86a]"
                  initial={{ width: 0 }}
                  whileInView={{ width: "60%" }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
              </motion.p>
            </div>

            <div className="stat-item group">
              <h3 className="text-3xl md:text-4xl font-semibold text-[#d5b86a]">
                <CountingNumber value={5} suffix="+" />
              </h3>
              <motion.p
                className="text-sm text-white/70 mt-1 relative overflow-hidden"
                whileHover={{ color: "rgba(255, 255, 255, 0.9)" }}
              >
                Parks
                <motion.span
                  className="absolute mt-3 bottom-0 left-0 h-[1px] bg-[#d5b86a]"
                  initial={{ width: 0 }}
                  whileInView={{ width: "60%" }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                />
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
