# catbird.blue

This is the public website for **Catbird**, a native Bluesky client for iPhone and iPad (iOS 18 or later). It is a static Astro site built from the Catbird design system's tokens, with no client framework, no analytics and no third-party requests. Pages are plain `.astro` files that share one layout and a small set of components. The site is meant to be served from the `catbird.blue` apex as a fallback underneath the production routes that already live there (see "Never ship these paths" below).

- Governing plan: [`../docs/execution-plans/2026-10-02-catbird-website-plan.md`](../docs/execution-plans/2026-10-02-catbird-website-plan.md) (read its Overrides box first)
- Evidence for every product and privacy claim: [`../docs/research/2026-10-02-catbird-website-research.md`](../docs/research/2026-10-02-catbird-website-research.md)
- Decision log: [`../docs/DECISIONS.md`](../docs/DECISIONS.md)

The public product name is "Catbird". "Lite" is an internal build name and never appears on the site.

## Run it

Requires Node 22.12 or later.

```bash
npm install
npm run dev          # tokens + astro dev
npm run build        # tokens + static build into dist/
npm run preview      # serve dist/
npm test             # Playwright: builds, serves on :4329, runs tests/site.spec.ts
npm run tokens       # regenerate src/styles/tokens.css only
node scripts/render-og.mjs   # re-render public/og/*.png (1200x630)
```

The first test run needs the browsers: `npx playwright install chromium webkit`.

Visit `/styleguide` (noindex, not in the sitemap) to see every shared component, the type ramp and a live contrast table for all seven themes.

## Layout

```
design/tokens.json            design system export; the site's source of truth for tokens
scripts/build-tokens.mjs      tokens.json -> src/styles/tokens.css (dependency-free)
scripts/render-og.mjs         Open Graph cards via Playwright, set in Roboto Flex only
scripts/subset-font.py        rebuilds the Roboto Flex woff2 subset (fontTools)
src/config.ts                 every URL, ID and legal value (null = not decided; omit, never placeholder)
src/layouts/BaseLayout.astro  <head>, header, footer, draft banner
src/components/site/          SiteHeader, SiteFooter, ThemePicker, Wordmark
src/components/ui/            Button, Icon, Section, Card, Badge, PhoneFrame, DraftBanner
src/scripts/theme-head.js     inline <head> theme bootstrap (no flash)
src/styles/tokens.css         GENERATED, do not edit
src/styles/web-tokens.css     web-only tokens (AA fixes, display font, glass, motion)
src/styles/global.css         reset, type, links, focus, prose, glass, reduced motion, forced colors
src/styles/ds-components.css  cb-* renditions of real app views (copied from the design system)
public/fonts/                 Roboto Flex subset + OFL.txt
LICENSES/                     third-party licenses (Lucide ISC/MIT, Roboto Flex OFL)
tests/site.spec.ts            status, axe x 7 themes, same-origin, no-flash, built-output checks
```

## Token pipeline

`design/tokens.json` is copied from the Catbird design system. `scripts/build-tokens.mjs` compiles it, the same way the design system compiles its previews:

1. `:root, [data-theme="light"] { … }`: every color as `--<name>` (aliases like `"{accent}"` become `var(--accent)`) and every shadow.
2. `[data-theme="<id>"] { … }` for `dim`, `black`, `hc-light`, `hc-dark`, `cvd-light` and `cvd-dark`. Each block re-declares **all** colors and shadows, not just the differences, so a nested theme never inherits the wrong value.
3. `:root { … }`: spacing, radius, size, border width, opacity and `--font-<family>` (`sans`, `expanded`, `rounded`, `serif`, `mono`).
4. One `.t-<style>` class per type style (`.t-body`, `.t-headline`, `.t-nav-large-title`, …) with family, size, line height and weight. The expanded styles also get `font-stretch: 120%`.

Never edit `tokens.css`. To change a token, change `design/tokens.json` (ideally by re-exporting from the design system) and rebuild.

### Web-only tokens (`src/styles/web-tokens.css`)

The app keeps a few known contrast misses on purpose. The web must meet WCAG 2.2 AA, so these tokens exist only here. Every value is documented inline with its ratio.

| Token | Use it for | Why |
|---|---|---|
| `--font-display` | Wordmark and display headings, with `font-stretch: 120%` | `-apple-system, BlinkMacSystemFont, "Roboto Flex", system-ui, sans-serif` |
| `--accent-fill` / `--on-accent-fill` | Any fill that carries a text label (primary buttons) | White on the brand `#5192ff` is 3.04:1. `#005eff` gives 5.19:1. HC themes use their own accent; HC Dark labels are black. |
| `--link` | Links and any text-colored accent | Same as `--accent-text`, except Dim and CVD Dark use `#7faeff` (6.05:1), because the app's `#5192ff` on Dim is 4.44:1. |
| `--text-muted` | Secondary prose | The app's Light `text-secondary` is 3.44:1. Light uses `#6a6a70`, Dim uses `#bdbdc2`. |
| `--like-text` / `--repost-text` | Engagement colors on text (counts) | Light `#d70015` / `#1a7f37`, Dim like `#ff7a70`. |
| `--focus-ring` | Keyboard focus | At least 3:1 on `--bg` and `--card-bg` in every theme (the styleguide shows the live ratios). |
| `--card-bg` | Card and callout surfaces | `bg-secondary`, or `elevated-popover` in Black. |
| `--glass-bg`, `--glass-stroke`, `--surface-opaque`, `--glass-filter` | The header and a floating call-to-action pill only | Pkl "regular" strength: `blur(20px) saturate(1.3)`. |
| `--hero-gradient` | Brand art backgrounds | 135°, `accent` → `accent-gradient-partner` (flat accent in HC). |
| `--content-max` (1120px), `--reading-max` (680px), `--gutter` (16px), `--header-h` | Layout | |
| `--dur-instant/enter/exit/emphasis`, `--ease-enter/exit/out` | Motion | 150 / 350 / 220 / 450 ms from the brand motion doc. |

On wide-gamut displays, the brand themes set `--accent` to `color(display-p3 0.318 0.573 1)` to match the app's Display P3 AccentColor. Contrast math stays in sRGB, and labelled fills use `--accent-fill`, which is unaffected.

Use `--text-muted` and `--link` for web copy. Use `--text-secondary` and `--accent-text` only inside app vignettes. `<PhoneFrame>` adds the `.cb-vignette` class, which remaps those app roles (and labelled accent fills) to the AA web values automatically. `--danger` is not remapped, so avoid danger-filled labels such as LIVE badges in vignettes.

## Theme system

There are seven themes: `light`, `dim`, `black`, `hc-light`, `hc-dark`, `cvd-light` and `cvd-dark`. The visitor's preference is stored in `localStorage["catbird-theme"]` as `{ scheme: 'system'|'light'|'dim'|'black', contrast: 'system'|'more', cvd: 'off'|'on' }`. Every storage access is wrapped in try/catch, and the site works with storage blocked.

How the theme is resolved:

1. `scheme: 'system'` becomes `light` or `dim`, following `prefers-color-scheme`.
2. If `contrast` is `'more'`, or it is `'system'` and the browser reports `prefers-contrast: more`, the theme is `hc-light` (from Light) or `hc-dark` (from Dim or Black).
3. Otherwise, if `cvd` is `'on'`, the theme is `cvd-light` or `cvd-dark`.
4. Otherwise the theme is the scheme itself.

`src/scripts/theme-head.js` is inlined in `<head>` before any stylesheet. It sets `<html data-theme>` and the `js` class before first paint, updates the two `theme-color` metas, and re-resolves the theme when the color-scheme or contrast media queries change. It exposes `window.CatbirdTheme` (`read`, `write`, `apply`, `resolve`) for the footer `ThemePicker`. The picker is hidden without JS. Without JS the page renders in Light.

Other platform settings are handled in CSS:

- **`forced-colors: active`:** tokens map to system colors (`Canvas`, `CanvasText`, `LinkText`, `ButtonText`, `ButtonFace`, `Highlight`). Buttons, cards, badges and segmented controls get real 1px borders. Icons use `currentColor`.
- **`prefers-reduced-motion: reduce`:** no transforms (including press-scale) and no animation. Only color and opacity crossfades remain.
- **`prefers-reduced-transparency: reduce`, the HC themes and forced colors:** `.glass` surfaces become opaque, with no `backdrop-filter`.

## Fonts

- **Body text** uses `--font-sans`, which starts with `system-ui`. On Apple devices that is the real variable SF Pro.
- **Display text and the wordmark** use `--font-display` with `font-stretch: 120%`. That equals SF Pro `wdth` 120, the app's navigation-title width.
- **Measured on 2026-10-02** in Safari 27, Chrome 154, Firefox 155 and iOS Safari: `system-ui` resolves to variable SF Pro, with working `wght`, `opsz` and `wdth` through `font-stretch` (see the plan's Overrides box and the design system's README).
- **Use `font-stretch`, not `font-width`**, which Chrome ignores. Never use `scaleX()` to fake width.
- **Never name "SF Pro"** in CSS. Never ship SF outlines in any file, including OG images, press art and wordmark SVGs. The SF Pro license forbids it.
- **No Inter, no Google Fonts, no CDN fonts.**
- **Roboto Flex** (SIL OFL 1.1) is the display fallback on non-Apple platforms. It is self-hosted at `public/fonts/RobotoFlex-subset.woff2`.
  - Subset to Basic Latin, Latin-1 and common punctuation.
  - Variable axes kept: `opsz` 8–144, `wght` 100–1000, `wdth` 25–151. The other parametric axes are pinned to their defaults.
  - About 188 KB.
  - Apple browsers match `-apple-system` / `BlinkMacSystemFont` first and never download it.
  - License: `public/fonts/OFL.txt` (also in `LICENSES/`). Roboto Flex has no Reserved Font Name, so the subset keeps its name.
- **Rebuilding the subset:** run `python scripts/subset-font.py` with fontTools and brotli installed. It pins the axes other than `opsz`, `wght` and `wdth`, subsets to woff2 and asserts the kept axes.
- **The wordmark** is live text: lowercase "catbird", weight 900, tracking −0.02em, x-height clear space, in `--accent`. `docs/brand/08-components/wordmark.md` specifies width 125; the site uses **120** to match the app's navigation titles.

## Icons

Icons are [Lucide](https://lucide.dev) via `lucide-static`, inlined at build time by `<Icon name="…">`. There are no icon requests and no icon font. Lucide is ISC licensed, and some icons derived from Feather are MIT; the full notice is in `LICENSES/lucide-static-ISC.txt`. Never use emoji as icons. Never use the Bluesky butterfly as Catbird's logo.

## Component API (for page authors)

All components live in `src/components/`. Every prop is documented in the file header.

- `BaseLayout`: `title`, `description`, `path?`, `ogImage?` (`/og/default.png`), `ogImageAlt?`, `ogType?`, `noindex?`, `draft?`, `draftDetail?`. It also has a `head` slot.
- `Section`: `as?`, `width?` (`content` | `reading` | `full`), `tone?` (`default` | `secondary`), `space?` (`none` | `sm` | `md` | `lg`), `id?`, `labelledby?`, `class?`.
- `Button`: `href?`, `variant?` (`primary` | `secondary` | `plain`), `size?` (`sm` | `md` | `lg`), `icon?`, `iconEnd?`, `type?`, `block?`, `class?`, plus pass-through attributes.
- `Icon`: `name`, `size?` (20), `strokeWidth?` (2), `label?` (meaningful icon), `class?`.
- `Card`: `as?`, `href?`, `variant?` (`filled` | `outline`), `padding?` (`sm` | `md` | `lg`), `class?`.
- `Badge`: `tone?` (`neutral` | `accent` | `success` | `warning` | `danger`), `icon?`. State tones always show a glyph.
- `PhoneFrame`: `label` (required; the vignette is one `role="img"`), `device?` (`phone` | `tablet`), `width?`, `theme?`, `bleed?`, `class?`.
- `DraftBanner`: `message?` ("Draft — not yet in effect"), `detail?`.
- `Wordmark`: `size?`, `tone?` (`accent` | `primary` | `reverse`), `as?`.

Global classes: `.prose` (long-form, 65ch, 17px/1.55), `.lead`, `.muted`, `.eyebrow`, `.fine`, `.display`, `.h1`–`.h3`, `.glass`, `.cluster`, `.stack`, `.visually-hidden`, `.js-only`, `.no-js-only`, `.t-*`, and the `cb-*` classes from `ds-components.css`.

## Never ship these paths

`catbird.blue` is production. These paths are served by the origin today and must keep returning exactly what they return now (plan §2.3). The site must never contain a file at any of them, and the built-output test enforces this:

| Path | What it is |
|---|---|
| `/.well-known/apple-app-site-association` | Universal links (200, `application/json`, no redirect) |
| `/.well-known/assetlinks.json` | Android app links |
| `/.well-known/atproto-did` | The `@catbird.blue` handle |
| `/.well-known/jwks.json` | Proxied to nest |
| `/oauth-client-metadata.json` | The OAuth `client_id` document |
| `/oauth/callback`, `/oauth/callback/atproto`, `/oauth/permission-callback` | OAuth |
| `/klipy/v2/*` | GIF proxy |
| `/robots.txt` | Cloudflare-managed |

The subdomains (`api`, `chat`, `mlschat`, `circles`, `catmos`, `youtube`, `pds`, `atprotodrive`, `dev-api`) are untouched by this site.

Also never ship:

- Any `catbird.app` reference.
- The spelling "BlueSky".
- An App Store badge or Smart App Banner. Wait until `APP_STORE_LIVE` is true.
- Analytics, cookies, or third-party requests.

## Assets still needed

- **Real App Store screenshots:** 6.9" iPhone and 13" iPad, in unmodified Apple product bezels. The preview-fixture pipeline currently renders "Post format error" cards (plan §5.5).
- **Wordmark SVG outlines:** horizontal and stacked lockups, drawn from Roboto Flex or custom lettering, never SF Pro. Plus a true vector bird. `public/favicon.svg` uses the Android drawable's traced silhouette as a stand-in.
- **A full-bleed apple-touch-icon**, exported from Icon Composer (`Catbird/Catbird/Resources/AppIcon.icon`). The current `public/apple-touch-icon.png` is the pre-masked 1024 icon composited onto the icon gradient, so its glossy rim still shows inside iOS's own mask.
- **`/logo.png`** for the OAuth client metadata (plan §3.3, decision D3).
- **Per-page OG cards:** add entries to `CARDS` in `scripts/render-og.mjs`.
