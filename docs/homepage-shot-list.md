# Homepage shot list, for the iOS owner

The homepage currently uses temporary illustrations for its three interactions. These captures replace them, and they are also the gates before those claims can be published (`homepage-evidence.md`). Nothing here should interrupt the build-7 reply and rendering work.

## Before anything

- **Coordinate first.** Root, the integration coordinator, owns the phone and the simulator slots.
  - Don't touch Josh's iPhone while it holds the preserved reply draft.
  - Don't touch any simulator, sign-in session or build in use for build 7.
  - Captures can wait for a released slot; the page doesn't depend on them to progress.
- **Build:** the release build (1.0 build 6, source `7c7b1742`) or the sealed build 7 once it supersedes it. Build 7 changes none of the drawer, ring or iPad files.
  - Release configuration, not a DEBUG fixture build.
  - Record the commit, configuration, device or simulator ID, OS version and file hashes for every capture.
- **Accounts and content.** Use a demo Bluesky account Josh owns, with its own banner and avatar. Everything on screen must be fictional, Josh's own, or consented.
  - **No third-party people.** No real third-party avatars, names, posts or DMs.
  - **No third-party feed artwork** unless the creator has agreed. Prefer Bluesky-owned feeds or feeds made by the demo account.
- **Never in frame:**
  - link cards or GIFs on build 6 (the yellow and red rendering placeholder; Josh's build-7 fix);
  - the reply composer before build 7 is sealed;
  - the composer's Audio row;
  - edit-mode feed removal (it writes immediately);
  - the Discover Feeds sheet (third-party feeds);
  - any encrypted-chat, group-chat or Circles UI.
- **Never tap:** Post, Unblock, or Remove.
- **Format:** stills as PNG at the device's native resolution; clips as 10 seconds or less, no audio, with touch indicators on. Light and dark versions where listed.

## A. Feeds drawer (iPhone)

Setup:
- Pin 4–6 feeds and save 4–8 more, so both sections show tiles.
- The default feed must not be the only pinned feed, or an empty "Pinned" heading appears.

| # | Type | Frame |
|---|---|---|
| A1 | Still | iPhone portrait, light, default accent, Large text. The drawer is fully open in grid mode: banner, identity row, "Feeds" row (+, list, pencil), the default-feed card with its checkmark, and the Pinned and Saved grids. Not in edit mode; no search field and no sheet. |
| A2 | Still | Same as A1, in the dark theme Josh prefers (Dim or Black). |
| A3 | Clip | Start on Home at the top of the default feed, with its title visible. Tap the grid button at the top left; the drawer opens. Hold about 1 s, then tap a Saved tile. The drawer closes and the large title changes to that feed's name. End 1 s after the new title appears, before any third-party post is readable, or use a feed of the demo account's own posts. **This clip is the publication gate for the feeds claim.** |
| A4 | Clip (optional) | Drawer open: tap "Search your feeds" in the bottom bar, type 3–4 letters of a saved feed's name, and the grid filters. Stop there. |
| A5 | Still (optional) | iPad Pro 13-inch, landscape, drawer open as a side panel over the feed, grid mode. |

## B. Composer character ring (iPhone)

New-post composer only, not a reply. A simulator with the release build is fine.

| # | Type | Frame |
|---|---|---|
| B1 | Still | A draft of about 120 characters: grey ring with no number; the bar shows only +, Add to Thread and the ring. Light. |
| B2 | Still | A draft at 255 characters: the ring shows "45". |
| B3 | Still | At 285 characters: orange ring with a number. |
| B4 | Still | At 305 characters: red ring with "!". |
| B5 | Still | After setting Interaction Settings to Mentioned and Following, with quotes off: the chip reads "Mentioned, Following · No quotes". |
| B6 | Still | B1 in the dark theme. |
| B7 | Clip | Start with an empty composer, paste neutral demo text to about 250 characters, then type slowly to about 295. The number appears, the ring turns orange, then red. End on red. Crop the keyboard's suggestion bar if it shows personal words. |

**B2–B5 are the publication gate for the ring and chip sentences.**

## C. iPad (iPad Pro 13-inch simulator, iPadOS 26)

Use simulator `56D76971-EC63-4C7C-B2D8-A6D0C3FD07B0` or the dedicated iPad simulator `94294312`. Avoid iPad mini, where the Profile tab overflows into a chevron.

| # | Type | Frame |
|---|---|---|
| C1 | Still | Landscape, light, full screen. Home with the timeline loaded; the top tab bar shows Home, Search, Notifications, Profile and Messages. Drawer closed. |
| C2 | Still | C1 in dark. |
| C3 | Still | Landscape, light. The sidebar toggle is tapped, so the tabs show as a left sidebar beside the timeline. |
| C4 | Still | Messages in landscape: the conversation list on the left with 4–6 conversations between demo accounts, and conversation A open on the right. Light and dark. |
| C5 | Clip | From C4: tap conversation B in the list; the right pane switches while the list stays. Tap back to A. No typing. |
| C6 | Still (reference only) | Messages in portrait, to see whether the list overlays or collapses. This decides whether the page may say the list "can stay beside" the chat. |

- **Gate for the iPad sentence:** C1.
- **Gate for adding the Messages sentence:** C4, C5 and C6.

## Hand-back

Put the files under `website/public/images/home/` with names such as `feeds-drawer-light.png`, plus a short `PROVENANCE.md` giving commit, configuration, device, OS, account, date and SHA-256 for each file. Then:

1. Replace the illustration in each `Interaction` slot with the capture: an `<img>` with width/height and alt text, or a `<video>` with a poster, `muted playsinline loop`, and no autoplay under `prefers-reduced-motion`.
2. Pass `illustration={false}` so the "Illustration" note disappears.
3. Update `homepage-evidence.md` with the capture paths.
