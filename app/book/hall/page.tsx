import { redirect } from "next/navigation";

// Hall selection now lives inside /book/datetime. This route stays only so
// old bookmarks and links still work.
export default function HallStepPage() {
  redirect("/book/datetime");
}
