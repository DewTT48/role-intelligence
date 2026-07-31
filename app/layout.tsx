import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const ibmPlexThai = localFont({
  src: [
    { path: "../public/fonts/ibm-plex-sans-thai-thai-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/ibm-plex-sans-thai-thai-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/ibm-plex-sans-thai-thai-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/ibm-plex-sans-thai-thai-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-ibm-plex-thai",
  display: "swap",
});

const ibmPlexLatin = localFont({
  src: [
    { path: "../public/fonts/ibm-plex-sans-thai-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/ibm-plex-sans-thai-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/ibm-plex-sans-thai-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/ibm-plex-sans-thai-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-ibm-plex-latin",
  display: "swap",
});

const siteUrl = new URL("https://dewtt48.github.io/smart-jd/");
const title = "Smart JD — Job Description ที่ดี คือจุดเริ่มต้นของการบริหารคนที่ดี";
const description = "เปลี่ยนข้อมูลตำแหน่งให้เป็น Job Description 19 หมวดที่มีโครงสร้าง เชื่อมบริบทธุรกิจและ Competency พร้อมนำไปใช้ต่อในงาน HR";
const socialImage = "https://dewtt48.github.io/smart-jd/og.png";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title,
  description,
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    locale: "th_TH",
    title,
    description,
    url: siteUrl,
    images: [{ url: socialImage, width: 1200, height: 630, alt: "Smart JD — JD ที่ดี ไม่ได้จบแค่การรับสมัคร" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [socialImage],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body className={`${ibmPlexThai.variable} ${ibmPlexLatin.variable}`}>{children}</body>
    </html>
  );
}
