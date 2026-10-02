// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Pages that must not appear in the sitemap. /privacy and /terms render with
// <meta name="robots" content="noindex"> while they are drafts (LegalLayout), and a
// noindex URL in a sitemap is a contradictory signal to search engines. Remove them from
// this list in the same change that drops noindex from LegalLayout.
const EXCLUDED = ['/styleguide', '/404', '/privacy', '/terms'];

export default defineConfig({
  site: 'https://catbird.blue',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname.replace(/\/$/, '') || '/';
        return !EXCLUDED.includes(path);
      },
    }),
  ],
});
