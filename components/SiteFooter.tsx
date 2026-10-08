import Link from "next/link";
import { Button } from "@/components/ui/button";

const YEAR = new Date().getFullYear();

const footerColumns = [
  {
    title: "APARTMENTS",
    links: [
      { label: "Book a Stay", href: "/book" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Gallery", href: "/#gallery" },
    ],
  },
  {
    title: "CINEMA",
    links: [
      { label: "Now Showing", href: "/now-showing" },
      { label: "Book a Hall", href: "/book" },
      { label: "Session Times", href: "/#how-it-works" },
      { label: "Private Events", href: "/book" },
    ],
  },
  {
    title: "COMPANY",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/#contact" },
      { label: "FAQ", href: "/#faq" },
      { label: "How It Works", href: "/#how-it-works" },
    ],
  },
  {
    title: "LEGAL",
    links: [
      { label: "Terms and Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Refund Policy", href: "/refund-policy" },
    ],
  },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4l6.5 8L4 20h2l5.5-6.5L16 20h4l-6.5-8L20 4h-2l-5.5 6.5L8 4H4z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

export default function SiteFooter() {
  return (
    <footer className="relative w-full overflow-hidden border-t border-border bg-[#080808] font-body antialiased selection:bg-gold/30 selection:text-white">
      {/* Hero image with gradient overlay */}
      <div className="relative w-full">
        <img
          src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1600&q=80"
          alt="Lavish cinema hall interior"
          className="h-[300px] w-full object-cover object-center outline outline-1 -outline-offset-1 outline-white/10 sm:h-[360px] md:h-[420px] lg:h-[500px]"
        />

        {/* Gradient: transparent to solid dark */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 40%, rgba(8,8,8,0.6) 70%, #080808 100%)",
          }}
        />

        {/* Overlay text on the image */}
        <div className="absolute inset-0 flex flex-col justify-center px-page">
          <h2 className="font-display max-w-xs text-3xl leading-[1.15] tracking-wide text-white sm:max-w-sm sm:text-4xl md:max-w-md md:text-5xl">
            LAVISH LIVING
            <br />
            REDEFINED.
          </h2>
          <p className="mt-3 max-w-[270px] text-[13px] leading-relaxed text-muted">
            Premium short-term apartments and private cinema halls in
            Gwarimpa, Abuja.
          </p>
          <div className="mt-5">
            <Button asChild size="lg">
              <Link href="/book">
                Book Now
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto w-full max-w-6xl px-page pt-2xl pb-0">
        <div className="grid grid-cols-1 gap-xl sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand block - 3 cols */}
          <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-3">
            <Link href="/" className="font-display text-2xl tracking-[0.12em] text-white">
              LAVISH
            </Link>
            <p className="max-w-[210px] text-[13px] leading-relaxed text-muted">
              Premium short-term apartments and private cinema halls in
              Gwarimpa, Abuja, Nigeria.
            </p>
            <Button asChild variant="outline" size="sm" className="w-fit">
              <Link href="/book">
                Book a Hall
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </Button>
          </div>

          {/* Navigation columns - 6 cols */}
          <nav
            aria-label="Footer navigation"
            className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 lg:col-span-6 lg:ml-8"
          >
            {footerColumns.map((col) => (
              <div key={col.title} className="flex flex-col gap-4">
                <h3 className="font-mono text-[10px] font-semibold tracking-[0.15em] text-gold uppercase">
                  {col.title}
                </h3>
                <ul className="flex flex-col gap-[10px]">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="inline-block text-[13px] leading-snug text-muted transition-colors duration-150 hover:text-white focus-visible:text-white focus-visible:outline-none"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Social column - 3 cols */}
          <div className="flex flex-col gap-4 lg:col-span-3">
            <h3 className="text-xl font-display tracking-wide text-white">
              STAY CONNECTED
            </h3>
            <p className="max-w-[220px] text-[13px] leading-relaxed text-muted">
              Follow us for updates, events and a dose of inspiration.
            </p>
            <div className="flex items-center gap-2">
              {socialLinks.map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex size-10 items-center justify-center rounded-full bg-white/5 text-muted shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-[background-color,color,box-shadow] duration-150 hover:bg-white/10 hover:text-white hover:shadow-[0_0_0_1px_rgba(255,255,255,0.15)] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-2xl flex flex-col items-start justify-between gap-4 border-t border-border pt-lg pb-xl text-[13px] text-muted sm:flex-row sm:items-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.10em]">
            Copyright &copy; {YEAR}. Lavish Living Limited. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-5 font-mono text-[10px] uppercase tracking-[0.10em]">
            {["Privacy Policy", "Terms of Service", "Refund Policy"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className="transition-colors duration-150 hover:text-white focus-visible:text-white focus-visible:outline-none"
                >
                  {item}
                </a>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Massive Wordmark */}
      <div className="relative w-full overflow-hidden" aria-hidden="true">
        <div className="flex w-full items-end select-none">
          <div className="flex-1 overflow-hidden">
            <svg
              className="h-auto w-full"
              viewBox="0 0 870 170"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="wm-gradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                  gradientUnits="objectBoundingBox"
                >
                  <stop offset="0%" stopColor="#6b6b6b" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#191919" stopOpacity="0.7" />
                </linearGradient>
              </defs>
              <text
                x="50%"
                y="90%"
                dominantBaseline="auto"
                textAnchor="middle"
                textLength="870"
                lengthAdjust="spacingAndGlyphs"
                fontSize="175"
                fontWeight="700"
                fontFamily="var(--font-bebas), system-ui, sans-serif"
                letterSpacing="-0.025em"
                fill="url(#wm-gradient)"
              >
                LAVISH
              </text>
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
}
