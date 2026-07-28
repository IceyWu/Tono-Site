/**
 * 产品与文档的查询层。
 *
 * 路由文件只跟这里打交道，不直接碰 collection 的 id 拼接规则，
 * 这样以后改目录结构只需要动这一个文件。
 */

import { getCollection, type CollectionEntry } from "astro:content";

import { DOC_ORDER } from "../consts";
import { DEFAULT_LOCALE, type Locale } from "../i18n";

export type Product = CollectionEntry<"products">;
export type Doc = CollectionEntry<"legal">;

/** 按 order 排序的产品列表，首页与路由生成共用 */
export async function getProducts(): Promise<Product[]> {
  const products = await getCollection("products");
  return products.sort((a, b) => a.data.order - b.data.order);
}

export const getDocs = (): Promise<Doc[]> => getCollection("legal");

/** 取某语言的产品文案，缺失时回退默认语言 */
export function productCopy(product: Product, locale: Locale) {
  const copy = product.data.copy[locale] ?? product.data.copy[DEFAULT_LOCALE];
  // schema 已保证默认语言存在，这里的断言是给类型看的
  return copy!;
}

/** 文档条目 id 形如 liubai/zh-CN/privacy */
const docId = (product: string, locale: Locale, slug: string) =>
  `${product}/${locale}/${slug}`;

const orderOf = (slug: string) => {
  const index = DOC_ORDER.indexOf(slug as (typeof DOC_ORDER)[number]);
  return index === -1 ? DOC_ORDER.length : index;
};

/**
 * 某产品有哪些文档。以默认语言为准，保证各语言的页脚导航条目一致
 * —— 英文缺译时给出的是回退页面，而不是一个断链。
 */
export function docSlugsOf(docs: Doc[], product: string): string[] {
  return docs
    .filter((doc) => doc.id.startsWith(`${product}/${DEFAULT_LOCALE}/`))
    .map((doc) => doc.id.split("/").at(-1)!)
    .sort((a, b) => orderOf(a) - orderOf(b));
}

/**
 * 找某语言下的文档正文。
 * translated 为 false 表示这是默认语言的回退内容，调用方据此把页面标为 noindex。
 */
export function resolveDoc(
  docs: Doc[],
  product: string,
  locale: Locale,
  slug: string,
): { entry: Doc; translated: boolean } | null {
  const exact = docs.find((doc) => doc.id === docId(product, locale, slug));
  if (exact) return { entry: exact, translated: true };

  const fallback = docs.find(
    (doc) => doc.id === docId(product, DEFAULT_LOCALE, slug),
  );
  return fallback ? { entry: fallback, translated: false } : null;
}
