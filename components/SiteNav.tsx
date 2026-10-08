"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/now-showing", label: "Now Showing" },
  { href: "/#how-it-works", label: "How It Works" }
];

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the mobile menu on route change / resize back to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      className={`lavish-slide-down sticky top-0 z-50 border-b border-border bg-black/85 backdrop-blur-md transition-all duration-300 ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-page transition-all duration-300 ${
          scrolled ? "h-[64px]" : "h-[76px]"
        }`}
      >
        <Link
          href="/"
          className="font-display text-[24px] tracking-[0.12em] text-white transition sm:text-[30px]"
        >
          LAVISH CINEMAS
        </Link>

        <nav className="hidden items-center gap-xl sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted transition hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
          <Button asChild variant="outline">
            <Link href="/book">Book a Hall</Link>
          </Button>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          className="flex items-center justify-center p-xs text-white sm:hidden"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M6 6L18 18M18 6L6 18" />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M4 7H20M4 12H20M4 17H20" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lavish-fade-up flex flex-col gap-lg border-t border-border bg-black/95 p-lg sm:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted transition hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
          <Button asChild variant="outline" className="w-full">
            <Link href="/book" onClick={() => setMobileMenuOpen(false)}>
              Book a Hall
            </Link>
          </Button>
        </div>
      )}
    </header>
  );
}
