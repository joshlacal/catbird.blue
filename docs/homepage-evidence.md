# Homepage evidence — current October 7 copy

Josh's October 7 wording is the editorial direction: “Explore the open social web with Catbird.” The lead explicitly identifies Catbird as a Bluesky app for iPhone and iPad. This does not claim support for other social networks.

The homepage now leads with feeds, conversations, and composing, followed by a short iPad section. Existing illustrations stay visibly labeled; they are not app screenshots. Availability remains driven by the existing config. No release or email-delivery claim was added.

Current source checked read-only in `.workspaces/appstore-polish-1005/Catbird`:

| Claim | Source |
|---|---|
| Find/save feeds; keep pinned and saved feeds together | `Features/Feed/Views/FeedsStartPage.swift`: Add Feed at 338; Discover more feeds at 1374; pinned/saved grids at 1384–1393; feed selection at 378–385. |
| Read conversation context, with threaded or linear replies | `Features/Feed/Views/Thread/ThreadView.swift`: layout options at 49–52; `UIKitThreadView.swift`: parent/anchor/reply rows at 1039–1050; `Features/Feed/Models/ThreadReplyLayout.swift`: linear/tree models at 10–39. |
| Posts, replies and threads in the composer | `Features/Feed/Views/Components/PostComposer/PostComposerViewUIKit/PostComposerViewUIKit.swift`: source post/editor at 438–473, add-thread action at 770–787; `PostComposerViewUIKit+Thread.swift`: multiple entries at 13–111. |
| Photos, video and alt text | Same composer directory, `PostComposerViewUIKit+Sheets.swift`: photo/video alt-text editors at 239–252; media attachment routes. |
| iPhone/iPad and native feel | Existing iPhone/iPad app scope; SwiftUI/UIKit navigation and adaptive layouts. “Feels right at home” is Josh's design description, not a performance or multitasking guarantee. |

These are source checks, not a claim that a particular final binary has been captured. Use the October 7 section of `homepage-shot-list.md` for the current capture plan. Discovery's changing UI is not a promoted screenshot or a separate recommendation/AI claim.

## Historical October 3 evidence

The material below is retained for provenance. Its build numbers, workspace, open issues, and long capture gates describe the October 3 state; they are not today's release baseline or required validation process.

# Homepage evidence (local revision, 2026-10-03)

The homepage promotes three interactions a Bluesky user can see in Catbird. Each one was checked against the release build. That build is 1.0 build 6, installed on Josh's iPhone from sealed source `7c7b1742baa5d863cba54d9546c9417601822f1a` in the Lite workspace (`~/Developer/.workspaces/catbird-lite/Catbird`). Each was also checked against the runtime evidence the iOS lanes have recorded, then challenged by an adversarial reviewer.

**Source presence is not runtime proof.** Each section separates what the code shows from what a run has shown.

None of the pictures on the page are screenshots. They are temporary illustrations drawn from the release source. Each carries a visible "Illustration" note until a release-build capture replaces it (see `homepage-shot-list.md`).

The research trail is in the workflow journals of the design-system session, `wf_29db6200-d81` (verification and challenge) and `wf_6f8e6901-194` (the original shortlist). The shortlist is in the workspace at `docs/research/2026-10-03-catbird-lite-distinctive-choices.md`. Its line numbers came from an older working copy (bookmark `lite`, `4065b2a2`), which is not an ancestor of the release. Where they differ, this file supersedes it.

## Hero lead

Headline: "Explore Bluesky through your feeds". Lead: "Keep your pinned and saved feeds in one grid and switch between them with a tap. Write posts and threads with photos, video and alt text, and choose who can reply. Catbird uses the Bluesky account you already have."

| Clause | Backed by |
|---|---|
| Pinned and saved feeds in one grid; switch with a tap | §1 (feeds drawer grid; the tile-tap clip A3 is the publication gate) |
| Posts and threads with photos, video and alt text | The /features composer list, fact-checked against the Lite build on 2026-10-02 (`PostComposerViewModel.swift`, `ComposerAccessoryBar.swift`, `MediaItemView.swift`) |
| Choose who can reply | §2 (reply-limit chip; interaction settings in the composer) |
| Uses the Bluesky account you already have | OAuth sign-in with the user's existing AT Protocol account (homepage "Signing in", /privacy draft) |

Platforms are stated once, factually, in the status line under the lead ("iPhone and iPad · iOS 18 or later"). The quiet character count is a secondary detail in §2's section, not in the lead. The iPad section is titled "Also on iPad". Each clause keeps its section's publication gate.

## 1. Feeds drawer grid: promoted, with a caveat

**On the page:**
- "Tap the grid button on Home to see your feeds together: your default feed at the top, then the feeds you've pinned and the ones you've saved, as a grid of icons. Tap any one to switch to it."
- "Every feed you've pinned or saved is in one place."

**Release source (7c7b1742):**
- `Catbird/Core/UI/HomeView.swift`:
  - `:162-174` is the top-leading `square.grid.3x3.fill` "Feed selector" button, on Home root only.
  - `:118-131` sets the current feed name as the large title.
- `Catbird/Features/Settings/Views/SideDrawer.swift:172-178` opens the drawer, gated on the Home tab at root.
- `Catbird/App/ContentView.swift:461-523` holds the drawer content, the close button and the bottom bar (Profile, Bookmarks, My Lists).
- `Catbird/Features/Feed/Views/FeedsStartPage.swift`:
  - `:1176-1225` banner and identity row.
  - `:1227-1316` the "Feeds" row with Add Feed, the grid/list toggle and Edit.
  - `:352-449` the default-feed card with a selection checkmark.
  - `:1381-1391` the Pinned and Saved sections.
  - `:520-566` the grid: 3 columns at 402pt, 4 at 430pt.
  - `:772-790` a tile tap sets the selected feed.
- Launcher paging was removed (`7d103557`), so the page doesn't mention it.
- The drawer files are byte-identical to the drawer candidate `af362d77`.

**Runtime:**
- **Simulator, drawer files identical to the release** (`af362d77`, DEBUG build with fixture overlays, iPhone 17 Pro, iOS 27). `FeedsDrawerRefinementUITests/testDrawerAndDiscoveryTrailingControls` and `FeedDiscoveryJourneyTests/testNormalModeEntryProvidesNativeSearchAndCanClose` passed. This proves that Feed selector opens the drawer and that Add Feed and Discover work. Packet: `~/Developer/_main-consolidation-builds/Oct3DrawerFixtureRemedy/Packet/FINAL-REPORT.md`.
- **Not shown on any build:** tapping a pinned or saved tile to switch feeds, a populated grid, the swipe-right gesture on the release drawer, or the physical device.
- **Physical:** build 6 covers startup only. Its report says "Same-binary physical drawer/Discover … remain unqualified" (`~/Documents/Codex/2026-10-02/task/main-consolidation/device-gates/build6/REPORT.md`).

**Open items:**
- **Drawer polish:** LITE-003 (banner blur) and LITE-016 (Feeds page polish) still need verification. Josh's notes keep the grid, so the concept is stable and the details may still change.
- **Source quirks:**
  - An account whose only pinned feed is the default shows an empty "Pinned" heading.
  - Remove (in Edit mode) writes immediately, with no confirmation.
- **Build 7** touches none of the drawer files.

**Deliberately not said:**
- **Swipe right.** No release runtime evidence.
- **Paging or "launchpad".** Paging was removed.
- **Drag to reorder.** Not runtime-qualified on either code path.
- **Any comparison with the official app.** The verified one is that the official app shows pinned feeds as tabs on Home and other saved feeds on a separate Feeds screen. The page doesn't make the comparison. It must never say the official app hides saved feeds or can't reorder them, because it can on its Saved Feeds screen.

**Gate before publication:** shot A3 in the shot list, showing a tile tap switching the feed on the release build.

## 2. Composer character ring: promoted, with a caveat

This replaced the provisional "blocked replies" pick (see §4).

**On the page:**
- "While you write, the character count is a small grey ring. The number appears only when you're within 50 characters of the 300-character limit, and the ring changes color as you get closer."
- "If you limit who can reply, the composer spells it out above the keyboard, for example 'Mentioned, Following · No quotes'."
- "You see the limit when it's close, and who can reply before you post."

**Release source (7c7b1742)** is byte-identical to the validated composer files, apart from one add-to-thread icon line:
- `CharacterLimitIndicator.swift`:
  - `:11-21` shows the number only with 50 or fewer characters left.
  - `:41-67` colors: grey up to 260 characters, green 261–280, orange 281–290, red 291 and over.
  - `:96-105` shows "!" when over the limit.
- `ComposerAccessoryBar.swift:96-126` is the bar: Add, Add to Thread, the ring.
- `ComposerChipsStrip.swift`:
  - `:119-127` is the reply-limit chip. Its summary order is Mentioned, Following, Followers, Lists; `PostInteractionSettingsState.swift:49-59` adds " · No quotes".
  - `:139-156` is the "Detected: ‹language›" chip, which appears by default while you type.

**Runtime:**
- **Simulator UI test on identical composer files.** `testComposerSingleAndThread` passed 15 of 15 executions. Its screenshot shows a short draft with the grey ring and no number, the bar, and the "Detected: English" chip. Base `63ba7724` plus the composer patch, iPhone simulator. Evidence: `~/Documents/Codex/2026-10-03/task/ui-validation/evidence/RESULTS.json` and `…/candidate-large-ltr/attachments/FBAE60BB-25AE-46C2-804E-712BBF1DFC22.png`.
- **Not yet captured:**
  - the number appearing;
  - the color states;
  - the reply-limit chip.

  The unit tests for these (`ComposerCounterDisplayTests`, `ComposerChipsStripTests`) were compiled but not run.

**Open items:**
- **Build 7** changes the reply composer (`69a93517`) but none of these three files. Capture the new-post composer only.
- **Keep out of frame:**
  - the composer's dead-end "Audio" row;
  - the Post button (never tap it).

**Deliberately not said:**
- "Distraction-free".
- "Chips only appear when you change a setting." The Detected chip appears by default.
- The comparison. The official app always shows the number from 300, and its pill says "Interaction limited" without naming the limit (social-app `CharProgress.tsx:29-60`, `ThreadgateBtn.tsx:136-137`).

**Gate before publication:** stills of the number, the orange and red states, and the chip, from the shot list.

## 3. Native iPad app: promoted, narrowed

**On the page:**
- "Catbird is built for iPad as well as iPhone, and it fills the iPad screen."
- "If you read Bluesky on an iPad, Catbird uses the space you have."
- "iPad with iPadOS 18 or later."

**Release artifact.** The build-6 archive `Info.plist` (`~/Developer/_main-consolidation-builds/Oct3Combined/ArchiveQualificationR3/Catbird-build6-r3-arm64.xcarchive/Products/Applications/Catbird.app/Info.plist`) shows:
- `UIDeviceFamily` [1, 2];
- `UIApplicationSupportsMultipleScenes` true;
- all four iPad orientations;
- no `UIRequiresFullScreen`.

**Release source:**
- `ContentView.swift:446` sets `.tabViewStyle(.sidebarAdaptable)`.
- `ContentView.swift:369-440` defines the tabs: Home, Search, Notifications, Profile (iPad only) and Messages.
- `ChatTabView.swift:36-48` uses `NavigationSplitView` on iPad.

**Runtime:**
- **No real-UI iPad run exists** on any build.
- **Window resizing:** an iPad simulator fixture run on build 5 (`be4ca022`) showed real window resizing on a synthetic diagnostics screen. That isn't product UI.
- **Not runnable on iPad:** the build-6 binary is provisioned for Josh's iPhone only.

**Open items:**
- **LITE-017** (window continuity through resizing) is in progress.
- **iPad mini:** the iPad Profile tab overflows into a ">" chevron in portrait (source comment `ContentView.swift:248-260`).

**Deliberately not said:**
- "Messages keeps your list beside the open chat." Allowed only after the iPad Messages capture.
- Anything about Split View, Stage Manager or multiple windows keeping your place.
- "The only Bluesky app made for iPad". The bsky.app website has a tablet layout, and other clients may exist.
- The verified comparison, not used on the page: the official iOS app is iPhone-only (`supportsTablet: false`, social-app `app.config.js:58-59`). Recheck the App Store listing on the day of publication if it's ever used.

**Gate before publication:** iPad shots 1–3 from the shot list.

## 4. Replaced: blocked-reply cards (do not promote)

The brief started with "understandable blocked-reply states". Verification and the skeptic both found the claim unstable:

1. **The card appears in fewer places than "a blocked reply" suggests.** The AppView drops blocked replies below a post entirely (atproto `views/index.ts` `checkThreadV2ReplyInclusion`). The card appears only on a blocked post above a reply, a blocked main post, quoted posts and bookmarks.
2. **"View this post" probably can't work.** It calls `app.bsky.feed.getPosts`, which drops posts with any block relation. The expected result is "This post isn't available."
3. **Unblock silently fails for list-based blocks.** The card treats a list block as a direct block (`GraphManager.swift:661-700`).
4. **The blocked-main-post copy is false.** It says replies are shown, but the AppView returns the main post only.
5. **No runtime evidence exists** for the card on any build.
6. **It's a product choice for Josh.** The card shows the name and avatar of an account that blocked you.

The illustration was moved to `_trash/website-homepage-rev-20261003/`.

## 5. Availability, price and removed claims

**Availability:**
- On 2026-10-03 the public TestFlight link `testflight.apple.com/join/8zPe2QG8` returned a live "Catbird for Bluesky beta" page.
- Which build it serves could not be verified. Builds 5 and 6 were installed as development builds, not through TestFlight.
- So `config.ts` sets `BETA_VERIFIED = false`, and every page says "In development; not yet on the App Store". The site-wide action is "Follow for Updates" (@catbird.blue).

**Removed, because no price or tip decision exists:**
- "Price: Free" (press fact sheet);
- "It's free" and "The beta is free" (support FAQ);
- "a free, open-source app" (press);
- "It's free" (old hero).

**Removed from the homepage and kept on /features:** the old feature tiles, the "Also included" list and the "A look inside" carousel.

**Removed from the homepage only:**
- The SwiftUI and Liquid Glass introduction. Press and /features still describe Liquid Glass factually.
- The "What is Bluesky?" explainer. The non-affiliation line stays in the footer and FAQ.
