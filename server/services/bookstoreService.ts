import { bookstores } from '../../src/data/bookstores.js'
import { applySupportedTags } from '../../src/data/bookstoreTagging.js'
import type { Bookstore, BookstoreSearchParams } from '../../src/types/bookstore.js'
import type { BookstoreProvider } from './bookstoreProvider.js'

export type BookstoreSearchResult = {
  data: Bookstore[]
  source: string
  fallback: boolean
}

function normalize(value: string) {
  return value.trim().toLocaleLowerCase('zh-CN')
}

export class MockBookstoreProvider implements BookstoreProvider {
  readonly name = 'mock'

  async search(params: BookstoreSearchParams): Promise<Bookstore[]> {
    const city = normalize(params.city || '上海')
    const tags = params.tags?.map(normalize).filter(Boolean) ?? []
    const keyword = normalize(params.keyword || '')

    return bookstores.map((store) => ({
      ...store,
      tags: applySupportedTags(store),
    })).filter((store) => {
      const searchable = normalize([store.name, store.address, store.description, ...store.tags].join(' '))
      return normalize(store.city) === city
        && tags.every((tag) => store.tags.some((storeTag) => normalize(storeTag) === tag))
        && (!keyword || searchable.includes(keyword))
    })
  }
}

export class BookstoreService {
  constructor(
    private readonly fallbackProvider: BookstoreProvider,
    private readonly configuredProvider?: BookstoreProvider,
  ) {}

  async search(params: BookstoreSearchParams): Promise<BookstoreSearchResult> {
    if (!this.configuredProvider) {
      return { data: await this.fallbackProvider.search(params), source: this.fallbackProvider.name, fallback: false }
    }
    try {
      return { data: await this.configuredProvider.search(params), source: this.configuredProvider.name, fallback: false }
    } catch {
      return { data: await this.fallbackProvider.search(params), source: this.fallbackProvider.name, fallback: true }
    }
  }
}
