"use client";

import { useRef, useState, useEffect, useCallback } from "react";

function buildDays(count = 30, minDate?: string) {
  const days: Date[] = [];
  const base = minDate ? new Date(minDate + "T00:00:00") : new Date();
  base.setHours(0, 0, 0, 0);

  for (let i = 0; i < count; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function DayPicker({
  selectedDate,
  onSelect,
  minDate,
}: {
  selectedDate: string;
  onSelect: (iso: string) => void;
  minDate?: string;
}) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const days = buildDays(30, minDate);

  const updateScrollButtons = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [updateScrollButtons]);

  // Scroll active day into view if not visible
  useEffect(() => {
    const el = sliderRef.current;
    if (!el || !selectedDate) return;
    const activeEl = el.querySelector<HTMLElement>(`[data-iso="${selectedDate}"]`);
    if (activeEl) {
      const elLeft = activeEl.offsetLeft;
      const elWidth = activeEl.offsetWidth;
      const containerLeft = el.scrollLeft;
      const containerWidth = el.clientWidth;
      if (elLeft < containerLeft || elLeft + elWidth > containerLeft + containerWidth) {
        el.scrollTo({ left: elLeft - 40, behavior: "smooth" });
      }
    }
  }, [selectedDate]);

  function scroll(direction: "left" | "right") {
    const el = sliderRef.current;
    if (!el) return;
    const offset = direction === "left" ? -288 : 288;
    el.scrollBy({ left: offset, behavior: "smooth" });
  }

  return (
    <div className="moviedateswrap w-full select-none">
      <div className="week_days_wrap custom_slider flex w-full items-center justify-between gap-2 sm:gap-3">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          aria-label="Previous dates"
          className={`scroll-arrow-wrap is-upcoming-left flex size-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 sm:size-12 ${
            canScrollLeft
              ? "cursor-pointer bg-white/10 text-white hover:bg-gold hover:text-black"
              : "cursor-not-allowed bg-white/[0.03] text-white/20 opacity-30"
          }`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Carousel Tracks / Swiper Slides */}
        <div
          ref={sliderRef}
          className="no-scrollbar flex flex-1 items-center gap-4 overflow-x-auto py-2 scroll-smooth"
        >
          {days.map((date) => {
            const iso = date.toISOString().split("T")[0];
            const isSelected = selectedDate === iso;
            const weekday = date.toLocaleDateString("en-NG", { weekday: "short" });
            const dayNum = String(date.getDate()).padStart(2, "0");
            const month = date.toLocaleDateString("en-NG", { month: "short" });

            return (
              <button
                key={iso}
                data-iso={iso}
                type="button"
                onClick={() => onSelect(iso)}
                className={`day_card flex h-[72px] w-[56px] min-w-[56px] max-w-[56px] shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-[5px] p-2 transition-all duration-300 ${
                  isSelected
                    ? "is-active bg-gold text-black shadow-md shadow-gold/20"
                    : "border border-white/[0.05] bg-white/[0.05] text-white hover:border-gold/40 hover:bg-white/[0.10]"
                }`}
              >
                <div
                  className={`text-[13px] leading-[13px] ${
                    isSelected ? "font-normal text-black" : "font-light text-white/80"
                  }`}
                >
                  {weekday}
                </div>
                <div
                  className={`text-[20px] font-bold leading-[20px] ${
                    isSelected ? "text-black" : "text-white"
                  }`}
                >
                  {dayNum}
                </div>
                <div
                  className={`text-[13px] leading-[13px] ${
                    isSelected ? "font-normal text-black" : "font-normal text-white/80"
                  }`}
                >
                  {month}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          aria-label="Next dates"
          className={`scroll-arrow-wrap is-upcoming-right flex size-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 sm:size-12 ${
            canScrollRight
              ? "cursor-pointer bg-white/10 text-white hover:bg-gold hover:text-black"
              : "cursor-not-allowed bg-white/[0.03] text-white/20 opacity-30"
          }`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
