"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AdminNav({ active }: { active: "today" | "upcoming" | "featured" }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-page py-lg">
        <div className="flex items-center gap-xl">
          <span className="font-display text-[20px] tracking-[0.10em] text-white">
            LAVISH ADMIN
          </span>
          <nav className="flex gap-lg">
            <Link
              href="/admin"
              className={`font-mono text-[10px] uppercase tracking-[0.15em] ${
                active === "today" ? "text-gold" : "text-muted hover:text-white"
              }`}
            >
              Today
            </Link>
            <Link
              href="/admin/bookings"
              className={`font-mono text-[10px] uppercase tracking-[0.15em] ${
                active === "upcoming" ? "text-gold" : "text-muted hover:text-white"
              }`}
            >
              All Bookings
            </Link>
            <Link
              href="/admin/featured"
              className={`font-mono text-[10px] uppercase tracking-[0.15em] ${
                active === "featured" ? "text-gold" : "text-muted hover:text-white"
              }`}
            >
              Featured Movie
            </Link>
          </nav>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted hover:text-gold">
          Log out
        </Button>
      </div>
    </header>
  );
}
