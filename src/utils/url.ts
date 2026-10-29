// base 경로(astro.config의 base)를 고려한 내부 링크 생성기.
const base = import.meta.env.BASE_URL.replace(/\/+$/, '');

export function url(path = '/'): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

export function tagSlug(tag: string): string {
  return tag.trim().toLowerCase().replace(/\s+/g, '-');
}

export function tagUrl(tag: string): string {
  return url(`/tags/${encodeURIComponent(tagSlug(tag))}/`);
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Seoul',
  });
}
