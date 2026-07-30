export type BookstoreEditorialNameRule = {
  city: string
  nameIncludes: string
  tags: string[]
  description: string
  sources: string[]
  confidence: '高' | '中'
}

/**
 * 以城市和门店名称匹配的编辑档案。
 * 每条均保留公开来源；名称相同但不在目标城市的门店不会命中。
 */
export const approvedBookstoreEditorialNameRules: BookstoreEditorialNameRule[] = [
  {
    city: '北京', nameIncludes: 'PAGE ONE', tags: ['外文书', '活动与讲座'],
    description: '北京坊门店以外文书与杂志见长，并举办艺术文化活动。',
    sources: ['https://japanese.beijing.gov.cn/consuminginbeijing/onedayinbeijing/bookstores/updatesofbookstores/202106/t20210628_2423087.html'], confidence: '高',
  },
  {
    city: '北京', nameIncludes: 'PAGEONE', tags: ['外文书', '活动与讲座'],
    description: '北京的 PAGEONE 门店以外文书与杂志见长，并举办文化活动。',
    sources: ['https://japanese.beijing.gov.cn/consuminginbeijing/onedayinbeijing/bookstores/updatesofbookstores/202106/t20210628_2423087.html'], confidence: '高',
  },
  {
    city: '北京', nameIncludes: '正阳书局', tags: ['古籍', '活动与讲座'],
    description: '万松老人塔下的京味书店，专营北京历史文献并开展公共文化活动。',
    sources: ['https://www.beijing.gov.cn/renwen/zt/ydbj/yw/201804/t20180425_1872965.html'], confidence: '高',
  },
  {
    city: '北京', nameIncludes: '万圣书园', tags: ['安静阅读', '活动与讲座'],
    description: '社科与人文选书分类鲜明，设阅读交流与主题读书会。',
    sources: ['https://www.beijing.gov.cn/renwen/cshd/202401/t20240105_3526544.html'], confidence: '高',
  },
  {
    city: '北京', nameIncludes: '多抓鱼书店', tags: ['二手书'],
    description: '从二手书循环起步的实体书店，适合淘选旧书。',
    sources: ['https://www.beijing.gov.cn/fuwu/bmfw/sy/jrts/202411/t20241104_3933280.html'], confidence: '高',
  },
  {
    city: '北京', nameIncludes: '纸上声音', tags: ['二手书', '咖啡阅读'],
    description: '兼有折扣新书、旧书与二层阅读咖啡区的书店。',
    sources: ['https://japanese.beijing.gov.cn/consuminginbeijing/onedayinbeijing/bookstores/updatesofbookstores/202112/t20211201_2550908.html'], confidence: '高',
  },
  {
    city: '北京', nameIncludes: 'AGORA BOOKS', tags: ['咖啡阅读', '活动与讲座'],
    description: '植物与文创环绕的阅读空间，提供咖啡及主题读书会。',
    sources: ['https://japanese.beijing.gov.cn/consuminginbeijing/onedayinbeijing/bookstores/updatesofbookstores/202112/t20211201_2550908.html'], confidence: '高',
  },
  {
    city: '北京', nameIncludes: '外研书店', tags: ['外文书', '亲子', '活动与讲座'],
    description: '连接外语学习、童书阅读与线下读书会的阅读空间。',
    sources: ['https://www.bjxwcbj.gov.cn/zt/stsd/8759a693268a44f1bf307408826bfecd.html'], confidence: '高',
  },
  {
    city: '北京', nameIncludes: '中图外文书店', tags: ['外文书'],
    description: '以进口原版图书为线索，适合查找多语种与英文读物。',
    sources: ['https://www.cnpdigital.cn/'], confidence: '高',
  },
  {
    city: '北京', nameIncludes: '单向空间', tags: ['活动与讲座'],
    description: '以阅读活动与公共讨论连接读者的文化书店。',
    sources: ['https://www.beijing.gov.cn/renwen/sy/whkb/201906/t20190612_1866314.html'], confidence: '高',
  },
  {
    city: '杭州', nameIncludes: '博库书城', tags: ['书城', '活动与讲座'],
    description: '杭州大型书城，覆盖广泛品类，并承办城市阅读活动。',
    sources: ['https://www.hzzx.gov.cn/cshz/content/2024-04/22/content_8719141.htm'], confidence: '高',
  },
  {
    city: '杭州', nameIncludes: '钟书阁(星光', tags: ['艺术／设计', '亲子'],
    description: '星光国际广场门店以沉浸式书架与儿童阅读区见长。',
    sources: ['https://wgly.hangzhou.gov.cn/art/2017/3/20/art_1229495371_58931504.html'], confidence: '高',
  },
  {
    city: '杭州', nameIncludes: '晓风书屋', tags: ['活动与讲座'],
    description: '持续组织讲座、展览、阅读分享与书展的杭州阅读空间。',
    sources: ['https://wgly.hangzhou.gov.cn/art/2023/12/18/art_1229752179_58951998.html'], confidence: '高',
  },
  {
    city: '杭州', nameIncludes: '西湖书房', tags: ['咖啡阅读', '安静阅读'],
    description: '社区阅读空间，设阅读区、咖啡站与有声书角。',
    sources: ['https://eng.hangzhou.gov.cn/art/2024/12/16/art_811217_58876446.html'], confidence: '高',
  },
  {
    city: '成都', nameIncludes: '方所', tags: ['艺术／设计', '亲子', '咖啡阅读', '活动与讲座'],
    description: '太古里复合文化空间，融合艺术设计、童书、讲座与人文咖啡。',
    sources: ['https://www.nationalreading.gov.cn/ydkj/swsh/202204/t20220425_110939.html'], confidence: '高',
  },
  {
    city: '成都', nameIncludes: '文轩BOOKS', tags: ['亲子'],
    description: '设亲子阅读区的城市书店，适合带孩子一起选书与停留。',
    sources: ['https://cds.sczwfw.gov.cn/art/2021/7/22/art_15395_149295.html'], confidence: '高',
  },
]

export function getApprovedBookstoreEditorialRule(city: string, name: string) {
  return approvedBookstoreEditorialNameRules.find((rule) => city.includes(rule.city) && name.includes(rule.nameIncludes))
}
