import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

/** Every public page. Page agents: add new routes here. */
export const PAGES = [
  '/',
  '/features',
  '/privacy',
  '/terms',
  '/support',
  '/press',
  '/accessibility',
  '/news',
  '/changelog',
  '/404',
];

const THEMES = ['light', 'dim', 'black', 'hc-light', 'hc-dark', 'cvd-light', 'cvd-dark'] as const;
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function setTheme(page: Page, theme: string) {
  // Freeze transitions so axe never measures a color mid-crossfade.
  await page.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation:none!important}' });
  await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
  // Let any theme crossfade settle before measuring.
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
}

test.describe('pages respond', () => {
  for (const path of PAGES) {
    test(`status 200: ${path}`, async ({ request }) => {
      const res = await request.get(path, { maxRedirects: 0 });
      expect(res.status(), `${path} should return 200`).toBe(200);
    });
  }
});

test.describe('axe (WCAG 2.2 AA) in every theme', () => {
  for (const path of PAGES) {
    for (const theme of THEMES) {
      test(`axe ${theme}: ${path}`, async ({ page }) => {
        const res = await page.goto(path);
        expect(res?.status(), `${path} must exist before it can be audited`).toBe(200);
        await setTheme(page, theme);
        const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
        const summary = results.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.slice(0, 5).map((n) => `${n.target.join(' ')} :: ${n.failureSummary?.split('\n').slice(0, 2).join(' ')}`),
        }));
        expect(summary, `axe violations on ${path} [${theme}]`).toEqual([]);
      });
    }
  }
});

test.describe('privacy: no third-party requests', () => {
  for (const path of PAGES) {
    test(`same-origin only: ${path}`, async ({ page, baseURL }) => {
      const origin = new URL(baseURL!).origin;
      const offsite: string[] = [];
      page.on('request', (req) => {
        const url = req.url();
        if (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('about:')) return;
        if (new URL(url).origin !== origin) offsite.push(url);
      });
      await page.goto(path, { waitUntil: 'networkidle' });
      // Exercise the theme picker and menu so lazily triggered requests are caught too.
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForLoadState('networkidle');
      expect(offsite, `requests leaving ${origin} on ${path}`).toEqual([]);
    });
  }
});

test.describe('theme bootstrap', () => {
  test('no flash: stored scheme applies before first paint', async ({ page }) => {
    await page.addInitScript(() => {
      try {
        localStorage.setItem('catbird-theme', JSON.stringify({ scheme: 'dim', contrast: 'system', cvd: 'off' }));
      } catch {
        /* storage blocked */
      }
      // Record data-theme at the earliest observable moments.
      (window as unknown as { __themeAtFirstStyle: string | null }).__themeAtFirstStyle = null;
      const obs = new MutationObserver(() => {
        const w = window as unknown as { __themeAtFirstStyle: string | null };
        if (w.__themeAtFirstStyle === null && document.querySelector('link[rel="stylesheet"], style')) {
          w.__themeAtFirstStyle = document.documentElement.getAttribute('data-theme');
        }
      });
      obs.observe(document, { childList: true, subtree: true });
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          if (e.name === 'first-paint' || e.name === 'first-contentful-paint') {
            (window as unknown as { __themeAtPaint: string | null }).__themeAtPaint =
              document.documentElement.getAttribute('data-theme');
          }
        }
      }).observe({ type: 'paint', buffered: true });
    });
    await page.goto('/styleguide');
    const atStyle = await page.evaluate(() => (window as unknown as { __themeAtFirstStyle: string | null }).__themeAtFirstStyle);
    expect(atStyle).toBe('dim');
    const atPaint = await page.evaluate(
      () => (window as unknown as { __themeAtPaint?: string | null }).__themeAtPaint ?? document.documentElement.getAttribute('data-theme'),
    );
    expect(atPaint).toBe('dim');
    // The resolved background is Dim's, not Light's.
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe('rgb(46, 46, 51)');
  });

  test('preference resolution', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light', contrast: 'no-preference' });
    await page.goto('/styleguide');
    const resolve = (p: object) =>
      page.evaluate((pref) => (window as unknown as { CatbirdTheme: { resolve(p: object): string } }).CatbirdTheme.resolve(pref), p);
    expect(await resolve({ scheme: 'system', contrast: 'system', cvd: 'off' })).toBe('light');
    expect(await resolve({ scheme: 'black', contrast: 'system', cvd: 'off' })).toBe('black');
    expect(await resolve({ scheme: 'dim', contrast: 'more', cvd: 'off' })).toBe('hc-dark');
    expect(await resolve({ scheme: 'light', contrast: 'more', cvd: 'on' })).toBe('hc-light');
    expect(await resolve({ scheme: 'light', contrast: 'system', cvd: 'on' })).toBe('cvd-light');
    expect(await resolve({ scheme: 'black', contrast: 'system', cvd: 'on' })).toBe('cvd-dark');
    await page.emulateMedia({ colorScheme: 'dark' });
    expect(await resolve({ scheme: 'system', contrast: 'system', cvd: 'off' })).toBe('dim');
    await page.emulateMedia({ colorScheme: 'dark', contrast: 'more' });
    expect(await resolve({ scheme: 'system', contrast: 'system', cvd: 'off' })).toBe('hc-dark');
    // Live media change re-resolves the page without a reload.
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'hc-dark');
  });

  test('theme picker writes the preference', async ({ page }) => {
    await page.goto('/styleguide');
    await page.getByRole('group', { name: 'Appearance' }).getByRole('radio', { name: 'Black' }).check();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'black');
    const stored = await page.evaluate(() => localStorage.getItem('catbird-theme'));
    expect(JSON.parse(stored!)).toMatchObject({ scheme: 'black' });
  });
});

test.describe('mobile navigation', () => {
  test.use({ viewport: { width: 375, height: 740 } });
  test('menu button toggles the nav with aria-expanded', async ({ page }) => {
    await page.goto('/styleguide');
    const btn = page.getByRole('button', { name: 'Menu' });
    await expect(btn).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeHidden();
    await btn.click();
    await expect(btn).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Features' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  test('nav is reachable without JavaScript', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 740 } });
    const page = await ctx.newPage();
    await page.goto('/styleguide');
    await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Features' })).toBeVisible();
    await ctx.close();
  });

  test('no horizontal scroll at 320px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    for (const path of ['/styleguide', '/404']) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${path} overflows horizontally`).toBeLessThanOrEqual(0);
    }
  });
});

test.describe('built output', () => {
  const dist = resolve(process.cwd(), 'dist');
  const walk = (dir: string): string[] =>
    readdirSync(dir).flatMap((f) => {
      const p = join(dir, f);
      return statSync(p).isDirectory() ? walk(p) : [p];
    });

  test('no catbird.app and no "BlueSky" anywhere in the build', () => {
    const files = walk(dist).filter((f) => /\.(html|xml|css|js|json|txt|svg)$/.test(f));
    expect(files.length).toBeGreaterThan(0);
    const hits: string[] = [];
    for (const f of files) {
      const text = readFileSync(f, 'utf8');
      if (text.includes('catbird.app')) hits.push(`${f}: catbird.app`);
      if (text.includes('BlueSky')) hits.push(`${f}: BlueSky`);
    }
    expect(hits).toEqual([]);
  });

  test('reserved production paths are not shipped', () => {
    const rel = walk(dist).map((f) => f.slice(dist.length));
    const reserved = rel.filter((p) =>
      /^\/(\.well-known\/|oauth-client-metadata\.json$|oauth(\/|$)|klipy(\/|$)|robots\.txt$)/.test(p),
    );
    expect(reserved).toEqual([]);
  });

  test('client JS on / is under 15 KB', async ({ page }) => {
    let external = 0;
    page.on('response', async (res) => {
      if (res.request().resourceType() === 'script') {
        try {
          external += (await res.body()).length;
        } catch {
          /* body unavailable */
        }
      }
    });
    const res = await page.goto('/', { waitUntil: 'networkidle' });
    expect(res?.status(), '/ must exist').toBe(200);
    const inline = await page.evaluate(() =>
      Array.from(document.querySelectorAll('script:not([src])'))
        .filter((s) => !s.getAttribute('type') || /javascript|module/.test(s.getAttribute('type')!))
        .reduce((n, s) => n + new TextEncoder().encode(s.textContent ?? '').length, 0),
    );
    const total = external + inline;
    expect(total, `client JS on / is ${total} bytes`).toBeLessThan(15 * 1024);
  });
});
