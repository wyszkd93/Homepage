import { getCollection, type CollectionEntry } from 'astro:content';
import type { Category } from '../categories';
import { classify } from './categories';

export type Post = CollectionEntry<'blog'> & { category: Category; displayTitle: string };

export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts
    .map((post) => {
      const { category, title } = classify(post.data.title, post.data.category);
      return Object.assign(post, { category, displayTitle: title });
    })
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
