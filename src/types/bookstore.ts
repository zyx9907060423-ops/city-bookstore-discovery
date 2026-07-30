export type Bookstore = {
  id: string
  name: string
  city: string
  address: string
  image: string
  tags: string[]
  description: string
  /** 高德地图地点详情入口。 */
  mapUrl?: string
  /** 已人工核验时，放入某一篇具体的小红书 UGC 帖链接。 */
  ugcUrl?: string
  reviewUrl: string
}

export type BookstoreSearchParams = {
  city?: string
  tags?: string[]
  keyword?: string
}

export type BookstoreSearchResponse = {
  data: Bookstore[]
  meta: {
    count: number
    source: string
    fallback: boolean
  }
}
