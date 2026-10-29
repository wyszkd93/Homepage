// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import { rehypeBasePath } from './plugins/rehype-base-path.mjs';

const site = 'https://mogumogu93.github.io';
// 저장소 이름이 <사용자>.github.io 이면 루트(/)에서 서비스됩니다.
// 다른 이름의 저장소로 옮기면 '/<저장소 이름>' 으로 바꾸세요.
const base = '/';

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
