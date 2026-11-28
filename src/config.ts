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

/**
 * Flip to true only after confirming that TESTFLIGHT_URL serves the release build this
 * site describes. Until then the site directs people to follow Catbird for updates.
 */
export const BETA_VERIFIED = false;

export const GITHUB_URL = 'https://github.com/joshlacal/Catbird';
export const BLUESKY_HANDLE = 'catbird.blue';
export const BLUESKY_URL = 'https://bsky.app/profile/catbird.blue';

/** Where Catbird can be had today. Every page derives its call to action from this. */
export type Availability = 'app-store' | 'beta' | 'in-development';
export const AVAILABILITY: Availability = APP_STORE_LIVE
  ? 'app-store'
  : BETA_VERIFIED
    ? 'beta'
    : 'in-development';

/** One-line availability statement, safe to show anywhere. */
export const AVAILABILITY_TEXT: Record<Availability, string> = {
  'app-store': 'On the App Store',
  beta: 'In beta on TestFlight; not yet on the App Store',
  'in-development': 'Not on the App Store yet',
};

/** The site-wide primary action for the current availability. */
export const PRIMARY_CTA: { href: string; label: string; external: boolean } =
  AVAILABILITY === 'app-store'
    ? { href: APP_STORE_URL, label: 'Get Catbird', external: true }
    : AVAILABILITY === 'beta'
      ? { href: TESTFLIGHT_URL, label: 'Join the Beta', external: true }
      : { href: BLUESKY_URL, label: 'Follow for Updates', external: true };

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
