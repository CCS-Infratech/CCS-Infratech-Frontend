"use client";

import { ReactNode } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, MapPin, Navigation } from "lucide-react";
import SectionHeading from "./section-heading";

/* ---------------------------------------------------------------- facts */

export interface QuickFact {
  label: string;
  value: string;
  icon?: ReactNode;
}

export function QuickFacts({ facts }: { facts: QuickFact[] }) {
  if (facts.length === 0) return null;

  return (
    <motion.dl
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
    >
      {facts.map((fact) => (
        <div
          key={fact.label}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6"
        >
          <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
            {fact.icon}
            {fact.label}
          </dt>

          <dd className="mt-2 text-lg font-bold text-zinc-50 sm:text-xl">
            {fact.value}
          </dd>
        </div>
      ))}
    </motion.dl>
  );
}

/* -------------------------------------------------------- specifications */

export interface ProjectSpec {
  title: string;
  description: string;
  image: string;
}

export function SpecificationsSection({
  specs,
}: {
  specs: ProjectSpec[];
}) {
  if (specs.length === 0) return null;

  return (
    <section
      id="specifications"
      className="scroll-mt-36 py-20 md:py-28"
    >
      <SectionHeading
        eyebrow="Building details"
        title={
          <>
            Specifications &amp;{" "}
            <span className="text-amber-400">
              features
            </span>
          </>
        }
        description="What goes into the build — materials, systems and finishes, spelled out."
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {specs.map((spec, index) => (
          <motion.article
            key={`${spec.title}-${index}`}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.5,
              delay: Math.min(index, 5) * 0.07,
            }}
            className="group flex flex-col overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 transition-colors duration-300 hover:border-amber-400/40"
          >
            {spec.image && (
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900">
                <Image
                  src={spec.image}
                  alt={spec.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
            )}

            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-xl font-bold text-zinc-50">
                {spec.title}
              </h3>

              {spec.description && (
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  {spec.description}
                </p>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- amenities */

export interface ProjectAmenity {
  title: string;
  icon: string;
}

export function AmenitiesSection({
  amenities,
  projectTitle,
}: {
  amenities: ProjectAmenity[];
  projectTitle: string;
}) {
  if (amenities.length === 0) return null;

  return (
    <section
      id="amenities"
      className="scroll-mt-36 py-20 md:py-28"
    >
      <SectionHeading
        align="center"
        eyebrow="Lifestyle"
        title={
          <>
            Amenities at{" "}
            <span className="text-amber-400">
              {projectTitle}
            </span>
          </>
        }
        description={`${amenities.length} shared facilities designed around how residents actually use the place.`}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
        {amenities.map((amenity, index) => (
          <motion.div
            key={`${amenity.title}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.45,
              delay: Math.min(index, 8) * 0.04,
            }}
            className="flex flex-col items-center rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/40 sm:p-7"
          >
            <div className="relative mb-4 h-12 w-12 sm:h-16 sm:w-16">
              <Image
                src={amenity.icon || "/icons/kitchen.png"}
                alt=""
                fill
                sizes="64px"
                className="object-contain"
              />
            </div>

            <p className="text-sm font-medium text-zinc-200 sm:text-base">
              {amenity.title}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- location */

export function LocationSection({
  projectTitle,
  location,
  address,
  mapUrl,
  nearbyAttractions,
}: {
  projectTitle: string;
  location?: string;
  address: string;
  mapUrl?: string;
  nearbyAttractions: string[];
}) {
  const query =
    address ||
    `${projectTitle} ${location || ""}`.trim();

  // Google only allows *embed* URLs to be framed. Anything else — a
  // maps.app.goo.gl share link, a /maps/place link — is served with
  // X-Frame-Options and the iframe shows "refused to connect", so we keep it
  // as the directions target and frame a search embed of the address instead.
  const isEmbeddable =
    !!mapUrl &&
    (mapUrl.includes("/maps/embed") ||
      mapUrl.includes("output=embed"));

  const embedSrc = isEmbeddable
    ? mapUrl
    : query
      ? `https://www.google.com/maps?q=${encodeURIComponent(
          query
        )}&output=embed`
      : undefined;

  const directionsUrl =
    mapUrl && !isEmbeddable
      ? mapUrl
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          query
        )}`;

  return (
    <section
      id="location"
      className="scroll-mt-36 py-20 md:py-28"
    >
      <SectionHeading
        eyebrow="Getting there"
        title={
          <>
            Where you&apos;ll{" "}
            <span className="text-amber-400">
              find it
            </span>
          </>
        }
        description={
          location
            ? `${projectTitle} sits in ${location}, within easy reach of the places residents use every week.`
            : undefined
        }
      />

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8"
        >
          <h3 className="text-lg font-bold text-zinc-50">
            Location details
          </h3>

          <div className="mt-5 flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />

            <div>
              <p className="text-sm font-medium text-zinc-200">
                Address
              </p>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-sm leading-relaxed text-zinc-400 transition-colors hover:text-amber-400"
              >
                {address}
              </a>
            </div>
          </div>

          {nearbyAttractions.length > 0 && (
            <div className="mt-7 border-t border-zinc-800 pt-6">
              <h4 className="text-sm font-semibold text-zinc-200">
                Nearby
              </h4>

              <ul className="mt-3 space-y-2.5">
                {nearbyAttractions.map(
                  (attraction, index) => (
                    <li
                      key={`${attraction}-${index}`}
                      className="flex items-start gap-2.5 text-sm text-zinc-400"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />

                      {attraction}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#fbe575] px-6 py-3.5 text-sm font-bold text-black transition-transform duration-300 hover:scale-[1.02]"
          >
            <Navigation className="h-4 w-4" />
            Get directions
            <ExternalLink className="h-3.5 w-3.5 opacity-60" />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="relative h-[340px] overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 lg:col-span-2 lg:h-auto lg:min-h-[420px]"
        >
          {embedSrc ? (
            <iframe
              src={embedSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map showing ${projectTitle}`}
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
              <MapPin className="h-10 w-10 text-amber-400/70" />

              <p className="text-sm text-zinc-400">
                An interactive map isn&apos;t available for
                this project yet.
              </p>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300"
              >
                Open in Google Maps
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
