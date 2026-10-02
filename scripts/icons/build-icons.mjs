#!/usr/bin/env node
// Builds the site's icon set from the app's real icon sources. Nothing here is redrawn.
//
//   public/favicon.svg         Flat silver bird on solid #5192ff. The bird geometry and fills are
//                              copied verbatim from the Android adaptive-icon foreground vector
//                              (android/Catbird/app/src/main/res/drawable/ic_launcher_foreground.xml),
//                              the only true vector of the Catbird bird.
//   public/favicon-32.png      favicon.svg rasterized (Chromium, 8x supersampled, box-filtered down).
//   public/favicon-48.png      Same, at 48 px.
//   public/apple-touch-icon.png  180x180, full-bleed, opaque RGB (no alpha channel).
//   public/logo.png            512x512, full-bleed, opaque RGB. For the OAuth metadata logo_uri.
//
// Full-bleed icons: Icon Composer's ictool renders the shipped AppIcon.icon (gradient + Liquid Glass
// bird) at the exact target size, but it always applies the rounded-square mask and an edge rim
// highlight. The bird and the background inside the shape are kept exactly as rendered; only the
// masked corners and the rim band (outermost ~3% of the edge) are replaced with the icon's own
// background colour, sampled row by row from the render (the background is a vertical gradient,
// so each row is one colour). Result: Apple can apply its own mask without a double edge.
//
// Requirements: macOS with Xcode (for ictool), the repo's Playwright Chromium.
// Usage: node scripts/icons/build-icons.mjs
//   Env ANDROID_FOREGROUND, APP_ICON override the source paths.

import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, mkdtempSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync, crc32 } from 'node:zlib';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const workspace = resolve(root, '..');
const ANDROID_FOREGROUND =
  process.env.ANDROID_FOREGROUND ??
  join(workspace, 'android/Catbird/app/src/main/res/drawable/ic_launcher_foreground.xml');
const APP_ICON = process.env.APP_ICON ?? join(workspace, 'Catbird/Catbird/Resources/AppIcon.icon');
const ICTOOL =
  '/Applications/Xcode.app/Contents/Applications/Icon Composer.app/Contents/Executables/ictool';

const FAVICON_BG = '#5192ff'; // tokens.json color "accent" (all brand themes)

// ---------------------------------------------------------------------------------------------
// 1. favicon.svg from the Android vector drawable
// ---------------------------------------------------------------------------------------------

function parseVectorDrawable(xml) {
  const attr = (block, name) => block.match(new RegExp(`android:${name}="([^"]*)"`))?.[1];
  const vector = xml.match(/<vector[\s\S]*?>/)[0];
  const viewportWidth = Number(attr(vector, 'viewportWidth'));
  const viewportHeight = Number(attr(vector, 'viewportHeight'));
  const paths = [...xml.matchAll(/<path[\s\S]*?\/>/g)].map(([block]) => ({
    d: attr(block, 'pathData'),
    fill: attr(block, 'fillColor'),
    evenOdd: attr(block, 'fillType') === 'evenOdd',
  }));
  if (!viewportWidth || !viewportHeight || paths.length === 0 || paths.some((p) => !p.d || !p.fill)) {
    throw new Error('Could not parse the Android vector drawable');
  }
  return { viewportWidth, viewportHeight, paths };
}

function faviconSvg({ viewportWidth: w, viewportHeight: h, paths }) {
  // The drawable centres the bird inside Android's 72dp safe zone of a 108dp canvas, which is
  // too small for a 16 px tab icon. Scale the group (not the paths) about the bird's visual
  // centre so it fills ~86% of the tile. The paths themselves are copied unchanged.
  const birdBox = { x0: 20.48, x1: 87.5, y0: 30.75, y1: 76.77 }; // from the head + beak pathData
  const cx = (birdBox.x0 + birdBox.x1) / 2;
  const cy = (birdBox.y0 + birdBox.y1) / 2;
  const scale = 1.38;
  const body = paths
    .map((p) => `    <path fill="${p.fill}"${p.evenOdd ? ' fill-rule="evenodd"' : ''} d="${p.d}"/>`)
    .join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">
  <title>Catbird</title>
  <rect width="${w}" height="${h}" rx="24" fill="${FAVICON_BG}"/>
  <g transform="translate(${w / 2} ${h / 2 + 1}) scale(${scale}) translate(${-cx} ${-cy})">
${body}
  </g>
</svg>
`;
}

// ---------------------------------------------------------------------------------------------
// 2. Minimal PNG writer (8-bit RGB, no alpha, sRGB chunk)
// ---------------------------------------------------------------------------------------------

function pngRgb(width, height, rgb) {
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(td) >>> 0);
    return Buffer.concat([len, td, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: truecolour, no alpha
  const raw = Buffer.alloc((width * 3 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 3 + 1)] = 0; // filter: none
    rgb.copy(raw, y * (width * 3 + 1) + 1, y * width * 3, (y + 1) * width * 3);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('sRGB', Buffer.from([0])), // perceptual
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/** RGBA PNG for small favicons (keeps the transparent rounded corners). */
function pngRgba(width, height, rgba) {
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(td) >>> 0);
    return Buffer.concat([len, td, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6; // truecolour + alpha
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('sRGB', Buffer.from([0])),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---------------------------------------------------------------------------------------------
// 3. In-page pixel work (runs in Chromium so the P3-tagged ictool PNG is colour-managed to sRGB)
// ---------------------------------------------------------------------------------------------

/** Rasterize an SVG at `size` px: render 8x larger, then halve with box filtering. */
async function rasterizeSvg(page, svg, size) {
  return page.evaluate(
    async ({ svg, size }) => {
      const img = new Image();
      img.src = 'data:image/svg+xml;base64,' + btoa(svg);
      await img.decode();
      let s = size * 8;
      let c = new OffscreenCanvas(s, s);
      c.getContext('2d').drawImage(img, 0, 0, s, s);
      while (s > size) {
        const next = s / 2;
        const src = c.getContext('2d').getImageData(0, 0, s, s).data;
        const out = new ImageData(next, next);
        for (let y = 0; y < next; y++) {
          for (let x = 0; x < next; x++) {
            // Premultiplied 2x2 box average so transparent edges don't darken.
            let r = 0, g = 0, b = 0, a = 0;
            for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
              const i = ((y * 2 + dy) * s + (x * 2 + dx)) * 4;
              const al = src[i + 3];
              r += src[i] * al; g += src[i + 1] * al; b += src[i + 2] * al; a += al;
            }
            const o = (y * next + x) * 4;
            out.data[o] = a ? Math.round(r / a) : 0;
            out.data[o + 1] = a ? Math.round(g / a) : 0;
            out.data[o + 2] = a ? Math.round(b / a) : 0;
            out.data[o + 3] = Math.round(a / 4);
          }
        }
        c = new OffscreenCanvas(next, next);
        c.getContext('2d').putImageData(out, 0, 0);
        s = next;
      }
      const data = c.getContext('2d').getImageData(0, 0, size, size).data;
      let bin = '';
      for (let i = 0; i < data.length; i++) bin += String.fromCharCode(data[i]);
      return btoa(bin);
    },
    { svg, size },
  );
}

/** Turn a masked ictool render into a full-bleed opaque RGB square. */
async function fullBleed(page, pngBase64, size) {
  return page.evaluate(
    async ({ pngBase64, size }) => {
      const img = new Image();
      img.src = 'data:image/png;base64,' + pngBase64;
      await img.decode();
      const c = new OffscreenCanvas(size, size);
      const ctx = c.getContext('2d', { colorSpace: 'srgb' });
      ctx.drawImage(img, 0, 0, size, size);
      const { data } = ctx.getImageData(0, 0, size, size);
      const N = size;
      const k = N / 1024; // all distances below are tuned on a 1024 render

      // Chamfer (3-4) distance from the outside of the mask, in pixels.
      const INF = 1e9;
      const dist = new Float64Array(N * N);
      for (let i = 0; i < N * N; i++) dist[i] = data[i * 4 + 3] < 250 ? 0 : INF;
      const at = (x, y) => (x < 0 || y < 0 || x >= N || y >= N ? 0 : dist[y * N + x]);
      for (let y = 0; y < N; y++)
        for (let x = 0; x < N; x++) {
          const i = y * N + x;
          if (dist[i] === 0) continue;
          dist[i] = Math.min(dist[i], at(x - 1, y) + 3, at(x, y - 1) + 3, at(x - 1, y - 1) + 4, at(x + 1, y - 1) + 4);
        }
      for (let y = N - 1; y >= 0; y--)
        for (let x = N - 1; x >= 0; x--) {
          const i = y * N + x;
          if (dist[i] === 0) continue;
          dist[i] = Math.min(dist[i], at(x + 1, y) + 3, at(x, y + 1) + 3, at(x + 1, y + 1) + 4, at(x - 1, y + 1) + 4);
        }
      for (let i = 0; i < N * N; i++) dist[i] /= 3;

      // Background colour per row: median of gradient pixels in a band just inside the rim.
      const bandMin = 44 * k, bandMax = 84 * k;
      const rows = new Array(N).fill(null);
      for (let y = 0; y < N; y++) {
        const rs = [], gs = [], bs = [];
        for (let x = 0; x < N; x++) {
          const i = y * N + x, d = dist[i];
          if (d < bandMin || d > bandMax) continue;
          const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
          if (b - r < 60) continue; // skip the grey bird and its shading
          rs.push(r); gs.push(g); bs.push(b);
        }
        if (rs.length >= 3) {
          const med = (a) => a.sort((p, q) => p - q)[a.length >> 1];
          rows[y] = [med(rs), med(gs), med(bs)];
        }
      }
      const valid = rows.map((r, y) => (r ? y : -1)).filter((y) => y >= 0);
      const first = valid[0], last = valid[valid.length - 1];
      // Top: the gradient is flat near its start colour; hold it.
      for (let y = 0; y < first; y++) rows[y] = rows[first].slice();
      // Bottom: extend the measured trend with a least-squares line over the last valid rows.
      const tail = valid.slice(-Math.max(8, Math.round(64 * k)));
      const fit = [0, 1, 2].map((ch) => {
        const n = tail.length, xs = tail, ys = tail.map((y) => rows[y][ch]);
        const mx = xs.reduce((a, b) => a + b) / n, my = ys.reduce((a, b) => a + b) / n;
        let num = 0, den = 0;
        for (let i = 0; i < n; i++) { num += (xs[i] - mx) * (ys[i] - my); den += (xs[i] - mx) ** 2; }
        const slope = den ? num / den : 0;
        return (y) => my + slope * (y - mx);
      });
      for (let y = last + 1; y < N; y++) rows[y] = fit.map((f) => Math.max(0, Math.min(255, f(y))));
      // Interior gaps (none expected): copy the previous row.
      for (let y = 1; y < N; y++) if (!rows[y]) rows[y] = rows[y - 1].slice();
      // Smooth the column to remove median noise.
      const rad = Math.max(1, Math.round(5 * k));
      const smooth = rows.map((_, y) => {
        const acc = [0, 0, 0];
        let n = 0;
        for (let j = Math.max(0, y - rad); j <= Math.min(N - 1, y + rad); j++) {
          acc[0] += rows[j][0]; acc[1] += rows[j][1]; acc[2] += rows[j][2]; n++;
        }
        return acc.map((v) => v / n);
      });

      // Blend: replace the rim band with the row colour, feathered.
      const r0 = 26 * k, r1 = 42 * k;
      const out = new Uint8Array(N * N * 3);
      for (let y = 0; y < N; y++)
        for (let x = 0; x < N; x++) {
          const i = y * N + x, d = dist[i];
          let t = (d - r0) / (r1 - r0);
          t = t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t);
          for (let ch = 0; ch < 3; ch++)
            out[i * 3 + ch] = Math.round(smooth[y][ch] * (1 - t) + data[i * 4 + ch] * t);
        }
      let bin = '';
      for (let i = 0; i < out.length; i++) bin += String.fromCharCode(out[i]);
      return btoa(bin);
    },
    { pngBase64, size },
  );
}

function ictoolRender(size, outDir) {
  if (!existsSync(ICTOOL)) throw new Error(`ictool not found at ${ICTOOL} (install Xcode)`);
  const out = join(outDir, `appicon-${size}.png`);
  execFileSync(ICTOOL, [
    APP_ICON, '--export-image', '--output-file', out,
    '--platform', 'iOS', '--rendition', 'Default',
    '--width', String(size), '--height', String(size), '--scale', '1',
  ]);
  return readFileSync(out).toString('base64');
}

// ---------------------------------------------------------------------------------------------

const vector = parseVectorDrawable(readFileSync(ANDROID_FOREGROUND, 'utf8'));
const svg = faviconSvg(vector);
writeFileSync(join(root, 'public/favicon.svg'), svg);
console.log('icons: wrote public/favicon.svg');

const tmp = mkdtempSync(join(tmpdir(), 'catbird-icons-'));
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent('<!doctype html><title>icons</title>');

for (const size of [32, 48]) {
  const rgba = Buffer.from(await rasterizeSvg(page, svg, size), 'base64');
  writeFileSync(join(root, `public/favicon-${size}.png`), pngRgba(size, size, rgba));
  console.log(`icons: wrote public/favicon-${size}.png`);
}

for (const [size, name] of [[180, 'apple-touch-icon.png'], [512, 'logo.png']]) {
  const rgb = Buffer.from(await fullBleed(page, ictoolRender(size, tmp), size), 'base64');
  writeFileSync(join(root, 'public', name), pngRgb(size, size, rgb));
  console.log(`icons: wrote public/${name} (${size}x${size}, full-bleed, RGB)`);
}

await browser.close();
