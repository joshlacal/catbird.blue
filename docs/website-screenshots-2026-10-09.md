# Website screenshot replacement — October 9, 2026 UTC

The homepage’s four temporary illustrations are replaced with approved native Catbird captures from October 8 Eastern / October 9 UTC. Features reuses the composer and thread captures. The approved footer owner is `© 2026 Josh LaCalamito`. No legal text, publication flags, account/diagnostics copy, availability settings, or other marketing claims change in this patch.

## Mapping

| Website location | Approved native source | Web image |
| --- | --- | --- |
| Home: Feeds | `inputs/01-iphone-feeds.png` | `/images/screenshots/catbird-feeds-2026-10-08.webp` |
| Home: Conversations; Features: Threads and posts | `inputs/03-iphone-thread.png` | `/images/screenshots/catbird-thread-2026-10-08.webp` |
| Home: Writing; Features: Composer | `inputs/04-iphone-composer.png` | `/images/screenshots/catbird-composer-2026-10-08.webp` |
| Home: iPad | `inputs/05-ipad-reading.png` | `/images/screenshots/catbird-ipad-reading-2026-10-08.webp` |

The existing Appearance illustration and its descriptive illustration label remain because the approved asset set contains no Appearance capture. The separate iPhone reading capture is retained in the approved asset package; this bounded update introduces no new website section for it. Native captures avoid duplicating the marketing headlines baked into the framed App Store exports. No decorative device chrome is added.

## Source and processing

Approved package: `/Users/joshlacalamito/Documents/Codex/2026-10-07/task/Catbird-launch-assets-2026-10-07/Catbird-AppStore-Assets-2026-10-08-v2/`.

Read `FINAL-HANDOFF.md`, `evidence/final-source-verification.json`, `evidence/source-README.md`, `evidence/source-final-captures.json`, and `evidence/source-provenance.json` in that package. The captures show real production UI components using approved fictional fixture content, with `.test` handles and Josh-authorized posts. They are native simulator captures from iPhone 17 Pro Max and iPad Pro 13-inch M5 on iOS 27.0 (24A434), with the status time set to 9:41. The source snapshot was taken at 00:44:35 UTC on October 9. They demonstrate the pictured scenes, not full live-account operation or App Store acceptance.

The original 1320 × 2868 iPhone images and 2064 × 2752 iPad image were converted to lossless WebP at their original dimensions. There was no crop, resize, retouching, compositing, or new text. Every output’s decoded RGBA byte array was compared with its source and matched exactly. Four assets total 1,365,208 bytes. The original aliasing in June’s thread avatar and reduced opacity of the inactive composer entry are preserved.

| Original | SHA-256 |
| --- | --- |
| `01-iphone-feeds.png` | `580fef1d65564e9c5ec1d8f3f69de496af654afc712f3e47c50b4dc60b18f9a7` |
| `03-iphone-thread.png` | `864257a06a026ce2c82cdb0c29f9bc9b937c25b379749fd1ae3b3bf6f32e4032` |
| `04-iphone-composer.png` | `23fd1b2ce33c99edf77bf930aee255482431a16c6cdec0c697f50736aa576eef` |
| `05-ipad-reading.png` | `627a6c53094023d2494fec2b95037fe6168a31fec72d2894e23012e769e38ba9` |

Detailed source/output hashes, encoder version, byte counts, and decoded-pixel hashes are recorded in `asset-provenance.json` in the isolated staging packet at `~/Documents/Codex/2026-10-08/task-3/website-update-2026-10-09/screenshot-stage/`.

The new component specifies natural width/height, meaningful alt text, lazy loading, and responsive CSS width with automatic height. It displays the entire capture without object-fit cropping or simulated device UI. The homepage’s existing illustration notices are disabled only for the four sections receiving real native captures.

## Scope and verification handoff

The stage contains source and image files only. The website owner performs the site build and desktop/mobile review in an isolated snapshot, then deploys using the existing bounded static-website route if accepted. Preserve the published Terms body, October 8 effective date, and published state. Privacy review and publication remain separately controlled. Do not deploy a full stale output tree or reserved origin paths.

## Update — framed iPhone captures (October 9, 2026, ~17:30 UTC)

At Josh's request, the three iPhone images on Home and Features now show the captures inside the official iPhone 17 Pro Max (Silver) bezel, taken from the App Store compositions in `Catbird-AppStore-Launch-v2.sketch` (page "App Store exports — 1206 × 2622 at 1206w"). Each composition was duplicated, detached, stripped of its "Catbird" wordmark and headline text and its background fill, exported at 1.4× as a trimmed transparent PNG (1481 × 3066), and then deleted. The Sketch document's own layers were not changed. The PNGs were encoded as lossy WebP (q92, alpha lossless) to `catbird-{feeds,thread,composer}-framed-2026-10-09.webp` (173–193 KB each). `AppScreenshot.astro` marks these captures `framed` and drops the border and shadow for them. The iPad capture has no frame in Sketch and is unchanged. The October 8 unframed WebPs remain in `public/` but are no longer referenced.

Deployed by copying only those three images plus `index.html` and `features/index.html` to `netcup:/var/www/catbird.blue/`. Before copying, the live tree was diffed against the local build and the only differences were these screenshot changes. The previous HTML is backed up at `netcup:/home/josh/website-backups/framed-20261009/`. To roll back, copy those two files back.
