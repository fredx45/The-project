#!/usr/bin/env node
/*
 * Pre-launch check. Run `node preflight.js` before deploying.
 * Scans for placeholders that must be replaced and config that must be filled.
 * Exits 0 when the site is ready, 1 when anything is outstanding.
 * No dependencies, so it works on a bare checkout.
 */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const SKIP = new Set([".git", "node_modules"]);
const TEXT = /\.(html|css|js|txt|xml|md)$/i;

function walk(dir, out) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, out);
    // LAUNCH.md documents the placeholders, so scanning it would always fail.
    else if (TEXT.test(name) && name !== "preflight.js" && name !== "LAUNCH.md") out.push(full);
  }
  return out;
}

// Each check: what is missing, why it matters, and how to tell it is still there.
const CHECKS = [
  { id: "operator", label: "Operator name (privacy policy)",
    why: "UK GDPR requires a named, identifiable operator.",
    test: t => t.includes("[your name or company]") },
  { id: "contact", label: "Contact email (about + privacy)",
    why: "Ad networks expect a working contact route.",
    test: t => t.includes("[your email address]") },
  { id: "date", label: "Policy last-updated date",
    why: "A policy with no date looks abandoned.",
    test: t => t.includes("[date you publish]") },
  { id: "domain", label: "Domain still example.com",
    why: "Link previews and the sitemap need the real host.",
    test: t => t.includes("example.com") },
  { id: "adstxt", label: "ads.txt publisher ID",
    why: "Ads will not serve until ads.txt names your publisher ID.",
    test: t => t.includes("pub-REPLACE_ME") },
  { id: "adsense", label: "AdSense config (ADS.client)",
    why: "Slots stay as placeholders until this is set.",
    test: t => /var ADS = \{ client: ""/.test(t) },
  { id: "ga", label: "GA4 measurement ID (GA.id)",
    why: "No analytics collected until this is set.",
    test: t => /var GA = \{ id: "" \}/.test(t) }
];

const files = walk(ROOT, []);
const found = new Map();

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  for (const check of CHECKS) {
    if (!check.test(text)) continue;
    if (!found.has(check.id)) found.set(check.id, { check, files: [] });
    found.get(check.id).files.push(path.relative(ROOT, file));
  }
}

const RED = "\x1b[31m", GREEN = "\x1b[32m", DIM = "\x1b[2m", OFF = "\x1b[0m";

if (found.size === 0) {
  console.log(`${GREEN}✓ Preflight clean — no placeholders left.${OFF}`);
  console.log(`${DIM}  Still worth checking by hand: ads.txt reachable over HTTPS,`);
  console.log(`  link preview unfurls, and the share button on a real phone.${OFF}`);
  process.exit(0);
}

console.log(`${RED}✗ ${found.size} item${found.size === 1 ? "" : "s"} outstanding before launch:${OFF}\n`);
for (const { check, files: fs_ } of found.values()) {
  console.log(`  ${RED}•${OFF} ${check.label}`);
  console.log(`    ${DIM}${check.why}${OFF}`);
  console.log(`    ${DIM}in: ${fs_.join(", ")}${OFF}\n`);
}
console.log(`${DIM}See LAUNCH.md for what to replace each one with.${OFF}`);
process.exit(1);
