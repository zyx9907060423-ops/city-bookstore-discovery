import { createApp } from '../server/app.js'

/**
 * Vercel Serverless Function 入口。
 * 复用本地 Express 路由，所有高德请求仍只在服务端读取 AMAP_API_KEY。
 */
const app = createApp()

export default app
