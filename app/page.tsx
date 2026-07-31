"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

const APP_URL =
  "https://script.google.com/macros/s/AKfycbwLVLP47ZKYsMz6cpAYSGVPWdmQ6g9AmX0cDF1A0SV6tx9NR8Z1A_snPuAnw2tMHFRf/exec";
const LEAD_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwukSqFDCuGT15ZvM9j0b4hUy1qE1rr2v__kt8NQgj09dubVIpJkrFU1Wd_RfUoSqMx/exec";

const productTabs = [
  {
    id: "workspace",
    label: "JD Workspace",
    kicker: "สร้าง · ตรวจ · แก้ไข",
    title: "ทำงานกับ JD ใน Workspace เดียว",
    body: "ตรวจทานเนื้อหาเป็นรายส่วน ปรับให้ตรงบริบท และยืนยันก่อนสร้างเอกสารที่นำไปแก้ไขต่อได้",
    image: "/product/jd-workspace.png",
    alt: "หน้าจอจริงของ JD Workspace สำหรับตรวจและแก้ไข Job Description",
  },
  {
    id: "context",
    label: "Business Context",
    kicker: "บริบทที่ไม่หลุดจากองค์กร",
    title: "เชื่อมข้อมูลบริษัทกับทุกตำแหน่ง",
    body: "ใช้เป้าหมายธุรกิจ โครงสร้างองค์กร และบริบทการทำงานเป็นข้อมูลประกอบ แทนการเริ่มจากข้อความทั่วไป",
    image: "/product/company-context.png",
    alt: "หน้าจอจริงสำหรับจัดการข้อมูลบริษัทและบริบทธุรกิจ",
  },
  {
    id: "batch",
    label: "Batch Import",
    kicker: "มาตรฐานที่ขยายได้",
    title: "นำเข้าข้อมูลหลายตำแหน่งอย่างเป็นระบบ",
    body: "ใช้โครงสร้างข้อมูลเดียวกันข้ามทีม ลดงานซ้ำ และช่วยให้การจัดทำ JD จำนวนมากควบคุมได้ง่ายขึ้น",
    image: "/product/batch-import.png",
    alt: "หน้าจอจริงสำหรับนำเข้าข้อมูลหลายตำแหน่ง",
  },
];

const outcomes = [
  {
    number: "01",
    title: "สรรหาได้ตรงบทบาท",
    body: "เปลี่ยนความต้องการทางธุรกิจให้เป็นขอบเขตงานและคุณสมบัติที่ผู้สมัครเข้าใจตรงกัน",
  },
  {
    number: "02",
    title: "สัมภาษณ์บนหลักฐานเดียวกัน",
    body: "ใช้หน้าที่ ผลลัพธ์ และ Competency เป็นกรอบในการออกแบบคำถามและประเมินผู้สมัคร",
  },
  {
    number: "03",
    title: "ตั้งเป้าหมายงานได้ชัดขึ้น",
    body: "เชื่อมความรับผิดชอบกับผลลัพธ์ที่คาดหวัง เพื่อให้การคุยเรื่องผลงานมีจุดอ้างอิงร่วมกัน",
  },
  {
    number: "04",
    title: "พัฒนาคนได้ตรงจุด",
    body: "มองเห็นทักษะและ Competency ที่บทบาทต้องการ เพื่อใช้เป็นข้อมูลตั้งต้นในการวางแผนพัฒนา",
  },
];

const steps = [
  ["01", "Define the role", "ระบุเหตุผลของตำแหน่ง เป้าหมาย สายบังคับบัญชา และผลลัพธ์ที่ธุรกิจต้องการ"],
  ["02", "Connect the context", "เชื่อม Business Context และ Competency ขององค์กรกับข้อมูลตำแหน่ง"],
  ["03", "Build the draft", "ระบบช่วยจัดโครงสร้างและสร้างร่างเป็นรายส่วนจากข้อมูลที่คุณให้"],
  ["04", "Review & use", "HR ตรวจ แก้ไข ยืนยัน และสร้างเอกสารที่พร้อมนำไปใช้งานต่อ"],
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
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
          <a className="brand" href="#top" aria-label="Smart JD หน้าแรก">
            <span className="brand-mark">JD</span>
            <span>Smart JD</span>
          </a>
          <nav className="desktop-nav" aria-label="เมนูหลัก">
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
            <a href="#value" onClick={() => setMenuOpen(false)}>คุณค่าของ JD</a>
            <a href="#product" onClick={() => setMenuOpen(false)}>ดูระบบจริง</a>
            <a href="#how" onClick={() => setMenuOpen(false)}>วิธีการทำงาน</a>
            <a href="#trust" onClick={() => setMenuOpen(false)}>Responsible AI</a>
            <a href={APP_URL} target="_blank" rel="noopener noreferrer">เข้าสู่ระบบ</a>
            <button type="button" onClick={openContact}>ขอเดโม Smart JD</button>
          </nav>
        )}
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-orb hero-orb-one" />
          <div className="hero-orb hero-orb-two" />
          <div className="section-shell hero-grid">
            <div className="hero-copy">
              <p className="eyebrow"><span /> JOB DATA THAT WORKS HARDER</p>
              <h1>JD ที่ดี<br />ไม่ได้จบแค่<br /><em>การรับสมัคร</em></h1>
              <p className="hero-lead">
                เปลี่ยนข้อมูลตำแหน่งให้เป็นโครงสร้างบทบาทงานที่ชัดเจน
                เป็นมาตรฐาน และมีคุณค่าต่อการตัดสินใจด้านคนตลอด Employee Lifecycle
              </p>
              <div className="hero-actions">
                <button className="button button-primary button-large" type="button" onClick={openContact}>
                  ขอเดโม Smart JD <Arrow />
                </button>
                <a className="button button-secondary button-large" href={APP_URL} target="_blank" rel="noopener noreferrer">
                  มีบัญชีแล้ว เข้าสู่ระบบ
                </a>
              </div>
              <p className="human-note"><span>✓</span> AI ช่วยจัดโครงสร้าง — มนุษย์ตรวจ แก้ไข และตัดสินใจก่อนใช้จริง</p>
            </div>

            <div className="role-map" aria-label="แผนภาพแสดง JD เป็นข้อมูลตั้งต้นสำหรับงาน HR">
              <div className="map-topline"><span>ROLE FOUNDATION</span><strong>Marketing Manager</strong></div>
              <div className="map-core">
                <div className="map-score"><span>JD</span><small>Structured role data</small></div>
                <div className="map-fields">
                  <span>Job Purpose</span><span>Expected Outcomes</span><span>Responsibilities</span><span>Competencies</span>
                </div>
              </div>
              <div className="map-divider"><span>นำข้อมูลไปใช้ต่อ</span></div>
              <div className="map-outcomes">
                <div><b>01</b><span>Recruitment</span></div>
                <div><b>02</b><span>Interview</span></div>
                <div><b>03</b><span>Performance</span></div>
                <div><b>04</b><span>Development</span></div>
              </div>
              <div className="map-stamp"><span>✓</span> Human reviewed</div>
            </div>
          </div>
        </section>

        <section className="proof-strip" aria-label="จุดเด่นของ Smart JD">
          <div className="section-shell proof-grid">
            <div><strong>Structured</strong><span>ข้อมูลตำแหน่งเป็นระบบ</span></div>
            <div><strong>Business-aligned</strong><span>เชื่อมบริบทองค์กร</span></div>
            <div><strong>Human-reviewed</strong><span>HR ควบคุมทุกขั้น</span></div>
            <div><strong>Reusable</strong><span>นำไปใช้ในงาน HR ต่อได้</span></div>
          </div>
        </section>

        <section className="section challenge-section">
          <div className="section-shell">
            <div className="section-heading split-heading">
              <div>
                <p className="eyebrow"><span /> THE REAL CHALLENGE</p>
                <h2>ปัญหาไม่ได้อยู่ที่<br />“เขียน JD ไม่เร็วพอ”</h2>
              </div>
              <p>
                แต่อยู่ที่ข้อมูลตำแหน่งไม่ชัด ไม่ทันงานจริง และไม่ได้ถูกออกแบบให้เชื่อมกับการตัดสินใจด้านคนตั้งแต่ต้น
              </p>
            </div>
            <div className="challenge-grid">
              <article><span>01</span><h3>เริ่มจากไฟล์เก่า</h3><p>Copy & Paste เนื้อหาเดิม โดยไม่ได้ทบทวนว่าบทบาทเปลี่ยนไปอย่างไร</p></article>
              <article><span>02</span><h3>มาตรฐานไม่เหมือนกัน</h3><p>แต่ละทีมใช้ภาษา โครงสร้าง และระดับรายละเอียดต่างกัน</p></article>
              <article><span>03</span><h3>มองงานคนละภาพ</h3><p>HR และ Hiring Manager ไม่ได้เริ่มต้นจากความคาดหวังชุดเดียวกัน</p></article>
              <article className="challenge-highlight"><span>04</span><h3>จบเป็นเอกสาร Static</h3><p>ทำเสร็จเพื่อเปิดรับสมัคร แล้วข้อมูลสำคัญไม่ได้ถูกนำไปใช้ต่อ</p></article>
            </div>
          </div>
        </section>

        <section className="section reframe-section">
          <div className="section-shell reframe-grid">
            <div className="reframe-quote">
              <p>SMART JD PRINCIPLE</p>
              <blockquote>“เราไม่ได้สร้าง JD เพื่อให้มีเอกสารครบ<br />แต่สร้างให้ทุกคนเข้าใจว่า งานนี้มีไว้เพื่ออะไร”</blockquote>
            </div>
            <div className="reframe-copy">
              <p className="eyebrow light"><span /> FROM DOCUMENT TO ROLE DATA</p>
              <h2>เปลี่ยนจากการเขียนเอกสาร<br />เป็นการออกแบบบทบาทงาน</h2>
              <p>
                Smart JD พาคุณเริ่มจาก Business Need แล้วเชื่อมเป้าหมายของบทบาท ผลลัพธ์ หน้าที่ ทักษะ และ Competency เข้าไว้ในโครงสร้างเดียวกัน
              </p>
            </div>
          </div>
        </section>

        <section className="section value-section" id="value">
          <div className="section-shell">
            <div className="section-heading centered-heading">
              <p className="eyebrow"><span /> ONE JD · MORE HR VALUE</p>
              <h2>JD หนึ่งฉบับ เป็นข้อมูลตั้งต้น<br />ให้ HR ทำงานได้ดีกว่าเดิม</h2>
              <p>ไม่ได้แทนระบบ HR อื่น แต่ช่วยให้ทุก Workflow เริ่มจากข้อมูลบทบาทที่ชัดและสอดคล้องกัน</p>
            </div>
            <div className="outcome-grid">
              {outcomes.map((outcome) => (
                <article key={outcome.number}>
                  <span>{outcome.number}</span>
                  <h3>{outcome.title}</h3>
                  <p>{outcome.body}</p>
                </article>
              ))}
            </div>
            <div className="lifecycle-line" aria-label="วงจรการนำ JD ไปใช้ต่อ">
              <span className="active">Job Description</span><i>→</i><span>Recruitment</span><i>→</i><span>Interview</span><i>→</i><span>Performance</span><i>→</i><span>Learning</span><i>→</i><span>Career</span>
            </div>
          </div>
        </section>

        <section className="section product-section" id="product">
          <div className="section-shell">
            <div className="section-heading split-heading product-heading">
              <div>
                <p className="eyebrow"><span /> REAL PRODUCT · REAL WORKFLOW</p>
                <h2>ดูระบบจริง<br />ไม่ใช่แค่ภาพแนวคิด</h2>
              </div>
              <p>ตั้งแต่ข้อมูลบริษัท การจัดทำ JD ทีละตำแหน่ง ไปจนถึงการนำเข้าหลายตำแหน่งด้วยมาตรฐานเดียวกัน</p>
            </div>
            <div className="product-tabs" role="tablist" aria-label="ตัวอย่างหน้าจอ Smart JD">
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
                <div className="browser-bar"><span /><span /><span /><small>Smart JD workspace</small></div>
                <Image
                  key={activeProduct.image}
                  src={activeProduct.image}
                  alt={activeProduct.alt}
                  width={1440}
                  height={1100}
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
              <h2>จาก Business Need<br />สู่ JD ที่พร้อมใช้</h2>
              <p>Workflow ที่ช่วยให้ HR และ Hiring Manager คุยกันบนข้อมูลชุดเดียวกัน โดยไม่เริ่มจากหน้ากระดาษเปล่า</p>
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
              <p className="eyebrow"><span /> WHY SMART JD</p>
              <h2>เร็วขึ้นอย่างเดียวไม่พอ<br />ต้องนำไปใช้ต่อได้ด้วย</h2>
            </div>
            <div className="compare-table">
              <div className="compare-row compare-head"><span>วิธีการ</span><span>จุดเริ่มต้น</span><span>สิ่งที่ได้</span><span>คุณค่าในงาน HR</span></div>
              <div className="compare-row"><strong>Word / ไฟล์เก่า</strong><span>เอกสารเปล่าหรือไฟล์เดิม</span><span>ข้อความและรูปแบบเอกสาร</span><span className="muted-value">จำกัดอยู่ในไฟล์</span></div>
              <div className="compare-row"><strong>Generic AI</strong><span>Prompt</span><span>ร่างข้อความที่รวดเร็ว</span><span className="muted-value">ต้องจัดบริบทและมาตรฐานต่อเอง</span></div>
              <div className="compare-row featured"><strong><i>JD</i> Smart JD</strong><span>Business Need + Role Data</span><span>JD ที่มีโครงสร้างและผ่านการตรวจ</span><span className="good-value">เป็นข้อมูลตั้งต้นสำหรับ People Decisions</span></div>
            </div>
          </div>
        </section>

        <section className="trust-section" id="trust">
          <div className="section-shell trust-grid">
            <div>
              <p className="eyebrow light"><span /> RESPONSIBLE AI</p>
              <h2>AI ช่วยร่าง<br /><em>มนุษย์ตัดสินใจ</em></h2>
            </div>
            <div className="trust-points">
              <p><span>01</span>AI ช่วยจัดโครงสร้างและเสนอเนื้อหาจากข้อมูลที่ผู้ใช้ให้</p>
              <p><span>02</span>ผู้ใช้เลือก ตรวจ แก้ไข และยืนยันก่อนสร้างเอกสารทุกครั้ง</p>
              <p><span>03</span>ระบบไม่ตัดสินใจเรื่องการจ้าง ค่าตอบแทน การเลิกจ้าง หรือ Job Evaluation แทนผู้ใช้</p>
            </div>
          </div>
        </section>

        <section className="section founder-section">
          <div className="section-shell founder-grid">
            <div className="founder-card">
              <span className="founder-monogram">DT</span>
              <div><strong>Dew Teerapap</strong><small>HR × AI Workflow Designer</small></div>
            </div>
            <div className="founder-copy">
              <p className="eyebrow"><span /> BUILT FROM REAL HR PRACTICE</p>
              <h2>สร้างจาก Workflow งาน HR จริง<br />ไม่ใช่ Prompt สำเร็จรูป</h2>
              <p>Smart JD ถูกออกแบบจากคำถามที่ HR และ Hiring Manager ต้องตอบร่วมกัน ก่อนที่บทบาทหนึ่งจะกลายเป็นเอกสารหรือข้อมูลในระบบ</p>
              <blockquote>“เครื่องมือที่ดีไม่ควรแค่เขียนแทนเรา แต่ควรช่วยให้เราคิดเรื่องงานได้ชัดขึ้น”</blockquote>
            </div>
          </div>
        </section>

        <section className="vision-section">
          <div className="section-shell vision-grid">
            <div>
              <p className="eyebrow"><span /> PRODUCT DIRECTION</p>
              <h2>เริ่มจาก JD<br />ต่อยอดสู่ People System</h2>
            </div>
            <div className="vision-road">
              <div className="vision-current"><small>พร้อมใช้งานในปัจจุบัน</small><strong>Smart JD</strong><span>Structured role data</span></div>
              <div className="vision-arrow">→</div>
              <div className="vision-future"><small>แนวทางการต่อยอด</small><div><span>Interview</span><span>Competency</span><span>KPI</span><span>Career</span></div></div>
            </div>
          </div>
        </section>

        <section className="final-section">
          <div className="section-shell final-box">
            <div>
              <p className="eyebrow light"><span /> START WITH A BETTER FOUNDATION</p>
              <h2>ทำให้ JD ฉบับต่อไป<br />มีคุณค่ามากกว่าเดิม</h2>
              <p>ดู Workflow ตั้งแต่รับข้อมูลตำแหน่ง เชื่อมบริบทธุรกิจ สร้างร่าง ตรวจแก้ ไปจนถึงเอกสารที่พร้อมใช้</p>
            </div>
            <div className="final-actions">
              <button className="button button-light button-large" type="button" onClick={openContact}>ขอเดโม Smart JD <Arrow /></button>
              <a href={APP_URL} target="_blank" rel="noopener noreferrer">มีบัญชีแล้ว เข้าสู่ระบบ</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-shell footer-grid">
          <div className="brand"><span className="brand-mark">JD</span><span>Smart JD</span></div>
          <p>สร้าง JD ที่มีคุณค่าต่อการตัดสินใจด้านคน</p>
          <div><Link href="/privacy">นโยบายความเป็นส่วนตัว</Link><button type="button" onClick={openContact}>ติดต่อผู้ดูแล</button></div>
          <small>© {new Date().getFullYear()} Smart JD</small>
        </div>
      </footer>

      {contactOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.currentTarget === event.target) setContactOpen(false);
        }}>
          <section className="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-title">
            <div className="modal-header">
              <div><p className="eyebrow"><span /> REQUEST A DEMO</p><h2 id="contact-title">ขอเดโม Smart JD</h2><p>เล่าให้เราฟังสั้น ๆ ว่าองค์กรของคุณต้องการพัฒนา JD ในด้านใด</p></div>
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
              <label className="full-field">เรื่องที่ต้องการติดต่อ <span>*</span><select name="inquiry_type" required defaultValue="demo"><option value="demo">ขอเดโม Smart JD</option><option value="trial">ขอทดลองใช้ / ขอเปิดบัญชี</option><option value="pricing">สอบถามราคาและเครดิต</option><option value="corporate">สอบถามสำหรับองค์กร</option><option value="support">แจ้งปัญหาการใช้งาน</option><option value="partnership">ความร่วมมือ / อื่น ๆ</option></select></label>
              <label>ชื่อผู้ติดต่อ <span>*</span><input name="name" type="text" autoComplete="name" required /></label>
              <label>บริษัท / องค์กร <span>*</span><input name="company" type="text" autoComplete="organization" required /></label>
              <label>อีเมลสำหรับติดต่อกลับ <span>*</span><input name="email" type="email" autoComplete="email" required /></label>
              <label>เบอร์โทรศัพท์<input name="phone" type="tel" autoComplete="tel" /></label>
              <label>ตำแหน่ง / บทบาท<input name="role" type="text" autoComplete="organization-title" /></label>
              <label>จำนวนพนักงานโดยประมาณ<select name="organization_size" defaultValue=""><option value="">เลือกช่วง</option><option value="1-20">1–20 คน</option><option value="21-50">21–50 คน</option><option value="51-200">51–200 คน</option><option value="201-500">201–500 คน</option><option value="501+">มากกว่า 500 คน</option></select></label>
              <label className="full-field">สิ่งที่ต้องการพัฒนาเกี่ยวกับ JD <span>*</span><textarea name="message" rows={4} required placeholder="เช่น ต้องการปรับ JD ให้เป็นมาตรฐาน หรือนำข้อมูลไปใช้ในการสรรหาและประเมินผลงาน" /></label>
              <label className="consent full-field"><input type="checkbox" name="consent" value="accepted" required /><span>ฉันยินยอมให้เก็บและใช้ข้อมูลนี้เพื่อติดต่อกลับเกี่ยวกับบริการ <Link href="/privacy" target="_blank">อ่านนโยบายความเป็นส่วนตัว</Link></span></label>
              <input type="hidden" name="source" value="smart-jd-landing" />
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
