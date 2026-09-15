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

ลิงก์เข้าสู่ระบบชี้ไปยัง Role Intelligence Production V3.4.7 ส่วน Lead API ยังคงใช้บริการรับคำขอเดโมเดิม

ตั้งแต่ V3.4.2 ระบบจะบันทึกและตรวจสอบ Version 1 โดยอัตโนมัติหลังสร้าง JD สำเร็จ การแก้ไขด้วยผู้ใช้หรือ AI จะอยู่ในสถานะร่าง และสร้าง Version ถัดไปเมื่อผู้ใช้กดบันทึกเท่านั้น ส่วน V3.4.3 เพิ่มการรีเฟรชตำแหน่งหลังนำเข้าทันที การแจ้งข้อมูลที่ขาดทั้งด้านบนและด้านล่าง และลดรอบอ่านเขียน Google Sheets ในงานหลัก และ V3.4.4 เพิ่มหน้าต่างแสดงสถานะอัปโหลดแบบป้องกันการกดซ้ำ พร้อมลดภาระการอ่านไฟล์ XLSX และแสดงรายการ Staging ใหม่โดยไม่โหลดคิวทั้งชีตซ้ำ

V3.4.5 เพิ่มหน้าต่างแสดงสถานะการสร้าง JD พร้อมเวลาที่ผ่านไปและข้อความแจ้งตามขั้นตอนโดยไม่กำหนดเวลาสำเร็จที่อาจคลาดเคลื่อน ปรับ Job Purpose ให้มีเนื้อหาครบขึ้นและตรวจซ่อมอัตโนมัติเมื่อสั้นเกินไป แสดงการใช้เครดิต AI ให้ชัดเจน แยกจากการบันทึก Version ที่ไม่หักเครดิตเพิ่ม เร่งการบันทึกร่างและแสดงรายการที่นำเข้าใหม่ทันที พร้อมบันทึกข้อมูลเวลาเพื่อใช้วิเคราะห์ประสิทธิภาพต่อไป โดยยังคงค่า Gemini Thinking Budget 4,096 และ Max Output 24,000 เพื่อรักษาคุณภาพ JD

V3.4.6 เป็น hotfix สำหรับการนำเข้ารายการที่เลือก แก้ขอบเขตตัวแปรผลลัพธ์ `createdInputRows` และเพิ่มการตรวจรายการที่เขียนลง Position Input แล้ว เพื่อให้ระบบเชื่อมสถานะกลับโดยไม่สร้างตำแหน่งซ้ำเมื่อเกิดการทำงานค้างระหว่างขั้นตอน

V3.4.7 แก้หน้า Admin ให้เรียงกิจกรรมล่าสุดตามค่าของเวลาจริงแทนการเรียงข้อความ รองรับชั่วโมงแบบไม่เติมเลขศูนย์จาก Google Sheets และกำหนดการแสดงผลเป็นเวลาไทย `Asia/Bangkok` อย่างชัดเจน โดยไม่แก้ไขหรือลบ Audit Log เดิม
