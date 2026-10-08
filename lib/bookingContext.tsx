"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type BookingDraft = {
  movieTitle: string | null;
  moviePosterUrl: string | null;
  movieTmdbId: number | null;
  movieSkipped: boolean;

  hallId: string | null;
  hallName: string | null;
  hallSlug: string | null;
  hallCapacity: number | null;

  date: string | null; // ISO yyyy-mm-dd
  startTime: string | null;
  endTime: string | null;

  packageId: string | null;
  packageName: string | null;
  packagePrice: number | null;
  specialEventUpgrade: boolean;

  guestCount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
};

export const EMPTY_DRAFT: BookingDraft = {
  movieTitle: null,
  moviePosterUrl: null,
  movieTmdbId: null,
  movieSkipped: false,

  hallId: null,
  hallName: null,
  hallSlug: null,
  hallCapacity: null,

  date: null,
  startTime: null,
  endTime: null,

  packageId: null,
  packageName: null,
  packagePrice: null,
  specialEventUpgrade: false,

  guestCount: 2,
  customerName: "",
  customerEmail: "",
  customerPhone: ""
};

const STORAGE_KEY = "lavish_booking_draft_v1";

type Ctx = {
  draft: BookingDraft;
  update: (patch: Partial<BookingDraft>) => void;
  reset: () => void;
  hydrated: boolean;
};

const BookingContext = createContext<Ctx | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<BookingDraft>(EMPTY_DRAFT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setDraft({ ...EMPTY_DRAFT, ...JSON.parse(raw) });
    } catch {
      // ignore, start from an empty draft
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // storage full or unavailable, booking still works within the session
    }
  }, [draft, hydrated]);

  function update(patch: Partial<BookingDraft>) {
    setDraft((d) => ({ ...d, ...patch }));
  }

  function reset() {
    setDraft(EMPTY_DRAFT);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  return (
    <BookingContext.Provider value={{ draft, update, reset, hydrated }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within a BookingProvider");
  return ctx;
}

// For places outside the /book/* wizard (the home page's featured film
// section) that need to seed a booking before the BookingProvider has
// even mounted. Writes straight to sessionStorage; the wizard picks it up
// on its next mount same as any other draft.
export function seedBookingDraft(patch: Partial<BookingDraft>) {
  if (typeof window === "undefined") return;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const current = raw ? { ...EMPTY_DRAFT, ...JSON.parse(raw) } : EMPTY_DRAFT;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...patch }));
  } catch {
    // ignore, worst case the wizard just starts from empty
  }
}
