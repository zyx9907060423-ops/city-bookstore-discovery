import type { Bookstore, BookstoreSearchParams } from '../../src/types/bookstore.js'
import { approvedBookstoreEditorialByAmapId } from '../../src/data/bookstoreEditorial.js'
import { applySupportedTags } from '../../src/data/bookstoreTagging.js'

export interface BookstoreProvider {
  readonly name: string
  search(params: BookstoreSearchParams): Promise<Bookstore[]>
}

type AmapPoi = {
  id: string
  name: string
  location?: string
  type?: string
  cityname?: string
  adname?: string
  address?: string
  photos?: Array<{ title?: string; url?: string }>
  business?: { opentime_today?: string; opentime_week?: string }
}

type AmapPlaceResponse = {
  status?: string
  info?: string
  infocode?: string
  pois?: AmapPoi[]
}

const fallbackImage = 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=85'

const retryDelay = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds))

function toSecureImageUrl(url?: string) {
  return url?.replace(/^http:/i, 'https:')
}

function createMapUrl(poi: AmapPoi) {
  const query = new URLSearchParams({ src: 'city-bookstore', callnative: '1' })
  if (poi.id) query.set('poiid', poi.id)
  else if (poi.location) query.set('position', poi.location)
  query.set('name', poi.name)
  return `https://uri.amap.com/marker?${query.toString()}`
}

function isBookstore(poi: AmapPoi) {
  return poi.type?.split(';').some((type) => type.trim() === '书店') ?? false
}

function createFallbackDescription(poi: AmapPoi) {
  const area = poi.adname ? `位于${poi.adname}的` : '这家'
  return `${area}实体书店；可通过地图和书友分享进一步了解近期选书、空间与活动。`
}

/** 高德 POI 2.0：密钥只在服务端请求中使用。 */
export class AmapProvider implements BookstoreProvider {
  readonly name = 'amap'

  constructor(private readonly apiKey: string) {}

  private async fetchPage(query: URLSearchParams) {
    let lastError: unknown

    // 偶发网络抖动或限流不应立即让整座城市降级到 mock 数据。
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const response = await fetch(`https://restapi.amap.com/v5/place/text?${query.toString()}`)
        if (!response.ok) throw new Error(`高德地点服务请求失败（${response.status}）。`)

        const payload = await response.json() as AmapPlaceResponse
        if (payload.status !== '1') throw new Error(payload.info || payload.infocode || '高德地点服务返回异常。')
        return payload
      } catch (error) {
        lastError = error
        if (attempt < 2) await retryDelay(400 * (attempt + 1))
      }
    }

    throw lastError
  }

  async search(params: BookstoreSearchParams): Promise<Bookstore[]> {
    if (!this.apiKey) throw new Error('高德 Web 服务 Key 尚未配置。')

    const city = params.city?.trim() || '上海'
    const keyword = [params.keyword?.trim(), ...(params.tags ?? []), '书店'].filter(Boolean).join(' ')
    const pois: AmapPoi[] = []

    for (let page = 1; page <= 8; page += 1) {
      const query = new URLSearchParams({
        key: this.apiKey,
        keywords: keyword,
        region: city,
        city_limit: 'true',
        show_fields: 'photos,business',
        page_size: '25',
        page_num: String(page),
      })
      try {
        const payload = await this.fetchPage(query)
        const pagePois = payload.pois ?? []
        pois.push(...pagePois)
        if (pagePois.length < 25) break
      } catch (error) {
        // 每页已在 fetchPage 内重试。仍失败时拒绝返回部分城市结果，交由服务层明确降级。
        throw error
      }
    }

    const uniqueBookstores = [...new Map(
      pois.filter(isBookstore).map((poi) => [poi.id, poi]),
    ).values()]

    const mappedBookstores = uniqueBookstores.map((poi) => {
      const profile = approvedBookstoreEditorialByAmapId.get(poi.id)
      return {
        id: `amap-${poi.id}`,
        name: poi.name,
        city: poi.cityname || city,
        address: [poi.adname, poi.address].filter(Boolean).join(' · ') || '高德未提供详细地址',
        image: toSecureImageUrl(poi.photos?.find((photo) => photo.url)?.url) || fallbackImage,
        // 高德的“专卖店”等行业分类不等于阅读体验；只使用已核验标签，或门店名称/地址中明确可判定的规则标签。
        tags: applySupportedTags({ name: poi.name, address: poi.address ?? '', tags: profile?.tags }),
        description: profile?.description ?? createFallbackDescription(poi),
        mapUrl: createMapUrl(poi),
        reviewUrl: createMapUrl(poi),
      }
    })

    const requestedTags = params.tags ?? []
    return requestedTags.length
      ? mappedBookstores.filter((store) => requestedTags.every((tag) => store.tags.includes(tag)))
      : mappedBookstores
  }
}
