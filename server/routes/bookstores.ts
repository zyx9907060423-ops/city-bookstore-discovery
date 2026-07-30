import type { RequestHandler } from 'express'
import type { BookstoreSearchParams } from '../../src/types/bookstore.js'
import { BookstoreService } from '../services/bookstoreService.js'

function firstQueryValue(value: unknown): string | undefined {
  return Array.isArray(value) ? value[0] : typeof value === 'string' ? value : undefined
}

function parseSearchParams(query: Record<string, unknown>): BookstoreSearchParams {
  const rawTags = firstQueryValue(query.tags)
  return {
    city: firstQueryValue(query.city),
    tags: rawTags?.split(',').map((tag) => tag.trim()).filter(Boolean),
    keyword: firstQueryValue(query.keyword),
  }
}

export function createBookstoresRoute(service: BookstoreService): RequestHandler {
  return async (request, response, next) => {
    try {
      const result = await service.search(parseSearchParams(request.query))
      response.json({ data: result.data, meta: { count: result.data.length, source: result.source, fallback: result.fallback } })
    } catch (error) {
      next(error)
    }
  }
}
