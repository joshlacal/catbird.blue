/**
 * Site-wide facts. Every page reads links and legal details from here, never
 * hard-codes them. Values that are not decided yet are `null`; pages must handle
 * null by omitting the element (never by printing a placeholder).
 */

export const SITE_URL = 'https://catbird.blue';
export const SITE_NAME = 'Catbird';

/** Public TestFlight link (from the @catbird.blue profile bio). */
export const TESTFLIGHT_URL = 'https://testflight.apple.com/join/8zPe2QG8';

/** App Store Connect Apple ID. The listing is not live yet. */
export const APP_STORE_ID = '6743628331';
/** Flip to true only once the App Store listing is public (badge + Smart App Banner gate). */
export const APP_STORE_LIVE = false;
export const APP_STORE_URL = 'https://apps.apple.com/app/id6743628331';

export const GITHUB_URL = 'https://github.com/joshlacal/Catbird';
export const BLUESKY_HANDLE = 'catbird.blue';
export const BLUESKY_URL = 'https://bsky.app/profile/catbird.blue';

/** Monitored support address. null until a mailbox exists. */
export const SUPPORT_EMAIL: string | null = null;
/** Privacy contact address. null until a mailbox exists. */
export const PRIVACY_EMAIL: string | null = null;

/** Legal details for /privacy and /terms. Filled only after Josh decides (plan §7). */
export interface LegalConfig {
  controllerName: string | null;
  postalAddress: string | null;
  jurisdiction: string | null;
  /** ISO date (YYYY-MM-DD) the policy takes effect. */
  effectiveDate: string | null;
}

export const LEGAL: LegalConfig = {
  controllerName: null,
  postalAddress: null,
  jurisdiction: null,
  effectiveDate: null,
};

/** Minimum iOS / iPadOS version for 1.0. */
export const MIN_IOS = '18';

/** Primary navigation (header). */
export const NAV = [
  { href: '/features', label: 'Features' },
  { href: '/support', label: 'Support' },
  { href: '/news', label: 'News' },
] as const;

/** Footer links. External entries open in the same tab. */
export const FOOTER_LINKS = [
  { href: '/features', label: 'Features' },
  { href: '/support', label: 'Support' },
  { href: '/press', label: 'Press' },
  { href: '/news', label: 'News' },
  { href: '/changelog', label: 'Changelog' },
  { href: '/accessibility', label: 'Accessibility' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: GITHUB_URL, label: 'GitHub', external: true },
  { href: BLUESKY_URL, label: 'Bluesky', external: true },
] as const;
