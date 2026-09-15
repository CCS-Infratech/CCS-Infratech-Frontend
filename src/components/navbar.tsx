"use client";

import { Button } from "@/components/ui/button";
import { NAV_LINKS } from "@/constants";
import { useClickOutside } from "@/hooks";
import { cn } from "@/lib";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Download, MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, memo } from "react";
import Wrapper from "./global/wrapper";
import { projectGroupService } from "@/http/project-groups";

interface DropdownItem {
  name: string;
  link: string;
}

interface NavLink {
  name: string;
  link: string;
  dropdown?: DropdownItem[];
}

// Desktop Dropdown Component
const DesktopDropdown = memo(
  ({
    link,
    index,
    activeDropdown,
    onMouseEnter,
    onMouseLeave,
    onClose,
  }: {
    link: NavLink;
    index: number;
    activeDropdown: number | null;
    onMouseEnter: (index: number) => void;
    onMouseLeave: () => void;
    onClose: () => void;
  }) => {
    const isOpen = activeDropdown === index;

    if (!link.dropdown || link.dropdown.length === 0) {
      return (
        <Link
          href={link.link}
          className="hover:text-foreground transition-colors duration-200 hover:bg-accent rounded-md px-4 py-2 whitespace-nowrap"
        >
          {link.name}
        </Link>
      );
    }

    return (
      <div
        className="relative"
        onMouseEnter={() => onMouseEnter(index)}
        onMouseLeave={onMouseLeave}
      >
        <Link
          href={link.link}
          className="hover:text-foreground transition-colors duration-200 hover:bg-accent rounded-md px-4 py-2 flex items-center whitespace-nowrap"
        >
          {link.name}
          <ChevronDown
            className={cn(
              "ml-1 h-4 w-4 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </Link>

        {/* Invisible bridge to prevent gap issues */}
        {isOpen && <div className="absolute top-full left-0 right-0 h-2" />}

        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{
                duration: 0.15,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="absolute top-full left-0 pt-2 z-50"
            >
              <div className="bg-black/95 backdrop-blur-sm border border-foreground/10 rounded-lg overflow-hidden min-w-[200px] shadow-xl shadow-black/20">
                {link.dropdown.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.link}
                    className="block px-4 py-2.5 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors duration-150"
                    onClick={onClose}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

DesktopDropdown.displayName = "DesktopDropdown";

// Mobile Nav Item Component
const MobileNavItem = memo(
  ({
    navItem,
    index,
    activeDropdown,
    onToggle,
    onClose,
  }: {
    navItem: NavLink;
    index: number;
    activeDropdown: number | null;
    onToggle: (index: number) => void;
    onClose: () => void;
  }) => {
    const isOpen = activeDropdown === index;

    if (!navItem.dropdown || navItem.dropdown.length === 0) {
      return (
        <Link
          href={navItem.link}
          onClick={onClose}
          className="block text-neutral-300 hover:bg-neutral-800 w-full px-4 py-2.5 rounded-lg transition-colors duration-150"
        >
          {navItem.name}
        </Link>
      );
    }

    return (
      <div className="w-full">
        <div className="flex items-center justify-between w-full">
          <Link
            href={navItem.link}
            className="text-neutral-300 hover:bg-neutral-800 px-4 py-2.5 rounded-lg flex-grow transition-colors duration-150"
            onClick={onClose}
          >
            {navItem.name}
          </Link>
          <button
            onClick={() => onToggle(index)}
            className="text-neutral-300 hover:bg-neutral-800 p-2.5 rounded-lg transition-colors duration-150"
            aria-label={`Toggle ${navItem.name} submenu`}
            aria-expanded={isOpen}
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="overflow-hidden"
            >
              <div className="ml-4 mt-1 border-l border-neutral-700 pl-2 pb-1">
                {navItem.dropdown.map((item, dropIdx) => (
                  <Link
                    key={dropIdx}
                    href={item.link}
                    onClick={onClose}
                    className="block text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 w-full px-4 py-2 rounded-lg transition-colors duration-150"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

MobileNavItem.displayName = "MobileNavItem";

// Main Navbar Component
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [navLinks, setNavLinks] = useState<NavLink[]>(NAV_LINKS as NavLink[]);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fetchProjectGroups = async () => {
      try {
        const response = await projectGroupService.getPublishedGroups();
        const groups = Array.isArray(response?.data) ? response.data : [];
        setNavLinks(
          (NAV_LINKS as NavLink[]).map((link) =>
            link.name === "Projects"
              ? {
                  ...link,
                  dropdown: groups.map((group: { name: string; slug: string }) => ({
                    name: group.name,
                    link: `/projects/groups/${group.slug}`,
                  })),
                }
              : link,
          ),
        );
      } catch (error) {
        console.error("Failed to load project groups", error);
      }
    };

    fetchProjectGroups();
  }, []);

  const mobileMenuRef = useClickOutside(() => {
    if (open) {
      setOpen(false);
      setActiveDropdown(null);
    }
  });

  // Desktop hover handlers with debounce
  const handleMouseEnter = useCallback((index: number) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 100);
  }, []);

  const closeDropdown = useCallback(() => {
    setActiveDropdown(null);
  }, []);

  // Mobile handlers
  const toggleMobileMenu = useCallback(() => {
    setOpen((prev) => {
      if (prev) setActiveDropdown(null);
      return !prev;
    });
  }, []);

  const toggleMobileDropdown = useCallback((index: number) => {
    setActiveDropdown((prev) => (prev === index ? null : index));
  }, []);

  const closeMobileMenu = useCallback(() => {
    setOpen(false);
    setActiveDropdown(null);
  }, []);

  return (
    <header className="fixed w-full top-0 inset-x-0 z-50 mt-5">
      {/* Desktop Navigation */}
      <nav
        style={{ minWidth: "920px", width: "min(90%, 1100px)" }}
        className="hidden lg:flex bg-black/90 backdrop-blur-md border border-t-foreground/20 border-b-foreground/10 border-x-foreground/15 items-center justify-between rounded-full relative p-4 z-50 mx-auto"
      >
        <Wrapper className="flex items-center justify-between lg:px-4">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex-shrink-0"
          >
            <Link href="/" className="flex items-center gap-2">
              <Image
                height={140}
                width={140}
                src="/logo/mainlogo.png"
                alt="CSS Infratech"
                priority
              />
            </Link>
          </motion.div>

          {/* Nav Links */}
          <div className="hidden lg:flex flex-row flex-1 absolute inset-0 items-center justify-center w-max mx-auto gap-x-1 text-lg text-muted-foreground font-medium">
            {navLinks.map((link, index) => (
              <DesktopDropdown
                key={index}
                link={link}
                index={index}
                activeDropdown={activeDropdown}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClose={closeDropdown}
              />
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex flex-shrink-0 items-center gap-2">
            <Button
              asChild
              className="bg-white text-black hover:bg-amber-100"
              size="sm"
            >
              <a download="CCS-Infratech-Brochure.pdf" href="/brochures/brochure.pdf">
                <Download className="h-4 w-4" />
                Download Brochure
              </a>
            </Button>
            <Link href="/contact-us">
              <Button
                className="bg-[#fbe575] hover:bg-[#fbe575] text-black text-lg rounded-full "
                size="sm"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </Wrapper>
      </nav>

      {/* Mobile Navigation */}
      <nav
        className={cn(
          "flex relative flex-col lg:hidden w-11/12 border bg-neutral-950/95 backdrop-blur-md justify-between items-center mx-auto py-2 z-50 transition-[border-radius] duration-300",
          open
            ? "rounded-t-xl rounded-b-none border-neutral-800"
            : "rounded-full border-neutral-800/50"
        )}
      >
        <Wrapper className="flex items-center justify-between px-2">
          <div className="flex items-center justify-between gap-x-4 w-full">
            {/* Mobile Logo */}
            <Link href="/" onClick={closeMobileMenu}>
              <Image
                height={140}
                width={140}
                src="/logo/mainlogo.png"
                alt="CSS Infratech"
                priority
              />
            </Link>

            {/* Mobile Actions */}
            <div className="flex items-center justify-center gap-x-2">
              <Button
                asChild
                className="bg-white text-black hover:bg-amber-100"
                size="sm"
              >
                <a
                  aria-label="Download brochure"
                  download="CCS-Infratech-Brochure.pdf"
                  href="/brochures/brochure.pdf"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden xl:inline">Brochure</span>
                </a>
              </Button>
              <Link href="/contact-us" onClick={closeMobileMenu}>
                <Button
                  size="sm"
                  className="bg-[#fbe575] hover:bg-[#fbe575] text-black rounded-full font-normal"
                >
                  Contact Us
                </Button>
              </Link>

              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg hover:bg-neutral-800 transition-colors duration-150"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {open ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <XIcon className="text-white h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <MenuIcon className="text-white h-6 w-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </Wrapper>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                duration: 0.25,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="absolute top-full left-0 right-0 bg-neutral-950/98 backdrop-blur-md rounded-b-xl border-x border-b border-neutral-800 bg-black overflow-hidden shadow-2xl shadow-black/50 z-50"
            >
              <div className="flex flex-col gap-1 w-full px-4 py-6">
                {navLinks.map((navItem, idx) => (
                  <MobileNavItem
                    key={idx}
                    navItem={navItem}
                    index={idx}
                    activeDropdown={activeDropdown}
                    onToggle={toggleMobileDropdown}
                    onClose={closeMobileMenu}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Navbar;
