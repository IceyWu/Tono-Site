import type { APIRoute } from "astro";

/**
 * 动态生成 robots.txt，sitemap 地址从 astro.config 的 site 推导，
 * 避免域名在多处硬编码。
 */
export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL("https://tonomemo.com");

  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${new URL("sitemap-index.xml", base).href}`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
