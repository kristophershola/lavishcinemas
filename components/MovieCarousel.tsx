"use client";

import { useEffect, useRef, useState } from "react";
import { Movie } from "@/lib/movies";
import CarouselMovieCard from "@/components/CarouselMovieCard";

const CARD_WIDTH = 200; // must match CarouselMovieCard's fixed width
const GAP = 16; // tailwind gap-lg
const STEP = CARD_WIDTH + GAP;

export default function MovieCarousel({ movies }: { movies: Movie[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Doubled so the loop can reset seamlessly once it passes the halfway point
  const doubled = [...movies, ...movies];

  useEffect(() => {
    let frame: number;

    function tick() {
      const el = trackRef.current;
      if (el && !hovered) {
        el.scrollLeft += 0.6;
        const half = el.scrollWidth / 2;
        if (el.scrollLeft >= half) {
          el.scrollLeft -= half;
        }
      }
      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [hovered]);

  function scrollByCards(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * STEP * 3, behavior: "smooth" });
  }

  if (movies.length === 0) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div ref={trackRef} className="no-scrollbar flex gap-lg overflow-x-auto">
        {doubled.map((movie, i) => (
          <CarouselMovieCard key={`${movie.tmdbId}-${i}`} movie={movie} />
        ))}
      </div>

      {hovered && (
        <>
          <button
            onClick={() => scrollByCards(-1)}
            aria-label="Scroll left"
            className="absolute left-0 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-gold bg-black/80 text-gold transition hover:bg-gold hover:text-black"
          >
            ‹
          </button>
          <button
            onClick={() => scrollByCards(1)}
            aria-label="Scroll right"
            className="absolute right-0 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-gold bg-black/80 text-gold transition hover:bg-gold hover:text-black"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
