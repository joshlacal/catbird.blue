/**
 * Shared helpers for the legal pages (/privacy, /terms).
 *
 * Every fact that depends on a decision Josh has not made yet (identity, address,
 * jurisdiction, contact email, effective date) is read from src/config.ts. When a
 * value is null the pages render a clearly marked "to be completed" note instead of
 * a made-up value, and the notice at the top of the page lists what is missing.
 */
import { LEGAL, PRIVACY_EMAIL, SUPPORT_EMAIL } from '../../config';

export type LegalPageKind = 'privacy' | 'terms';

export interface TocEntry {
  id: string;
  label: string;
}

/** Contact address for privacy requests: the privacy mailbox, else the support mailbox. */
export const privacyContactEmail: string | null = PRIVACY_EMAIL ?? SUPPORT_EMAIL ?? null;

/** Contact address for the terms: the support mailbox, else the privacy mailbox. */
export const termsContactEmail: string | null = SUPPORT_EMAIL ?? PRIVACY_EMAIL ?? null;

/** "March 4, 2027" from "2027-03-04". Returns null for a missing or malformed date. */
export function formatEffectiveDate(iso: string | null): string | null {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export const effectiveDate = formatEffectiveDate(LEGAL.effectiveDate);

/**
 * The config-driven items still missing for a page, in reading order. Each entry is
 * a plain-language label shown in the "To be completed before publication" notice.
 */
export function missingLegalItems(kind: LegalPageKind): string[] {
  const missing: string[] = [];
  if (!LEGAL.controllerName) missing.push('The legal name of the person or company responsible for Catbird');
  if (!LEGAL.postalAddress) missing.push('A postal address for that person or company');
  // Governing law appears only in the terms; the privacy policy does not choose a law.
  if (kind === 'terms' && !LEGAL.jurisdiction) missing.push('The governing-law jurisdiction');
  const email = kind === 'privacy' ? privacyContactEmail : termsContactEmail;
  if (!email) missing.push('A monitored contact email address');
  if (!effectiveDate) missing.push('The effective date');
  return missing;
}
