import { readFileSync } from "node:fs";
import type { APIRoute } from "astro";
import sharp from "sharp";
import { fromRoot } from "../lib/paths";

const source = readFileSync(fromRoot("public", "favicon.svg"));

/** 与 favicon.svg 里那块圆角底板同色 */
const ICON_BACKGROUND = "#1a1a1a";

/** iOS 主屏图标：不支持 SVG，必须给一张 180×180 的 PNG */
export const GET: APIRoute = async () => {
  const png = await sharp(source, { density: 360 })
    .resize(180, 180, { kernel: "lanczos3", fit: "contain" })
    // iOS 会自己给图标套圆角遮罩，图标源自带的圆角会留下透明直角，
    // 用同色铺满整张图，避免出现二次圆角
    .flatten({ background: ICON_BACKGROUND })
    .png({ compressionLevel: 9 })
    .toBuffer();

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
