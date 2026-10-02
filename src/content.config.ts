/**
 * Content collections (Astro content layer).
 *
 * news: one Markdown file per post in src/content/news/. The file name (without .md) is the URL
 * slug: src/content/news/catbird-1-0.md -> /news/catbird-1-0. Posts tagged "release" also appear
 * on /changelog. See docs/brand-assets.md ("News and changelog") for the authoring rules.
 *
 * The collection may be empty. /news, /changelog and /rss.xml render a proper empty state, and
 * Astro logs a "No files found" warning at build time until the first post exists.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const NEWS_TAGS = ['release', 'beta', 'announcement'] as const;

const news = defineCollection({
  loader: glob({ base: './src/content/news', pattern: '**/[^_]*.md' }),
  schema: z.object({
    /** Headline, sentence case. */
    title: z.string().min(1),
    /** Publication date, YYYY-MM-DD. Must be the real date the post went out. */
    date: z.coerce.date(),
    /** One or two sentences. Used on the index, in RSS and as the meta description. */
    summary: z.string().min(1).max(300),
    /** "release" puts the post on /changelog. */
    tags: z.array(z.enum(NEWS_TAGS)).default([]),
    /** App version for release posts, e.g. "1.0". Shown on /changelog. */
    version: z.string().optional(),
    /** Drafts build locally but are excluded from every page, the RSS feed and the sitemap. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { news };
