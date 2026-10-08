import { prisma } from "@/lib/db";
import { formatNaira } from "@/lib/policy";
import AdminNav from "@/components/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminAllBookingsPage({
  searchParams
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q?.trim();

  const bookings = await prisma.booking.findMany({
    where: {
      status: { not: "RESCHEDULED" },
      date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      ...(q
        ? {
            OR: [
              { customerName: { contains: q, mode: "insensitive" } },
              { customerEmail: { contains: q, mode: "insensitive" } },
              { reference: { contains: q, mode: "insensitive" } }
            ]
          }
        : {})
    },
    include: { hall: true, package: true },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
    take: 100
  });

  return (
    <main className="min-h-screen bg-black">
      <AdminNav active="upcoming" />

      <div className="mx-auto max-w-7xl px-page py-xl">
        <h1 className="font-display text-[28px] tracking-[0.10em] text-white">
          Upcoming Bookings
        </h1>

        <form method="get" className="mt-lg">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search by name, email, or reference"
            className="w-full max-w-md rounded border border-border bg-surface px-md py-sm font-body text-[13px] text-white outline-none focus:border-gold"
          />
        </form>

        <div className="mt-xl overflow-hidden rounded border border-border">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-surface">
                <Th>Date</Th>
                <Th>Time</Th>
                <Th>Hall</Th>
                <Th>Package</Th>
                <Th>Guest</Th>
                <Th>Reference</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-md py-xl text-center font-body text-[13px] text-muted">
                    No bookings found.
                  </td>
                </tr>
              )}
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-border last:border-0">
                  <Td>
                    {new Date(booking.date).toLocaleDateString("en-NG", {
                      month: "short",
                      day: "numeric"
                    })}
                  </Td>
                  <Td>{booking.startTime}</Td>
                  <Td>{booking.hall.name}</Td>
                  <Td>
                    <span className="font-mono text-[10px] uppercase tracking-[0.10em] text-muted">
                      {booking.package.name}
                    </span>
                  </Td>
                  <Td>
                    <span className="block font-body text-[13px] text-white">
                      {booking.customerName}
                    </span>
                    <span className="block font-mono text-[10px] text-muted">
                      {booking.customerPhone}
                    </span>
                  </Td>
                  <Td>
                    <span className="font-mono text-[10px] text-muted">
                      {booking.reference}
                    </span>
                  </Td>
                  <Td>
                    <span className="font-mono text-[11px] text-white">
                      {formatNaira(booking.amount)}
                    </span>
                  </Td>
                  <Td>
                    <span className="font-mono text-[9px] uppercase tracking-[0.10em] text-muted">
                      {booking.paymentStatus === "PAID" ? booking.status : booking.paymentStatus}
                    </span>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-md py-sm font-mono text-[9px] uppercase tracking-[0.10em] text-muted">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-md py-md align-top">{children}</td>;
}
