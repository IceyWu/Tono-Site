import type { APIRoute } from "astro";
import {
  SITE_DESCRIPTION,
  SITE_LANG,
  SITE_NAME,
  THEME_COLOR,
} from "../consts";

/**
 * Web App Manifest。图标直接复用矢量 favicon，
 * 现有位图源只有 128px，放大到 512px 只会更模糊。
 */
export const GET: APIRoute = () => {
  const manifest = {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    lang: SITE_LANG,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: THEME_COLOR,
    icons: [
      {
        src: "/favicon.svg",
        type: "image/svg+xml",
        sizes: "any",
        purpose: "any",
      },
      {
        src: "/apple-touch-icon.png",
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
