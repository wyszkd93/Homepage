import rss from '@astrojs/rss';
import { SITE } from '../consts';
import { getPosts } from '../utils/posts';

export async function GET(context) {
  const posts = await getPosts();
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: new URL(base + '/', context.site),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      categories: post.data.tags,
      link: `${base}/blog/${post.id}/`,
    })),
    customData: '<language>ko</language>',
  });
}
