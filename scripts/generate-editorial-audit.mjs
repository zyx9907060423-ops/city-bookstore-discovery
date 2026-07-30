import { mkdir, writeFile } from 'node:fs/promises'
import { approvedBookstoreEditorialByAmapId } from '../src/data/bookstoreEditorial.ts'
import { getAppliedTags } from '../src/data/bookstoreTagging.ts'

const apiBaseUrl = process.env.BOOKSTORE_API_BASE_URL ?? 'http://127.0.0.1:5183'
const cities = ['上海', '北京', '杭州', '成都']
const outputDirectory = new URL('../docs/editorial-drafts/four-city-snapshot/', import.meta.url)

function getDistrict(address) {
  return address.split(' · ')[0] || '当地'
}

function escapeCell(value) {
  return value.replace(/\|/g, '\\|').replace(/\n/g, ' ')
}

function genericDescription(store) {
  return `位于${getDistrict(store.address)}的实体书店，现仅确认地点与书店属性。`
}

async function getCityDraft(city) {
  const response = await fetch(`${apiBaseUrl}/api/bookstores?city=${encodeURIComponent(city)}`)
  if (!response.ok) throw new Error(`${city} 请求失败：${response.status}`)
  const payload = await response.json()
  if (payload.meta.source !== 'amap' || payload.meta.fallback) {
    throw new Error(`${city} 未获得高德真实数据，已停止生成草案。`)
  }
  if (!Array.isArray(payload.data) || payload.data.length === 0) {
    throw new Error(`${city} 未返回书店结果，已停止生成草案，避免生成不完整审核表。`)
  }

  const rows = payload.data.map((store, index) => {
    const amapId = store.id.replace(/^amap-/, '')
    const approvedProfile = approvedBookstoreEditorialByAmapId.get(amapId)
    const appliedTags = getAppliedTags({
      name: store.name,
      address: store.address,
      tags: approvedProfile?.tags,
    })
    const tags = appliedTags.map((entry) => entry.tag)
    const description = approvedProfile?.description ?? genericDescription(store)
    const source = approvedProfile?.sources[0] ?? `https://www.amap.com/place/${amapId}`
    const tagEvidence = appliedTags.length
      ? appliedTags.map((entry) => `${entry.tag}（${entry.confidence}，${entry.basis}）`).join('；')
      : '仅确认地点与书店属性'
    const confidence = appliedTags.some((entry) => entry.confidence === '高')
      ? appliedTags.some((entry) => entry.confidence === '中') ? '高／中' : '高'
      : appliedTags.length ? '中' : '高（地点）'
    const status = appliedTags.length ? '标签已应用' : '仅保留书店'
    return `| ${index + 1} | ${amapId} | ${escapeCell(store.name)} | ${escapeCell(store.address)} | ${tags.length ? tags.join('、') : '书店'} | ${escapeCell(tagEvidence)} | ${description} | [来源](${source}) | ${confidence} | ${status} |`
  })

  const content = [
    `# ${city}书店编辑审核档案（高德快照）`,
    '',
    `生成时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false })}`,
    `数据来源：${payload.meta.source}；本次返回 ${payload.data.length} 家。`,
    '',
    '说明：已应用高/中置信度标签。无法由已核验档案或 POI 名称/地址明确判断的门店仍只标“书店”。',
    '',
    '| # | Amap ID | 书店 | 地址 | 已应用标签 | 标签依据 | 介绍（≤45字） | 来源 | 置信度 | 状态 |',
    '|---:|---|---|---|---|---|---|---|---|---|',
    ...rows,
    '',
  ].join('\n')

  return { city, count: payload.data.length, content }
}

await mkdir(outputDirectory, { recursive: true })
const drafts = []
for (const city of cities) drafts.push(await getCityDraft(city))

await Promise.all(drafts.map(({ city, content }) => writeFile(new URL(`${city}.md`, outputDirectory), content)))

const index = [
  '# 四城书店编辑审核档案（高德快照）',
  '',
  ...drafts.map(({ city, count }) => `- [${city}：${count} 家](./${city}.md)`),
  '',
  '标签应用口径：',
  '',
  '- “高”：已有公开官方或权威来源支撑的编辑介绍与标签。',
  '- “高（地点）”：高德公开 POI 页支持该门店的地点与书店属性；体验特点尚未逐店核验，因此仅标“书店”。',
  '- “标签已应用”：已符合高/中置信度规则；“仅保留书店”：尚无足够依据，不追加体验类标签。',
  '',
  '本批档案已按用户授权直接应用高/中置信度标签；保留“书店”的条目不会追加推测性标签。',
  '',
].join('\n')
await writeFile(new URL('README.md', outputDirectory), index)

console.log(JSON.stringify(drafts.map(({ city, count }) => ({ city, count }))))
