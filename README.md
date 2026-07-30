# 页间 · 城市书店发现

React、TypeScript、Vite 与 Express 构建的书店发现网站。浏览器只访问本站的 `/api/bookstores`；高德 Key 仅在服务端环境变量中读取。

## 数据来源与入口

- `BOOKSTORE_PROVIDER=amap` 时，服务端调用高德地点搜索，返回真实 POI 的名称、地址、地点图片、营业信息和高德地图入口。
- 没有 Key 或高德服务暂时失败时，会自动展示本地 mock 数据，页面会明确提示来源。
- 每张卡片同时保留“在地图中查看”和“小红书看书友分享”。小红书入口是该店名与城市的站内搜索；若人工核验过具体帖子，可在数据中填写 `ugcUrl`，它会优先跳转到该帖。

高德文本地点搜索单次最多返回 25 条，服务端最多读取 8 页，因此一个查询最多呈现 200 条结果；地点库的覆盖与分类由高德维护。它可以支持任意输入城市，但无法承诺包含每一家书店或自动判断“安静阅读、女性主义、江景”等主观风格。完整、准确的风格标签和指定 UGC 链接需要后续人工审核与运营数据补充。[高德地点搜索文档](https://lbs.amap.com/api/webservice/guide/api-advanced/newpoisearch)

## 本地运行

需要 Node.js 20+ 与 pnpm。

```bash
pnpm install
cp .env.example .env
pnpm dev
```

在 `.env` 中设置：

```text
BOOKSTORE_PROVIDER=amap
AMAP_API_KEY=你的高德Web服务Key
```

不要使用 `VITE_` 前缀，也不要提交 `.env`。启动后打开终端显示的地址；在同一 Wi-Fi 下，使用终端显示的网络地址即可用手机测试。

## API

```text
GET /api/bookstores?city=上海&tags=艺术／设计,江景&keyword=朵云
GET /api/health
```

`city` 支持任意城市名称；`tags` 用英文逗号分隔并作为高德搜索关键词补充；`keyword` 用于店名或地点搜索。返回的 `meta.source` 为 `amap` 时表示使用真实高德地点数据，`fallback: true` 表示已降级到本地示例。

## 部署为公网网站（Render）

项目包含 [render.yaml](./render.yaml)，可部署为同时提供网页和 API 的 Node Web Service。

1. 推送代码到 GitHub，确认 `.env` 没有提交。
2. 在 [Render](https://render.com/) 中选择 **New → Web Service**，连接仓库。
3. Render 会读取 `render.yaml`；或手动设置 Build Command：`pnpm install --frozen-lockfile && pnpm build`，Start Command：`pnpm start`。
4. 在 Render 的环境变量中设置 `BOOKSTORE_PROVIDER=amap`，并以 Secret 添加 `AMAP_API_KEY`。不要把 Key 写进 `render.yaml`、前端变量或 GitHub。
5. 部署完成后，Render 会提供一个 `https://…onrender.com` 地址，电脑和手机都可直接访问。

地图按钮使用高德 URI API 打开对应 POI，支持移动端与网页端。[高德地图 URI 文档](https://lbs.amap.com/api/uri-api/guide/mobile-web/point)；关于 Render 的端口与公网服务要求，参见 [Render Web Services 文档](https://render.com/docs/web-services)。

## 部署为公网网站（Vercel）

项目已包含 Vercel 的静态站点与 Serverless API 配置。导入 GitHub 仓库时使用仓库根目录。

1. Vercel 会运行 `pnpm build` 并发布 `dist`。
2. 在 **Settings → Environment Variables** 中添加 `BOOKSTORE_PROVIDER=amap` 与 `AMAP_API_KEY`；后者必须作为 Secret 保存，且不能使用 `VITE_` 前缀。
3. 重新部署后，网页经由同域的 `/api/bookstores` 调用服务端，再由服务端请求高德。

## 部署为 ESA Pages 免费测试版

项目根目录的 `esa.jsonc` 和 `esa/index.ts` 是阿里云 ESA Functions & Pages 专用配置；它们不会影响 `vercel.json` 或现有 Vercel 网站。ESA 使用边缘函数处理 `/api/bookstores`，高德 Key 只从 ESA 环境变量读取。

无自有域名时，ESA 提供的公共预览链接仅供测试，访问时需要 token，token 有效期为 60 分钟；它不是长期分享链接。

1. 登录 [阿里云 ESA 控制台](https://esa.console.aliyun.com/)，在 **边缘计算和 AI → 函数和Pages** 中开通免费模式。
2. 选择 **创建 → 导入 GitHub 仓库**，授权 GitHub 后选择 `zyx9907060423-ops/city-bookstore-discovery` 与 `main` 分支。
3. ESA 会读取仓库中的 `esa.jsonc`。若控制台要求手填，请使用：安装命令 `pnpm install --no-frozen-lockfile`、构建命令 `pnpm exec tsc -b && pnpm exec vite build`、静态资源目录 `./dist`、函数入口 `./esa/index.ts`。
4. 在项目的环境变量中添加 `AMAP_API_KEY`，填写高德 Web 服务 Key。不要填写 `VITE_AMAP_API_KEY`，不要把 Key 提交到 GitHub。
5. 点击部署。构建成功后用 ESA 提供的带 token 预览链接测试网页和 `/api/health`；token 失效后在 ESA 控制台重新生成预览链接。

ESA 支持通过 GitHub 导入仓库和自动构建；其公共测试链接的 token 有效期为 60 分钟。[ESA GitHub 导入文档](https://help.aliyun.com/zh/edge-security-acceleration/esa/user-guide/connect-pages-to-github)
