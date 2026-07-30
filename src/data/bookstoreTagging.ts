export const styleOptions = [
  '独立书店', '安静阅读', '咖啡阅读', '艺术／设计', '亲子', '二手书',
  '外文书', '活动与讲座', '女性主义', '江景', '海景', '影视戏剧',
  '古籍', '商场内书店', '教材书', '书城',
]

export type TagConfidence = '高' | '中'

export type BookstoreTagRule = {
  tag: string
  confidence: TagConfidence
  standard: string
  evidence: string
  exclude: string
}

/**
 * 可直接应用的标签规则：高置信度来自已核验的编辑来源；中置信度只采用高德
 * POI 的门店名称或地址中明确出现的经营/场所信息，不从行业大类推测阅读体验。
 */
export const bookstoreTagRules: BookstoreTagRule[] = [
  {
    tag: '古籍',
    confidence: '中',
    standard: '门店名称明确含“古籍”或“古旧书”；或已核验来源明确其持续经营古籍、版本文献。',
    evidence: '官方/权威介绍，或高德 POI 门店名称。',
    exclude: '仅售旧书、历史读物或举办古籍主题活动，均不标注。',
  },
  {
    tag: '商场内书店',
    confidence: '中',
    standard: '高德 POI 地址明确写有购物中心、商场、广场、百货或已识别商业项目名称；或已核验的商场官方目录收录该门店。',
    evidence: '高德 POI 地址或商场官方目录。',
    exclude: '仅在商业街、写字楼、住宅区附近，或地址无法确认具体商业项目，不标注。',
  },
  {
    tag: '教材书',
    confidence: '中',
    standard: '门店名称明确含“教材”“教辅”或“课本”；或已核验来源确认其以教材、教学用书零售为主营。',
    evidence: '高德 POI 门店名称，或教育/出版机构公开资料。',
    exclude: '普通书店售卖少量教材、练习册或童书，不标注。',
  },
  {
    tag: '书城',
    confidence: '中',
    standard: '门店正式名称明确含“书城”；或已核验来源称其为实体书城。',
    evidence: '高德 POI 门店名称，或官方/权威机构公开介绍。',
    exclude: '名称仅含“城”、地址在某个“城”内，或普通综合书店，不标注。',
  },
  {
    tag: '外文书',
    confidence: '中',
    standard: '门店名称明确含“外文书”；或已核验来源确认其长期提供外文、进口版或港版书。港版书可作为满足该标签的书目依据。',
    evidence: '官方/权威介绍，或高德 POI 门店名称。',
    exclude: '单次外文活动、少量外文读物，或仅销售外语教材，不标注。',
  },
]

type BookstoreTagInput = {
  name: string
  address: string
  tags?: string[]
}

export type AppliedTag = {
  tag: string
  confidence: TagConfidence
  basis: string
}

const mallAddressPattern = /购物中心|商场|广场|百货|\b(?:mall)\b|大悦城|万象城|万达(?:广场)?|来福士|太古里|太古汇|银泰(?:城|百货)?|龙之梦|印象城|吾悦(?:广场)?|世茂(?:广场)?|缤纷城|天街|天地|奥特莱斯|奥莱/i

function includesAny(value: string, terms: string[]) {
  return terms.some((term) => value.includes(term))
}

/** 返回可追溯到门店名称、地址或已核验编辑标签的中/高置信度标签。 */
export function getAppliedTags(input: BookstoreTagInput): AppliedTag[] {
  const name = input.name.trim()
  const address = input.address.trim()
  const existingTags = input.tags ?? []
  const applied = new Map<string, AppliedTag>()

  for (const tag of existingTags) {
    if (tag !== '书店') applied.set(tag, { tag, confidence: '高', basis: '已核验编辑档案' })
  }

  const add = (tag: string, basis: string) => {
    if (!applied.has(tag)) applied.set(tag, { tag, confidence: '中', basis })
  }

  if (includesAny(name, ['古籍', '古旧书', '古书'])) add('古籍', '高德 POI 门店名称')
  if (includesAny(name, ['教材', '教辅', '课本', '人教'])) add('教材书', '高德 POI 门店名称')
  if (name.includes('书城')) add('书城', '高德 POI 门店名称')
  if (includesAny(name, ['外文书', '港版书', '香港版书'])) add('外文书', '高德 POI 门店名称')
  if (includesAny(name, ['旧书', '二手书'])) add('二手书', '高德 POI 门店名称')
  if (includesAny(name, ['儿童', '童书', '绘本', '少儿'])) add('亲子', '高德 POI 门店名称')
  if (name.includes('咖啡')) add('咖啡阅读', '高德 POI 门店名称')
  if (includesAny(name, ['艺术', '美术', '设计'])) add('艺术／设计', '高德 POI 门店名称')
  if (includesAny(name, ['影视', '电影', '戏剧', '剧本'])) add('影视戏剧', '高德 POI 门店名称')
  if (includesAny(name, ['女性主义', '女权'])) add('女性主义', '高德 POI 门店名称')
  if (name.includes('独立书店')) add('独立书店', '高德 POI 门店名称')
  if (includesAny(name, ['江景', '滨江'])) add('江景', '高德 POI 门店名称')
  if (name.includes('海景')) add('海景', '高德 POI 门店名称')
  if (mallAddressPattern.test(address)) add('商场内书店', '高德 POI 地址')

  return [...applied.values()].slice(0, 4)
}

export function applySupportedTags(input: BookstoreTagInput) {
  const tags = getAppliedTags(input).map((entry) => entry.tag)
  return tags.length ? tags : ['书店']
}
