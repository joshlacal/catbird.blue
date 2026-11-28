// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import termsPolicy from './src/terms-policy.json' with { type: 'json' };
import privacyPolicy from './src/privacy-policy.json' with { type: 'json' };

// Each legal page follows its own publication state.
const EXCLUDED = ['/styleguide', '/404'];
if (privacyPolicy.publication.status !== 'published') EXCLUDED.push('/privacy');
if (termsPolicy.publication.status !== 'published') EXCLUDED.push('/terms');

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
