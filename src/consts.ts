/**
 * 站点级元信息的单一来源。
 * 新增页面时只需从这里取默认值，避免各页面重复硬编码域名 / 品牌名。
 */

/** 品牌名，用于 title 模板与结构化数据 */
export const SITE_NAME = "Tono";

/** 首页标题（不套模板） */
export const SITE_TITLE = "Tono — 专注创造，让工具回归本质";

/**
 * 默认描述。控制在 70~160 字符区间，
 * 太短搜索引擎会自行截取页面文本，太长会被截断。
 */
export const SITE_DESCRIPTION =
  "Tono 打造简单、强大、完全属于你的创作工具。去掉多余的干扰，把注意力还给正在创造的内容。";

/** 站点语言，同时用于 <html lang> 与 og:locale */
export const SITE_LANG = "zh-CN";
export const SITE_LOCALE = "zh_CN";

/** 默认社交分享图（构建期由 src/pages/og.png.ts 生成） */
export const DEFAULT_OG_IMAGE = "/og.png";

/** 浏览器地址栏 / 移动端状态栏主题色，与 body 背景保持一致 */
export const THEME_COLOR = "#ffffff";

/**
 * title 模板：首页用原始标题，子页面统一加品牌后缀。
 * 后续新增产品页时传入页面标题即可，例如 formatTitle("Memo") → "Memo — Tono"
 */
export function formatTitle(title?: string): string {
  if (!title || title === SITE_NAME) return SITE_TITLE;
  return `${title} — ${SITE_NAME}`;
}

/* ────────────────────────────────
 * 产品：留白 / LiuBai
 * ──────────────────────────────── */

export const LIUBAI_NAME = "留白";
export const LIUBAI_NAME_EN = "LiuBai";
export const LIUBAI_TAGLINE = "在空白处，写下你的灵感";
export const LIUBAI_DESCRIPTION =
  "留白是一款安静记录灵感的随笔应用。本地优先，不上传、不追踪，打开就写，把注意力留给文字本身。";

/** 留白的页面路径（相对 BASE_URL），首页页脚与法务页导航共用 */
export const LIUBAI_LINKS = [
  { path: "liubai/user-protocol", label: "用户协议" },
  { path: "liubai/privacy", label: "隐私政策" },
  { path: "liubai/support", label: "支持" },
] as const;
