import { CATEGORIES, DEFAULT_CATEGORY, type Category } from '../categories';

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, '');
const ALL_PREFIXES = new Set(CATEGORIES.flatMap((c) => c.prefixes));

export function getCategory(slug: string): Category {
  return CATEGORIES.find((c) => c.slug === slug) ?? CATEGORIES.find((c) => c.slug === DEFAULT_CATEGORY)!;
}

/** 제목 앞 말머리들("[RAC][INSTALL] …")을 읽어 카테고리와 말머리를 뗀 제목을 돌려줍니다. */
export function classify(title: string, override?: string): { category: Category; title: string } {
  let rest = title.trim();
  let found: Category | undefined;
  for (;;) {
    const m = rest.match(/^\[([^\]]+)\]\s*/);
    if (!m || !ALL_PREFIXES.has(norm(m[1]))) break;
    found ??= CATEGORIES.find((c) => c.prefixes.includes(norm(m[1])));
    rest = rest.slice(m[0].length);
  }
  const category = override ? getCategory(override) : (found ?? getCategory(DEFAULT_CATEGORY));
  return { category, title: rest || title };
}
