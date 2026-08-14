/**
 * 界面文案的单一来源（产品自身的营销文案不在这里，见 src/content/products/*.yaml）。
 *
 * 结构约定：先写默认语言（中文母本），其余语言由 `Record<Locale, Dict>` 约束 ——
 * 少一个 key 就编译不过，避免漏翻。
 */

import type { Locale } from "./locales";

const zhCN = {
  site: {
    /** 首页标题，不套 " — Tono" 模板 */
    title: "Tono — 专注创造，让工具回归本质",
    description:
      "Tono 打造简单、强大、完全属于你的创作工具。去掉多余的干扰，把注意力还给正在创造的内容。",
  },

  home: {
    eyebrow: "Simple · Powerful · Yours",
    tagline: "专注创造，让工具回归本质",
    productsNav: "产品",
  },

  product: {
    /** 未上架时按钮上的补充说明 */
    comingSoon: "即将上线",
    /** TestFlight 尚未开放公开测试时的补充说明 */
    betaSoon: "即将开放",
    appStoreLabel: "在 App Store 查看 {name}",
    testFlightLabel: "通过 TestFlight 测试 {name}",
    /** {name} 会被替换成产品字标 */
    docsNavLabel: "{name} 相关页面",
  },

  /** 文档标题按文件名索引，新增文档时在这里加一条 */
  docs: {
    "user-protocol": "用户协议",
    privacy: "隐私政策",
    support: "支持",
  },

  doc: {
    updated: "更新日期",
  },

  notFound: {
    title: "页面不存在",
    description: "抱歉，这个页面找不到了。",
    detail: "你访问的地址可能已经变更或从未存在。",
    back: "返回首页",
  },

  chrome: {
    /** 语言按钮上显示的文字，指向「切换到哪个语言」 */
    langSwitchLabel: "EN",
    langSwitchAria: "Switch to English",
    themeLabel: "外观",
    themeChoices: { system: "跟随系统", light: "浅色", dark: "深色" },
  },
} as const;

type Widen<T> = T extends readonly (infer Item)[]
  ? readonly Widen<Item>[]
  : T extends object
    ? { readonly [Key in keyof T]: Widen<T[Key]> }
    : T extends string
      ? string
      : T;

/** 字典形状由中文母本决定，叶子放宽为 string 以便其他语言填不同文案 */
export type Dict = Widen<typeof zhCN>;

const en: Dict = {
  site: {
    title: "Tono — Focus on Creating",
    description:
      "Tono makes simple, powerful tools that are entirely yours. Less noise, more attention on the thing you are making.",
  },

  home: {
    eyebrow: "Simple · Powerful · Yours",
    tagline: "Focus on creating. Let tools step back.",
    productsNav: "Products",
  },

  product: {
    comingSoon: "Coming soon",
    betaSoon: "Coming soon",
    appStoreLabel: "View {name} on the App Store",
    testFlightLabel: "Test {name} with TestFlight",
    docsNavLabel: "{name} pages",
  },

  docs: {
    "user-protocol": "Terms of Use",
    privacy: "Privacy Policy",
    support: "Support",
  },

  doc: {
    updated: "Updated",
  },

  notFound: {
    title: "Page not found",
    description: "Sorry, we couldn't find that page.",
    detail: "The address may have changed, or it never existed.",
    back: "Back to home",
  },

  chrome: {
    langSwitchLabel: "中",
    langSwitchAria: "切换为中文",
    themeLabel: "Appearance",
    themeChoices: { system: "System", light: "Light", dark: "Dark" },
  },
};

export const ui: Record<Locale, Dict> = { "zh-CN": zhCN, en };

/** 极简插值：interpolate("{name} pages", { name: "LiuBai" }) */
export const interpolate = (
  template: string,
  values: Record<string, string>,
): string =>
  template.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match);
