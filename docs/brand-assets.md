# Brand assets and news

This page lists every icon, logo and Open Graph image the site ships. For each one it says where the source comes from and how to rebuild it. It also covers how to add news posts and release notes. Each asset is built by a script from the app's own icon sources, so none of it is redrawn by hand. Rebuild the assets whenever the app icon changes, and commit the PNGs the scripts write.

Governing plan: `../docs/execution-plans/2026-10-02-catbird-website-plan.md` (§3.3 Technical files, §5.3 Wordmark and logo, §5.5 Imagery). Brand rules: `../docs/brand/08-components/app-icon.md` and `../docs/brand/07-iconography.md`. Paths below are relative to `website/` unless they start with `../`.

## Icons

| File | Size | What it is | Built by |
|---|---|---|---|
| `public/favicon.svg` | vector, 108×108 viewBox | Flat silver bird on solid `#5192ff` (token `accent`), in a rounded tile (`rx` 24) | `scripts/icons/build-icons.mjs` |
| `public/favicon-32.png` | 32×32 RGBA | `favicon.svg` rasterized | same |
| `public/favicon-48.png` | 48×48 RGBA | `favicon.svg` rasterized | same |
| `public/apple-touch-icon.png` | 180×180 RGB, no alpha | The shipped iOS app icon, full-bleed (square corners, opaque) | same |
| `public/logo.png` | 512×512 RGB, no alpha | The same full-bleed icon at 512. It is meant for `logo_uri` in the OAuth client metadata (plan §3.3, decision D3). | same |

### Favicon (`favicon.svg`, `favicon-32.png`, `favicon-48.png`)

- **Source:** `../android/Catbird/app/src/main/res/drawable/ic_launcher_foreground.xml`. This is the only true vector of the Catbird bird; the other icon sources are raster images or Icon Composer layers.
- **Conversion:** the script parses the drawable and copies each `<path>` into the SVG unchanged. `pathData` becomes `d`, `fillColor` becomes `fill`, and `fillType="evenOdd"` becomes `fill-rule="evenodd"`. That gives four paths: the silver head `#A6ABB3`, the beak `#1C1C1E`, the eye `#1C1C1E` and the white eye highlight `#FFFFFF`. The 108×108 viewport is kept.
- **Scaling:** the drawable sizes the bird for Android's 72dp safe zone, which is too small for a 16px browser tab. The script therefore scales the group, not the paths, by 1.38 about the bird's centre, so the bird fills about 86% of the tile.
- **Brand rules followed:** "flat silver bird on solid `#5192FF`, no gradient at these sizes" (`../docs/brand/08-components/app-icon.md:46-47`). The bird faces right and is never mirrored, and the eye highlight stays white.
- **PNGs:** Chromium renders the SVG at 8× the target size. The script then halves it repeatedly with a premultiplied 2×2 box filter, which keeps small sizes crisp without dark fringes on the transparent corners.

### Full-bleed app icon (`apple-touch-icon.png`, `logo.png`)

- **Source:** `../Catbird/Catbird/Resources/AppIcon.icon`, the Icon Composer document the app ships. That is the gradient plus the Liquid Glass bird layers, with group scale 0.44 and a +10pt y offset.
- **Export:** Xcode's `ictool` (`/Applications/Xcode.app/Contents/Applications/Icon Composer.app/Contents/Executables/ictool`, version 27.0) renders the icon at the exact target size: `--platform iOS --rendition Default --scale 1`.
- **Why the export needs a fix:** `ictool` always applies the rounded-square mask and draws a bright rim along the edge. Apple applies its own mask to `apple-touch-icon`, so a pre-masked icon would show a double edge.
- **The fix:**
  - The render is colour-managed from Display P3 to sRGB as Chromium draws it into a canvas.
  - The script measures each pixel's distance from the mask edge.
  - The outermost band, about 26–42px at 1024 scale, is replaced with that row's background colour, with a feathered blend. Since the background is a vertical gradient, each row is a single colour. The script samples it from a band just inside the rim and skips the grey bird pixels.
  - Rows above the first clean sample hold the top colour. Rows below the last clean sample continue the measured trend.
  - The bird and every interior pixel are kept exactly as `ictool` rendered them.
- **Output:** the script writes these PNGs itself, as 8-bit RGB with no alpha channel and an `sRGB` chunk, using Node's `zlib`.
- **Checked:** both files report `hasAlpha: no` (`sips -g hasAlpha`). At 3× and 8× zoom the corners show no seam or rim.

### Rebuild

```sh
cd website
node scripts/icons/build-icons.mjs
```

- **Needs:** macOS with Xcode 27 (for `ictool`) and the repo's Playwright Chromium (`npx playwright install chromium`).
- **Sources:** the script reads its inputs from the sibling repos. Override them with `ANDROID_FOREGROUND=/path/to/ic_launcher_foreground.xml` and `APP_ICON=/path/to/AppIcon.icon`.
- **When the app icon changes:** rebuild, then open `public/apple-touch-icon.png` and `public/logo.png` and check the corners.

### Head tags

- `BaseLayout.astro` links `favicon.svg`, `favicon-32.png`, `favicon-48.png` and `apple-touch-icon.png`. Search engines prefer a favicon whose size is a multiple of 48px.

## Open Graph cards (`public/og/*.png`)

All cards are 1200×630 and are built by `scripts/og/render-og.mjs` from the definitions in `scripts/og/cards.mjs`.

- **Background:** the app icon's own gradient. It runs from token `icon-gradient-top` `#00308c` to `icon-gradient-bottom` `#5194ff`, top to bottom, and reaches the bottom colour at 70% of the height, as in `AppIcon.icon/icon.json`. All text is white (token `on-accent`).
- **Artwork:** `scripts/og/assets/catbird-head.png` is a byte-for-byte copy of `../Catbird/Catbird/Resources/Assets.xcassets/CatbirdIcon.imageset/catbird head square.png` (SHA-256 `2621064a36052f783bbc3467d48c3217156d7e4b7b410af43f8baef78df5729e`). CSS crops it to the bird's opaque bounding box (88, 219, 901×642 in the 1080px source) and adds a soft drop shadow. The bird is never redrawn, recoloured or mirrored.
- **Type:**
  - All type is the bundled Roboto Flex subset `public/fonts/RobotoFlex-subset.woff2` (OFL). It is embedded as a data URL under a private family name, with no fallback family.
  - The wordmark is lowercase "catbird", weight 900, `font-stretch: 120%`, tracking −0.02em. Titles are weight 820 at 120%.
  - The script refuses to render if the font did not load. SF Pro's licence forbids baking its outlines into images, so a system-font fallback must never end up in the art.
  - Every character used on the cards was checked against the subset's cmap; none are missing.
- **Layouts:**
  - `brand` (`default.png`): the bird centred at about 40% of the width, with the wordmark and the line "A Bluesky client for iPhone and iPad" below. This follows `../docs/brand/08-components/app-icon.md:48`.
  - `page` (all other cards): the wordmark, the page title and a one-line subtitle on the left, `catbird.blue` at the bottom left, and the bird on the right.

| File | Page | Title on card | Subtitle | `ogImageAlt` to pass to `BaseLayout` |
|---|---|---|---|---|
| `og/default.png` | fallback for every page | (wordmark) | A Bluesky client for iPhone and iPad | The Catbird bird above the catbird wordmark on a blue gradient, with the line “A Bluesky client for iPhone and iPad”. |
| `og/home.png` | `/` | A Bluesky client for iPhone and iPad | Requires iOS 18 or later. | Catbird card: “A Bluesky client for iPhone and iPad. Requires iOS 18 or later.” beside the Catbird bird. |
| `og/features.png` | `/features` | Features | Feeds, posting, threads, safety tools and more. | Catbird card: “Features” beside the Catbird bird. |
| `og/support.png` | `/support` | Support | Answers and ways to get help with Catbird. | Catbird card: “Support” beside the Catbird bird. |
| `og/press.png` | `/press` | Press | Facts and brand assets for writing about Catbird. | Catbird card: “Press” beside the Catbird bird. |
| `og/privacy.png` | `/privacy` | Privacy Policy | What Catbird stores, where it goes and your choices. | Catbird card: “Privacy Policy” beside the Catbird bird. |
| `og/terms.png` | `/terms` | Terms of Service | The rules for using Catbird. | Catbird card: “Terms of Service” beside the Catbird bird. |
| `og/news.png` | `/news`, non-release posts | News | Updates and announcements about Catbird. | Catbird card: “News” beside the Catbird bird. |
| `og/changelog.png` | `/changelog`, release posts | Changelog | What changed in each release of Catbird. | Catbird card: “Changelog” beside the Catbird bird. |
| `og/accessibility.png` | `/accessibility` | Accessibility | Accessibility settings in Catbird and on this site. | Catbird card: “Accessibility” beside the Catbird bird. |

"Privacy Policy" and "Terms of Service" are the names the app uses for these links (`Catbird/Features/Settings/Views/AboutSettingsView.swift:197,209` in the Lite workspace).

### Rebuild

```sh
cd website
node scripts/og/render-og.mjs            # every card
node scripts/og/render-og.mjs privacy    # one card by slug
```

- **Add or edit a card:** change `scripts/og/cards.mjs`, then run the script.
- **Keep titles in step:** a card's title should match its page's `<h1>`. When a page title changes, re-render that card.
- **Superseded script:** `scripts/render-og.mjs` at the top of `scripts/` is the foundation's original renderer. It draws a different `default.png` (a 135° accent gradient with the masked app icon). If it runs, it overwrites the current default card, so use `scripts/og/render-og.mjs` instead.

## News and changelog

- **Content collection:** posts live in `src/content/news/*.md` (`src/content.config.ts`, glob loader). The file name is the URL slug.
- **Pages:**
  - `/news` lists every published post, newest first.
  - `/news/<slug>` is the post page.
  - `/changelog` shows posts tagged `release` with their full text inline.
  - `/rss.xml` is an RSS 2.0 feed of every published post, with an `atom:link rel="self"`.
- **When there are no posts:** `/news` and `/changelog` show an empty state: "No posts yet." (or "No release notes yet.") "Follow @catbird.blue on Bluesky for updates." The RSS feed is still valid, with a channel and no items. At build time Astro logs `No files found matching …` and `The collection "news" does not exist or is empty` until the first post exists. Both warnings are expected.
- **Why the collection ships empty:**
  - No real, dated Catbird announcement or release notes could be verified in the workspace.
  - App Store 1.0 hasn't shipped: the iTunes lookup returns 0 results (`../docs/execution-plans/2026-10-02-catbird-website-plan.md` §3.1).
  - The old site's 2024-01-15 "welcome" post was fake (plan §3.2), and it was not carried over.
  - The plan names the first real entries as the beta announcement and the 1.0 release notes.

### Front matter

```yaml
---
title: <headline in sentence case>
date: <YYYY-MM-DD>                        # the real publication date
summary: One or two sentences for the index, RSS and meta description (max 300 characters).
tags: [release]                           # release | beta | announcement; "release" adds it to /changelog
version: "1.0"                            # release posts only; shown as "Version 1.0"
draft: false                              # true keeps it out of every page, RSS and the sitemap
---
```

The angle-bracket values are slots to fill in; this block is a template, not a post.

- **Body:** Markdown, styled by the global `.prose` rules (about 65ch wide, 17px/1.55).
- **Headings:** start sections at `##`, because the post title is the page's `<h1>`.
- **Accuracy:** every claim must hold for the build being announced. The product-truth rules in plan §3 apply. Never claim a Mac app, encrypted group chat, Circles, widgets, the share extension or anything else on the never-claim list.
- **Dates:** use only real dates.
- **Files that aren't posts:** files whose names start with `_` are ignored, so they can hold notes. `src/content/news/.gitkeep` keeps the empty folder in version control.
