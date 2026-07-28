/**
 * i18n 运行时工具。
 *
 * 链接生成一律走官方的 getRelativeLocaleUrl（它会自己处理 base 前缀、
 * 默认语言不加前缀、以及 trailingSlash 配置），这里不再自己拼字符串。
 */

import { getRelativeLocaleUrl } from "astro:i18n";

import { SITE_NAME } from "../consts";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "./locales";
import { interpolate, ui, type Dict } from "./ui";

export * from "./locales";
export { interpolate, ui, type Dict };

/** 收窄 Astro.currentLocale：静态构建里它由 URL 推出，认不出时回落到默认语言 */
export function toLocale(value: string | undefined): Locale {
  return LOCALES.find((locale) => locale === value) ?? DEFAULT_LOCALE;
}

export const useTranslations = (locale: Locale): Dict => ui[locale];

/** 站内链接：localeUrl("en", "liubai/privacy") → /en/liubai/privacy */
export const localeUrl = (locale: Locale, path = "") =>
  getRelativeLocaleUrl(locale, path);

/**
 * [...locale] 动态路由的 params：
 * 默认语言为 undefined（落在根路径），其余语言用 locale 本身作为路径段。
 * 新增语言只需改 LOCALES，不用新建任何路由文件。
 */
export const localeParam = (locale: Locale) =>
  locale === DEFAULT_LOCALE ? undefined : locale;

/**
 * 去掉 base 与语言前缀后的逻辑路径，例如 "liubai/privacy"。
 * 各语言共用这一个值，canonical、hreflang 与语言切换都基于它。
 */
export function getRoutePath(url: URL): string {
  const base = import.meta.env.BASE_URL;
  const path = url.pathname.startsWith(base)
    ? url.pathname.slice(base.length)
    : url.pathname;

  const segments = path.split("/").filter(Boolean);
  const first = segments[0];
  // 默认语言不出现在 URL 里，因此只需剥掉非默认语言的前缀
  if (first && first !== DEFAULT_LOCALE && LOCALES.includes(first as Locale)) {
    segments.shift();
  }
  return segments.join("/");
}

/**
 * title 模板：首页用该语言的完整标题，其余页面统一加品牌后缀。
 * formatTitle("en", "LiuBai") → "LiuBai — Tono"
 */
export function formatTitle(locale: Locale, title?: string): string {
  if (!title || title === SITE_NAME) return ui[locale].site.title;
  return `${title} — ${SITE_NAME}`;
}
