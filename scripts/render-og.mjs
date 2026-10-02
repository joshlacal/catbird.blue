#!/usr/bin/env node
// Renders 1200x630 Open Graph cards to public/og/*.png with Playwright (Chromium).
// Usage: node scripts/render-og.mjs            -> renders every card in CARDS
//        node scripts/render-og.mjs default    -> renders one card by slug
//
// Type is set in self-hosted Roboto Flex (OFL) only, never the system font, so no
// SF Pro outlines end up in a raster image (SF Pro's license forbids that).
// Background is the token brand gradient (135deg, accent -> accent-gradient-partner).

import { chromium } from '@playwright/test';
import { readFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tokens = JSON.parse(readFileSync(resolve(root, 'design/tokens.json'), 'utf8'));
const color = (name) => tokens.color.tokens.find((t) => t.name === name).value.light;

// Add a card per page that needs its own image. Titles must be real page titles.
const CARDS = [
  { slug: 'default', title: null, subtitle: 'A Bluesky client for iPhone and iPad' },
];

const font = readFileSync(resolve(root, 'public/fonts/RobotoFlex-subset.woff2')).toString('base64');
const icon = readFileSync(resolve(root, 'public/images/app-icon-256.png')).toString('base64');

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const html = (card) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: "OG Roboto Flex"; src: url(data:font/woff2;base64,${font}) format("woff2"); font-weight: 100 1000; font-stretch: 25% 151%; }
html, body { margin: 0; }
.card { width: 1200px; height: 630px; box-sizing: border-box; padding: 84px 96px; display: flex; flex-direction: column; justify-content: center; gap: 28px;
  background: linear-gradient(135deg, ${color('accent')}, ${color('accent-gradient-partner')}); color: #fff; font-family: "OG Roboto Flex"; position: relative; overflow: hidden; }
.lockup { display: flex; align-items: center; gap: 40px; }
.icon { width: 168px; height: 168px; border-radius: 38px; box-shadow: 0 18px 40px rgba(0, 0, 0, 0.18); }
.wordmark { font-size: 148px; line-height: 1; font-weight: 900; font-stretch: 120%; letter-spacing: -0.02em; }
.title { font-size: 64px; line-height: 1.05; font-weight: 800; font-stretch: 120%; letter-spacing: -0.01em; max-width: 1000px; }
.sub { font-size: 44px; line-height: 1.2; font-weight: 560; font-stretch: 105%; opacity: 0.96; max-width: 1000px; color: #ffffff; }
.dot { position: absolute; width: 520px; height: 520px; border-radius: 50%; right: -160px; bottom: -220px; background: rgba(255, 255, 255, 0.10); }
</style></head><body><div class="card"><div class="dot"></div>
<div class="lockup"><img class="icon" src="data:image/png;base64,${icon}" alt=""><span class="wordmark">catbird</span></div>
${card.title ? `<div class="title">${esc(card.title)}</div>` : ''}
${card.subtitle ? `<div class="sub">${esc(card.subtitle)}</div>` : ''}
</div></body></html>`;

const only = process.argv[2];
const cards = only ? CARDS.filter((c) => c.slug === only) : CARDS;
if (!cards.length) throw new Error(`No OG card named "${only}"`);

mkdirSync(resolve(root, 'public/og'), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
for (const card of cards) {
  await page.setContent(html(card), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const out = resolve(root, `public/og/${card.slug}.png`);
  await page.screenshot({ path: out, type: 'png' });
  console.log(`og: wrote public/og/${card.slug}.png`);
}
await browser.close();
