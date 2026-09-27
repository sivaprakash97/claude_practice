import type { Metadata } from "next";
import { Manrope } from "next/font/google";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fluxby AI — Procurement prototype",
  description: "Clickable prototype of the Fluxby AI software research flow.",
};

export default function ProcurementLayout({ children }: LayoutProps<"/procurement">) {
  return <div className={`${manrope.className} bg-grey-50 text-grey-700`}>{children}</div>;
}
