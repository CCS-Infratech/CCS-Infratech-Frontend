"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  LinkedinIcon,
  MapPin,
} from "lucide-react";
import { useEffect, useState } from "react";
import ClubTowersModal from "./quote-dialog";
import AnimationContainer from "./global/animation-container";
import {
  getPublicSiteSettings,
  PublicSiteSettings,
} from "@/lib/site-settings";

const Footer = () => {
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] =
    useState(false);

  const [siteSettings, setSiteSettings] =
    useState<PublicSiteSettings | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      const data = await getPublicSiteSettings();
      setSiteSettings(data);
    };

    loadSettings();
  }, []);

  const phone =
    siteSettings?.phone ||
    "+(91) 70818-85577";

  const email =
    siteSettings?.email ||
    "info@ccsinfratech.com";

  const registeredOffice =
    siteSettings?.registeredOffice ||
    "451, Third Lane, Near Netaji Park, Nishatganj, New Hyderabad, Lucknow - 226007";

  const corporateOffice =
    siteSettings?.corporateOffice ||
    "AMOR, Sarai Shekh Farm, Near SBI Bank and Nayara Petrol Pump, Satrikhroad, Chinhat, Lucknow - 227105";

  const registeredOfficeMapHref =
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      registeredOffice
    )}`;

  const corporateOfficeMapHref =
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      corporateOffice
    )}`;

  const companyDescription =
    siteSettings?.companyDescription ||
    "We are creators of transformative spaces that inspire, innovate, and endure.";

  const footerText =
    siteSettings?.footerText ||
    "© 2025 ccsinfratech. All Rights Reserved";

  const phoneHref = `tel:${phone.replace(/[^\d+]/g, "")}`;

  const navigationLinks = {
    column1: [
      {
        label: "Home",
        href: "/",
      },
      {
        label: "About Us",
        href: "/about-us",
      },
      {
        label: "Projects",
        href: "/projects",
      },
    ],

    column2: [
      {
        label: "Blogs",
        href: "/blogs",
      },
      {
        label: "Press & Coverage",
        href: "/media/press-coverage",
      },
      {
        label: "Event & Campaigns",
        href: "/media/events-and-campaigns",
      },
    ],
  };

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: siteSettings?.facebookUrl,
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: siteSettings?.instagramUrl,
    },
    {
      name: "Youtube",
      icon: Youtube,
      href: siteSettings?.youtubeUrl,
    },
    {
      name: "Linkedin",
      icon: LinkedinIcon,
      href: siteSettings?.linkedinUrl,
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: siteSettings?.twitterUrl,
    },
  ].filter(
    (
      social
    ): social is {
      name: string;
      icon: typeof Facebook;
      href: string;
    } => Boolean(social.href)
  );

  return (
    <>
      <footer className="relative w-full -mt-12 w">
        {/* Background Image Container - Full Height */}
        <div className="absolute inset-0 z-0 h-full">
          <Image
            src="/images/Clubhouse.jpg"
            alt="Buildings background"
            fill
            className="object-cover"
            priority
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/65" />
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10">
          {/* Hero Section */}
          <div className="relative min-h-[420px] md:min-h-[500px] w-full py-16 md:py-24">
            <div className="h-full flex flex-col items-center justify-center px-4">

              {/* Main Heading */}
              <div className="text-center mb-10">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                  Your dream
                  <br />
                  home awaits
                </h1>

                <p className="text-white/90 text-base md:text-lg lg:text-xl max-w-2xl mx-auto">
                  Whether you're exploring our homes or envisioning something
                  <br className="hidden md:block" />
                  custom, we're here to bring your dream to life.
                </p>
              </div>

              {/* CTA Button */}
              <div className="flex justify-center w-full">
                <button
                  onClick={() =>
                    setIsQuoteDialogOpen(true)
                  }
                  className="bg-[#e1d18a] text-black font-bold rounded-full w-36 h-36 sm:w-40 sm:h-40 lg:w-40 lg:h-40 flex flex-col items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <span className="text-base sm:text-lg md:text-xl font-bold">
                    Get Your
                  </span>

                  <span className="text-base sm:text-lg md:text-xl font-bold">
                    Free
                  </span>

                  <span className="text-base sm:text-lg md:text-xl font-bold">
                    Quote
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Floating Footer Card */}
          <div className="relative -mt-10 md:-mt-12 px-4 pb-8">
            <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="px-6 md:px-12 py-12">

                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-12">

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <a
                      href={phoneHref}
                      className="block text-2xl md:text-3xl font-bold text-gray-900 hover:text-gray-700 transition-colors duration-200"
                    >
                      {phone}
                    </a>

                    <a
                      href={`mailto:${email}`}
                      className="block text-xl md:text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors duration-200 break-all"
                    >
                      {email}
                    </a>

                    {/* Social Media Links */}
                    {socialLinks.length > 0 && (
                      <div className="flex font-sans gap-6 pt-2">
                        {socialLinks.map((social) => {
                          const Icon = social.icon;

                          return (
                            <a
                              key={social.name}
                              href={social.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={social.name}
                              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                            >
                              <span className="text-sm">
                                {social.name}
                              </span>
                            </a>
                          );
                        })}
                      </div>
                    )}

                    {/* RERA Details */}
                    <div className="w-full">
                      <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl md:rounded-3xl p-3 md:p-4 shadow-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-transparent to-transparent rounded-2xl md:rounded-3xl pointer-events-none" />

                        <div className="relative flex items-center justify-between gap-3 md:gap-4">

                          {/* RERA Details - Left Side */}
                          <div className="flex flex-col justify-center font-sans space-y-0.5 md:space-y-1 flex-1 min-w-0">
                            <p className="text-gray-600 text-[10px] md:text-xs font-semibold tracking-wider uppercase whitespace-nowrap">
                              UP RERA Registration No.
                            </p>

                            <p className="text-gray-900 text-xs md:text-sm lg:text-sm font-bold tracking-tight leading-tight truncate">
                              UPRERAPRJ389222/03/2025
                            </p>

                            <p className="text-gray-700 text-[10px] md:text-xs">
                              <span className="font-medium">
                                Website:
                              </span>{" "}
                              <a
                                href="https://www.up-rera.in"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-[#e1d18a] transition-all duration-300 underline decoration-blue-600/40 underline-offset-2 hover:decoration-[#e1d18a]"
                              >
                                www.up-rera.in
                              </a>
                            </p>
                          </div>

                          {/* QR Code - Right Side */}
                          <div className="bg-gray-50 p-1.5 md:p-2 rounded-lg shadow-md ring-1 ring-gray-200 hover:ring-gray-300 transition-all duration-300 flex-shrink-0">
                            <Image
                              src="/images/qr.jpeg"
                              alt="RERA Registration QR Code"
                              width={100}
                              height={100}
                              className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24"
                              priority
                            />
                          </div>
                        </div>

                        {/* Bottom accent line */}
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-b-2xl md:rounded-3xl" />
                      </div>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="grid grid-cols-2 mt-8 gap-8">
                    <nav className="space-y-3">
                      {navigationLinks.column1.map(
                        (link) => (
                          <Link
                            key={link.label}
                            href={link.href}
                            className="block font-sans text-gray-800 hover:text-gray-900 transition-colors duration-200 text-sm md:text-base font-thin"
                          >
                            {link.label}
                          </Link>
                        )
                      )}
                    </nav>

                    <nav className="space-y-3">
                      {navigationLinks.column2.map(
                        (link) => (
                          <Link
                            key={link.label}
                            href={link.href}
                            className="block font-sans text-gray-800 hover:text-gray-900 transition-colors duration-200 text-sm md:text-base font-thin"
                          >
                            {link.label}
                          </Link>
                        )
                      )}
                    </nav>
                  </div>

                  {/* Brand Section with Addresses */}
                  <div className="space-y-6">
                    <Image
                      height={200}
                      width={200}
                      src="/logo/mainlogo.png"
                      alt="CCS Infratech"
                      priority
                    />

                    <p className="text-gray-600 font-sans leading-relaxed">
                      {companyDescription}
                    </p>

                    {/* Addresses */}
                    <div className="space-y-4 pt-2">

                      {/* Registered Office */}
                      <div className="space-y-1">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" />

                          <div>
                            <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                              Registered Office
                            </p>

                            <a
                              href={registeredOfficeMapHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1 block text-xs text-gray-600 font-sans leading-relaxed transition-colors hover:text-amber-600"
                            >
                              {registeredOffice}
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Corporate Office */}
                      <div className="space-y-1">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" />

                          <div>
                            <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                              Corporate Office
                            </p>

                            <a
                              href={corporateOfficeMapHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1 block text-xs text-gray-600 font-sans leading-relaxed transition-colors hover:text-amber-600"
                            >
                              {corporateOffice}
                            </a>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t font-sans border-gray-200 flex items-center justify-center flex-col sm:flex-row gap-4">
                  <p className="text-sm text-gray-600">
                    {footerText}
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Quote Dialog */}
      <ClubTowersModal
        open={isQuoteDialogOpen}
        onClose={() =>
          setIsQuoteDialogOpen(false)
        }
      />
    </>
  );
};

export default Footer;
