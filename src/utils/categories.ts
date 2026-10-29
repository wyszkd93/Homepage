import { DEFAULT_PLATFORM, DB_TOPICS, OS_TOPICS, PLATFORMS, topicsOf, type Platform, type Topic } from '../categories';

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, '');
const ALL_PREFIXES = new Set([...DB_TOPICS, ...OS_TOPICS].flatMap((t) => t.prefixes));

export function getPlatform(slug: string): Platform {
  const p = PLATFORMS.find((x) => x.slug === slug);
  if (!p) throw new Error(`알 수 없는 platform: ${slug} (src/categories.ts 참고)`);
  return p;
}

export function getTopic(platform: Platform, slug: string): Topic {
  const t = topicsOf(platform).find((x) => x.slug === slug);
  if (!t) throw new Error(`${platform.name}에 없는 topic: ${slug} (src/categories.ts 참고)`);
  return t;
}

/**
 * 분야·주제를 정하고, 목록에 보일 제목(앞의 말머리 "[RAC][INSTALL]" 제거)을 돌려줍니다.
 * frontmatter 값이 있으면 그대로 쓰고, 없으면 제목의 말머리·키워드로 추정합니다.
 */
export function classify(title: string, platformSlug?: string, topicSlug?: string) {
  let rest = title.trim();
  const prefixes: string[] = [];
  for (;;) {
    const m = rest.match(/^\[([^\]]+)\]\s*/);
    if (!m || !ALL_PREFIXES.has(norm(m[1]))) break;
    prefixes.push(norm(m[1]));
    rest = rest.slice(m[0].length);
  }

  const lower = title.toLowerCase();
  const isOsPrefix = prefixes.some((p) => OS_TOPICS.some((t) => t.prefixes.includes(p)));
  const platform = platformSlug
    ? getPlatform(platformSlug)
    : (PLATFORMS.find((p) => p.keywords.some((k) => lower.includes(k))) ??
      (isOsPrefix ? getPlatform('os') : getPlatform(DEFAULT_PLATFORM)));

  const topics = topicsOf(platform);
  const topic = topicSlug
    ? getTopic(platform, topicSlug)
    : (topics.find((t) => prefixes.some((p) => t.prefixes.includes(p))) ?? topics[topics.length - 1]);

  return { platform, topic, title: rest || title };
}
