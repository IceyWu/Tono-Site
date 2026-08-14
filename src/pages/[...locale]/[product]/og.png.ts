import type { APIRoute } from "astro";

import { LOCALES, localeParam } from "../../../i18n";
import { getProducts, productCopy, type Product } from "../../../lib/catalog";
import { ogResponse, renderOgImage } from "../../../lib/og";

export async function getStaticPaths() {
  const products = await getProducts();

  return LOCALES.flatMap((locale) =>
    products.map((product) => ({
      params: { locale: localeParam(locale), product: product.id },
      props: { locale, product },
    })),
  );
}

export const GET: APIRoute = async ({ props }) => {
  const { product } = props as { product: Product };
  // 分享图字体保持轻量，只渲染拉丁字形；页面正文仍按 locale 输出。
  const copy = productCopy(product, "en");

  return ogResponse(
    await renderOgImage({
      eyebrow: "Tono Product",
      title: product.data.latinName,
      subtitle: copy.titleSuffix,
      warm: product.data.theme === "warm",
    }),
  );
};
