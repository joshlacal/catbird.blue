#!/usr/bin/env node
// Renders the 1200x630 Open Graph cards in scripts/og/cards.mjs to public/og/<slug>.png.
//
//   node scripts/og/render-og.mjs           every card
//   node scripts/og/render-og.mjs features  one card by slug
//
// Type: the bundled Roboto Flex subset (public/fonts/RobotoFlex-subset.woff2, OFL) at
// font-stretch 120%, the width the app uses for its navigation titles. The font is embedded
// as a data URL and no system font is named, so SF Pro outlines can never end up in the art
// (SF Pro's licence forbids that).
// Background: the app icon's own gradient, tokens icon-gradient-top -> icon-gradient-bottom,
// top to bottom, reaching the bottom colour at 70% height exactly as AppIcon.icon/icon.json does.
// Artwork: the app's bird (scripts/og/assets/catbird-head.png, a byte-for-byte copy of
// Catbird/Catbird/Resources/Assets.xcassets/CatbirdIcon.imageset/catbird head square.png).

import { chromium } from '@playwright/test';
import { readFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CARDS } from './cards.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const tokens = JSON.parse(readFileSync(resolve(root, 'design/tokens.json'), 'utf8'));
const color = (name) => {
  const token = tokens.color.tokens.find((t) => t.name === name);
  if (!token) throw new Error(`Missing colour token ${name}`);
  return token.value.light;
};

const font = readFileSync(resolve(root, 'public/fonts/RobotoFlex-subset.woff2')).toString('base64');
const bird = readFileSync(resolve(here, 'assets/catbird-head.png')).toString('base64');

// Opaque bounding box of the bird inside the 1080x1080 source PNG (alpha > 0).
const SRC = 1080;
const BOX = { x: 88, y: 219, w: 901, h: 642 };

const esc = (s) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/** An <img> of the bird, cropped by CSS so `width` is the visible bird width. */
function birdImg(width, cls) {
  const k = width / BOX.w;
  const size = SRC * k;
  return `<div class="${cls}" style="width:${width}px;height:${BOX.h * k}px">
    <img src="data:image/png;base64,${bird}" alt="" style="width:${size}px;height:${size}px;left:${-BOX.x * k}px;top:${-BOX.y * k}px">
  </div>`;
}

const css = `
@font-face {
  font-family: "OG Display";
  src: url(data:font/woff2;base64,${font}) format("woff2");
  font-weight: 100 1000;
  font-stretch: 25% 151%;
}
html, body { margin: 0; }
* { box-sizing: border-box; }
.card {
  width: 1200px; height: 630px; position: relative; overflow: hidden;
  background: linear-gradient(180deg, ${color('icon-gradient-top')} 0%, ${color('icon-gradient-bottom')} 70%);
  color: ${color('on-accent')};
  font-family: "OG Display";
  font-optical-sizing: auto;
}
.bird { position: absolute; }
.bird img { position: absolute; max-width: none; filter: drop-shadow(0 22px 36px rgba(0, 24, 80, 0.35)); }
.wordmark { font-weight: 900; font-stretch: 120%; letter-spacing: -0.02em; line-height: 1; }
.url { font-weight: 650; font-stretch: 110%; font-size: 30px; letter-spacing: 0; }

/* brand layout: bird centred at ~40% of the width, wordmark below */
.brand { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.brand .bird { position: relative; }
.brand .wordmark { font-size: 120px; margin-top: 34px; }
.brand .sub { font-size: 34px; font-weight: 560; font-stretch: 105%; margin-top: 18px; }

/* page layout: text left, bird right */
.page .text { position: absolute; left: 80px; top: 72px; bottom: 64px; width: 620px; display: flex; flex-direction: column; }
.page .wordmark { font-size: 60px; }
.page .title { margin-top: auto; font-size: 92px; line-height: 0.98; font-weight: 820; font-stretch: 120%; letter-spacing: -0.015em; text-wrap: balance; }
.page .title.long { font-size: 68px; line-height: 1.04; }
.page .sub { margin-top: 22px; font-size: 34px; line-height: 1.22; font-weight: 520; font-stretch: 100%; text-wrap: pretty; }
.page .url { margin-top: auto; padding-top: 28px; }
.page .bird { right: 56px; top: 50%; transform: translateY(-50%); }
`;

function html(card) {
  const body =
    card.layout === 'brand'
      ? `<div class="card brand">
          ${birdImg(440, 'bird')}
          <div class="wordmark">catbird</div>
          ${card.subtitle ? `<div class="sub">${esc(card.subtitle)}</div>` : ''}
        </div>`
      : `<div class="card page">
          <div class="text">
            <div class="wordmark">catbird</div>
            <div class="title${card.title.length > 18 ? ' long' : ''}">${esc(card.title)}</div>
            ${card.subtitle ? `<div class="sub">${esc(card.subtitle)}</div>` : ''}
            <div class="url">catbird.blue</div>
          </div>
          ${birdImg(430, 'bird')}
        </div>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>${css}</style></head><body>${body}</body></html>`;
}

const only = process.argv[2];
const cards = only ? CARDS.filter((c) => c.slug === only) : CARDS;
if (!cards.length) throw new Error(`No OG card named "${only}"`);

mkdirSync(resolve(root, 'public/og'), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
for (const card of cards) {
  await page.setContent(html(card), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const loaded = await page.evaluate(() => document.fonts.check('900 120px "OG Display"'));
  if (!loaded) throw new Error('Roboto Flex did not load; refusing to render with a fallback font');
  await page.screenshot({ path: resolve(root, `public/og/${card.slug}.png`), type: 'png' });
  console.log(`og: wrote public/og/${card.slug}.png`);
}
await browser.close();
