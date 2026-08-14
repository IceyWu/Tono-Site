import { readFileSync } from "node:fs";
import sharp from "sharp";

import { fromRoot } from "./paths";

const source = readFileSync(fromRoot("public", "favicon.svg"));
const ICON_BACKGROUND = "#1a1a1a";

export async function renderAppIcon(size: number, maskable = false) {
  const safeSize = maskable ? Math.round(size * 0.8) : size;
  const icon = await sharp(source, { density: 720 })
    .resize(safeSize, safeSize, { kernel: "lanczos3", fit: "contain" })
    .png()
    .toBuffer();

  return new Uint8Array(
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: ICON_BACKGROUND,
      },
    })
      .composite([{ input: icon, gravity: "center" }])
      .png({ compressionLevel: 9 })
      .toBuffer(),
  );
}

export const iconResponse = (image: Uint8Array) =>
  new Response(new Uint8Array(image), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
