import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import siteConfig from '../config/site.json';

export async function GET(context) {
  const news = await getCollection('news', ({ data }) => !data.draft);
  return rss({
    title: `${siteConfig.title} — News`,
    description: siteConfig.description,
    site: context.site,
    items: news
      .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
      .map((entry) => ({
        title: entry.data.title,
        pubDate: entry.data.date,
        description: entry.data.summary ?? '',
        link: `/news/${entry.slug}/`,
      })),
  });
}
