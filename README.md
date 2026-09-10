# Role Intelligence

Landing page สำหรับ Role Intelligence — ระบบที่ช่วยเปลี่ยน Job Description ให้เป็นข้อมูลบทบาทที่เชื่อมเป้าหมาย งาน ผลลัพธ์ KPI และ Competency เพื่อนำไปใช้ต่อในงาน HR ได้จริง

เว็บไซต์สำหรับตรวจภายใน: [https://role-intelligence.pjdjpd-3375.chatgpt.site/](https://role-intelligence.pjdjpd-3375.chatgpt.site/)

โปรเจกต์นี้ clone จาก `DewTT48/smart-jd` แล้วแยกเป็นเว็บไซต์ใหม่โดยสมบูรณ์ จึงพัฒนาและเผยแพร่ได้โดยไม่กระทบ Landing Page เดิม

## สิ่งที่มีในเว็บไซต์

- Landing page ภาษาไทยแบบ Responsive ภายใต้แบรนด์ Role Intelligence
- ธีม Midnight Navy, Electric Blue, Performance Red และ Yellow accent
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

ลิงก์เข้าสู่ระบบชี้ไปยัง Retail UAT V3.3.2 ส่วน Lead API ยังคงใช้บริการรับคำขอเดโมเดิม
