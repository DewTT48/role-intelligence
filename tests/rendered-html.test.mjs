import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html", host: "role-intelligence.example" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Role Intelligence landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Role Intelligence — เปลี่ยน Job Description ให้ขับเคลื่อนผลลัพธ์/);
  assert.match(html, /Job Description ที่ดี/);
  assert.match(html, /Job Description 19 หมวด/);
  assert.match(html, /A LITTLE INPUT · A COMPLETE JD/);
  assert.match(html, /Account Executive/);
  assert.match(html, /demo-jd\/page-01\.webp/);
  assert.match(html, /demo-jd\/page-08\.webp/);
  assert.match(html, /เลื่อนลงเพื่ออ่าน JD ฉบับเต็ม/);
  assert.match(html, /ขอเดโม Role Intelligence/);
  assert.match(html, /มีบัญชีแล้ว เข้าสู่ระบบ/);
  assert.match(html, /REAL PRODUCT · REAL WORKFLOW/);
  assert.match(html, /RESPONSIBLE AI/);
  assert.match(html, /\/og\.png/);
  assert.match(html, /\/icon\.svg/);
  assert.doesNotMatch(html, /สร้าง JD ฟรี|เริ่มสร้าง JD ฟรี|codex-preview/);
  assert.doesNotMatch(html, /JOB DATA|Structured role data|Role Data/);
});

test("keeps the demo form compatible with the deployed lead service", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(source, /const DEMO_INQUIRY_VALUE = "trial"/);
  assert.match(source, /name="inquiry_type"/);
  assert.match(source, /name="message_body"/);
  assert.match(source, /name="message"/);
  assert.match(source, /role-intelligence-demo-landing/);
  assert.match(source, /\[เรื่องที่ติดต่อ: \$\{inquiryLabel\}\]/);
});

test("server-renders the privacy page", async () => {
  const response = await render("/privacy");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /นโยบายความเป็นส่วนตัว/);
  assert.match(html, /31 กรกฎาคม 2569/);
  assert.match(html, /Google Sheet/);
});
