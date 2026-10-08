"use client";

import { usePathname } from "next/navigation";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // Admin has its own AdminNav and login flow, stacking the public nav
  // and footer on top of that would just be noise for staff.
  if (isAdmin) return <>{children}</>;

  return (
    <>
      <SiteNav />
      {children}
      <SiteFooter />
    </>
  );
}
