"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroCarousel() {
  return (
    <section className="relative flex min-h-dvh w-full flex-col overflow-hidden border-b border-border bg-black">
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/lavish-hero.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        {/* Gradient so headline stays readable over the footage */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
      </div>

      {/* Main content */}
      <div className="lavish-fade-up container relative z-10 mt-hero flex flex-1 flex-col items-center justify-center px-page pb-hero text-center">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
          <h1 className="mb-lg flex w-full flex-col items-center text-white">
            <span className="text-center text-[44px] leading-[1.1] tracking-[0.04em] sm:text-[64px] md:text-[76px] lg:text-[88px]">
              Your Own Private
            </span>
            <span className="mt-xs text-center text-[44px] leading-[1.1] tracking-[0.04em] text-gold sm:text-[64px] md:text-[76px] lg:text-[88px]">
              Cinema Experience
            </span>
          </h1>

          <p className="mx-auto mb-xl max-w-[560px] font-body text-[15px] leading-relaxed text-muted sm:text-[17px]">
            Two private halls, six curated packages, and a screen all to yourselves.
            Book your hall and choose your film on arrival.
          </p>

          <div className="flex flex-col items-center justify-center gap-lg sm:flex-row sm:gap-xl">
            <Button asChild size="lg">
              <Link href="/book">Book a Hall</Link>
            </Button>

            <Link
              href="/now-showing"
              className="group inline-flex items-center gap-sm font-mono text-[11px] uppercase tracking-[0.15em] text-white transition hover:text-gold"
            >
              Now Showing
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:translate-x-1"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="lavish-fade-up relative z-10 mb-xl flex flex-col items-center gap-sm text-muted">
        <span className="font-mono text-[9px] uppercase tracking-[0.15em]">Scroll to Discover</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M6 13l6 6 6-6" />
        </svg>
      </div>
    </section>
  );
}
