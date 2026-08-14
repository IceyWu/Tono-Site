import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const dist = join(projectRoot, "dist");

const files = readdirSync(dist, { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => join(entry.parentPath, entry.name));
const htmlFiles = files.filter((file) => file.endsWith(".html"));

assert(htmlFiles.length > 0, "No generated HTML pages found in dist");

const resolvePublicPath = (pathname) => {
  const clean = decodeURIComponent(pathname).replace(/^\/+/, "");
  if (!clean) return join(dist, "index.html");
  if (clean === "404" || clean === "404/") return join(dist, "404.html");
  if (extname(clean)) return join(dist, clean);
  return join(dist, clean, "index.html");
};

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const label = relative(dist, file);
  const is404 = /(^|[\\/])404(?:[\\/]|\.html)/.test(label);

  assert.match(html, /<html lang="(?:zh-CN|en)"/, `${label}: missing valid lang`);
  assert.match(html, /<title>[^<]+<\/title>/, `${label}: missing title`);
  assert.match(html, /<meta name="description" content="[^"]+"/, `${label}: missing description`);
  assert.match(html, /<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>/, `${label}: missing h1`);

  if (!is404) {
    assert.match(html, /<link rel="canonical" href="https:\/\/tonomemo\.com\//, `${label}: missing canonical`);
    assert.match(html, /hreflang="x-default"/, `${label}: missing x-default`);
    assert.match(html, /<meta property="og:image:type" content="image\/png"/, `${label}: missing OG image type`);
    assert.match(html, /<meta name="twitter:image:alt" content="[^"]+"/, `${label}: missing Twitter image alt`);
  }

  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const value = match[1];
    if (!value || /^(?:https?:|mailto:|tel:|data:|#)/.test(value)) continue;
    const url = new URL(value, "https://tonomemo.com");
    assert(existsSync(resolvePublicPath(url.pathname)), `${label}: missing internal target ${value}`);
  }

  for (const match of html.matchAll(/<img\b([^>]*)>/g)) {
    assert.match(match[1], /\balt="[^"]*"/, `${label}: image missing alt`);
  }
}

const product = readFileSync(join(dist, "liubai", "index.html"), "utf8");
assert.match(product, /https:\/\/apps\.apple\.com\/app\/id6794540351/, "Incorrect App Store URL");
assert.match(product, /TestFlight\s*·\s*即将开放/, "Incorrect pending TestFlight state");
assert.match(product, /aria-disabled="true"/, "Pending TestFlight control lacks aria-disabled");

const manifest = JSON.parse(readFileSync(join(dist, "manifest.webmanifest"), "utf8"));
for (const icon of ["icon-192.png", "icon-512.png", "icon-maskable-512.png"]) {
  assert(manifest.icons.some((item) => item.src.endsWith(icon)), `Manifest missing ${icon}`);
  assert(existsSync(join(dist, icon)), `Build artifact missing ${icon}`);
}

const sitemap = readFileSync(join(dist, "sitemap-0.xml"), "utf8");
assert.match(sitemap, /<loc>https:\/\/tonomemo\.com\/liubai\/<\/loc><lastmod>2026-08-14/, "Incorrect product lastmod");
assert.match(sitemap, /<loc>https:\/\/tonomemo\.com\/liubai\/privacy\/<\/loc><lastmod>2026-07-25/, "Incorrect legal-page lastmod");

console.log(`Verified ${htmlFiles.length} HTML pages and ${files.length} build artifacts.`);
