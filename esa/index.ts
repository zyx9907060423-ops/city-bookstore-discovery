import { AmapProvider } from '../server/services/bookstoreProvider.js'
import { BookstoreService, MockBookstoreProvider } from '../server/services/bookstoreService.js'
import type { BookstoreSearchParams } from '../src/types/bookstore.js'

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=30, s-maxage=180',
    },
  })
}

function parseSearchParams(url: URL): BookstoreSearchParams {
  const rawTags = url.searchParams.get('tags')
  return {
    city: url.searchParams.get('city') ?? undefined,
    tags: rawTags?.split(',').map((tag) => tag.trim()).filter(Boolean),
    keyword: url.searchParams.get('keyword') ?? undefined,
  }
}

function createBookstoreService() {
  const fallbackProvider = new MockBookstoreProvider()
  // ESA 将此值配置为运行环境变量；它不会打包进 Vite 的浏览器代码。
  // 部分边缘运行时不会提供 Node.js 的 process 全局对象。缺少它时
  // 仍应安全降级到 mock，而不是让 /api/bookstores 返回 500。
  const apiKey = typeof process === 'undefined' ? '' : (process.env?.AMAP_API_KEY ?? '')
  const configuredProvider = apiKey ? new AmapProvider(apiKey) : undefined
  return new BookstoreService(fallbackProvider, configuredProvider)
}

async function handleRequest(request: Request) {
  const url = new URL(request.url)

  if (request.method !== 'GET') return json({ message: '仅支持 GET 请求。' }, 405)
  if (url.pathname === '/api/health') return json({ ok: true, runtime: 'esa-pages' })
  if (url.pathname !== '/api/bookstores') return json({ message: '未找到接口。' }, 404)

  try {
    const result = await createBookstoreService().search(parseSearchParams(url))
    return json({
      data: result.data,
      meta: { count: result.data.length, source: result.source, fallback: result.fallback },
    })
  } catch {
    return json({ message: '暂时无法读取书店数据，请稍后重试。' }, 500)
  }
}

/**
 * 阿里云 ESA Functions & Pages 入口。
 * 静态文件由 dist 托管；/api/* 这类非导航请求由此函数处理。
 */
export default {
  async fetch(request: Request) {
    return handleRequest(request)
  },
}
