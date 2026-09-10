import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "นโยบายความเป็นส่วนตัว | Role Intelligence",
  description: "นโยบายการเก็บและใช้ข้อมูลจากแบบฟอร์มติดต่อ Role Intelligence",
};

export default function PrivacyPage() {
  return (
    <>
      <header className="site-header">
        <div className="nav-shell">
          <Link className="brand" href="/">
            <span className="brand-mark">RI</span>
            <span>Role Intelligence</span>
          </Link>
          <div className="legal-nav">
            <Link className="button button-ghost" href="/">กลับหน้าแรก</Link>
          </div>
        </div>
      </header>
      <main className="legal-page">
        <article className="legal-content">
          <p className="eyebrow"><span /> PRIVACY</p>
          <h1>นโยบายความเป็นส่วนตัว</h1>
          <p className="legal-updated">ปรับปรุงล่าสุด: 31 กรกฎาคม 2569</p>

          <h2>ข้อมูลที่เราเก็บ</h2>
          <p>เมื่อคุณส่งแบบฟอร์มติดต่อ เราอาจเก็บชื่อ บริษัท อีเมล เบอร์โทรศัพท์ ตำแหน่งงาน ขนาดองค์กร หัวข้อที่สนใจ และข้อความที่คุณส่งมา</p>

          <h2>วัตถุประสงค์ในการใช้ข้อมูล</h2>
          <p>เราใช้ข้อมูลเพื่อพิจารณาคำขอเดโม คำขอใช้บริการ ตอบคำถาม ให้การสนับสนุน และติดต่อกลับเกี่ยวกับ Role Intelligence เท่านั้น</p>

          <h2>การเก็บรักษาและการเปิดเผยข้อมูล</h2>
          <p>ข้อมูลจะถูกจัดเก็บใน Google Sheet ที่ผู้ดูแลระบบเป็นเจ้าของ จำกัดการเข้าถึงเฉพาะผู้ดูแลที่เกี่ยวข้อง และจะไม่ขายหรือเปิดเผยเพื่อการโฆษณาของบุคคลภายนอก</p>

          <h2>สิทธิของเจ้าของข้อมูล</h2>
          <p>คุณสามารถขอเข้าถึง แก้ไข หรือลบข้อมูลที่ส่งผ่านแบบฟอร์มได้ โดยใช้แบบฟอร์มติดต่อบนเว็บไซต์และเลือกหัวข้อ “ความร่วมมือ / อื่น ๆ”</p>

          <h2>การเปลี่ยนแปลงนโยบาย</h2>
          <p>นโยบายนี้อาจปรับปรุงตามการพัฒนาบริการ โดยจะแสดงวันที่ปรับปรุงล่าสุดไว้บนหน้านี้</p>
        </article>
      </main>
      <footer className="site-footer">
        <div className="section-shell legal-footer">
          <div className="brand"><span className="brand-mark">RI</span><span>Role Intelligence</span></div>
          <Link href="/">กลับหน้าแรก</Link>
          <small>© {new Date().getFullYear()} Role Intelligence</small>
        </div>
      </footer>
    </>
  );
}
