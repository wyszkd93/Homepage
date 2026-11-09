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
    // 분야·주제 슬러그 (src/categories.ts). 없으면 제목으로 추정
    platform: z.string().optional(),
    topic: z.string().optional(),
    draft: z.boolean().default(false),
    // Tistory에서 가져온 글이면 원본 주소 (화면에는 표시하지 않음, 다시 가져오기용)
    source: z.string().url().optional(),
  }),
});

// AI 픽: 링크 하나를 큐레이션 카드로 (요약은 직접 쓴 문장, 원본은 원문이 공개한 한 줄 설명만)
const picks = defineCollection({
  loader: glob({ base: './src/content/picks', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(), // 한국어 제목
    url: z.string().url(), // 원문 주소
    kind: z.enum(['github', 'news', 'blog', 'paper', 'video']).default('github'),
    topic: z.enum(['ai', 'db']).default('ai'), // 피드 탭: AI, DB
    date: z.coerce.date(), // 올린 날
    tags: z.array(z.string()).default([]),
    comment: z.string(), // 💬 한마디
    original: z.string(), // 원문이 공개한 한 줄 설명 (그대로 인용)
    license: z.string().optional(),
    // 링크 카드
    card: z
      .object({
        owner: z.string().optional(),
        name: z.string().optional(),
        image: z.string().optional(), // 뉴스·블로그 미리보기 그림 주소
        site: z.string().optional(),
        stats: z.object({ contributors: z.number().optional(), usedBy: z.number().optional(), stars: z.number().optional(), forks: z.number().optional(), asOf: z.string() }).optional(),
      })
      .default({}),
  }),
});

export const collections = { blog, picks };
