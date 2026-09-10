"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

const APP_URL =
  "https://script.google.com/macros/s/AKfycbyh8i1-rd85lupTa8Li7SF9ce1vBCJL04hi9mURyDjo3SenL0MK6FG-z3DthdQ5BkUC/exec";
const LEAD_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwukSqFDCuGT15ZvM9j0b4hUy1qE1rr2v__kt8NQgj09dubVIpJkrFU1Wd_RfUoSqMx/exec";
// The deployed lead service uses "trial" for demo and account-opening requests.
const DEMO_INQUIRY_VALUE = "trial";
const PUBLIC_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const publicAsset = (path: string) => `${PUBLIC_BASE_PATH}${path}`;

const productTabs = [
  {
    id: "workspace",
    label: "JD Workspace",
    kicker: "สร้าง · ตรวจ · แก้ไข",
    title: "ทำงานกับ JD ใน Workspace เดียว",
    body: "ไล่ตรวจเนื้อหาทีละส่วน ปรับถ้อยคำให้ตรงกับงานจริง และยืนยันก่อนสร้างเป็นเอกสารที่ยังแก้ไขต่อได้",
    image: "/product/jd-workspace.png",
    alt: "หน้าจอจริงของ JD Workspace สำหรับตรวจและแก้ไข Job Description",
  },
  {
    id: "context",
    label: "Business Context",
    kicker: "บริบทที่ไม่หลุดจากองค์กร",
    title: "เชื่อมข้อมูลบริษัทกับทุกตำแหน่ง",
    body: "นำเป้าหมายธุรกิจ โครงสร้างองค์กร และวิธีทำงานของบริษัทมาใช้ประกอบ เพื่อให้ JD ไม่กลายเป็นข้อความทั่วไปที่ใช้ได้กับทุกแห่ง",
    image: "/product/company-context.png",
    alt: "หน้าจอจริงสำหรับจัดการข้อมูลบริษัทและบริบทธุรกิจ",
  },
  {
    id: "batch",
    label: "Batch Import",
    kicker: "มาตรฐานที่ขยายได้",
    title: "นำเข้าข้อมูลหลายตำแหน่งอย่างเป็นระบบ",
    body: "ใช้ชุดคำถามและโครงสร้างเดียวกันกับทุกทีม ลดงานที่ต้องทำซ้ำ และช่วยให้การจัดทำ JD จำนวนมากยังคงมาตรฐานเดียวกัน",
    image: "/product/batch-import.png",
    alt: "หน้าจอจริงสำหรับนำเข้าข้อมูลหลายตำแหน่ง",
  },
];

const outcomes = [
  {
    number: "01",
    title: "สรรหาได้ตรงบทบาท",
    body: [
      "ทำให้ขอบเขตงานและคุณสมบัติที่ต้องการ",
      "ชัดพอที่จะสื่อสารกับผู้สมัครได้ตรงกัน",
      "ตั้งแต่ต้น",
    ],
  },
  {
    number: "02",
    title: "สัมภาษณ์บนหลักฐานเดียวกัน",
    body: [
      "ใช้หน้าที่ ผลลัพธ์ และ Competency",
      "ใน JD เป็นกรอบตั้งคำถาม",
      "และเปรียบเทียบผู้สมัคร",
      "อย่างเป็นธรรมมากขึ้น",
    ],
  },
  {
    number: "03",
    title: "ตั้งเป้าหมายงานได้ชัดขึ้น",
    body: [
      "เชื่อมความรับผิดชอบกับผลลัพธ์ที่คาดหวัง",
      "เพื่อให้หัวหน้ากับพนักงานคุยเรื่องผลงาน",
      "บนความเข้าใจเดียวกัน",
    ],
  },
  {
    number: "04",
    title: "พัฒนาคนได้ตรงจุด",
    body: [
      "เห็นทักษะและ Competency ที่จำเป็นต่อบทบาท",
      "แล้วนำไปใช้วางแผนพัฒนา",
      "ให้ตรงกับงานมากขึ้น",
    ],
  },
  {
    number: "05",
    title: "เตรียมข้อมูลเพื่อประเมินค่างาน",
    body: [
      "มีข้อมูลเรื่องขอบเขต ความรับผิดชอบ",
      "การตัดสินใจ และผลกระทบของงานที่ชัดขึ้น",
      "เพื่อใช้เป็นหลักฐานตั้งต้นในการประเมินค่างาน",
      "โดยผู้เชี่ยวชาญ",
    ],
  },
  {
    number: "06",
    title: "วางกำลังคนและเส้นทางอาชีพ",
    body: [
      "มองเห็นความเชื่อมโยงระหว่างบทบาท",
      "ระดับความรับผิดชอบ และทักษะที่ต้องพัฒนา",
      "เพื่อนำไปประกอบการวาง Workforce Plan",
      "Career Path และ Succession",
    ],
  },
];

const challenges = [
  {
    number: "01",
    title: "เริ่มจากไฟล์เดิม",
    body: ["คัดลอกข้อความเก่ามาใช้ต่อ", "ทั้งที่เป้าหมายและวิธีทำงาน", "เปลี่ยนไปแล้ว"],
  },
  {
    number: "02",
    title: "รายละเอียดไม่เท่ากัน",
    body: ["บางตำแหน่งเขียนละเอียด", "บางตำแหน่งมีเพียงรายการงาน", "สั้น ๆ จนเทียบกันไม่ได้"],
  },
  {
    number: "03",
    title: "เข้าใจบทบาทไม่ตรงกัน",
    body: ["HR กับ Hiring Manager คุยเรื่อง", "ตำแหน่งเดียวกัน", "แต่คาดหวังผลลัพธ์คนละแบบ"],
  },
  {
    number: "04",
    title: "ใช้เพียงตอนรับสมัคร",
    body: ["เมื่อรับคนได้แล้ว ข้อมูลดี ๆ ใน JD", "กลับไม่ได้ถูกนำไปใช้ต่อกับ", "การบริหารผลงานและพัฒนาคน"],
    highlighted: true,
  },
];

const hrUses = [
  "สรรหา",
  "สัมภาษณ์",
  "Onboarding",
  "เป้าหมายและ KPI",
  "Competency",
  "Learning & IDP",
  "Career Path",
  "Succession",
  "ประเมินค่างาน",
  "ค่าตอบแทน",
  "วางกำลังคน",
  "ออกแบบองค์กร",
];

const steps = [
  ["01", "ทำความเข้าใจบทบาท", "ระบุว่าทำไมองค์กรจึงต้องมีตำแหน่งนี้ ต้องรายงานใคร และต้องสร้างผลลัพธ์อะไร"],
  ["02", "เชื่อมบริบทองค์กร", "นำเป้าหมายธุรกิจ วิธีทำงาน และ Competency ขององค์กรมาประกอบกับข้อมูลตำแหน่ง"],
  ["03", "สร้างร่างอย่างมีโครงสร้าง", "ระบบช่วยจัดข้อมูลและเสนอร่างทีละส่วน โดยอ้างอิงจากสิ่งที่ผู้ใช้ระบุ"],
  ["04", "ตรวจให้พร้อมใช้", "HR ตรวจ แก้ไข ยืนยัน และสร้างเป็นเอกสารที่นำไปใช้งานต่อได้"],
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(productTabs[0].id);
  const [contactOpen, setContactOpen] = useState(false);
  const [formStatus, setFormStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const requestIdRef = useRef("");
  const timerRef = useRef<number | null>(null);

  const activeProduct =
    productTabs.find((tab) => tab.id === activeTab) ?? productTabs[0];

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setContactOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    document.body.style.overflow = contactOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [contactOpen]);

  useEffect(() => {
    const receiveResult = (event: MessageEvent) => {
      const result = event.data;
      if (
        !result ||
        result.type !== "JD_LEAD_RESULT" ||
        result.requestId !== requestIdRef.current
      ) {
        return;
      }

      if (timerRef.current) clearTimeout(timerRef.current);
      setSubmitting(false);
      if (result.success) {
        formRef.current?.reset();
        setFormStatus("ส่งข้อมูลเรียบร้อยแล้ว ผู้ดูแลระบบจะติดต่อกลับ");
        window.setTimeout(() => setContactOpen(false), 1800);
      } else {
        setFormStatus(result.message || "ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      }
    };
    window.addEventListener("message", receiveResult);
    return () => window.removeEventListener("message", receiveResult);
  }, []);

  const openContact = () => {
    setMenuOpen(false);
    setFormStatus("");
    setContactOpen(true);
  };

  const submitLead = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = formRef.current;
    if (!form || !form.checkValidity()) {
      form?.reportValidity();
      setFormStatus("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }

    const trap = form.elements.namedItem("company_website") as HTMLInputElement;
    if (trap?.value) {
      form.reset();
      setFormStatus("ส่งข้อมูลเรียบร้อยแล้ว");
      return;
    }

    const requestId =
      window.crypto?.randomUUID?.() ??
      `lead-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    requestIdRef.current = requestId;
    (form.elements.namedItem("request_id") as HTMLInputElement).value = requestId;
    (form.elements.namedItem("page_url") as HTMLInputElement).value = window.location.href;
    (form.elements.namedItem("user_agent") as HTMLInputElement).value = navigator.userAgent;
    const inquirySelect = form.elements.namedItem("inquiry_type") as HTMLSelectElement;
    const messageBody = form.elements.namedItem("message_body") as HTMLTextAreaElement;
    const messageField = form.elements.namedItem("message") as HTMLInputElement;
    const inquiryLabel = inquirySelect.selectedOptions[0]?.textContent?.trim() || "ขอเดโม";
    messageField.value = `[เรื่องที่ติดต่อ: ${inquiryLabel}]\n${messageBody.value.trim()}`;

    setSubmitting(true);
    setFormStatus("กำลังส่งข้อมูล...");
    timerRef.current = window.setTimeout(() => {
      setSubmitting(false);
      setFormStatus("การส่งข้อมูลใช้เวลานานกว่าปกติ กรุณาลองใหม่อีกครั้ง");
    }, 25000);
    form.submit();
  };

  return (
    <>
      <a className="skip-link" href="#main">ข้ามไปยังเนื้อหาหลัก</a>

      <header className="site-header">
        <div className="nav-shell">
          <a className="brand" href="#top" aria-label="Role Intelligence หน้าแรก">
            <span className="brand-mark">RI</span>
            <span>Role Intelligence</span>
          </a>
          <nav className="desktop-nav" aria-label="เมนูหลัก">
            <a href="#jd-preview">ตัวอย่าง JD</a>
            <a href="#value">คุณค่าของ JD</a>
            <a href="#product">ดูระบบจริง</a>
            <a href="#how">วิธีการทำงาน</a>
            <a href="#trust">Responsible AI</a>
          </nav>
          <div className="nav-actions">
            <a className="button button-ghost" href={APP_URL} target="_blank" rel="noopener noreferrer">เข้าสู่ระบบ</a>
            <button className="button button-primary" type="button" onClick={openContact}>ขอเดโม</button>
          </div>
          <button
            className="menu-button"
            type="button"
            aria-label={menuOpen ? "ปิดเมนู" : "เปิดเมนู"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span /><span />
          </button>
        </div>
        {menuOpen && (
          <nav className="mobile-nav" aria-label="เมนูมือถือ">
            <a href="#jd-preview" onClick={() => setMenuOpen(false)}>ตัวอย่าง JD</a>
            <a href="#value" onClick={() => setMenuOpen(false)}>คุณค่าของ JD</a>
            <a href="#product" onClick={() => setMenuOpen(false)}>ดูระบบจริง</a>
            <a href="#how" onClick={() => setMenuOpen(false)}>วิธีการทำงาน</a>
            <a href="#trust" onClick={() => setMenuOpen(false)}>Responsible AI</a>
            <a href={APP_URL} target="_blank" rel="noopener noreferrer">เข้าสู่ระบบ</a>
            <button type="button" onClick={openContact}>ขอเดโม Role Intelligence</button>
          </nav>
        )}
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-orb hero-orb-one" />
          <div className="hero-orb hero-orb-two" />
          <div className="section-shell hero-grid">
            <div className="hero-copy">
              <p className="eyebrow"><span /> ROLE INTELLIGENCE</p>
              <h1 className="title-lines"><span>Job Description ที่ดี</span><span>คือจุดเริ่มต้นของ</span><span><em>การบริหารคนที่ดี</em></span></h1>
              <p className="hero-lead copy-lines">
                <span>เริ่มจากข้อมูลตำแหน่งเพียงไม่กี่เรื่อง</span>
                <span>แล้วเปลี่ยนให้เป็น Job Description 19 หมวด</span>
                <span>ที่อธิบายทั้งเป้าหมายของงาน ความรับผิดชอบ</span>
                <span>ผลลัพธ์ และ Competency ได้อย่างครบถ้วน</span>
              </p>
              <div className="hero-actions">
                <button className="button button-primary button-large" type="button" onClick={openContact}>
                  ขอเดโม Role Intelligence <Arrow />
                </button>
                <a className="button button-secondary button-large" href={APP_URL} target="_blank" rel="noopener noreferrer">
                  มีบัญชีแล้ว เข้าสู่ระบบ
                </a>
              </div>
              <p className="human-note"><span>✓</span> AI ช่วยร่างและจัดโครงสร้าง ส่วนคนเป็นผู้ตรวจ แก้ไข และยืนยันก่อนนำไปใช้</p>
            </div>

            <div className="hero-document" aria-label="ตัวอย่าง Job Description ที่สร้างจาก Role Intelligence">
              <div className="hero-document-bar">
                <span>JOB DESCRIPTION PREVIEW</span>
                <small>ตัวอย่างจากระบบจริง</small>
              </div>
              <div className="hero-page">
                <Image
                  src={publicAsset("/demo-jd/page-01.webp")}
                  alt="ตัวอย่าง Job Description ตำแหน่ง Account Executive หน้าแรก"
                  width={1200}
                  height={1695}
                  unoptimized
                  priority
                  sizes="(max-width: 1050px) 80vw, 48vw"
                />
              </div>
              <div className="hero-document-meta">
                <div><strong>19</strong><span>หัวข้อที่มีโครงสร้าง</span></div>
                <div><strong>8</strong><span>หน้าตัวอย่างฉบับเต็ม</span></div>
                <div><strong>✓</strong><span>ตรวจและแก้ไขก่อนใช้</span></div>
              </div>
              <div className="document-stamp"><span>JD</span> พร้อมสร้างเป็นเอกสาร</div>
            </div>
          </div>
        </section>

        <section className="proof-strip" aria-label="จุดเด่นของ Role Intelligence">
          <div className="section-shell proof-grid">
            <div><strong>19 structured sections</strong><span>ครบทั้งบทบาท งาน และผลลัพธ์</span></div>
            <div><strong>Business-aligned</strong><span>อธิบายว่างานนี้สำคัญต่อธุรกิจอย่างไร</span></div>
            <div><strong>Human-reviewed</strong><span>ผู้ใช้ตรวจและแก้ไขได้ทุกส่วน</span></div>
            <div><strong>Ready for HR</strong><span>พร้อมใช้ต่อในการสรรหาและบริหารคน</span></div>
          </div>
        </section>

        <section className="section jd-preview-section" id="jd-preview">
          <div className="section-shell">
            <div className="section-heading split-heading jd-preview-heading">
              <div>
                <p className="eyebrow"><span /> A LITTLE INPUT · A COMPLETE JD</p>
                <h2 className="title-lines"><span>กรอกข้อมูลไม่กี่เรื่อง</span><span>ได้ JD ที่ครบจนใช้งานต่อได้</span></h2>
              </div>
              <div>
                <p className="copy-lines">
                  <span>ไม่ต้องเริ่มด้วยการเขียนเอกสารยาว ๆ</span>
                  <span>เพียงบอกเหตุผลของตำแหน่ง งานสำคัญ และผลลัพธ์ที่คาดหวัง</span>
                  <span>ระบบจะช่วยเชื่อมข้อมูลเหล่านั้นกับบริบทธุรกิจและ Competency ขององค์กร</span>
                </p>
                <span className="sample-note"><i>✓</i> ตัวอย่างจากระบบจริง: Account Executive · 19 หมวด · 8 หน้า</span>
              </div>
            </div>

            <div className="input-output-comparison">
              <figure className="position-input-card">
                <figcaption>
                  <span className="preview-step">01</span>
                  <div><small>ข้อมูลที่ผู้ใช้กรอก</small><strong>Account Executive</strong></div>
                </figcaption>
                <div className="position-input-frame" aria-label="ตัวอย่างข้อมูลสั้น ๆ ที่ใช้สร้าง Job Description ตำแหน่ง Account Executive">
                  <div className="position-input-label"><span>POSITION INPUT</span><em>ข้อมูลสั้น ๆ</em></div>
                  <div className="position-input-field"><small>เหตุผลที่ต้องมีตำแหน่งนี้</small><p>ดูแลการขายและประสานงานกับลูกค้า เพื่อสร้างโอกาสทางธุรกิจ</p></div>
                  <div className="position-input-field"><small>หากไม่มีตำแหน่งนี้จะเกิดอะไรขึ้น</small><p>ติดตามลูกค้าไม่ต่อเนื่อง โอกาสขายลดลง และข้อมูลไม่เป็นระบบ</p></div>
                  <div className="position-input-field"><small>งานหลักที่รับผิดชอบ</small><p>ติดต่อ Prospect ติดตามลูกค้า ทำใบเสนอราคา และอัปเดต Pipeline</p></div>
                  <div className="position-input-field"><small>ผลลัพธ์ที่ต้องส่งมอบ</small><p>รายงาน Pipeline ใบเสนอราคา นัดหมาย และข้อมูลลูกค้าที่เป็นปัจจุบัน</p></div>
                  <div className="position-input-field"><small>ตัวชี้วัดความสำเร็จ</small><p>จำนวน Lead มูลค่า Pipeline อัตราปิดการขาย และเวลาตอบลูกค้า</p></div>
                  <div className="position-input-field"><small>ขอบเขตความรับผิดชอบ</small><p>ดูแล Prospect ลูกค้าปัจจุบันบางส่วน และข้อมูล Sales Pipeline</p></div>
                </div>
                <p className="position-input-note copy-lines">
                  <span>จากข้อมูลเท่านี้ ระบบจะช่วยจัดโครงสร้าง</span>
                  <span>และเติมรายละเอียดที่จำเป็น โดยผู้ใช้ยังเป็นผู้ตรวจ</span>
                  <span>แก้ไข และยืนยันทุกส่วน</span>
                </p>
              </figure>

              <div className="input-output-flow" aria-hidden="true">
                <span>เชื่อมบริบท<br />และจัดโครงสร้าง</span>
                <b>→</b>
                <small>ผู้ใช้ตรวจสอบ<br />ก่อนนำไปใช้</small>
              </div>

              <section className="complete-jd-card" aria-labelledby="complete-jd-title">
                <header className="complete-jd-toolbar">
                  <div>
                    <span className="preview-step">02</span>
                    <div><small>ผลลัพธ์ที่ได้</small><strong id="complete-jd-title">Account Executive · JD 19 หมวด</strong></div>
                  </div>
                  <span className="scroll-hint">เลื่อนลงเพื่ออ่าน JD ฉบับเต็ม ↓</span>
                </header>
                <div className="complete-jd-scroll" tabIndex={0} aria-label="ตัวอย่าง Job Description ตำแหน่ง Account Executive ฉบับเต็ม 8 หน้า เลื่อนเพื่ออ่าน">
                  {Array.from({ length: 8 }, (_, index) => {
                    const page = index + 1;
                    return (
                      <Image
                        key={page}
                        src={publicAsset(`/demo-jd/page-${String(page).padStart(2, "0")}.webp`)}
                        alt={`หน้า ${page} จาก 8 ของ Job Description ตำแหน่ง Account Executive`}
                        width={1200}
                        height={1695}
                        unoptimized
                        loading={page === 1 ? "eager" : "lazy"}
                        sizes="(max-width: 900px) 100vw, 58vw"
                      />
                    );
                  })}
                </div>
                <footer className="complete-jd-note"><span>✓</span> ครบ 19 หมวดในเอกสารเดียว · ใช้ข้อมูลจำลองและนำข้อมูลส่วนบุคคลออกแล้ว</footer>
              </section>
            </div>
          </div>
        </section>

        <section className="section challenge-section">
          <div className="section-shell">
            <div className="section-heading split-heading">
              <div>
                <p className="eyebrow"><span /> THE REAL CHALLENGE</p>
                <h2 className="title-lines challenge-title"><span>ปัญหาไม่ใช่แค่ “เขียน JD ช้า”</span></h2>
              </div>
              <p className="copy-lines">
                <span>ปัญหาที่หนักกว่าคือ JD จำนวนมากไม่สะท้อนงานที่ทำอยู่จริง</span>
                <span>และไม่ได้บอกให้ชัดว่าตำแหน่งนี้ต้องสร้างผลลัพธ์อะไรให้กับองค์กร</span>
              </p>
            </div>
            <div className="challenge-grid">
              {challenges.map((challenge) => (
                <article key={challenge.number} className={challenge.highlighted ? "challenge-highlight" : undefined}>
                  <span>{challenge.number}</span>
                  <h3>{challenge.title}</h3>
                  <p className="card-copy-lines">{challenge.body.map((line) => <span key={line}>{line}</span>)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section reframe-section">
          <div className="section-shell reframe-grid">
            <div className="reframe-quote">
              <p>หลักการของ Role Intelligence</p>
              <blockquote>
                <span>“เราไม่ได้ทำ JD</span>
                <span>เพียงเพื่อให้มีเอกสาร</span>
                <span>แต่ทำเพื่อให้ทุกคนเข้าใจตรงกันว่า</span>
                <span>งานนี้มีไว้เพื่ออะไร”</span>
              </blockquote>
            </div>
            <div className="reframe-copy">
              <p className="eyebrow light"><span /> FROM BASIC JD TO HR FOUNDATION</p>
              <h2 className="title-lines">
                <span>เปลี่ยนจากการเขียนเอกสาร</span>
                <span>เป็นการทำความเข้าใจ</span>
                <span>บทบาทงาน</span>
              </h2>
              <p>
                Role Intelligence ชวนให้เริ่มจากเหตุผลที่องค์กรต้องมีตำแหน่งนี้ แล้วค่อยเชื่อมไปสู่เป้าหมาย ผลลัพธ์ หน้าที่ ทักษะ และ Competency ที่จำเป็น
              </p>
            </div>
          </div>
        </section>

        <section className="section value-section" id="value">
          <div className="section-shell">
            <div className="section-heading centered-heading">
              <p className="eyebrow"><span /> ONE JD · MORE HR VALUE</p>
              <h2 className="title-lines"><span>JD หนึ่งฉบับ</span><span>ช่วยให้งาน HR ชัดขึ้นทั้งระบบ</span></h2>
              <p>เมื่อทุกคนเห็นเป้าหมายของงาน หน้าที่ ผลลัพธ์ และ Competency ชุดเดียวกัน การสรรหา สัมภาษณ์ บริหารผลงาน และพัฒนาคนก็เชื่อมต่อกันได้ง่ายขึ้น</p>
            </div>
            <div className="outcome-grid">
              {outcomes.map((outcome) => (
                <article key={outcome.number}>
                  <span>{outcome.number}</span>
                  <h3>{outcome.title}</h3>
                  <p className="card-copy-lines">{outcome.body.map((line) => <span key={line}>{line}</span>)}</p>
                </article>
              ))}
            </div>
            <div className="lifecycle-line" aria-label="แนวทางการนำข้อมูลจาก Job Description ไปใช้ต่อในงาน HR">
              <div className="lifecycle-source">
                <small>ข้อมูลตั้งต้น</small>
                <strong>Job Description</strong>
                <span>เป้าหมายงาน · หน้าที่ · ผลลัพธ์ · Competency</span>
              </div>
              <div className="lifecycle-connector" aria-hidden="true"><span>นำไปใช้ต่อ</span><b>→</b></div>
              <div className="lifecycle-uses">
                {hrUses.map((item) => <span key={item}>{item}</span>)}
              </div>
            </div>
          </div>
        </section>

        <section className="section product-section" id="product">
          <div className="section-shell">
            <div className="section-heading split-heading product-heading">
              <div>
                <p className="eyebrow"><span /> REAL PRODUCT · REAL WORKFLOW</p>
                <h2 className="title-lines"><span>ดูวิธีทำงานจริง</span><span>ตั้งแต่ต้นจนได้เอกสาร</span></h2>
              </div>
              <p className="copy-lines">
                <span>ดูว่าข้อมูลบริษัทและข้อมูลตำแหน่งถูกนำมาใช้ร่วมกันอย่างไร</span>
                <span>รวมถึงวิธีจัดทำ JD ทีละตำแหน่งหรือนำเข้าหลายตำแหน่งในครั้งเดียว</span>
              </p>
            </div>
            <div className="product-tabs" role="tablist" aria-label="ตัวอย่างหน้าจอ Role Intelligence">
              {productTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  className={activeTab === tab.id ? "active" : ""}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="product-showcase" role="tabpanel">
              <div className="product-copy">
                <p>{activeProduct.kicker}</p>
                <h3>{activeProduct.title}</h3>
                <span>{activeProduct.body}</span>
                <ul>
                  <li><i>✓</i> ใช้ข้อมูลจริงขององค์กรเป็นจุดเริ่มต้น</li>
                  <li><i>✓</i> ผู้ใช้ตรวจและแก้ไขได้ทุกส่วน</li>
                  <li><i>✓</i> สร้างเอกสารที่นำไปปรับต่อได้</li>
                </ul>
              </div>
              <div className="product-image-wrap">
                <div className="browser-bar"><span /><span /><span /><small>Role Intelligence</small></div>
                <Image
                  key={activeProduct.image}
                  src={publicAsset(activeProduct.image)}
                  alt={activeProduct.alt}
                  width={1440}
                  height={1100}
                  unoptimized
                  sizes="(max-width: 900px) 100vw, 65vw"
                  className="product-image"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="section how-section" id="how">
          <div className="section-shell how-grid">
            <div className="how-intro">
              <p className="eyebrow"><span /> A GUIDED PROCESS</p>
              <h2 className="title-lines"><span>จากเหตุผล</span><span>ที่ต้องมีตำแหน่ง</span><span>สู่ JD ที่พร้อมใช้</span></h2>
              <p>กระบวนการที่ช่วยให้ HR และ Hiring Manager ค่อย ๆ ตอบคำถามสำคัญร่วมกัน โดยไม่ต้องเริ่มจากหน้ากระดาษเปล่า</p>
              <button className="text-link" type="button" onClick={openContact}>ขอดู Workflow แบบเต็ม <Arrow /></button>
            </div>
            <ol className="step-list">
              {steps.map(([number, title, body]) => (
                <li key={number}>
                  <span>{number}</span>
                  <div><h3>{title}</h3><p>{body}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section difference-section">
          <div className="section-shell">
            <div className="section-heading centered-heading">
              <p className="eyebrow"><span /> WHY IT MATTERS</p>
              <h2 className="title-lines"><span>ไม่ใช่แค่ทำ JD ให้เร็วขึ้น</span><span>แต่ทำให้นำไปใช้งานต่อได้ดีขึ้นด้วย</span></h2>
            </div>
            <div className="compare-table">
              <div className="compare-row compare-head"><span>วิธีการ</span><span>จุดเริ่มต้น</span><span>สิ่งที่ได้</span><span>คุณค่าในงาน HR</span></div>
              <div className="compare-row"><strong>Word / ไฟล์เก่า</strong><span>เอกสารเปล่าหรือไฟล์เดิม</span><span>ข้อความและรูปแบบเอกสาร</span><span className="muted-value">จำกัดอยู่ในไฟล์</span></div>
              <div className="compare-row"><strong>Generic AI</strong><span>Prompt</span><span>ร่างข้อความที่รวดเร็ว</span><span className="muted-value">ต้องจัดบริบทและมาตรฐานต่อเอง</span></div>
              <div className="compare-row featured"><strong><i>RI</i> Role Intelligence</strong><span>Business Need + Role Information</span><span>Job Description ที่มีโครงสร้างและผ่านการตรวจ</span><span className="good-value">เป็นข้อมูลตั้งต้นสำหรับ People Decisions</span></div>
            </div>
          </div>
        </section>

        <section className="trust-section" id="trust">
          <div className="section-shell trust-grid">
            <div>
              <p className="eyebrow light"><span /> RESPONSIBLE AI</p>
              <h2 className="title-lines"><span>AI ช่วยร่าง</span><span><em>มนุษย์ตัดสินใจ</em></span></h2>
            </div>
            <div className="trust-points">
              <p><span>01</span>AI ช่วยร่างและจัดข้อมูลให้เป็นหมวดหมู่จากสิ่งที่ผู้ใช้ระบุ</p>
              <p><span>02</span>ผู้ใช้ตรวจ แก้ไข และยืนยันเนื้อหาด้วยตนเองก่อนสร้างเอกสาร</p>
              <p><span>03</span>การตัดสินใจเรื่องการจ้าง ค่าตอบแทน การเลิกจ้าง และ Job Evaluation ยังคงเป็นหน้าที่ของคน</p>
            </div>
          </div>
        </section>

        <section className="section founder-section">
          <div className="section-shell founder-grid">
            <div className="founder-card">
              <Image
                src={publicAsset("/dew-teerapap.jpeg")}
                alt="ดิว ธีรภาพ ผู้พัฒนา Role Intelligence"
                width={888}
                height={888}
                unoptimized
                sizes="(max-width: 760px) 100vw, 38vw"
                className="founder-photo"
              />
              <div><strong>Dew Teerapap</strong><small>HR × AI Workflow Designer</small></div>
            </div>
            <div className="founder-copy">
              <p className="eyebrow"><span /> BUILT FROM REAL HR PRACTICE</p>
              <h2 className="title-lines"><span>สร้างจากประสบการณ์</span><span>ทำงาน HR จริง</span><span>ไม่ใช่ชุดคำสั่งสำเร็จรูป</span></h2>
              <p>Role Intelligence เริ่มจากคำถามที่ HR และ Hiring Manager ต้องคุยกันให้ชัด ก่อนจะสรุปบทบาทหนึ่งออกมาเป็นเอกสารที่ทุกฝ่ายนำไปใช้ร่วมกันได้</p>
              <blockquote>“เครื่องมือที่ดีไม่ควรเพียงเขียนแทนเรา แต่ควรช่วยให้เราคิดเรื่องงานได้ชัดขึ้น”</blockquote>
            </div>
          </div>
        </section>

        <section className="vision-section">
          <div className="section-shell vision-grid">
            <div>
              <p className="eyebrow"><span /> PRODUCT DIRECTION</p>
              <h2 className="title-lines"><span>เริ่มจาก JD ที่ชัด</span><span>แล้วเชื่อมงานบริหารคน</span><span>เข้าด้วยกัน</span></h2>
            </div>
            <div className="vision-road">
              <div className="vision-current"><small>ข้อมูลตั้งต้นที่พร้อมใช้งาน</small><strong>Job Description 19 หมวดที่มีโครงสร้าง</strong><span>อธิบายเป้าหมายของงาน หน้าที่ ผลลัพธ์ ขอบเขตความรับผิดชอบ และ Competency บนข้อมูลชุดเดียวกัน</span></div>
              <div className="vision-arrow"><span>นำข้อมูลชุดเดียวกันไปใช้ต่อ</span><b>↓</b></div>
              <div className="vision-future"><small>แนวทางการนำข้อมูลไปใช้ต่อในงาน HR</small><div>{hrUses.map((item) => <span key={item}>{item}</span>)}</div></div>
            </div>
          </div>
        </section>

        <section className="final-section">
          <div className="section-shell final-box">
            <div>
              <p className="eyebrow light"><span /> START WITH A BETTER FOUNDATION</p>
              <h2 className="title-lines"><span>ลองทำให้ JD ของคุณ</span><span>เป็นเอกสารที่เอาไปใช้งาน HR ได้จริง</span></h2>
              <p className="copy-lines">
                <span>ดูตั้งแต่การเก็บข้อมูลตำแหน่ง เชื่อมบริบทธุรกิจ</span>
                <span>สร้างร่าง ตรวจแก้ จนได้เอกสารที่พร้อมนำไปใช้ต่อจริง</span>
              </p>
            </div>
            <div className="final-actions">
              <button className="button button-light button-large" type="button" onClick={openContact}>ขอเดโม <Arrow /></button>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-shell footer-grid">
          <div className="brand"><span className="brand-mark">RI</span><span>Role Intelligence</span></div>
          <p>สร้าง JD ที่มีคุณค่าต่อการตัดสินใจด้านคน</p>
          <div><Link href="/privacy">นโยบายความเป็นส่วนตัว</Link><button type="button" onClick={openContact}>ติดต่อผู้ดูแล</button></div>
          <small>© {new Date().getFullYear()} Role Intelligence</small>
        </div>
      </footer>

      {contactOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.currentTarget === event.target) setContactOpen(false);
        }}>
          <section className="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-title">
            <div className="modal-header">
              <div><p className="eyebrow"><span /> REQUEST A DEMO</p><h2 id="contact-title">ขอเดโม Role Intelligence</h2><p>เล่าให้เราฟังสั้น ๆ ว่าองค์กรของคุณต้องการพัฒนา JD ในด้านใด</p></div>
              <button type="button" aria-label="ปิดแบบฟอร์ม" onClick={() => setContactOpen(false)}>×</button>
            </div>
            <form
              ref={formRef}
              className="lead-form"
              action={LEAD_ENDPOINT}
              method="post"
              target="jd-lead-submission-frame"
              onSubmit={submitLead}
              noValidate
            >
              <input className="honeypot" type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <label className="full-field"><span className="field-label">เรื่องที่ต้องการติดต่อ <i>*</i></span><select name="inquiry_type" required defaultValue={DEMO_INQUIRY_VALUE}><option value={DEMO_INQUIRY_VALUE}>ขอเดโม Role Intelligence</option><option value="pricing">สอบถามราคาและเครดิต</option><option value="corporate">สอบถามสำหรับองค์กร</option><option value="support">แจ้งปัญหาการใช้งาน</option><option value="partnership">ความร่วมมือ / อื่น ๆ</option></select></label>
              <label><span className="field-label">ชื่อผู้ติดต่อ <i>*</i></span><input name="name" type="text" autoComplete="name" required /></label>
              <label><span className="field-label">บริษัท / องค์กร <i>*</i></span><input name="company" type="text" autoComplete="organization" required /></label>
              <label><span className="field-label">อีเมลสำหรับติดต่อกลับ <i>*</i></span><input name="email" type="email" autoComplete="email" required /></label>
              <label>เบอร์โทรศัพท์<input name="phone" type="tel" autoComplete="tel" /></label>
              <label>ตำแหน่ง / บทบาท<input name="role" type="text" autoComplete="organization-title" /></label>
              <label>จำนวนพนักงานโดยประมาณ<select name="organization_size" defaultValue=""><option value="">เลือกช่วง</option><option value="1-20">1–20 คน</option><option value="21-50">21–50 คน</option><option value="51-200">51–200 คน</option><option value="201-500">201–500 คน</option><option value="501+">มากกว่า 500 คน</option></select></label>
              <label className="full-field"><span className="field-label">สิ่งที่ต้องการพัฒนาเกี่ยวกับ JD <i>*</i></span><textarea name="message_body" rows={4} required placeholder="เช่น ต้องการปรับ JD ให้เป็นมาตรฐาน หรือนำข้อมูลไปใช้ในการสรรหาและประเมินผลงาน" /></label>
              <label className="consent full-field"><input type="checkbox" name="consent" value="accepted" required /><span>ฉันยินยอมให้เก็บและใช้ข้อมูลนี้เพื่อติดต่อกลับเกี่ยวกับบริการ <Link href="/privacy" target="_blank">อ่านนโยบายความเป็นส่วนตัว</Link></span></label>
              <input type="hidden" name="message" value="" />
              <input type="hidden" name="source" value="role-intelligence-demo-landing" />
              <input type="hidden" name="request_id" value="" />
              <input type="hidden" name="page_url" value="" />
              <input type="hidden" name="user_agent" value="" />
              <div className="form-footer full-field"><p aria-live="polite">{formStatus}</p><button className="button button-primary button-large" type="submit" disabled={submitting}>{submitting ? "กำลังส่ง..." : "ส่งคำขอเดโม"}</button></div>
            </form>
            <iframe name="jd-lead-submission-frame" title="ผลการส่งแบบฟอร์มขอเดโม" hidden />
          </section>
        </div>
      )}
    </>
  );
}
