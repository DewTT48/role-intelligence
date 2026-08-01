import type { Metadata } from "next";
import "./globals.css";

const siteUrl = new URL("https://dewtt48.github.io/smart-jd/");
const title = "ระบบสร้าง JD อัจฉริยะ — Job Description ที่ดี คือจุดเริ่มต้นของการบริหารคนที่ดี";
const description = "เริ่มจากข้อมูลตำแหน่งเพียงไม่กี่เรื่อง แล้วเปลี่ยนให้เป็น Job Description 19 หมวดที่อธิบายเป้าหมาย งาน ผลลัพธ์ และ Competency ได้ครบ พร้อมนำไปใช้ต่อในงาน HR";
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
    images: [{ url: socialImage, width: 1200, height: 630, alt: "ระบบสร้าง JD อัจฉริยะ — JD ที่ดี ไม่ได้จบแค่การรับสมัคร" }],
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
