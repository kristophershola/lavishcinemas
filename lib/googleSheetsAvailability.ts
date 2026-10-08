// Reads live availability from the shared Google Sheet ("Hall 1" and
// "Hall 2" tabs), which staff use to record walk-in and phone bookings.
// Read-only for now, via a public Sheets API key, no OAuth needed since
// the sheet is shared as "Anyone with the link can view".
//
// Note: this same spreadsheet also has older "CINEMA 1" / "CINEMA 2" tabs
// with a different, no-longer-current column layout (missing the 9:30am
// slot) and stale data. Those are not used here, only "Hall 1" / "Hall 2".
//
// This does not assume the header is at a fixed row, it scans every row
// in the tab and matches purely on the date cell, so it stays correct
// even if old month blocks or formatting end up stacked above the
// current one.
//
// Date matching handles both "1-Aug" and the occasional "Aug 1" anomaly
// confirmed in the equivalent Python service used elsewhere against this
// same sheet.

const SPREADSHEET_ID = "17-hZjuNdfEczlyLbNBEYmnWbAGLIl45-RZ1PFsNp-6Q";

// Column order in the current-format rows, left to right after the Date
// column. Must line up with DAILY_START_TIMES in lib/availability.ts.
const SHEET_TIME_COLUMNS = ["09:30", "12:00", "14:30", "17:00", "19:30", "22:00"];

async function fetchSheetTab(tabName: string): Promise<string[][]> {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  if (!apiKey) {
    console.error(
      "GOOGLE_SHEETS_API_KEY is not set, skipping the calendar sheet check. " +
        "Online bookings still work, but won't see manually recorded ones."
    );
    return [];
  }

  const range = encodeURIComponent(`'${tabName}'!A1:G1000`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${apiKey}`;

  try {
    const res = await fetch(url, { next: { revalidate: 30 } });
    if (!res.ok) {
      console.error(`Google Sheets fetch failed for tab "${tabName}": ${res.status}`);
      return [];
    }
    const json = await res.json();
    return json.values ?? [];
  } catch (err) {
    console.error(`Google Sheets fetch threw for tab "${tabName}":`, err);
    return [];
  }
}

// "1-Aug" and the occasional "Aug 1" anomaly, both lowercased, so a row
// matches regardless of which way round it was written.
function targetDateVariants(date: Date): Set<string> {
  const day = String(date.getDate());
  const monthAbbr = date.toLocaleDateString("en-US", { month: "short" });
  return new Set([`${day}-${monthAbbr}`.toLowerCase(), `${monthAbbr} ${day}`.toLowerCase()]);
}

// Returns the start times ("09:30", "14:30", ...) marked taken in the
// sheet for this hall and date. Any non-empty cell counts as taken,
// regardless of what the code in it (A, B, BYOF, XTRA TIME, etc) actually
// means, we only care about presence/absence here.
export async function getSheetTakenTimes(
  hallTabName: string,
  date: Date
): Promise<Set<string>> {
  const rows = await fetchSheetTab(hallTabName);
  const taken = new Set<string>();
  if (rows.length === 0) return taken;

  const variants = targetDateVariants(date);

  for (const row of rows) {
    if (!row || !row[0]) continue;

    const dateCell = String(row[0]).trim().toLowerCase();
    if (!variants.has(dateCell)) continue;

    SHEET_TIME_COLUMNS.forEach((startTime, sessionIndex) => {
      const columnIndex = sessionIndex + 1; // column 0 is the date itself
      const cell = row[columnIndex];
      if (cell && cell.trim() !== "") {
        taken.add(startTime);
      }
    });
    break; // found the matching date row, no need to keep scanning
  }

  return taken;
}
