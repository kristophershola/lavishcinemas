"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "Incorrect password");
      setSubmitting(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-page">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded border border-border bg-surface p-xl"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-gold">
          Staff Access
        </p>
        <h1 className="mt-sm font-display text-[28px] tracking-[0.10em] text-white">
          Admin Login
        </h1>

        <label className="mb-sm mt-xl block font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className="w-full rounded border border-border bg-black px-md py-sm font-body text-[13px] text-white outline-none focus:border-gold"
          required
        />

        {error && (
          <p className="mt-md font-body text-[13px] text-red-400">{error}</p>
        )}

        <Button type="submit" disabled={submitting} size="lg" className="mt-lg w-full">
          {submitting ? "Checking..." : "Log in"}
        </Button>
      </form>
    </main>
  );
}
