"use client";

import { useRef, useState, useEffect, useCallback } from "react";

function buildCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

function formatDisplay(date: Date) {
  return date.toLocaleDateString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function DatePicker({
  selectedDate,
  onSelect,
  minDate,
}: {
  selectedDate: string;
  onSelect: (iso: string) => void;
  minDate?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const initial = selectedDate ? new Date(selectedDate + "T00:00:00") : new Date();
  const [viewMonth, setViewMonth] = useState(initial.getMonth());
  const [viewYear, setViewYear] = useState(initial.getFullYear());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const min = minDate ? new Date(minDate + "T00:00:00") : today;

  const days = buildCalendarDays(viewYear, viewMonth);

  const closeOnOutside = useCallback((e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
  }, []);

  useEffect(() => {
    if (open) document.addEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, [open, closeOnOutside]);

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function selectDay(day: number) {
    const d = new Date(viewYear, viewMonth, day);
    if (d < min) return;
    const iso = d.toISOString().split("T")[0];
    onSelect(iso);
    setOpen(false);
  }

  const displayText = selectedDate
    ? formatDisplay(new Date(selectedDate + "T00:00:00"))
    : "Pick a date";

  return (
    <div ref={ref} className="relative w-full max-w-xs">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex h-11 w-full items-center justify-between rounded-2xl border border-border bg-black/20 px-3.5 text-left text-[15px] font-body shadow-xs outline-none transition-colors hover:border-gold/40 focus-visible:ring-[3px] focus-visible:ring-gold/30 ${
          selectedDate ? "text-white" : "text-muted"
        }`}
      >
        <span>{displayText}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown calendar */}
      {open && (
        <div className="absolute top-full left-0 z-50 mt-2 w-[280px] overflow-hidden rounded-2xl border border-border bg-[#161616] p-3 shadow-lg">
          {/* Month/Year nav */}
          <div className="flex items-center justify-between px-1 pb-2">
            <button
              type="button"
              onClick={prevMonth}
              className="flex size-7 items-center justify-center rounded-full text-muted transition hover:bg-white/5 hover:text-white"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <span className="font-display text-[15px] tracking-wide text-white">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="flex size-7 items-center justify-center rounded-full text-muted transition hover:bg-white/5 hover:text-white"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-0">
            {WEEKDAYS.map((wd) => (
              <div
                key={wd}
                className="py-1 text-center font-mono text-[10px] uppercase tracking-[0.10em] text-muted/60"
              >
                {wd}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-0">
            {days.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} />;

              const dateObj = new Date(viewYear, viewMonth, day);
              const iso = dateObj.toISOString().split("T")[0];
              const isPast = dateObj < min;
              const isSelected = selectedDate === iso;
              const isToday =
                dateObj.getFullYear() === today.getFullYear() &&
                dateObj.getMonth() === today.getMonth() &&
                dateObj.getDate() === today.getDate();

              return (
                <button
                  key={iso}
                  type="button"
                  disabled={isPast}
                  onClick={() => selectDay(day)}
                  className={`flex size-8 items-center justify-center rounded-full text-[13px] font-body transition ${
                    isPast
                      ? "cursor-not-allowed text-muted/30"
                      : isSelected
                      ? "bg-white font-medium text-black"
                      : isToday
                      ? "bg-white/10 text-white"
                      : "text-white hover:bg-white/5"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
