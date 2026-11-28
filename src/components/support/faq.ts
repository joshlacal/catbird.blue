/**
 * Support FAQ content (plan §3.2 /support). Every answer is checked against the code that
 * ships in the 1.0 build; the evidence for each one is listed in the build report and in
 * the comments below. Answers are trusted HTML authored here (rendered with set:html);
 * the FAQPage JSON-LD uses the same text with tags stripped.
 *
 * When something changes in the app, change the answer here:
 *   - "delete-account" follows the hosting-provider options in Account settings.
 *   - "dm-notifications" must be removed when direct-message push works (LITE-001).
 *   - "requirements" follows config AVAILABILITY (pre-release / beta / App Store).
 *     No price is stated: pricing is not decided.
 */
import {
  AVAILABILITY,
  APP_STORE_URL,
  BLUESKY_HANDLE,
  BLUESKY_URL,
  GITHUB_URL,
  MIN_IOS,
  SUPPORT_EMAIL,
  TESTFLIGHT_URL,
} from '../../config';

export interface FaqItem {
  /** Stable anchor id (#faq-<id>). */
  id: string;
  question: string;
  /** Trusted HTML. */
  answer: string;
}

export interface FaqGroup {
  id: string;
  title: string;
  items: FaqItem[];
}

const ext = (href: string, label: string) => `<a href="${href}">${label}</a>`;
const blueskyLink = ext(BLUESKY_URL, `@${BLUESKY_HANDLE}`);
const githubIssues = `${GITHUB_URL}/issues`;
const contactLine = SUPPORT_EMAIL
  ? `email <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a> or message ${blueskyLink} on Bluesky`
  : `message ${blueskyLink} on Bluesky`;

// Distribution follows config AVAILABILITY. The beta wording is used only once the
// TestFlight link is verified to serve the release build (BETA_VERIFIED).
const getIt =
  AVAILABILITY === 'app-store'
    ? `<p>Download Catbird from the ${ext(APP_STORE_URL, 'App Store')}.</p>`
    : AVAILABILITY === 'beta'
      ? `<p>Catbird is in beta and isn’t on the App Store yet. To try it, install Apple’s TestFlight app on your iPhone or iPad, then open the ${ext(TESTFLIGHT_URL, 'Catbird beta invitation')} and tap Accept.</p>`
      : `<p>Catbird isn’t on the App Store yet. Follow ${blueskyLink} on Bluesky to hear when you can try it.</p>`;

export const FAQ: FaqGroup[] = [
  {
    id: 'about',
    title: 'About Catbird',
    items: [
      {
        // Non-affiliation line: plan §3.2 /terms.
        id: 'official',
        question: 'Is Catbird an official Bluesky app?',
        answer: `<p>No. Catbird is an independent app for Bluesky. It isn’t affiliated with, endorsed by, or officially connected to Bluesky Social, PBC. You use the same Bluesky account in Catbird as you do anywhere else.</p>`,
      },
      {
        // pbxproj IPHONEOS_DEPLOYMENT_TARGET = 18, TARGETED_DEVICE_FAMILY = "1,2" (Lite);
        // LoginView.swift:576,1008-1010 (Create Account); pbxproj:639-642 (English only).
        id: 'requirements',
        question:
          AVAILABILITY === 'beta'
            ? 'What do I need, and how do I join the beta?'
            : AVAILABILITY === 'app-store'
              ? 'What do I need, and where do I get Catbird?'
              : 'What do I need, and when can I try Catbird?',
        answer: `<p>You need an iPhone or iPad running iOS ${MIN_IOS} or iPadOS ${MIN_IOS}, or later, and a Bluesky account. If you don’t have an account yet, you can create one from Catbird’s sign-in screen. The app is in English.</p>${getIt}`,
      },
    ],
  },
  {
    id: 'account',
    title: 'Your account',
    items: [
      {
        // LoginView.swift:1144-1150 (webAuthenticationSession, preferredBrowserSession: .ephemeral);
        // AuthManager.swift:557-561 (OAuth client, catbird.blue callback).
        id: 'sign-in',
        question: 'How does signing in work, and why does it open a browser?',
        answer: `<p>Catbird uses OAuth, the standard sign-in method for Bluesky and the AT Protocol. When you enter your handle, Catbird opens your account server’s own sign-in page in a secure browser window. You sign in there and approve access for Catbird, then the window closes and you’re back in the app.</p><p>The browser step is what keeps your password out of Catbird: you type it on your server’s page, not in the app. The window is a private browsing session, so it doesn’t use or keep your Safari sign-ins.</p>`,
      },
      {
        // No SecureField anywhere in the app; credentials are entered on the authorization server.
        id: 'password',
        question: 'Does Catbird see my password?',
        answer: `<p>No. You enter your password only on your account server’s sign-in page. Catbird never receives it.</p>`,
      },
      {
        // nest/catbird/src/config/mod.rs:534-536 (30 days); services/redis_auth_store.rs:1-4 (AES-256-GCM),
        // :78-106 (sliding TTL refreshed on each use); research privacy-truth §3.
        id: 'session',
        question: 'Does Catbird keep me signed in?',
        answer: `<p>Yes. When you sign in, your account server issues sign-in tokens to Catbird’s server, not to your device. Catbird’s server stores them encrypted and uses them to pass most of the app’s requests on to your account. Your device keeps a session ID that points to that session, not the tokens themselves.</p><p>The session expires after 30 days without use, and every time you use the app the 30 days start again. Signing out ends it immediately. The <a href="/privacy">privacy policy</a> explains what Catbird’s server handles.</p>`,
      },
      {
        // UnifiedProfileView.swift:818-843 (current-user menu: Switch Account, Sign Out);
        // ContentView.swift:401-403 (Profile tab on iPad only), :494 (Profile in the feeds menu);
        // nest handlers/atproto.rs:1117-1222 (logout deletes session, then revokes tokens).
        id: 'sign-out',
        question: 'How do I sign out?',
        answer: `<p>Open your profile, tap the More button (the circle with three dots) at the top, and choose Sign Out. On iPad, your profile is the Profile tab. On iPhone, open the feeds menu from Home and tap Profile.</p><p>Signing out deletes your session from Catbird’s server and asks your account server to revoke Catbird’s access.</p>`,
      },
      {
        // appstore-polish-1005, October 7: AccountSettingsView.swift shows
        // Account Deletion Options, opening the provider instructions via AccountDeletionSheet.
        id: 'delete-account',
        question: 'How do I delete my account?',
        answer: `<p>In Catbird, go to Settings, then Account, and tap Account Deletion Options to find instructions from the provider that hosts your account. Opening the provider’s website does not delete your account; follow its instructions to complete the request.</p><p>For accounts hosted by Bluesky, you can also use the account settings in Bluesky’s own app or at <a href="https://bsky.app">bsky.app</a>. If your account is on another server, follow that provider’s instructions. Deleting Catbird from your device does not delete your account.</p>`,
      },
      {
        // Logout path above; push records and preferences are not removed on logout
        // (research privacy-truth §11 deletion paths; nest services/push/registry.rs:405-485).
        id: 'server-data',
        question: 'How do I ask Catbird to delete data its server holds?',
        answer: `<p>Your posts, follows and likes live on your account server, and your direct messages with Bluesky’s chat service, not on Catbird’s server. Deleting them happens through Bluesky.</p><p>Catbird’s server holds your sign-in session, which signing out deletes. It also keeps data it needs for notifications, such as your notification settings and each device’s push registration, and signing out doesn’t remove that. To ask for that data to be deleted, ${contactLine} from the account the request is about, so the request can be matched to it. The <a href="/privacy">privacy policy</a> lists what Catbird’s server keeps.</p>`,
      },
    ],
  },
  {
    id: 'safety',
    title: 'Safety and content',
    items: [
      {
        // PostView.swift:520-565 (Mute User, Block User, Mute Thread, Report Post);
        // UnifiedProfileView.swift:846-925 (Report User, Mute User, Block User);
        // FeedScreen.swift:44 (Report Feed); ReportFormView.swift:541-566 (choose moderation service);
        // ModerationSettingsView.swift:95-136 (Muted Words & Tags, Muted Accounts, Blocked Accounts).
        id: 'report-block-mute',
        question: 'How do I report, block or mute someone?',
        answer: `<p>Open a post’s menu to choose Report Post, Mute User, Block User or Mute Thread. On someone’s profile, the More button has Report User, Mute User and Block User. You can also report feeds and labelers.</p><p>When you report something, you choose which moderation service receives it: Bluesky’s, or another labeler you subscribe to. To review your muted words and tags, muted accounts and blocked accounts, go to Settings, then Moderation.</p>`,
      },
      {
        // ModerationSettingsView.swift:150-168 (toggle can only be turned off in Catbird);
        // 1.0 plan copy fix: "bsky.app on the web".
        id: 'adult-content',
        question: 'Why can’t I turn on adult content in Catbird?',
        answer: `<p>Catbird can’t turn adult content on. You can turn it on in Bluesky’s web app: sign in at <a href="https://bsky.app">bsky.app</a> in a web browser and turn it on in its moderation settings. The setting belongs to your account, so Catbird follows it.</p><p>You can turn adult content off in Catbird at any time, in Settings, then Moderation.</p>`,
      },
    ],
  },
  {
    id: 'ask-catbird',
    title: 'Ask Catbird',
    items: [
      {
        // BlueskyIntelligenceAgent.swift:75-79 (FoundationModels, iOS 26), :853-858 (model availability);
        // CopilotContracts.swift (actions need confirmation); plan §6 #10 (menu shows on iOS 18).
        id: 'ask-catbird-requirements',
        question: 'What does Ask Catbird need?',
        answer: `<p>Ask Catbird uses Apple Intelligence and runs on your device. It needs iOS 26 or iPadOS 26 or later, a device that supports Apple Intelligence, and Apple Intelligence turned on in the Settings app. On other devices you may still see Ask Catbird in menus, but it can’t answer.</p><p>Ask Catbird can suggest actions, like following someone or drafting a reply. Nothing happens until you confirm.</p>`,
      },
    ],
  },
  {
    id: 'problems',
    title: 'Problems and feedback',
    items: [
      {
        // TestFlight's built-in feedback; github.com/joshlacal/Catbird has issues enabled (gh repo view).
        id: 'report-bug',
        question: 'How do I report a bug?',
        answer: `<p>If you’re testing Catbird through TestFlight, the quickest way is TestFlight’s feedback. Take a screenshot in Catbird and choose Share Beta Feedback, or open the TestFlight app, choose Catbird and tap Send Beta Feedback.</p><p>You can also <a href="${githubIssues}">open an issue on GitHub</a>, where Catbird’s source code is published. Issues there are public, so leave out anything private. Or ${contactLine}.</p>`,
      },
      {
        // docs/qa/catbird-lite-live-feedback.md:15-27 (LITE-001, needs verification, not delivered).
        id: 'dm-notifications',
        question: 'Why don’t I get notifications for direct messages?',
        answer: `<p>This is a known issue: Catbird doesn’t deliver push notifications for Bluesky direct messages yet. Your messages still arrive, so check the Messages tab. A fix is being tested.</p>`,
      },
    ],
  },
];

/** Plain text for JSON-LD: strips tags, decodes the few entities used above. */
export function plainText(html: string): string {
  return html
    .replace(/<\/p>\s*<p>/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

export function faqJsonLd(groups: FaqGroup[] = FAQ) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: groups.flatMap((g) =>
      g.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: plainText(item.answer) },
      })),
    ),
  };
}
