import React from "react";
import Link from "next/link";
import Image from "next/image";
import AnimationContainer from "./global/animation-container";
import { Button } from "./ui/button";

const Hero = React.memo(function Hero() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/ccs-home-hero.mp4"
        poster="/hero-poster.jpg"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at top right, transparent, rgba(0, 0, 0, 0.6) 90%)",
        }}
        aria-hidden="true"
      />

      {/* Content Container */}
      <div className="relative z-10 flex h-full w-full flex-col justify-center px-6 md:px-16 lg:px-24">
        <div className="flex flex-col items-start gap-6">
          <AnimationContainer animation="fadeUp" delay={0.4}>
            <p className="text-4xl tracking-tighter md:text-5xl lg:text-8xl font-thin text-[#e1d18a] -mb-5">
              Building Dreams
            </p>
          </AnimationContainer>

          <AnimationContainer animation="fadeUp" delay={0.5}>
            <p className="text-4xl tracking-tighter md:text-5xl lg:text-8xl font-thin text-white mt-2">
              By Crafting Homes
            </p>
          </AnimationContainer>

          <AnimationContainer animation="fadeUp" delay={0.6}>
            <p className="text-base md:text-lg lg:text-lg font-light font-sans text-white/80 max-w-2xl">
              A grand way of life brought to you by CCS Infratech.
            </p>
          </AnimationContainer>

          <AnimationContainer animation="fadeUp" delay={0.8}>
            <div className="mt-4">
              <Link href="/projects/amor">
                <Button
                  size="lg"
                  className="rounded-full bg-[#e1d18a] px-6 py-2.5 text-base font-semibold text-black shadow-lg hover:bg-[#d4c27c] transition"
                >
                  Explore now
                </Button>
              </Link>
            </div>
          </AnimationContainer>
        </div>
      </div>
    </div>
  );
});

export default Hero;
