import type { Metadata } from "next";
import {
  Edu_SA_Beginner,
  Edu_TAS_Beginner,
  IBM_Plex_Mono,
  IBM_Plex_Serif,
  Instrument_Sans,
  Nanum_Pen_Script,
} from "next/font/google";
import "./globals.css";

const instrument = Instrument_Sans({ subsets: ["latin"], axes: ["wdth"], variable: "--font-instrument" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-plex-mono" });
const plexSerif = IBM_Plex_Serif({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-plex-serif" });
const eduTas = Edu_TAS_Beginner({ subsets: ["latin"], variable: "--font-edu-tas" });
const eduSa = Edu_SA_Beginner({ subsets: ["latin"], variable: "--font-edu-sa" });
const nanum = Nanum_Pen_Script({ subsets: ["latin"], weight: "400", variable: "--font-nanum" });

export const metadata: Metadata = {
  title: "Designing a smart procurement experience — ORO Labs case study",
  description: "A solution to preventing duplicate purchases at your organisation. Product design case study for ORO Labs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fonts = [instrument, plexMono, plexSerif, eduTas, eduSa, nanum].map((f) => f.variable).join(" ");
  return (
    <html lang="en" className={fonts}>
      <body>{children}</body>
    </html>
  );
}
