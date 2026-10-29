import { getCollection, type CollectionEntry } from 'astro:content';
import type { Platform, Topic } from '../categories';
import { classify } from './categories';

export type Post = CollectionEntry<'blog'> & { platform: Platform; topic: Topic; displayTitle: string };

export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts
    .map((post) => {
      const { platform, topic, title } = classify(post.data.title, post.data.platform, post.data.topic);
      return Object.assign(post, { platform, topic, displayTitle: title });
    })
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const categoryUrl = (platform: Platform, topic?: Topic) =>
  `/blog/category/${platform.slug}/${topic ? `${topic.slug}/` : ''}`;
