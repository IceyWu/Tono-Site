/**
 * 语言清单。astro.config 与运行时代码都从这里取，保证配置与代码不会各说一套。
 *
 * 这个文件被 astro.config.mjs 导入，因此**不要**在这里引入任何 astro:* 虚拟模块，
 * 否则配置加载阶段会解析失败。
 */

/** 顺序即语言切换的循环顺序；第一项为默认语言 */
export const LOCALES = ["zh-CN", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "zh-CN";

/** og:locale */
export const OG_LOCALE: Record<Locale, string> = {
  "zh-CN": "zh_CN",
  en: "en_US",
};

/** <link rel="alternate" hreflang>：用宽一点的语言标签，覆盖简体中文各地区 */
export const HREFLANG: Record<Locale, string> = {
  "zh-CN": "zh-Hans",
  en: "en",
};

/** 判断浏览器语言标签属于哪个 locale，供客户端语言检测脚本使用 */
export const LOCALE_MATCHERS: Record<Locale, string> = {
  "zh-CN": "^zh\\b",
  en: "^en\\b",
};
