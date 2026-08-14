import type { APIRoute } from "astro";

import {
  LOCALES,
  localeParam,
  useTranslations,
} from "../../../../i18n";
import {
  docSlugsOf,
  getDocs,
  getProducts,
  resolveDoc,
  type Product,
} from "../../../../lib/catalog";
import { ogResponse, renderOgImage } from "../../../../lib/og";

export async function getStaticPaths() {
  const [products, docs] = await Promise.all([getProducts(), getDocs()]);

  return LOCALES.flatMap((locale) =>
    products.flatMap((product) =>
      docSlugsOf(docs, product.id).flatMap((slug) => {
        const resolved = resolveDoc(docs, product.id, locale, slug);
        if (!resolved) return [];

        return [
          {
            params: {
              locale: localeParam(locale),
              product: product.id,
              doc: slug,
            },
            props: { locale, product, entry: resolved.entry, slug },
          },
        ];
      }),
    ),
  );
}

export const GET: APIRoute = async ({ props }) => {
  const { product, slug } = props as {
    product: Product;
    slug: string;
  };
  const english = useTranslations("en");
  const title = english.docs[slug as keyof typeof english.docs] ?? slug;

  return ogResponse(
    await renderOgImage({
      eyebrow: product.data.latinName,
      title,
      subtitle: "Legal & Support",
      warm: product.data.theme === "warm",
    }),
  );
};
