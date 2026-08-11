import type { Metadata } from "next";
import { Big_Shoulders, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Big_Shoulders({
  variable: "--font-display-src",
  subsets: ["latin"],
});

const body = Inter({
  variable: "--font-body-src",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono-src",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Ridgeback Cycles - New & Used Bikes",
  description:
    "Road, mountain, hybrid, e-bike and kids bikes. Ship or collect in-store. No account needed to buy.",
};

// SiteHeader/SiteFooter used to live here, which meant every route in the
// app -- including /admin -- inherited the public storefront nav. They now
// live in app/(storefront)/layout.tsx instead, so only the actual
// storefront pages get them. This root layout just provides the shared
// html/body shell and fonts that every route (storefront AND admin) needs.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">{children}</body>
    </html>
  );
}