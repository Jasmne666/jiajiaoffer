# Portfolio Assistant on CloudBase

腾讯 CloudBase HTTP 云函数，为个人作品集提供 DeepSeek 问答接口。

## 本地检查

```powershell
npm.cmd install
npm.cmd test
```

## 部署

```powershell
npm.cmd run deploy
```

生产路由：`https://pawcare-jiajia-d9gmtzk31c0601d89.service.tcloudbase.com/portfolio-assistant?webfn=true`

`DEEPSEEK_API_KEY` 必须在 CloudBase 云函数配置中作为环境变量填写，不得写入代码或提交到仓库。
