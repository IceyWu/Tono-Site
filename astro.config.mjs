// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://tonomemo.com',
  base: '/',
  // 去掉每个 HTML 的多余空白，静态站点无副作用
  compressHTML: true,
  integrations: [
    sitemap({
      // 只收录真正的页面：排除 404 与端点产物（robots.txt / og.png 等）
      filter: (page) => {
        const { pathname } = new URL(page);
        if (pathname.startsWith('/404')) return false;
        // 带扩展名的说明是资源文件而不是页面
        return !/\.[a-z0-9]+$/i.test(pathname);
      },
      changefreq: 'weekly',
      lastmod: new Date(),
    }),
  ],
});
