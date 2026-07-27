# Tono Site

> Tono 官方站点

## 预览

🔗 https://tonomemo.com

## 页面

| 路径 | 说明 |
|------|------|
| `/` | 首页 |
| `/liubai` | 留白 · 产品页 |
| `/liubai/user-protocol` | 留白 · 用户协议 |
| `/liubai/privacy` | 留白 · 隐私政策 |
| `/liubai/support` | 留白 · 支持与常见问题 |

## 技术栈

- [Astro](https://astro.build/) — 静态站点生成
- GitHub Actions — 自动部署至 GitHub Pages

## 开发

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # 输出到 ./dist
pnpm preview    # 预览构建产物
```

## 部署

推送到 `main` 分支后自动通过 GitHub Actions 构建并部署到 GitHub Pages。

## License

© 2026 Tono. All rights reserved.
