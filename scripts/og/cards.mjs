// Open Graph card definitions. One entry per page that has its own card.
// `title` must match the page's real <h1>/title; `subtitle` must be a plain fact about the page.
// `alt` is what pages pass to BaseLayout's `ogImageAlt`.
// `layout`: 'brand' = centred bird with the wordmark below (the default social card, per
// docs/brand/08-components/app-icon.md "OpenGraph card"); 'page' = title left, bird right.

export const CARDS = [
  {
    slug: 'default',
    layout: 'brand',
    title: null,
    subtitle: 'A Bluesky client for iPhone and iPad',
    alt: 'The Catbird bird above the catbird wordmark on a blue gradient, with the line “A Bluesky client for iPhone and iPad”.',
  },
  {
    slug: 'home',
    layout: 'page',
    title: 'A Bluesky client for iPhone and iPad',
    subtitle: 'Requires iOS 18 or later.',
    alt: 'Catbird card: “A Bluesky client for iPhone and iPad. Requires iOS 18 or later.” beside the Catbird bird.',
  },
  {
    slug: 'features',
    layout: 'page',
    title: 'Features',
    subtitle: 'Feeds, posting, threads, safety tools and more.',
    alt: 'Catbird card: “Features” beside the Catbird bird.',
  },
  {
    slug: 'support',
    layout: 'page',
    title: 'Support',
    subtitle: 'Answers and ways to get help with Catbird.',
    alt: 'Catbird card: “Support” beside the Catbird bird.',
  },
  {
    slug: 'press',
    layout: 'page',
    title: 'Press',
    subtitle: 'Facts and brand assets for writing about Catbird.',
    alt: 'Catbird card: “Press” beside the Catbird bird.',
  },
  {
    slug: 'privacy',
    layout: 'page',
    title: 'Privacy Policy',
    subtitle: 'What Catbird stores, where it goes and your choices.',
    alt: 'Catbird card: “Privacy Policy” beside the Catbird bird.',
  },
  {
    slug: 'terms',
    layout: 'page',
    title: 'Terms of Service',
    subtitle: 'The rules for using Catbird.',
    alt: 'Catbird card: “Terms of Service” beside the Catbird bird.',
  },
  {
    slug: 'news',
    layout: 'page',
    title: 'News',
    subtitle: 'Updates and announcements about Catbird.',
    alt: 'Catbird card: “News” beside the Catbird bird.',
  },
  {
    slug: 'changelog',
    layout: 'page',
    title: 'Changelog',
    subtitle: 'What changed in each release of Catbird.',
    alt: 'Catbird card: “Changelog” beside the Catbird bird.',
  },
  {
    slug: 'accessibility',
    layout: 'page',
    title: 'Accessibility',
    subtitle: 'Accessibility settings in Catbird and on this site.',
    alt: 'Catbird card: “Accessibility” beside the Catbird bird.',
  },
];
