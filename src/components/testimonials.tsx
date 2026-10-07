"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import AnimationContainer from "./global/animation-container";
import Wrapper from "./global/wrapper";
import Marquee from "./ui/marquee";
import SectionBadge from "./ui/section-badge";
import { TESTIMONIALS as FALLBACK_TESTIMONIALS } from "@/constants";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiTestimonial {
  id: string;
  author: string;
  role: string;
  content: string;
  imageUrl: string | null;
  rating: number;
  isActive: boolean;
  sortOrder: number;
}

interface Testimonial {
  id: string;
  author: string;
  role: string;
  content: string;
  image: string;
  rating: number;
}

const fallbackTestimonials: Testimonial[] =
  FALLBACK_TESTIMONIALS.map((testimonial, index) => ({
    id: `fallback-${index}`,
    author: testimonial.author,
    role: testimonial.role,
    content: testimonial.content,
    image: testimonial.image,
    rating: testimonial.rating,
  }));

const Testimonials = () => {
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(fallbackTestimonials);

  useEffect(() => {
    let cancelled = false;

    const loadTestimonials = async () => {
      if (!BACKEND_URL) {
        console.error(
          "NEXT_PUBLIC_API_URL is not configured."
        );
        return;
      }

      try {
        const response = await fetch(
          `${BACKEND_URL}/api/v1/testimonials`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Testimonials API returned ${response.status}`
          );
        }

        const result: {
          success: boolean;
          data: ApiTestimonial[];
        } = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error(
            "Invalid testimonials API response"
          );
        }

        if (cancelled) {
          return;
        }

        setTestimonials(
          result.data.map((testimonial) => ({
            id: testimonial.id,
            author: testimonial.author,
            role: testimonial.role,
            content: testimonial.content,
            image:
              testimonial.imageUrl ||
              "/images/testimonials/nikita.jpg",
            rating: Math.min(
              5,
              Math.max(1, testimonial.rating)
            ),
          }))
        );
      } catch (error) {
        console.error(
          "Failed to load testimonials from API. Using fallback testimonials.",
          error
        );
      }
    };

    loadTestimonials();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Wrapper className="py-20 lg:py-32">
      <div className="flex flex-col items-center text-center gap-4 mb-16">
        <AnimationContainer animation="fadeUp" delay={0.2}>
          <SectionBadge title="Testimonials" />
        </AnimationContainer>

        <AnimationContainer animation="fadeUp" delay={0.3}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium !leading-tight text-transparent bg-clip-text bg-gradient-to-b from-foreground to-neutral-400">
            Loved by real estate
            <br />
            professionals
          </h2>
        </AnimationContainer>

        <AnimationContainer animation="fadeUp" delay={0.4}>
          <p className="text-sm md:text-base font-sans font-thin lg:text-md max-w-2xl mx-auto">
            See what our users have to say about their experience with our
            platform
          </p>
        </AnimationContainer>
      </div>

      <AnimationContainer animation="fadeUp" delay={0.5}>
        <div className="relative">
          <div className="absolute -left-1 top-0 w-20 h-full bg-gradient-to-r from-[#101010] to-transparent z-10" />
          <div className="absolute -right-1 top-0 w-20 h-full bg-gradient-to-l from-[#101010] to-transparent z-10" />

          <Marquee className="[--gap:1.5rem]" pauseOnHover>
            {testimonials.map((testimonial, index) => (
              <AnimationContainer
                key={testimonial.id}
                animation="fadeUp"
                delay={0.6 + index * 0.1}
              >
                <div className="flex-shrink-0 w-[400px] rounded-3xl bg-[#191919] backdrop-blur-3xl p-8">
                  <div className="flex flex-col gap-6">
                    <AnimationContainer
                      animation="fadeRight"
                      delay={0.7 + index * 0.1}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden">
                          <img
                            src={testimonial.image}
                            alt={testimonial.author}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>

                        <div>
                          <h4 className="font-medium">
                            {testimonial.author}
                          </h4>

                          <p className="text-sm text-muted-foreground">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </AnimationContainer>

                    <AnimationContainer
                      animation="fadeUp"
                      delay={0.8 + index * 0.1}
                    >
                      <p className="text-lg">
                        "{testimonial.content}"
                      </p>
                    </AnimationContainer>

                    <AnimationContainer
                      animation="fadeUp"
                      delay={0.9 + index * 0.1}
                    >
                      <div className="flex gap-1">
                        {[...Array(testimonial.rating)].map(
                          (_, i) => (
                            <Star
                              key={i}
                              className="w-5 h-5 fill-primary text-primary"
                            />
                          )
                        )}
                      </div>
                    </AnimationContainer>
                  </div>
                </div>
              </AnimationContainer>
            ))}
          </Marquee>
        </div>
      </AnimationContainer>
    </Wrapper>
  );
};

export default Testimonials;
