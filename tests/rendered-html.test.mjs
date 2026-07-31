import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html", host: "smart-jd.example" },
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

test("server-renders the Smart JD landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Smart JD — Job Description ที่ดี คือจุดเริ่มต้นของการบริหารคนที่ดี/);
  assert.match(html, /Job Description ที่ดี/);
  assert.match(html, /Job Description 19 หมวด/);
  assert.match(html, /INSIDE YOUR SMART JD/);
  assert.match(html, /Account Executive/);
  assert.match(html, /demo-jd%2Fpage-01\.webp/);
  assert.match(html, /ขอเดโม Smart JD/);
  assert.match(html, /มีบัญชีแล้ว เข้าสู่ระบบ/);
  assert.match(html, /REAL PRODUCT · REAL WORKFLOW/);
  assert.match(html, /RESPONSIBLE AI/);
  assert.match(html, /\/og\.png/);
  assert.doesNotMatch(html, /สร้าง JD ฟรี|เริ่มสร้าง JD ฟรี|codex-preview/);
  assert.doesNotMatch(html, /JOB DATA|Structured role data|Role Data/);
});

test("server-renders the privacy page", async () => {
  const response = await render("/privacy");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /นโยบายความเป็นส่วนตัว/);
  assert.match(html, /31 กรกฎาคม 2569/);
  assert.match(html, /Google Sheet/);
});
