import { join } from "node:path";

/**
 * 构建期读取项目内文件的路径助手。
 *
 * 不能用 import.meta.url：端点代码会被打包进 dist/.prerender/chunks/，
 * 相对路径会失效。astro build 始终以项目根目录为 cwd，因此以 cwd 为基准。
 */
export const fromRoot = (...segments: string[]) =>
  join(process.cwd(), ...segments);

/**
 * 拼上站点 base 前缀，生成站内链接。
 * Astro 保证 BASE_URL 以 "/" 结尾，所以这里只需去掉入参开头多余的斜杠。
 * 直接写 "/foo" 的绝对路径在 base 不是 "/" 时会 404，统一走这里。
 */
export const withBase = (path = "") =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
