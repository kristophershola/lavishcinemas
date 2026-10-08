"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function BookingStatusActions({
  bookingId,
  status
}: {
  bookingId: string;
  status: string;
}) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  async function setStatus(newStatus: string) {
    setUpdating(true);
    await fetch(`/api/admin/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });
    setUpdating(false);
    router.refresh();
  }

  if (status === "COMPLETED" || status === "NO_SHOW") {
    return (
      <span className="font-mono text-[9px] uppercase tracking-[0.10em] text-muted">
        {status === "COMPLETED" ? "Completed" : "No show"}
      </span>
    );
  }

  return (
    <div className="flex gap-sm">
      <Button
        variant="outline"
        size="sm"
        disabled={updating}
        onClick={() => setStatus("COMPLETED")}
      >
        Mark seated
      </Button>
      <Button
        variant="destructive"
        size="sm"
        disabled={updating}
        onClick={() => setStatus("NO_SHOW")}
      >
        No show
      </Button>
    </div>
  );
}
