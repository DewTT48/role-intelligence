# ระบบสร้าง JD อัจฉริยะ

Landing page สำหรับระบบสร้าง JD อัจฉริยะ — ระบบที่ช่วยเปลี่ยนข้อมูลตำแหน่งให้เป็น Job Description 19 หมวดที่มีโครงสร้าง เป็นมาตรฐาน และนำไปใช้ต่อในงาน HR ได้ดียิ่งขึ้น

เว็บไซต์: [https://dewtt48.github.io/smart-jd/](https://dewtt48.github.io/smart-jd/)

โปรเจกต์นี้เป็นเว็บไซต์ใหม่ที่แยกจาก `DewTT48/smart-jd-builder` โดยสมบูรณ์ จึงสามารถพัฒนาและเผยแพร่ได้โดยไม่กระทบ Landing Page เดิม

## สิ่งที่มีในเว็บไซต์

- Landing page ภาษาไทยแบบ Responsive
- CTA `ขอเดโม` และ `เข้าสู่ระบบ` โดยไม่มีการเสนอสร้าง JD ฟรี
- ภาพหน้าจอระบบจริง: JD Workspace, Business Context และ Batch Import
- ตัวอย่าง Job Description ฉบับจริง 8 หน้า พร้อมตัวสำรวจเนื้อหา 19 หมวด
- IBM Plex Sans Thai แบบ Self-hosted ครบ 4 น้ำหนัก
- ฟอร์มขอเดโมที่เชื่อมกับ Google Apps Script Lead API เดิม
- หน้า `/privacy` สำหรับนโยบายความเป็นส่วนตัว
- Social Preview Card สำหรับการแชร์ลิงก์
- Responsible AI และ Human Validation statement

## เริ่มต้นในเครื่อง

```bash
npm install
npm run dev
```

เว็บไซต์จะเปิดที่ URL ที่แสดงใน Terminal

## ตรวจสอบก่อนเผยแพร่

```bash
npm test
```

GitHub Pages จะ build และ publish อัตโนมัติจาก branch `main` ผ่าน GitHub Actions

## โครงสร้างหลัก

- `app/page.tsx` — หน้า Landing Page และการทำงานของฟอร์ม
- `app/globals.css` — Design system และ Responsive layout
- `app/privacy/page.tsx` — นโยบายความเป็นส่วนตัว
- `public/product/` — ภาพหน้าจอผลิตภัณฑ์จริง
- `public/og.png` — Social Preview Card
- `.openai/hosting.json` — การตั้งค่าสำหรับ Sites

## การเชื่อมระบบ

ลิงก์เข้าสู่ระบบและ Lead API ใช้ปลายทางเดียวกับ Landing Page ปัจจุบัน เพื่อรักษา Workflow ของผู้ใช้เดิมและการรับคำขอเดโม
