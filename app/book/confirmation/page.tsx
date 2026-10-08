import Link from "next/link";
import { prisma } from "@/lib/db";
import { verifyTransaction } from "@/lib/paystack";
import { formatNaira } from "@/lib/policy";

export const dynamic = "force-dynamic";

export default async function ConfirmationPage({
  searchParams
}: {
  searchParams: { reference?: string };
}) {
  const reference = searchParams.reference;

  if (!reference) {
    return (
      <Wrapper>
        <p className="font-body text-[15px] text-muted">
          No booking reference was provided.
        </p>
      </Wrapper>
    );
  }

  let booking = await prisma.booking.findUnique({
    where: { reference },
    include: { hall: true, package: true }
  });

  if (!booking) {
    return (
      <Wrapper>
        <p className="font-body text-[15px] text-muted">
          We could not find a booking with that reference.
        </p>
      </Wrapper>
    );
  }

  // In case the webhook hasn't landed yet, double check with Paystack directly.
  if (booking.paymentStatus !== "PAID") {
    try {
      const result = await verifyTransaction(reference);
      if (result.data.status === "success") {
        booking = await prisma.booking.update({
          where: { reference },
          data: { status: "CONFIRMED", paymentStatus: "PAID" },
          include: { hall: true, package: true }
        });
      }
    } catch {
      // fall through, show current status below
    }
  }

  const paid = booking.paymentStatus === "PAID";

  return (
    <Wrapper>
      <p className="font-mono text-[13px] font-medium uppercase tracking-[0.15em] text-gold">
        {paid ? "Booking confirmed" : "Payment pending"}
      </p>
      <h1 className="mt-sm font-display text-[40px] tracking-[0.10em] text-white">
        {booking.hall.name}
      </h1>

      <div className="mt-lg space-y-md rounded border-2 border-border bg-black/20 p-xl">
        <Row label="Reference" value={booking.reference} />
        <Row label="Package" value={booking.package.name} />
        <Row label="Film" value={booking.movieTitle ?? "Chosen on arrival"} />
        <Row
          label="Date"
          value={new Date(booking.date).toLocaleDateString("en-NG", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          })}
        />
        <Row label="Time" value={`${booking.startTime} to ${booking.endTime}`} />
        <Row label="Guests" value={String(booking.guestCount)} />
        {booking.specialEventUpgrade && (
          <Row label="Special Event Upgrade" value="Included" />
        )}
        <Row label="Amount" value={formatNaira(booking.amount)} />
      </div>

      {!paid && (
        <p className="mt-lg font-body text-[15px] font-medium text-muted">
          We have not received confirmation of your payment yet. If you
          completed payment, refresh this page in a moment.
        </p>
      )}

      <div className="mt-xl rounded border-2 border-border bg-black/20 p-lg">
        <p className="font-mono text-[12px] uppercase tracking-[0.10em] text-muted">
          Doors open at your ticketed time. No extensions for late arrivals.
          {!booking.movieTitle && " Pick your film on arrival."} No cancellations or refunds.
          Rescheduling costs N15,000 and must fall within 14 days of this date.
        </p>
      </div>

      <div className="mt-xl flex flex-wrap items-center gap-xl">
        <Link
          href="/"
          className="font-mono text-[13px] font-medium uppercase tracking-[0.15em] text-gold underline underline-offset-4"
        >
          Back to home
        </Link>
        {paid && (
          <Link
            href="/manage"
            className="font-mono text-[13px] font-medium uppercase tracking-[0.15em] text-muted underline underline-offset-4 hover:text-gold"
          >
            Need to reschedule?
          </Link>
        )}
      </div>
    </Wrapper>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-md">
      <span className="font-mono text-[12px] uppercase tracking-[0.10em] text-muted">
        {label}
      </span>
      <span className="font-body text-[15px] font-medium text-white">{value}</span>
    </div>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return <div className="max-w-2xl">{children}</div>;
}
