import { readFileSync } from "node:fs";
import satori from "satori";
import sharp from "sharp";

import { SITE_NAME } from "../consts";
import { fromRoot } from "./paths";

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

interface OgImageOptions {
  eyebrow?: string;
  title: string;
  subtitle: string;
  warm?: boolean;
}

/** 构建期生成社交分享图；仅使用拉丁字符，避免依赖体积庞大的 CJK 字体。 */
export async function renderOgImage({
  eyebrow = SITE_NAME,
  title,
  subtitle,
  warm = false,
}: OgImageOptions): Promise<Uint8Array> {
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
          backgroundColor: warm ? "#faf8f4" : "#fdfdfc",
          position: "relative",
        },
        children: [
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
                fontWeight: 400,
                fontSize: "24px",
                letterSpacing: "5px",
                textTransform: "uppercase",
                color: "#8a847e",
              },
              children: eyebrow,
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                marginTop: "18px",
                fontFamily: "Playfair Display",
                fontWeight: 700,
                fontSize: title.length > 18 ? "94px" : "132px",
                letterSpacing: "-2px",
                color: "#171513",
                lineHeight: 1.1,
              },
              children: title,
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                marginTop: "22px",
                fontFamily: "Playfair Display",
                fontWeight: 400,
                fontSize: "34px",
                letterSpacing: "2px",
                color: "#625d58",
              },
              children: subtitle,
            },
          },
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                bottom: "46px",
                display: "flex",
                fontFamily: "Playfair Display",
                fontWeight: 400,
                fontSize: "22px",
                letterSpacing: "2px",
                color: "#98918a",
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
        {
          name: "Playfair Display",
          data: playfair(400),
          weight: 400,
          style: "normal",
        },
        {
          name: "Playfair Display",
          data: playfair(700),
          weight: 700,
          style: "normal",
        },
      ],
    },
  );

  return new Uint8Array(
    await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer(),
  );
}

export const ogResponse = (image: Uint8Array) =>
  new Response(new Uint8Array(image), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
