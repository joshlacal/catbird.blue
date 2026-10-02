import { getCollection, type CollectionEntry } from 'astro:content';

export type NewsPost = CollectionEntry<'news'>;

/** Published posts (drafts excluded), newest first. */
export async function getPublishedPosts(): Promise<NewsPost[]> {
  const posts = await getCollection('news', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Published posts tagged "release", newest first. */
export async function getReleasePosts(): Promise<NewsPost[]> {
  return (await getPublishedPosts()).filter((p) => p.data.tags.includes('release'));
}

export const postUrl = (post: NewsPost) => `/news/${post.id}`;

/** Dates are calendar dates (YYYY-MM-DD in front matter), so format them in UTC. */
export const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

export const isoDate = (date: Date) => date.toISOString().slice(0, 10);

export const TAG_LABELS: Record<string, string> = {
  release: 'Release',
  beta: 'Beta',
  announcement: 'Announcement',
};
