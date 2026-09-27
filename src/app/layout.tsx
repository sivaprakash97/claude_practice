import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fluxby AI — Procurement prototype",
  description: "Clickable prototype of the Fluxby AI software research flow.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.className} h-full antialiased`}>
      <body className="min-h-full bg-grey-50 text-grey-700">{children}</body>
    </html>
  );
}
