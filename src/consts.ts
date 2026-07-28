/**
 * 站点级、与语言无关的元信息。
 * 需要翻译的文案一律放在 src/i18n/ui.ts，不要写在这里。
 */

/** 品牌名，用于 title 模板与结构化数据 */
export const SITE_NAME = "Tono";

/**
 * 站点根地址。astro.config 的 `site` 由此导入，
 * 端点（robots.txt / BaseLayout）在拿不到 Astro.site 时也回退到同一份值，
 * 避免域名散落在多个文件里。
 */
export const SITE_URL = "https://tonomemo.com";

/** 默认社交分享图（构建期由 src/pages/og.png.ts 生成） */
export const DEFAULT_OG_IMAGE = "/og.png";

/**
 * 浏览器地址栏 / 移动端状态栏主题色，与 body 背景（--color-bg）保持一致。
 * 两个值分别对应浅色与深色主题，靠 <meta media> 切换。
 */
export const THEME_COLOR = "#fdfdfc";
export const THEME_COLOR_DARK = "#131211";

/**
 * 产品文档在页脚里的排列顺序。
 * 文件系统按字母序返回，但「用户协议 → 隐私政策 → 支持」才是阅读顺序，
 * 所以这里显式指定；不在表里的文档排到最后。
 */
export const DOC_ORDER = ["user-protocol", "privacy", "support"] as const;
