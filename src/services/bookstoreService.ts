import type { BookstoreSearchParams, BookstoreSearchResponse } from '../types/bookstore'

function createSearchQuery(params: BookstoreSearchParams) {
  const query = new URLSearchParams()
  if (params.city) query.set('city', params.city)
  if (params.tags?.length) query.set('tags', params.tags.join(','))
  if (params.keyword?.trim()) query.set('keyword', params.keyword.trim())
  return query
}

export async function searchBookstores(params: BookstoreSearchParams): Promise<BookstoreSearchResponse> {
  const response = await fetch(`/api/bookstores?${createSearchQuery(params).toString()}`)
  if (!response.ok) throw new Error('暂时无法加载书店数据，请稍后重试。')
  return response.json() as Promise<BookstoreSearchResponse>
}
