// Single source of truth for Lavish Cinemas business rules.
// Change values here, not in individual components, so pricing and
// copy never drift apart across the site.

export const SESSION_DURATION_MINUTES = 140; // 2 hours 20 minutes

export const MIN_GUESTS = 1;
export const MAX_GUESTS = 6;

export const SPECIAL_EVENT_UPGRADE_FEE = 3500000; // in kobo (N35,000)
export const RESCHEDULE_FEE = 1500000; // in kobo (N15,000)
export const RESCHEDULE_WINDOW_DAYS = 14;
export const MAX_RESCHEDULES_PER_BOOKING = 2;

export const NO_CANCELLATIONS = true;
export const NO_REFUNDS = true;
export const NO_LATE_EXTENSIONS = true;

export function formatNaira(kobo: number): string {
  const naira = kobo / 100;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(naira);
}

export function addSessionMinutes(startTime: string): string {
  const [h, m] = startTime.split(":").map(Number);
  const total = h * 60 + m + SESSION_DURATION_MINUTES;
  const endH = Math.floor(total / 60) % 24;
  const endM = total % 60;
  return `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
}

export function isWithinRescheduleWindow(originalDate: Date, newDate: Date): boolean {
  const diffMs = newDate.getTime() - originalDate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= RESCHEDULE_WINDOW_DAYS;
}
