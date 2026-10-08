"use client";

import { useRouter } from "next/navigation";
import { useBooking } from "@/lib/bookingContext";
import { SPECIAL_EVENT_UPGRADE_FEE, formatNaira } from "@/lib/policy";

type Package = {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string | null;
  imageUrl: string | null;
};

export default function PackageStepClient({ packages }: { packages: Package[] }) {
  const router = useRouter();
  const { draft, update } = useBooking();

  function choose(pkg: Package) {
    update({ packageId: pkg.id, packageName: pkg.name, packagePrice: pkg.price });
    router.push("/book/contact");
  }

  return (
    <div>
      <p className="font-mono text-[13px] font-medium uppercase tracking-[0.15em] text-gold">Step 3</p>
      <h1 className="mt-sm font-display text-[38px] tracking-[0.10em] text-white">
        Choose Your Package
      </h1>
      <p className="mt-sm font-body text-[15px] font-light text-muted">
        Same six packages, whichever hall you're in.
      </p>

      <div className="mt-xl grid gap-lg sm:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => {
          const selected = draft.packageId === pkg.id;
          return (
            <button
              key={pkg.id}
              onClick={() => choose(pkg)}
              className="group relative max-w-md overflow-hidden rounded-2xl shadow-lg text-left transition-all duration-300"
            >
              {pkg.imageUrl ? (
                <div className="relative h-72 overflow-hidden bg-deep">
                  <img
                    src={pkg.imageUrl}
                    alt={pkg.name}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
                  {selected && (
                    <div className="absolute inset-0 ring-2 ring-gold ring-inset rounded-2xl" />
                  )}
                </div>
              ) : (
                <div className={`relative h-72 bg-deep flex items-center justify-center ${selected ? "ring-2 ring-gold" : ""}`}>
                  <span className="font-display text-[48px] tracking-wider text-white/10">{pkg.name.charAt(0)}</span>
                  {selected && (
                    <div className="absolute inset-0 ring-2 ring-gold ring-inset rounded-2xl" />
                  )}
                </div>
              )}
              <div className={`absolute top-4 right-4 flex size-8 items-center justify-center rounded-full border transition-all duration-300 ${
                selected
                  ? "border-gold bg-gold text-black"
                  : "border-white/40 bg-white/20 text-white/70 backdrop-blur-sm group-hover:border-white/60 group-hover:bg-white/30"
              }`}>
                {selected && (
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <div className="p-lg">
                <h3 className="font-display text-[20px] tracking-wider uppercase text-white">
                  {pkg.name}
                </h3>
                {pkg.description && (
                  <p className="mt-xs font-body text-[14px] font-light leading-relaxed text-muted">
                    {pkg.description}
                  </p>
                )}
                <div className="mt-md flex items-end justify-between">
                  <div>
                    <span className="font-mono text-[11px] font-medium uppercase tracking-widest text-muted">Price</span>
                    <p className="font-mono text-[22px] font-semibold text-gold">{formatNaira(pkg.price)}</p>
                  </div>
                  <span className={`rounded-full px-md py-xs font-body text-[13px] font-medium transition-all duration-300 ${
                    selected
                      ? "bg-gold text-black"
                      : "bg-white/10 text-white/70 group-hover:bg-gold/20 group-hover:text-gold"
                  }`}>
                    {selected ? "Selected" : "Select"}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {packages.length === 0 && (
        <p className="mt-lg font-body text-[15px] text-muted">
          No packages are set up yet.
        </p>
      )}

      <label className="mt-xl flex items-start gap-md rounded-2xl border-2 border-border bg-black/20 p-lg transition-all duration-300 hover:border-gold/40">
        <input
          type="checkbox"
          checked={draft.specialEventUpgrade}
          onChange={(e) => update({ specialEventUpgrade: e.target.checked })}
          className="mt-1 h-5 w-5 accent-gold"
        />
        <span>
          <span className="block font-body text-[15px] font-medium text-white">
            Special Event Upgrade (+{formatNaira(SPECIAL_EVENT_UPGRADE_FEE)})
          </span>
          <span className="block font-body text-[13px] font-light text-muted">
            Hall decoration and your own film or video screening.
          </span>
        </span>
      </label>
    </div>
  );
}
