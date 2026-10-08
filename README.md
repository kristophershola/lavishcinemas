# Lavish Cinemas Booking Site

Private cinema hall booking for Lavish Cinemas. Next.js, PostgreSQL, Paystack.

## Setup

1. Install dependencies
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in real values
   ```
   copy .env.example .env
   ```
3. Push the database schema
   ```
   npm run db:generate
   npm run db:push
   ```
4. Seed starter halls and packages (edit `prisma/seed.js` first to match real hall names and package pricing)
   ```
   npm run db:seed
   ```
5. Run the dev server
   ```
   npm run dev
   ```
   Visit http://localhost:3000

## How booking works

Booking is a 5-step wizard, each step is its own page under `/book/*`, and you can start at any step, in any order, and still reach checkout. The default order is:

1. `/book/datetime` — pick a hall, date, and time, all in one step. Hall isn't a separate step, it's just the first thing you pick here, since availability is per-hall anyway
2. `/book/movie` — pick a film from the live Now Showing feed, or skip and decide on arrival
3. `/book/package` — pick a package (pricing tier) and optionally the Special Event Upgrade
4. `/book/contact` — guest count and contact details
5. `/book/checkout` — review everything, with an Edit link back to each step, and a callout listing anything still missing. Reachable at any time, not just after finishing steps 1 to 4

The booking flow runs on the normal dark theme, same as the rest of the site, with all step content sitting inside a single `bg-surface` card (`app/book/layout.tsx`) rather than loose on the black page, the same pattern as the "Now Showing" featured film card on the home page. Buttons, inputs, and step nav pills are sized up from the rest of the site (thicker 2px borders, larger padding, 14–16px body text instead of 11–13px) for readability.

`/book/hall` still exists as a route but just redirects to `/book/datetime`, so old bookmarks or links don't break.

Selections live in `lib/bookingContext.tsx`, a React context backed by `sessionStorage` (key `lavish_booking_draft_v1`), wrapped around every `/book/*` page by `app/book/layout.tsx`. Because each step page reads and writes the same draft, navigating between them in any order keeps everything filled in. External links (a movie card's "Book Now", the featured film section's timeslots) seed the draft via query params or directly via `seedBookingDraft()`, which each step reads once on mount.

Submitting at checkout:
1. Posts to `/api/bookings`, which creates a `PENDING` booking and redirects to Paystack's hosted checkout
2. Paystack sends a webhook to `/api/paystack/webhook` on successful payment, which marks the booking `CONFIRMED` and `PAID`
3. `/book/confirmation` double checks payment status directly with Paystack as a fallback, in case the webhook is delayed

The old single-page form (`components/_deprecated_BookingForm.tsx.bak`) and the old standalone hall step (`components/steps/_deprecated_HallStepClient.tsx.bak`) are unused and kept only for reference, safe to delete.

## Now Showing

`/now-showing` and the home page snippet both pull from a live JSON feed at `lib/movies.ts` (currently `https://raw.githubusercontent.com/kristophershola/movie-updater/main/movies.json`), maintained by the separate movie-updater project, not this database. Revalidated every 5 minutes.

A film picked during booking is snapshotted onto the `Booking` row (`movieTitle`, `moviePosterUrl`, `movieTmdbId`), not stored as a foreign key, since movies aren't in this database. If skipped, those fields stay null and every guest-facing and staff-facing page shows "chosen on arrival" instead.

## Pricing

Halls don't carry a price. Price lives on `Package` (Crunch and Drink, Crunch and Wine, BYOF, Slice and Drink, Slice and Wine, Executive), and both halls currently share the same six packages. A booking's `amount` is `package.price + (specialEventUpgrade ? SPECIAL_EVENT_UPGRADE_FEE : 0)`.

If a hall ever needs its own pricing instead of the shared list, add a `hallId` to `Package` and scope the query in `/book` and `/api/bookings` by it, nothing else needs to change since everything already reads price off the `Package` relation.

Edit prices in `prisma/seed.js`, or directly in the database via `npm run db:studio`. Each package also has a `description` (short blurb, shown on the package step) and `imageUrl` (currently a placehold.co placeholder, swap for real package photography whenever it's ready, same field, no code change needed).

## Business rules, all centralized in lib/policy.ts

- Sessions are fixed at 2 hours 20 minutes
- Halls hold 1 to 6 guests
- No cancellations, no refunds
- Reschedule fee is N15,000, must land within 14 days of the original date (reschedule flow not yet built, this is the constant to wire it to)
- Special Event Upgrade is N35,000

If any of these change, edit `lib/policy.ts` only, everything else reads from there.

## Site-wide layout

`components/SiteNav.tsx` and `components/SiteFooter.tsx` are wired into `app/layout.tsx` via `components/SiteChrome.tsx`, so they appear on every page except `/admin/*`, which keeps its own `AdminNav` instead. Footer links to `/about`, `/terms`, `/privacy`, `/refund-policy` are placeholder pages with real structure but copy that still needs legal review, marked as such on the pages themselves.

## Timeslots

Daily start times live in `lib/availability.ts`: 09:30, 12:00, 14:30, 17:00, 19:30, 22:00. End times are always computed as start + 2h20m (`SESSION_DURATION_MINUTES` in `lib/policy.ts`), so the last slot technically ends at 12:20am, not 12:00am. If the last session should actually be a shorter 2-hour slot instead, that needs its own handling since right now every slot shares one fixed duration, flag it if that's the case.

## Homepage sections

Top to bottom: hero with an auto-rotating background carousel (`components/HeroCarousel.tsx`, currently placehold.co placeholder images, swap the `src` values for real hall photography whenever ready), a featured film section (`components/FeaturedFilmSection.tsx`) combining a 6-day date picker with live per-hall timeslots for the top movie in the feed, a Now Showing preview in a 2-2-4 grid (4 large cards, 4 small cards, via `MovieCard`'s `size` prop) with a "See All Movies" button to `/now-showing`, and a How It Works section (`components/HowItWorks.tsx`).

Clicking a timeslot in the featured film section seeds the booking draft directly via `seedBookingDraft()` (same sessionStorage the wizard reads) and jumps straight to `/book/package`, step 4, skipping movie/hall/datetime since all three are already decided by that click.

## Reschedule flow

A guest goes to `/manage`, enters their booking reference and the email they booked with, and if the booking is `CONFIRMED` and `PAID`, they can pick a new date within 14 days of the original and pay the N15,000 fee.

What happens under the hood:
1. `/api/manage/reschedule` checks the new date is within the window and the new slot is free, then stores the requested date/time on the booking as `pendingReschedule*` fields and starts a Paystack transaction for just the fee
2. On successful payment (webhook or the fallback verify on `/manage/confirmation`), `lib/reschedule.ts` creates a brand new `Booking` row for the new date/time carrying over the original guest count and amount, and marks the original booking `RESCHEDULED` so it drops off the admin's daily view
3. The new booking is a fully independent booking, but it carries the running reschedule count forward, so a maximum of 2 reschedules applies across the whole chain, not per row. Once that's hit, `/manage` shows the booking as no longer eligible instead of the reschedule form.

## Admin

Visit `/admin` and log in with the `ADMIN_PASSWORD` set in `.env`. It's a single shared staff login, not individual accounts.

- `/admin` shows today's bookings, with prev/next day navigation, guest and revenue totals, and buttons to mark a booking as seated or a no-show
- `/admin/bookings` shows all upcoming confirmed bookings with search by name, email, or reference
- Only bookings with `paymentStatus: PAID` show status actions, unpaid ones are shown but can't be marked seated

## Featured movie

`/admin/featured` lets staff search the live movie feed and pick which film shows in the home page's "Now Showing" section. The choice is stored in `SiteSettings`, a single-row table (`lib/settings.ts` has the get/set helpers), and the home page falls back to the first movie in the feed if nothing's been picked. The carousel below it automatically excludes whichever movie is currently featured.

## Calendar sheet availability

Staff record walk-in and phone bookings in a shared Google Sheet, separate from this database. `lib/googleSheetsAvailability.ts` reads that sheet's "Hall 1" and "Hall 2" tabs and treats any non-empty cell as taken, whatever code is actually written there (A, B, BYOF, XTRA TIME, etc, none of it is decoded, just presence/absence). Date matching handles both formats seen in the real sheet, "1-Jul" and the occasional "Jul 1" anomaly, both are checked. `getAvailableSlots` in `lib/availability.ts` checks both this database and the sheet, a slot only shows as available if neither source has it marked taken.

This is read-only. Bookings made through the site still only write to this database, not to the sheet, staff need to keep recording walk-ins in the sheet manually for now.

**Getting a key:**
1. Go to console.cloud.google.com, create a project if you don't have one
2. APIs & Services > Library, search "Google Sheets API", enable it
3. APIs & Services > Credentials > Create Credentials > API key
4. Click into the new key, under "API restrictions" choose "Restrict key" and select only "Google Sheets API", so the key can't be used for anything else if it ever leaks
5. Paste it into `GOOGLE_SHEETS_API_KEY` in `.env`

The sheet itself must stay shared as "Anyone with the link can view" for this to work, since there's no OAuth login involved, just a read-only key.

If the key is missing or the sheet is unreachable, availability checks fall back to database-only (a warning is logged, nothing breaks), so a misconfigured key doesn't take the booking flow down, it just stops seeing walk-in bookings until fixed.

The tabs are assumed to be reused every month (cleared out, not recreated with a new name), so "Hall 1" / "Hall 2" as hardcoded tab names should stay valid long term. If that ever changes, `SPREADSHEET_ID` and the tab-name lookup both live in `lib/googleSheetsAvailability.ts`.

## Still to build

- Email/SMS confirmation on successful payment
- Real hall and package photography (replace placeholders in `prisma/seed.js`)
- Editing hall/package details from the admin UI (currently database only, via `npm run db:studio`)
- A loading/empty state for `/now-showing` and the home snippet if the movies feed is slow or down (currently just shows nothing if the fetch fails)

## Deploying

This is set up to deploy on Railway (Postgres + app together). Push this folder to a GitHub repo, then connect it in Railway and set the environment variables from `.env.example`. Set the Paystack webhook URL in your Paystack dashboard to `https://your-domain/api/paystack/webhook`.
