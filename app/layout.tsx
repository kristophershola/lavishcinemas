import type { Metadata } from "next";
import { Inter, Comforter } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const comforter = Comforter({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-comforter",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Lavish Cinemas | Private Cinema Bookings",
  description:
    "Book a private cinema hall in Nigeria. Sessions for 1 to 6 guests, 2 hours 20 minutes, your film chosen on arrival."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${comforter.variable}`}
    >
      <body className="antialiased">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
