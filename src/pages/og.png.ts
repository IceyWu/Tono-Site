import { readFileSync } from "node:fs";
import type { APIRoute } from "astro";
import satori from "satori";
import sharp from "sharp";
import { SITE_NAME } from "../consts";
import { fromRoot } from "../lib/paths";

const playfair = (weight: 400 | 700) =>
  readFileSync(
    fromRoot(
      "node_modules",
      "@fontsource",
      "playfair-display",
      "files",
      `playfair-display-latin-${weight}-normal.woff`,
    ),
  );

/**
 * 构建期生成 1200×630 社交分享图。
 * satori 会把文字转成矢量路径，因此 sharp 光栅化时不依赖系统字体，
 * 本地和 CI 输出完全一致。
 * 注意：只用拉丁字符 —— Playfair 不含中文字形。
 */
export const GET: APIRoute = async () => {
  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          position: "relative",
        },
        children: [
          // 顶部渐变条，呼应首页的 gradient accent
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                top: 0,
                left: 0,
                width: "1200px",
                height: "10px",
                backgroundImage:
                  "linear-gradient(90deg, #8278ff 0%, #ffaa8c 50%, #8cc8ff 100%)",
              },
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                fontFamily: "Playfair Display",
                fontWeight: 700,
                fontSize: "180px",
                letterSpacing: "-4px",
                color: "#111111",
                lineHeight: 1.1,
              },
              children: SITE_NAME,
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                marginTop: "16px",
                fontFamily: "Playfair Display",
                fontWeight: 400,
                fontSize: "40px",
                letterSpacing: "4px",
                color: "#595959",
              },
              children: "Simple \u00B7 Powerful \u00B7 Yours",
            },
          },
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                bottom: "48px",
                display: "flex",
                fontFamily: "Playfair Display",
                fontWeight: 400,
                fontSize: "24px",
                letterSpacing: "2px",
                color: "#8a8a8a",
              },
              children: "tonomemo.com",
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Playfair Display", data: playfair(400), weight: 400, style: "normal" },
        { name: "Playfair Display", data: playfair(700), weight: 700, style: "normal" },
      ],
    },
  );

  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
