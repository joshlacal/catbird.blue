/**
 * Home page copy that is shared with /features. Every line is a shipped 1.0 fact; the
 * evidence (Lite workspace paths, relative to .workspaces/catbird-lite/Catbird/Catbird/)
 * sits next to each entry so a reviewer can check it without the research report.
 */

export interface FeatureTile {
  id: string;
  icon: string;
  title: string;
  body: string;
  /** Extra requirement line shown under the body (e.g. OS and device gates). */
  note?: string;
}

export const FEATURE_TILES: FeatureTile[] = [
  {
    // Features/Feed/Views/FeedsStartPage.swift:378,1449,1460-1466 (Add Feed, Discover,
    // Pinned/Saved); Features/Feed/Models/FeedFilterSettings.swift:95-262; muted words:
    // Features/Settings/Views/ModerationSettingsView.swift (research CLAIM 18).
    id: 'feeds',
    icon: 'grid-3x3',
    title: 'Your feeds',
    body: 'Keep pinned and saved feeds in one drawer, including custom, list and hashtag feeds, then filter out reposts, replies or links and mute words and tags.',
  },
  {
    // Features/Feed/Views/Components/PostComposer/PostComposerViewModel.swift:161
    // (maxImagesAllowed = 10); Components/ComposerAccessoryBar.swift:134-158;
    // PostComposerViewUIKit+MediaAttachments.swift (video caption editor);
    // Media/MediaItemView.swift:119-122 (alt text).
    id: 'composer',
    icon: 'pen-line',
    title: 'A serious composer',
    body: 'Write threads with up to 10 photos, video with captions, GIFs and alt text, and choose who can reply before you post.',
  },
  {
    // Features/Feed/Models/ThreadReplyLayout.swift:12-17; Features/Feed/Views/Post.swift:10,346-375.
    id: 'threads',
    icon: 'list-tree',
    title: 'Threads your way',
    body: 'Read replies as a tree or as a straight line, and translate posts in other languages without leaving the conversation.',
  },
  {
    // Features/Settings/Views/ModerationSettingsView.swift; Features/Moderation/Views/
    // VerificationSettingsView.swift:26-27 ("Show verification badges").
    id: 'safety',
    icon: 'shield-check',
    title: 'Safety tools',
    body: 'Report, block and mute, subscribe to labelers, and decide whether verification badges appear.',
  },
  {
    // Features/Settings/Views/AppearanceSettingsView.swift:67-127; Core/State/ThemeManager.swift:29-47.
    id: 'appearance',
    icon: 'palette',
    title: 'Make it yours',
    body: 'Choose Light or Dark, Dim or True Black, one of seven accent colors, and the font style, size and line spacing you read best in.',
  },
  {
    // Core/Services/BlueskyIntelligenceAgent.swift:78-83 (@available iOS 26, SystemLanguageModel);
    // Core/Models/CopilotContracts.swift:51-76 (inline confirmation, proposed actions).
    id: 'ask-catbird',
    icon: 'sparkles',
    title: 'Ask Catbird',
    body: 'An assistant that runs on your device answers questions about posts and profiles, and anything it suggests doing waits for you to confirm.',
    note: 'Requires iOS 26 and Apple Intelligence.',
  },
];

export interface IncludedItem {
  icon: string;
  label: string;
}

export const ALSO_INCLUDED: IncludedItem[] = [
  // Features/Chat/Views/ChatTabView.swift:161 (MessageRequestsButton);
  // Features/Chat/Views/Components/MessageReactionsView.swift
  { icon: 'mail', label: 'Bluesky direct messages, with message requests and reactions' },
  // Features/Auth/Views/AccountSwitcherView.swift:224,233
  { icon: 'users-round', label: 'Multiple accounts' },
  // Features/Settings/Views/PrivacySecuritySettingsView.swift:73-101
  { icon: 'scan-face', label: 'Face ID or Touch ID app lock' },
  // AppIntents/Support/CatbirdShortcuts.swift:16-110
  { icon: 'audio-lines', label: 'Siri and App Shortcuts' },
  // Features/StarterPack/Views/StarterPackQRCodeCard.swift; StarterPackWizardView.swift
  { icon: 'qr-code', label: 'Starter packs with QR codes' },
  // App/ContentView.swift:380 (Search tab); Features/Search/Views/Sections/TrendingTopicsSection.swift
  { icon: 'search', label: 'Search and trending topics' },
  // App/ContentView.swift:515 ("My Lists"); Features/Lists
  { icon: 'list', label: 'Lists' },
  // App/ContentView.swift:504 ("Bookmarks")
  { icon: 'bookmark', label: 'Bookmarks' },
];
