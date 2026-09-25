import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.GITHUB_PAGES === "true" ? "/role-intelligence" : "";

const siteUrl = new URL("https://role-intelligence.pjdjpd-3375.chatgpt.site/");
const title = "Role Intelligence — เปลี่ยน Job Description ให้ขับเคลื่อนผลลัพธ์";
const description = "ทำให้ทุกบทบาทชัดเจน เชื่อมเป้าหมาย งาน ผลลัพธ์ KPI และ Competency เพื่อให้ Job Description นำไปใช้ต่อในงาน HR ได้จริง";
const socialImage = "https://role-intelligence.pjdjpd-3375.chatgpt.site/og.png";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: "Role Intelligence",
  title,
  description,
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    locale: "th_TH",
    title,
    description,
    url: siteUrl,
    images: [{ url: socialImage, width: 1200, height: 630, alt: "Role Intelligence — จาก JD สู่บทบาทที่ขับเคลื่อนผลลัพธ์" }],
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
      <head>
        <link rel="manifest" href={`${basePath}/manifest.webmanifest`} />
        <link rel="apple-touch-icon" sizes="180x180" href={`${basePath}/icons/apple-touch-icon.png`} />
        <meta name="apple-mobile-web-app-title" content="Role Intelligence" />
      </head>
      <body>{children}</body>
    </html>
  );
}
