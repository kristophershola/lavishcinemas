"use client";

import DayPicker from "./DayPicker";

export default function DatePicker({
  selectedDate,
  onSelect,
  minDate,
}: {
  selectedDate: string;
  onSelect: (iso: string) => void;
  minDate?: string;
}) {
  return (
    <div className="w-full">
      <DayPicker
        selectedDate={selectedDate}
        onSelect={onSelect}
        minDate={minDate}
      />
    </div>
  );
}
