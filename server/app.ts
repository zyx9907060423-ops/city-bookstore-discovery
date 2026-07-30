import express from 'express'
import { createBookstoresRoute } from './routes/bookstores.js'
import { AmapProvider } from './services/bookstoreProvider.js'
import { BookstoreService, MockBookstoreProvider } from './services/bookstoreService.js'

function createBookstoreService() {
  const fallbackProvider = new MockBookstoreProvider()
  const configuredProvider = process.env.BOOKSTORE_PROVIDER === 'amap'
    ? new AmapProvider(process.env.AMAP_API_KEY ?? '')
    : undefined
  return new BookstoreService(fallbackProvider, configuredProvider)
}

export function createApp() {
  const app = express()
  app.disable('x-powered-by')
  app.get('/api/health', (_request, response) => response.json({ ok: true }))
  app.get('/api/bookstores', createBookstoresRoute(createBookstoreService()))
  app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
    console.error(error)
    response.status(500).json({ message: '暂时无法读取书店数据，请稍后重试。' })
  })
  return app
}
