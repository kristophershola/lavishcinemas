"use client";

function buildDays(count: number) {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function DayPicker({
  selectedDate,
  onSelect
}: {
  selectedDate: string;
  onSelect: (iso: string) => void;
}) {
  const days = buildDays(6);

  return (
    <div className="flex gap-sm overflow-x-auto pb-sm">
      {days.map((date) => {
        const iso = date.toISOString().split("T")[0];
        const isSelected = selectedDate === iso;
        const weekday = date.toLocaleDateString("en-NG", { weekday: "short" });
        const month = date.toLocaleDateString("en-NG", { month: "short" }).toUpperCase();
        const dayNum = date.getDate();

        return (
          <button
            key={iso}
            onClick={() => onSelect(iso)}
            className={`day-card flex shrink-0 flex-col items-center justify-center rounded-[5px] border transition-all duration-300 ${
              isSelected
                ? "border-gold bg-gold-dim"
                : "border-surface bg-surface hover:border-gold/40"
            }`}
            style={{
              height: "5.75rem",
              minWidth: "4.25rem",
              maxWidth: "4.25rem",
              padding: "1em",
              gap: "0.2rem"
            }}
          >
            <span
              className={`font-mono text-[11px] uppercase tracking-[0.10em] ${
                isSelected ? "text-gold" : "text-muted"
              }`}
            >
              {weekday}
            </span>
            <span
              className={`font-display text-[28px] leading-none ${
                isSelected ? "text-gold" : "text-white"
              }`}
            >
              {dayNum}
            </span>
            <span
              className={`font-mono text-[10px] uppercase tracking-[0.15em] ${
                isSelected ? "text-gold/70" : "text-muted/70"
              }`}
            >
              {month}
            </span>
          </button>
        );
      })}
    </div>
  );
}
