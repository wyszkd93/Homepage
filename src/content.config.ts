import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    // 카테고리 슬러그(src/categories.ts). 없으면 제목 말머리로 자동 분류
    category: z.string().optional(),
    draft: z.boolean().default(false),
    // Tistory에서 가져온 글이면 원본 주소
    source: z.string().url().optional(),
  }),
});

export const collections = { blog };
