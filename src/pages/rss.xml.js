import rss from '@astrojs/rss';
import { SITE_URL } from '../config';
import { getPublishedPosts, postUrl } from '../components/news/posts';

/** /rss.xml: every published news post, newest first. Valid (channel only) with zero posts. */
export async function GET(context) {
  const posts = await getPublishedPosts();
  return rss({
    title: 'Catbird News',
    description: 'Updates, announcements and release notes for Catbird, a Bluesky client for iPhone and iPad.',
    site: context.site ?? SITE_URL,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.summary,
      link: postUrl(post),
      categories: post.data.tags,
    })),
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: `<language>en-us</language><atom:link href="${new URL('/rss.xml', SITE_URL).href}" rel="self" type="application/rss+xml"/>`,
    trailingSlash: false,
  });
}
