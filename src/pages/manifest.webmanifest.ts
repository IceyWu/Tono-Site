import type { APIRoute } from "astro";
import { SITE_NAME, THEME_COLOR } from "../consts";
import { DEFAULT_LOCALE, useTranslations } from "../i18n";
import { withBase } from "../lib/paths";

/**
 * Web App Manifest。图标直接复用矢量 favicon，
 * 现有位图源只有 128px，放大到 512px 只会更模糊。
 *
 * 只有一份 manifest，因此用默认语言的文案：安装后的图标名以中文为准。
 */
export const GET: APIRoute = () => {
  const t = useTranslations(DEFAULT_LOCALE);

  const manifest = {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: t.site.description,
    lang: DEFAULT_LOCALE,
    start_url: withBase(),
    scope: withBase(),
    display: "standalone",
    background_color: THEME_COLOR,
    theme_color: THEME_COLOR,
    icons: [
      {
        src: withBase("favicon.svg"),
        type: "image/svg+xml",
        sizes: "any",
        purpose: "any",
      },
      {
        src: withBase("apple-touch-icon.png"),
        type: "image/png",
        sizes: "180x180",
      },
    ],
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
    },
  });
};
