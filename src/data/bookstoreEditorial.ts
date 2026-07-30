export type BookstoreEditorialProfile = {
  amapId: string
  tags: string[]
  description: string
  sources: string[]
}

/**
 * 已通过人工审核的编辑档案。
 * 仅使用高德 POI ID 匹配，避免同一品牌的不同门店误用介绍。
 */
export const approvedBookstoreEditorialProfiles: BookstoreEditorialProfile[] = [
  {
    amapId: 'B0G0P9FUWI',
    tags: ['艺术／设计', '江景', '活动与讲座'],
    description: '在上海中心52层，以阅读、展览与读书会连接黄浦江景。',
    sources: ['https://www.shanghaitower.com/news_2/44.html'],
  },
  {
    amapId: 'B0FFLPX4S0',
    tags: ['亲子', '活动与讲座', '书城'],
    description: '福州路大型书城，覆盖多主题图书，并持续举办签售与亲子活动。',
    sources: ['https://www.shanghai.gov.cn/nw4411/20241028/6b6038ec427c4f9c9c8a3d7f38070de6.html'],
  },
  {
    amapId: 'B0G2K1VSOD',
    tags: ['艺术／设计'],
    description: '上生·新所的复合文化空间，以书籍、艺术与生活提案串联漫游。',
    sources: ['https://icci.sjtu.edu.cn/news/view/1334'],
  },
  {
    amapId: 'B0FFMCJP0Z',
    tags: ['安静阅读', '活动与讲座'],
    description: '金桥的24小时阅读空间，夜间也可读书，并举办分享活动。',
    sources: ['https://www.ssme.sh.gov.cn/public/product%21serviceDetail.do?productId=2c91c2877b39f09a017b3e29c8b44065'],
  },
  {
    amapId: 'B00155F57R',
    tags: ['书城'],
    description: '宜山路四层综合书城，社科、文艺、科技与少儿图书分区陈列。',
    sources: ['https://www.why.com.cn/wx/article/2024/09/20/17268083591091891793.html'],
  },
  {
    amapId: 'B0MALA64RY',
    tags: ['书店'],
    description: '朱家角镇的实体书店，现仅确认地点与书店属性。',
    sources: ['https://www.amap.com/place/B0MALA64RY'],
  },
  {
    amapId: 'B0H0ZUTZRV',
    tags: ['商场内书店'],
    description: '前滩太古里的茑屋书店，以 Wellness Community 为主题。',
    sources: ['https://www.taikooliqiantan.com/detail/250.html'],
  },
  {
    amapId: 'B0KDG5KPLL',
    tags: ['活动与讲座'],
    description: '福州路百年书局焕新为阅读、播客与文化活动并行的复合空间。',
    sources: ['https://www.nationalreading.gov.cn/ydkj/202412/t20241223_877954.html'],
  },
  {
    amapId: 'B00156TLW0',
    tags: ['书店'],
    description: '钟书阁的泰晤士小镇门店，现仅确认地点与书店属性。',
    sources: ['https://www.amap.com/place/B00156TLW0'],
  },
  {
    amapId: 'B0IGLZ2S57',
    tags: ['二手书'],
    description: '复旦大学路旁的旧书店，以文史哲旧书为主，保留淘书气息。',
    sources: ['https://www.shyp.gov.cn/shypq/xwzx-tpyw/20220808/412921.html'],
  },
  {
    amapId: 'B0FFHC51ZW',
    tags: ['咖啡阅读', '活动与讲座'],
    description: '北外滩的阅读空间，设咖啡体验并举办文化分享活动。',
    sources: ['https://www.shhk.gov.cn/slh/038001/20220815/5efea84c-6275-4e23-8f8e-c7a1da757dfc.html'],
  },
  {
    amapId: 'B001553N0R',
    tags: ['亲子', '活动与讲座', '书城'],
    description: '中山公园旁四层书城，设亲子共读与家庭教育活动。',
    sources: ['https://www.shcn.gov.cn/col3991/20240628/1262104.html'],
  },
  {
    amapId: 'B00153CA7F',
    tags: ['古籍'],
    description: '福州路近七十年的专业古籍书店，主打古籍与版本文献。',
    sources: ['https://www.nationalreading.gov.cn/ydkj/202505/t20250529_897923.html'],
  },
  {
    amapId: 'B00154DF7O',
    tags: ['教材书'],
    description: '大木桥路的教材零售门店，现仅确认教材书店属性。',
    sources: ['https://www.shmeea.edu.cn/download/20211103/02.pdf'],
  },
  {
    amapId: 'B0GUOZ3LVS',
    tags: ['书店'],
    description: '复旦大学出版社的校园综合书店，重点陈列人文社科与复旦版图书。',
    sources: ['https://news.fudan.edu.cn/2020/0618/c64a105558/page.htm'],
  },
  {
    amapId: 'B00151B405',
    tags: ['外文书'],
    description: '淮海中路的沪港阅读窗口，设“沪港双城记”书架与港版书。',
    sources: ['https://www.nationalreading.gov.cn/ydkj/202502/t20250206_884216.html'],
  },
  {
    amapId: 'B0H647KUGZ',
    tags: ['书店'],
    description: '大学路的实体书店，现仅确认地点与书店属性。',
    sources: ['https://www.amap.com/place/B0H647KUGZ'],
  },
  {
    amapId: 'B0JBM75DSW',
    tags: ['独立书店', '艺术／设计', '活动与讲座'],
    description: '红宝石路的独立艺术书店，连接艺术书、展览、出版与书展。',
    sources: ['https://www.shobserver.cn/wx/detail.do?id=579304'],
  },
  {
    amapId: 'B0K3Z7CYGF',
    tags: ['商场内书店'],
    description: '大华虎城内的实体书店，现仅确认门店与书店属性。',
    sources: ['https://yuezecorp.com/kcxfz'],
  },
  {
    amapId: 'B0LG27KF0A',
    tags: ['书店'],
    description: '延安西路的实体书店，现仅确认地点与书店属性。',
    sources: ['https://www.amap.com/place/B0LG27KF0A'],
  },
  {
    amapId: 'B00155BSZN',
    tags: ['书店'],
    description: '七宝老街附近的新华书店，现仅确认地点与书店属性。',
    sources: ['https://www.shmeea.edu.cn/download/20201112/20201112_6.pdf'],
  },
  {
    amapId: 'B0HU1HB3TA',
    tags: ['咖啡阅读', '活动与讲座'],
    description: '近百年老店焕新为红色主题阅读空间，并开展分享会活动。',
    sources: ['https://www.nationalreading.gov.cn/ydkj/swsh/202405/t20240510_846669.html'],
  },
  {
    amapId: 'B0JK17HO9G',
    tags: ['商场内书店'],
    description: '世茂广场内的西西弗门店，现仅确认地点与书店属性。',
    sources: ['https://www.amap.com/place/B0JK17HO9G'],
  },
  {
    amapId: 'B0FFGIIPYC',
    tags: ['商场内书店'],
    description: '静安大悦城的西西弗门店，以英伦装饰与多主题书籍陈列见长。',
    sources: ['https://whlyj.sh.gov.cn/gqfc/20230828/033c9da0a6b843f59cf2c64f7aa9a5a0.html'],
  },
  {
    amapId: 'B0LUFCYRL3',
    tags: ['咖啡阅读', '商场内书店'],
    description: '鑫耀·光环Live的西西弗与矢量咖啡复合门店，适合边读边饮。',
    sources: ['https://www.shinkong-place.com/brands/1206'],
  },
  {
    amapId: 'B00154DL1U',
    tags: ['书城'],
    description: '曹杨地区的上海书城门店，现仅确认地点与书店属性。',
    sources: ['https://www.amap.com/place/B00154DL1U'],
  },
]

export const approvedBookstoreEditorialByAmapId = new Map(
  approvedBookstoreEditorialProfiles.map((profile) => [profile.amapId, profile]),
)
