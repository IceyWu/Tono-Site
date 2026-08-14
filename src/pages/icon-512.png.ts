import type { APIRoute } from "astro";
import { iconResponse, renderAppIcon } from "../lib/app-icon";

export const GET: APIRoute = async () =>
  iconResponse(await renderAppIcon(512));
