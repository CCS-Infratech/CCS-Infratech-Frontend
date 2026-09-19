"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type LeadershipMember = {
  id: string;
  name: string;
  designation: string;
  imageUrl: string | null;
  experience: string | null;
  bio: string | null;
  isActive: boolean;
  sortOrder: number;
};

const fallbackPartners: LeadershipMember[] = [
  {
    id: "fallback-1",
    name: "Faisal Aslam",
    designation: "Partner",
    imageUrl: "/images/person.png",
    experience: "18+ Years",
    bio: null,
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "fallback-2",
    name: "Zeeshan Aslam",
    designation: "Partner",
    imageUrl: "/images/optimized/zeeshan.webp",
    experience: "15+ Years",
    bio: null,
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "fallback-3",
    name: "Suhail Aslam",
    designation: "Partner",
    imageUrl: "/images/person.png",
    experience: "12+ Years",
    bio: null,
    isActive: true,
    sortOrder: 3,
  },
  {
    id: "fallback-4",
    name: "Shoaib Akram",
    designation: "Partner",
    imageUrl: "/images/person.png",
    experience: "10+ Years",
    bio: null,
    isActive: true,
    sortOrder: 4,
  },
];

const BACKEND_URL =
  process.env.NEXT_PUBLIC_CCS_BACKEND_URL ||
  "https://api.ccsinfratech.com";

function normalizeImageUrl(imageUrl: string | null) {
  if (!imageUrl) {
    return "/images/person.png";
  }

  // Existing CCS images stored as paths such as /images/person.png
  if (imageUrl.startsWith("/")) {
    return imageUrl;
  }

  // Allow full public URLs if they are configured later.
  return imageUrl;
}

export default function TeamSection() {
  const [partners, setPartners] =
    useState<LeadershipMember[]>(fallbackPartners);

  useEffect(() => {
    let mounted = true;

    const loadLeadership = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/v1/leadership`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Leadership API returned ${response.status}`
          );
        }

        const result = await response.json();

        const members: LeadershipMember[] =
          Array.isArray(result?.data)
            ? result.data
            : [];

        if (!mounted) {
          return;
        }

        if (members.length > 0) {
          const activeMembers = members
            .filter((member) => member.isActive)
            .sort(
              (a, b) =>
                a.sortOrder - b.sortOrder
            );

          if (activeMembers.length > 0) {
            setPartners(activeMembers);
          }
        }
      } catch (error) {
        console.error(
          "Failed to load leadership members:",
          error
        );

        // Keep existing fallback members visible.
      }
    };

    loadLeadership();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="w-full mb-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-20 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-px bg-amber-600" />

              <p className="text-sm font-medium text-amber-600 tracking-widest uppercase">
                Our Partners
              </p>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 tracking-tight leading-tight">
              The People Behind
              <br />
              Every Structure
            </h2>
          </div>

          <p className="max-w-sm text-stone-600 leading-relaxed text-lg">
            With decades of combined experience, our partners bring vision,
            expertise, and unwavering commitment to every project.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {partners.map((partner, index) => (
            <div
              key={partner.id}
              className="group relative bg-white border border-stone-200 hover:border-stone-300 transition-all duration-500 hover:shadow-xl hover:shadow-stone-200/50"
            >
              {/* Corner Accents - Blueprint Style */}
              <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-px -translate-y-px" />

              <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-px translate-y-px" />

              {/* Image Container */}
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={normalizeImageUrl(partner.imageUrl)}
                  alt={partner.name}
                  fill
                  className="object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
                  priority={index < 4}
                  unoptimized={
                    Boolean(
                      partner.imageUrl &&
                      !partner.imageUrl.startsWith("/")
                    )
                  }
                />

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors duration-500" />
              </div>

              {/* Info Section */}
              <div className="p-5 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-stone-900 mb-0.5 group-hover:text-amber-700 transition-colors duration-300">
                      {partner.name}
                    </h3>

                    <p className="text-sm text-stone-500">
                      {partner.designation}
                    </p>
                  </div>

                  {/* Index Number */}
                  <span className="text-3xl font-bold text-stone-100 group-hover:text-amber-100 transition-colors duration-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
