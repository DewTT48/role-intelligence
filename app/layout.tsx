import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const host = headerList.get("host") ?? "localhost:3000";
  const protocol = headerList.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  const title = "Smart JD — JD ที่มีคุณค่ามากกว่าเอกสารหนึ่งฉบับ";
  const description = "เปลี่ยนข้อมูลตำแหน่งให้เป็นโครงสร้างบทบาทงานที่ชัดเจน เป็นมาตรฐาน และนำไปใช้ต่อในงาน HR ได้ดียิ่งขึ้น";
  const socialImage = new URL("/og.png", base).toString();

  return {
    metadataBase: base,
    title,
    description,
    openGraph: {
      type: "website",
      locale: "th_TH",
      title,
      description,
      url: base,
      images: [{ url: socialImage, width: 1200, height: 630, alt: "Smart JD — JD ที่ดี ไม่ได้จบแค่การรับสมัคร" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
