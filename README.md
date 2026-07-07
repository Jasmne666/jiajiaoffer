# Ren Chenjia Portfolio

个人求职作品集静态网站，集中展示 AI Coding、AIGC 影像、内容运营、视觉设计与项目经历。

## 本地预览

```powershell
python -m http.server 4173
```

打开 `http://localhost:4173`。

## 部署

项目为纯静态站点，可直接部署到 GitHub Pages、Cloudflare Pages、Vercel 或 Netlify。

## AI 作品集助手

前端通过腾讯 CloudBase HTTP 云函数调用 DeepSeek；接口代码和部署配置位于 `cloudbase/`。

部署云函数：

```powershell
cd cloudbase
npm install
npm run deploy
```

`DEEPSEEK_API_KEY` 必须在 CloudBase 控制台的函数环境变量中配置，不得写入前端或提交到仓库。
