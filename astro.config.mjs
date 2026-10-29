// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import { rehypeBasePath } from './plugins/rehype-base-path.mjs';

const site = 'https://wyszkd93.github.io';
const base = '/Homepage';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  markdown: {
    // 마크다운 본문의 "/images/..." 같은 루트 경로 링크에 base를 붙여 줍니다.
    processor: unified({ rehypePlugins: [[rehypeBasePath, { base }]] }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
});
