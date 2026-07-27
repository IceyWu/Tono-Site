import { join } from "node:path";

/**
 * 构建期读取项目内文件的路径助手。
 *
 * 不能用 import.meta.url：端点代码会被打包进 dist/.prerender/chunks/，
 * 相对路径会失效。astro build 始终以项目根目录为 cwd，因此以 cwd 为基准。
 */
export const fromRoot = (...segments: string[]) =>
  join(process.cwd(), ...segments);
