#!/usr/bin/env node
// Tistory 블로그 글을 Astro 콘텐츠 컬렉션(마크다운)으로 가져오는 스크립트.
//
// 사용법:
//   npm run import:tistory -- <블로그ID 또는 주소> [옵션]
//
// 예:
//   npm run import:tistory -- myblog                 # https://myblog.tistory.com/rss 의 글
//   npm run import:tistory -- myblog --ids 1-300     # 글 번호 1~300 페이지를 직접 수집 (RSS에 없는 옛 글)
//   npm run import:tistory -- https://blog.example.com --dry-run
//
// 옵션:
//   --ids <a-b|a,b,c>  RSS 대신 글 번호로 각 글 페이지를 직접 가져옵니다.
//   --full             RSS 모드에서도 본문은 각 글 페이지에서 가져옵니다(RSS 본문이 잘려 있을 때).
//   --no-images        이미지를 내려받지 않고 원본 주소를 그대로 씁니다.
//   --force            이미 있는 파일도 덮어씁니다(기본: 건너뜀).
//   --dry-run          파일을 쓰지 않고 결과만 출력합니다.
//   --delay <ms>       요청 사이 대기 시간(기본 300ms).
//
// 결과:
//   src/content/blog/tistory/<글번호>.md
//   public/images/tistory/<글번호>/<n>.<확장자>

import { mkdir, writeFile, access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { XMLParser } from 'fast-xml-parser';
import { parse as parseHtml } from 'node-html-parser';
import TurndownService from 'turndown';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const POSTS_DIR = path.join(ROOT, 'src/content/blog/tistory');
const IMAGES_DIR = path.join(ROOT, 'public/images/tistory');
const IMAGES_URL = '/images/tistory';
const UA = 'Mozilla/5.0 (compatible; homepage-tistory-importer/1.0)';

// ---------- CLI ----------

function parseArgs(argv) {
  const opts = { images: true, force: false, dryRun: false, full: false, delay: 300, ids: null, blog: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--ids') opts.ids = parseIds(argv[++i]);
    else if (a === '--full') opts.full = true;
    else if (a === '--no-images') opts.images = false;
    else if (a === '--force') opts.force = true;
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--delay') opts.delay = Number(argv[++i]);
    else if (a === '-h' || a === '--help') usage(0);
    else if (!a.startsWith('-') && !opts.blog) opts.blog = a;
    else {
      console.error(`알 수 없는 옵션: ${a}`);
      usage(1);
    }
  }
  if (!opts.blog) usage(1);
  return opts;
}

function usage(code) {
  console.log('사용법: npm run import:tistory -- <블로그ID 또는 주소> [--ids 1-300] [--full] [--no-images] [--force] [--dry-run]');
  process.exit(code);
}

function parseIds(spec) {
  if (!spec) usage(1);
  const ids = new Set();
  for (const part of spec.split(',')) {
    const m = part.trim().match(/^(\d+)(?:-(\d+))?$/);
    if (!m) throw new Error(`--ids 형식이 잘못되었습니다: ${part}`);
    const from = Number(m[1]);
    const to = Number(m[2] ?? m[1]);
    for (let n = from; n <= to; n++) ids.add(n);
  }
  return [...ids];
}

function blogOrigin(input) {
  if (/^https?:\/\//.test(input)) return new URL(input).origin;
  if (input.includes('.')) return `https://${input.replace(/\/.*$/, '')}`;
  return `https://${input}.tistory.com`;
}

// ---------- HTTP ----------

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url, { tries = 3, ...init } = {}) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { ...init, headers: { 'User-Agent': UA, ...(init.headers ?? {}) } });
      if (res.status === 404 || res.status === 403) return res;
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (err) {
      lastErr = err;
      await sleep(1000 * 2 ** i);
    }
  }
  throw new Error(`${url} 요청 실패: ${lastErr?.message}`);
}

// ---------- 글 수집 ----------

async function postsFromRss(origin) {
  const res = await fetchWithRetry(`${origin}/rss`);
  if (!res.ok) throw new Error(`RSS를 찾을 수 없습니다 (${res.status}): ${origin}/rss`);
  const xml = await res.text();
  const parser = new XMLParser({ ignoreAttributes: true, isArray: (name) => name === 'item' || name === 'category' });
  const channel = parser.parse(xml)?.rss?.channel;
  const items = channel?.item ?? [];
  return items.map((item) => ({
    title: String(item.title ?? '').trim(),
    link: String(item.link ?? '').trim(),
    date: new Date(item.pubDate),
    tags: (item.category ?? []).map((c) => String(c).trim()).filter(Boolean),
    html: String(item.description ?? ''),
  }));
}

// 글 페이지 HTML에서 제목/날짜/태그/본문 추출 (스킨마다 구조가 달라 여러 선택자를 시도)
function postFromPage(html, link) {
  const doc = parseHtml(html);
  const meta = (prop) =>
    doc.querySelector(`meta[property="${prop}"]`)?.getAttribute('content') ??
    doc.querySelector(`meta[name="${prop}"]`)?.getAttribute('content');

  const title = (meta('og:title') ?? doc.querySelector('title')?.text ?? '').trim();
  const published = meta('article:published_time') ?? meta('og:regDate');
  const body =
    doc.querySelector('.tt_article_useless_p_margin') ??
    doc.querySelector('.contents_style') ??
    doc.querySelector('.entry-content') ??
    doc.querySelector('.article-view') ??
    doc.querySelector('article');
  if (!title || !body) return null;

  const tags = [
    ...new Set(
      doc
        .querySelectorAll('a[rel="tag"], .tags a, .tag_label a, .area_tag a')
        .map((a) => a.text.trim().replace(/^#/, ''))
        .filter(Boolean),
    ),
  ];

  let date = published ? parseTistoryDate(published) : null;
  if (!date || Number.isNaN(date.valueOf())) date = new Date();

  return { title, link, date, tags, html: body.innerHTML };
}

function parseTistoryDate(s) {
  // og:regDate 형식: 20230101123000
  const m = s.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
  if (m) return new Date(`${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}+09:00`);
  return new Date(s);
}

async function fetchPage(link) {
  const res = await fetchWithRetry(link);
  // 404: 삭제된 글, 403: 비공개·보호 글 ("권한이 없거나 존재하지 않는 페이지")
  if (res.status === 404 || res.status === 403) return null;
  return postFromPage(await res.text(), link);
}

// ---------- HTML → Markdown ----------

function createTurndown() {
  const td = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    emDelimiter: '*',
  });
  // 마크다운으로 표현하기 어려운 요소는 HTML 그대로 유지
  td.keep(['iframe', 'video', 'table', 'details', 'summary']);

  // 본문 글자 속 "<db_name>" 같은 꺾쇠가 HTML 태그로 해석되지 않도록 이스케이프
  const escape = td.escape.bind(td);
  td.escape = (text) => escape(text).replace(/</g, '&lt;');

  // Tistory 코드 블록: <pre class="language-js"> / <pre data-ke-language="javascript">
  td.addRule('tistoryCode', {
    filter: (node) => node.nodeName === 'PRE',
    replacement: (_content, node) => {
      const cls = `${node.getAttribute('class') ?? ''} ${node.firstChild?.getAttribute?.('class') ?? ''}`;
      const lang =
        node.getAttribute('data-ke-language') ??
        cls.match(/language-([\w+#-]+)/)?.[1] ??
        (/^\s*([a-z]+)\s*$/.test(node.getAttribute('class') ?? '') ? node.getAttribute('class').trim() : '');
      const code = node.textContent.replace(/\n$/, '');
      const fence = code.includes('```') ? '~~~' : '```';
      return `\n\n${fence}${lang && lang !== 'plaintext' ? lang : ''}\n${code}\n${fence}\n\n`;
    },
  });

  td.addRule('figcaption', {
    filter: 'figcaption',
    replacement: (content) => (content.trim() ? `\n\n*${content.trim()}*\n\n` : ''),
  });

  return td;
}

// 변환 전에 Tistory 특유의 군더더기 정리
function cleanHtml(html) {
  const doc = parseHtml(`<div id="__root">${html}</div>`);
  const root = doc.querySelector('#__root');

  root.querySelectorAll('script, style, .another_category, .container_postbtn, .revenue_unit_wrap, ins.adsbygoogle').forEach((n) => n.remove());

  // 빈 문단(&nbsp;나 폭 0 공백만 있는 <p data-ke-size>) 제거
  root.querySelectorAll('p').forEach((p) => {
    if (!p.querySelector('img, iframe, video') && p.text.replace(/[\u00a0\u200b\u200c\u200d\ufeff]|&nbsp;/g, '').trim() === '') p.remove();
  });

  // 이미지: 썸네일 프록시 주소를 원본 주소로
  root.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('data-src') ?? img.getAttribute('src') ?? '';
    img.setAttribute('src', originalImageUrl(src));
    for (const attr of ['srcset', 'data-src', 'onerror', 'data-origin-width', 'data-origin-height', 'data-filename']) {
      img.removeAttribute(attr);
    }
  });

  // 칸이 하나뿐인 표는 편집기의 "상자" 서식이므로 인용 상자로 바꿈
  root.querySelectorAll('table').forEach((table) => {
    const cells = table.querySelectorAll('td, th');
    if (cells.length !== 1) return;
    const html = cells[0].innerHTML;
    // 정렬된 명령 실행 결과처럼 보이면(연속 공백, ----- 구분선) 코드 블록으로
    if (/(&nbsp;|\u00a0){2,}/.test(html) || /-{5,}/.test(cells[0].text)) {
      const text = parseHtml(html.replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|div)>/gi, '\n')).text.replace(/\u00a0/g, ' ');
      const esc = text.trim().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      table.replaceWith(`<pre><code>${esc}</code></pre>`);
    } else {
      table.replaceWith(`<blockquote>${html}</blockquote>`);
    }
  });

  // 굵게/기울임 등의 끝에 붙은 <br> 제거: <b>내용<br></b> → **내용  ** 로 깨지는 것 방지
  root.querySelectorAll('b br, strong br, em br, i br, span br, a br').forEach((br) => {
    const parent = br.parentNode;
    const after = parent.childNodes.slice(parent.childNodes.indexOf(br) + 1);
    if (after.every((n) => n.nodeType === 3 && n.text.trim() === '')) br.remove();
  });

  // 표 등 HTML 그대로 남는 부분이 사이트 스타일을 따르도록 Tistory 인라인 스타일·속성 제거
  // (코드 블록의 언어 정보는 남김)
  const KEEP_ATTRS = new Set(['href', 'src', 'alt', 'title', 'colspan', 'rowspan', 'allowfullscreen', 'frameborder']);
  root.querySelectorAll('*').forEach((el) => {
    if (el.tagName === 'PRE' || el.tagName === 'CODE' || el.tagName === 'IMG') return;
    for (const name of Object.keys(el.attributes)) {
      if (!KEEP_ATTRS.has(name.toLowerCase())) el.removeAttribute(name);
    }
  });
  root.querySelectorAll('span, font').forEach((el) => el.replaceWith(el.innerHTML));

  return root.innerHTML;
}

function originalImageUrl(src) {
  if (!src) return src;
  let url = src.startsWith('//') ? `https:${src}` : src;
  try {
    const u = new URL(url);
    const fname = u.searchParams.get('fname');
    if (fname && (/daumcdn\.net$/.test(u.hostname) || u.pathname.includes('/thumb'))) url = fname;
  } catch {
    /* 상대 경로 등은 그대로 */
  }
  return url;
}

// ---------- 이미지 ----------

const EXT_BY_TYPE = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  'image/avif': 'avif',
  'image/bmp': 'bmp',
};

async function localizeImages(markdown, slug, opts) {
  const re = /!\[([^\]]*)\]\((\S+?)(?:\s+"[^"]*")?\)/g;
  const urls = [...new Set([...markdown.matchAll(re)].map((m) => m[2]).filter((u) => /^https?:\/\//.test(u)))];
  const map = new Map();
  let n = 0;
  let failed = 0;

  for (const remote of urls) {
    n++;
    try {
      const res = await fetchWithRetry(remote, { tries: 2 });
      const type = (res.headers.get('content-type') ?? '').split(';')[0].trim();
      if (!res.ok || !type.startsWith('image/')) throw new Error(`이미지가 아님 (${res.status} ${type})`);
      const ext = EXT_BY_TYPE[type] ?? 'img';
      const file = `${n}.${ext}`;
      if (!opts.dryRun) {
        const dir = path.join(IMAGES_DIR, slug);
        await mkdir(dir, { recursive: true });
        await writeFile(path.join(dir, file), Buffer.from(await res.arrayBuffer()));
      }
      map.set(remote, `${IMAGES_URL}/${slug}/${file}`);
    } catch (err) {
      failed++;
      console.warn(`  ! 이미지 다운로드 실패, 원본 주소 유지: ${remote} (${err.message})`);
    }
  }

  const replaced = markdown.replace(re, (all, alt, url) => (map.has(url) ? `![${alt}](${map.get(url)})` : all));
  return { markdown: replaced, downloaded: map.size, failed };
}

// ---------- 출력 ----------

function slugFor(link, fallbackIndex) {
  try {
    const parts = new URL(link).pathname.split('/').filter(Boolean);
    const last = decodeURIComponent(parts.at(-1) ?? '');
    if (/^\d+$/.test(last)) return last;
    const s = last
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '');
    if (s) return s;
  } catch {
    /* fallthrough */
  }
  return `post-${fallbackIndex}`;
}

function excerpt(markdown, len = 140) {
  const text = markdown
    .replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\\([\\`*_{}\[\]()#+\-.!|<>~])/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/^\s*([-+]|\d+\.)\s+/gm, '')
    .replace(/[#>*_`|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > len ? `${text.slice(0, len).trim()}…` : text;
}

function frontmatter(post, description, keep = []) {
  // JSON 문자열은 그대로 유효한 YAML 문자열입니다.
  const q = (s) => JSON.stringify(s);
  const lines = [
    '---',
    `title: ${q(post.title)}`,
    description ? `description: ${q(description)}` : null,
    `date: ${post.date.toISOString()}`,
    `tags: [${post.tags.map(q).join(', ')}]`,
    ...keep,
    `source: ${q(post.link)}`,
    '---',
  ];
  return lines.filter((l) => l !== null).join('\n');
}

const exists = (p) => access(p).then(() => true, () => false);

// ---------- main ----------

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const origin = blogOrigin(opts.blog);
  const td = createTurndown();
  console.log(`블로그: ${origin}`);

  /** @type {Array<{title:string, link:string, date:Date, tags:string[], html:string} | {link:string, lazy:true}>} */
  let sources;
  if (opts.ids) {
    sources = opts.ids.map((id) => ({ link: `${origin}/${id}`, lazy: true }));
    console.log(`글 번호 ${opts.ids.length}개를 페이지에서 직접 가져옵니다.`);
  } else {
    sources = await postsFromRss(origin);
    console.log(`RSS에서 글 ${sources.length}개를 찾았습니다.`);
  }

  if (!opts.dryRun) await mkdir(POSTS_DIR, { recursive: true });

  const summary = { written: 0, skipped: 0, missing: 0, failed: 0, images: 0, imageFailures: 0 };

  for (const [i, src] of sources.entries()) {
    const slug = slugFor(src.link, i + 1);
    const file = path.join(POSTS_DIR, `${slug}.md`);
    const rel = path.relative(ROOT, file);

    if (!opts.force && (await exists(file))) {
      console.log(`- 건너뜀 (이미 있음): ${rel}`);
      summary.skipped++;
      continue;
    }

    try {
      let post = src;
      if (src.lazy || opts.full) {
        const page = await fetchPage(src.link);
        await sleep(opts.delay);
        if (!page) {
          if (src.lazy) {
            summary.missing++;
            continue; // 삭제됐거나 비공개인 글 번호
          }
        } else {
          post = src.lazy ? page : { ...src, html: page.html, tags: src.tags.length ? src.tags : page.tags };
        }
      }

      let body = td
        .turndown(cleanHtml(post.html))
        .replace(/[\u200b\u200c\u200d\ufeff]/g, '') // 폭 0 공백
        .replace(/^[ \t]*(?:\*\*|__)+[ \t]*$/gm, '') // 내용 없이 남은 굵게 표시 "****"
        .replace(/\n{3,}/g, '\n\n')
        .trim();
      if (opts.images) {
        const r = await localizeImages(body, slug, opts);
        body = r.markdown;
        summary.images += r.downloaded;
        summary.imageFailures += r.failed;
      }

      // --force로 덮어쓸 때 직접 정해 둔 분류(platform, topic)는 유지
      const prev = (await exists(file)) ? await readFile(file, 'utf8') : '';
      const keep = prev.match(/^(platform|topic):.*$/gm) ?? [];
      const content = `${frontmatter(post, excerpt(body), keep)}\n\n${body}\n`;
      if (!opts.dryRun) await writeFile(file, content);
      console.log(`✓ ${rel}  ${post.title}`);
      summary.written++;
    } catch (err) {
      console.error(`✗ ${src.link}: ${err.message}`);
      summary.failed++;
    }
  }

  console.log(
    `\n완료: 저장 ${summary.written}, 건너뜀 ${summary.skipped}, 없음 ${summary.missing}, 실패 ${summary.failed}, ` +
      `이미지 ${summary.images}개 저장 / ${summary.imageFailures}개 원본 주소 유지${opts.dryRun ? ' (dry-run: 파일은 쓰지 않음)' : ''}`,
  );
  if (summary.failed > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
