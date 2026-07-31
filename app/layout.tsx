import type { Metadata } from "next";
import "@ibm/plex-sans-thai/css/ibm-plex-sans-thai-all.css";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
