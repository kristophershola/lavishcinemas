import { BookingProvider } from "@/lib/bookingContext";
import BookingStepNav from "@/components/BookingStepNav";

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return (
    <BookingProvider>
      <main className="min-h-screen w-full bg-black text-white">
        <BookingStepNav />
        <div className="mx-auto max-w-7xl px-page py-hero">
          <div className="rounded border border-border bg-surface p-xl sm:p-2xl">
            {children}
          </div>
        </div>
      </main>
    </BookingProvider>
  );
}
