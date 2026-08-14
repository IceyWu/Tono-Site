// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { SITE_URL } from './src/consts';
import { DEFAULT_LOCALE, LOCALES } from './src/i18n/locales';

const root = fileURLToPath(new URL('.', import.meta.url));

/** @param {string} file */
const updatedFrom = (file) => {
  if (!existsSync(file)) return undefined;
  const match = readFileSync(file, 'utf8').match(/^updated:\s*([^\r\n]+)/m);
  if (!match) return undefined;
  const date = new Date(match[1].trim().replace(/^['"]|['"]$/g, ''));
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

/** @param {string} pathname */
const lastmodForPath = (pathname) => {
  const segments = pathname.split('/').filter(Boolean);
  const english = segments[0] === 'en';
  if (english) segments.shift();
  const locale = english ? 'en' : DEFAULT_LOCALE;
  const [product, doc] = segments;
  if (!product) return undefined;

  if (doc) {
    return updatedFrom(
      join(root, 'src', 'content', 'legal', product, locale, `${doc}.md`),
    );
  }

  return updatedFrom(
    join(root, 'src', 'content', 'products', `${product}.yaml`),
  );
};

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  base: '/',
  // 去掉每个 HTML 的多余空白，静态站点无副作用
  compressHTML: true,

  /*
   * 官方 i18n 路由：默认语言（中文）留在根目录，其余语言带 /<locale>/ 前缀。
   * 页面文件本身不按语言复制 —— 见 src/pages/[...locale]/，
   * 用文档允许的「手动实现路由逻辑」把一个文件产出为各语言版本。
   */
  i18n: {
    locales: [...LOCALES],
    defaultLocale: DEFAULT_LOCALE,
    routing: { prefixDefaultLocale: false },
  },

  /*
   * 预取：语言切换链接指向的是另一个 URL，悬停时先把目标页拉到本地，
   * 点下去几乎没有等待，体感接近「就地切换」，同时保住独立 URL 的 SEO。
   */
  prefetch: { defaultStrategy: 'hover' },
  integrations: [
    sitemap({
      // 只收录真正的页面：排除 404 与端点产物（robots.txt / og.png 等）
      filter: (page) => {
        const { pathname } = new URL(page);
        // 404 在每种语言下都有一份（/404、/en/404），统一排除
        if (/(^|\/)404\/?$/.test(pathname)) return false;
        // 带扩展名的说明是资源文件而不是页面
        return !/\.[a-z0-9]+$/i.test(pathname);
      },
      changefreq: 'weekly',
      serialize: (item) => {
        const lastmod = lastmodForPath(new URL(item.url).pathname);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
});
