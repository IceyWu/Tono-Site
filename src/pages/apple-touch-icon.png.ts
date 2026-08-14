import type { APIRoute } from "astro";
import { iconResponse, renderAppIcon } from "../lib/app-icon";

/** iOS 主屏图标：不支持 SVG，必须给一张 180×180 的 PNG */
export const GET: APIRoute = async () => {
  return iconResponse(await renderAppIcon(180));
};
