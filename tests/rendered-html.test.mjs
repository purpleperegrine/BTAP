import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("https://barleys.example/", {
      headers: { accept: "text/html" },
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

test("server-renders the complete Barley's landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Barley(?:’|&rsquo;|&#x27;|')s Taproom/);
  assert.match(html, /Pizza, pints/);
  assert.match(html, /id="food-menu"/);
  assert.match(html, /id="beer-menu"/);
  assert.match(html, /id="live-music"/);
  assert.match(html, /id="visit"/);
  assert.match(html, /tel:\+18282888388/);
  assert.match(html, /facebook\.com\/barleysinspindale/);
  assert.match(html, /data-cta="primary-CTA"/);
  assert.match(html, /data-cta="secondary-CTA"/);
  assert.match(html, /og\.png/);
});

test("removes all starter-preview markers and dependencies", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(page, /SkeletonPreview|codex-preview|Your site is taking shape/);
  assert.doesNotMatch(layout, /SkeletonPreview|codex-preview|Starter Project/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.match(page, /aria-label="Primary navigation"/);
  assert.match(page, /className="skip-link"/);
  assert.match(page, /mobile-cta-bar/);
});
