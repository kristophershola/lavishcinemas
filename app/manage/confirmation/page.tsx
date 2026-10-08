import Link from "next/link";
import { prisma } from "@/lib/db";
import { verifyTransaction } from "@/lib/paystack";
import { finalizeReschedule } from "@/lib/reschedule";
import { formatNaira } from "@/lib/policy";

export const dynamic = "force-dynamic";

export default async function RescheduleConfirmationPage({
  searchParams
}: {
  searchParams: { reference?: string };
}) {
  const reference = searchParams.reference;

  if (!reference) {
    return (
      <Wrapper>
        <p className="font-body text-[14px] text-muted">
          No reschedule reference was provided.
        </p>
      </Wrapper>
    );
  }

  const original = await prisma.booking.findFirst({
    where: { pendingRescheduleReference: reference }
  });

  if (!original) {
    return (
      <Wrapper>
        <p className="font-body text-[14px] text-muted">
          We could not find a reschedule request with that reference.
        </p>
      </Wrapper>
    );
  }

  let newBooking =
    original.status === "RESCHEDULED"
      ? await prisma.booking.findFirst({
          where: { rescheduledFromId: original.id },
          include: { hall: true, package: true }
        })
      : null;

  // Not finalized yet, so double check payment directly with Paystack.
  if (!newBooking) {
    try {
      const result = await verifyTransaction(reference);
      if (result.data.status === "success") {
        newBooking = await finalizeReschedule(reference);
      }
    } catch {
      // fall through, show pending state below
    }
  }

  if (!newBooking) {
    return (
      <Wrapper>
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-gold">
          Payment pending
        </p>
        <h1 className="mt-sm font-display text-[28px] tracking-[0.10em] text-white">
          We have not confirmed this payment yet
        </h1>
        <p className="mt-lg font-body text-[13px] text-muted">
          If you completed payment, refresh this page in a moment. Your
          original booking has not changed until this is confirmed.
        </p>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-gold">
        Rescheduled
      </p>
      <h1 className="mt-sm font-display text-[36px] tracking-[0.10em] text-white">
        {newBooking.hall.name}
      </h1>

      <div className="mt-lg space-y-sm rounded border border-border bg-surface p-lg">
        <Row label="New Reference" value={newBooking.reference} />
        <Row label="Package" value={newBooking.package.name} />
        <Row
          label="Date"
          value={new Date(newBooking.date).toLocaleDateString("en-NG", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          })}
        />
        <Row label="Time" value={`${newBooking.startTime} to ${newBooking.endTime}`} />
        <Row label="Guests" value={String(newBooking.guestCount)} />
        <Row label="Session Amount" value={formatNaira(newBooking.amount)} />
      </div>

      <div className="mt-xl rounded border border-border bg-surface p-lg">
        <p className="font-mono text-[9px] uppercase tracking-[0.10em] text-muted">
          Doors open at your ticketed time. No extensions for late arrivals.
          Pick your film on arrival. No cancellations or refunds.
        </p>
      </div>

      <Link
        href="/"
        className="mt-xl inline-block font-mono text-[11px] uppercase tracking-[0.15em] text-gold underline underline-offset-4"
      >
        Back to home
      </Link>
    </Wrapper>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-mono text-[9px] uppercase tracking-[0.10em] text-muted">
        {label}
      </span>
      <span className="font-body text-[13px] text-white">{value}</span>
    </div>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-black px-page py-hero">
      <div className="mx-auto max-w-2xl">{children}</div>
    </main>
  );
}
