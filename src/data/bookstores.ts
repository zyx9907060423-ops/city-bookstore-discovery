import type { Bookstore } from '../types/bookstore.js'
export { styleOptions } from './bookstoreTagging.js'

const photos = {
  shelves: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=85',
  window: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=85',
  tables: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=85',
  library: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=85',
  books: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=1200&q=85',
  reading: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&q=85',
}

export const bookstores: Bookstore[] = [
  {
    id: 'duoyun', name: '朵云书院·旗舰店', city: '上海', address: '浦东新区滨江大道 2777 号', image: 'https://sghimages.shobserver.com/img/catch/2022/04/27/32bf34ba-55cd-464e-954e-f5909ad10dbd.jpg',
    tags: ['艺术／设计', '安静阅读', '江景', '影视戏剧'], description: '面向江景的阅读空间，艺术类选书和展览让停留变得很自然。', mapUrl: 'https://www.amap.com/search?query=%E6%9C%B5%E4%BA%91%E4%B9%A6%E9%99%A2%20%E4%B8%8A%E6%B5%B7', reviewUrl: 'https://www.amap.com/search?query=%E6%9C%B5%E4%BA%91%E4%B9%A6%E9%99%A2%20%E4%B8%8A%E6%B5%B7',
  },
  {
    id: 'heji', name: '衡山·和集', city: '上海', address: '徐汇区衡山路 880 号', image: photos.shelves,
    tags: ['独立书店', '咖啡阅读', '活动与讲座'], description: '书、音乐与咖啡共处一室，适合在午后慢慢挑一本意外的书。', mapUrl: 'https://www.amap.com/search?query=%E8%A1%A1%E5%B1%B1%E5%92%8C%E9%9B%86%20%E4%B8%8A%E6%B5%B7', reviewUrl: 'https://www.amap.com/search?query=%E8%A1%A1%E5%B1%B1%E5%92%8C%E9%9B%86%20%E4%B8%8A%E6%B5%B7',
  },
  {
    id: 'mofan', name: '模范书局·诗歌店', city: '上海', address: '虹口区四川北路 856 号', image: photos.library,
    tags: ['独立书店', '安静阅读', '外文书'], description: '藏在历史建筑里的小书店，木质书架与诗集让时间安静下来。', mapUrl: 'https://www.amap.com/search?query=%E6%A8%A1%E8%8C%83%E4%B9%A6%E5%B1%80%E8%AF%97%E6%AD%8C%E5%BA%97%20%E4%B8%8A%E6%B5%B7', reviewUrl: 'https://www.amap.com/search?query=%E6%A8%A1%E8%8C%83%E4%B9%A6%E5%B1%80%E8%AF%97%E6%AD%8C%E5%BA%97%20%E4%B8%8A%E6%B5%B7',
  },
  {
    id: 'sisyphus', name: '西西弗书店·静安大悦城店', city: '上海', address: '静安区西藏北路 166 号', image: photos.books,
    tags: ['咖啡阅读', '亲子', '活动与讲座'], description: '明亮开阔、品类丰富，带孩子逛书店或临时阅读都很合适。', mapUrl: 'https://www.amap.com/search?query=%E8%A5%BF%E8%A5%BF%E5%BC%97%E4%B9%A6%E5%BA%97%20%E4%B8%8A%E6%B5%B7', reviewUrl: 'https://www.amap.com/search?query=%E8%A5%BF%E8%A5%BF%E5%BC%97%E4%B9%A6%E5%BA%97%20%E4%B8%8A%E6%B5%B7',
  },
  {
    id: 'fuzhou', name: '上海书城', city: '上海', address: '黄浦区福州路 465 号', image: 'https://goshopshanghai.com/wp-content/uploads/2018/08/shanghaibookstore-2.jpg',
    tags: ['安静阅读', '亲子', '活动与讲座', '影视戏剧'], description: '从大众读物到专题展台一应俱全，是认真找书时很可靠的一站。', mapUrl: 'https://www.amap.com/search?query=%E4%B8%8A%E6%B5%B7%E4%B9%A6%E5%9F%8E%20%E7%A6%8F%E5%B7%9E%E8%B7%AF', reviewUrl: 'https://www.amap.com/search?query=%E4%B8%8A%E6%B5%B7%E4%B9%A6%E5%9F%8E%20%E7%A6%8F%E5%B7%9E%E8%B7%AF',
  },
  {
    id: 'mylittle', name: 'My Little Sunshine', city: '上海', address: '徐汇区安福路 322 号', image: photos.reading,
    tags: ['独立书店', '艺术／设计', '外文书', '女性主义'], description: '以图像、设计和独立出版物见长，适合寻找审美灵感。', mapUrl: 'https://www.amap.com/search?query=My%20Little%20Sunshine%20%E4%B8%8A%E6%B5%B7', reviewUrl: 'https://www.amap.com/search?query=My%20Little%20Sunshine%20%E4%B8%8A%E6%B5%B7',
  },
  {
    id: 'tsutaya', name: '茑屋书店·上生新所店', city: '上海', address: '长宁区延安西路 1262 号', image: photos.window,
    tags: ['艺术／设计', '咖啡阅读', '外文书'], description: '以生活方式策展串联书、文具与咖啡，适合悠闲地消磨半天。', mapUrl: 'https://www.amap.com/search?query=%E8%8C%91%E5%B1%8B%E4%B9%A6%E5%BA%97%20%E4%B8%8A%E7%94%9F%E6%96%B0%E6%89%80', reviewUrl: 'https://www.amap.com/search?query=%E8%8C%91%E5%B1%8B%E4%B9%A6%E5%BA%97%20%E4%B8%8A%E7%94%9F%E6%96%B0%E6%89%80',
  },
  {
    id: 'zhuan', name: '钟书阁·泰晤士小镇店', city: '上海', address: '松江区三新北路 900 弄', image: photos.library,
    tags: ['艺术／设计', '亲子', '安静阅读'], description: '极具戏剧感的空间设计，是带着相机和好奇心一起去的书店。', mapUrl: 'https://www.amap.com/search?query=%E9%92%9F%E4%B9%A6%E9%98%81%20%E6%B3%B0%E6%99%A4%E5%A3%AB%E5%B0%8F%E9%95%87', reviewUrl: 'https://www.amap.com/search?query=%E9%92%9F%E4%B9%A6%E9%98%81%20%E6%B3%B0%E6%99%A4%E5%A3%AB%E5%B0%8F%E9%95%87',
  },
  {
    id: 'oldbook', name: '博古斋旧书店', city: '上海', address: '黄浦区福州路 424 号', image: photos.books,
    tags: ['二手书', '安静阅读', '独立书店'], description: '适合慢慢翻阅旧版画册、碑帖和人文书，在书页里碰见旧时光。', mapUrl: 'https://www.amap.com/search?query=%E5%8D%9A%E5%8F%A4%E6%96%8B%E6%97%A7%E4%B9%A6%E5%BA%97%20%E4%B8%8A%E6%B5%B7', reviewUrl: 'https://www.amap.com/search?query=%E5%8D%9A%E5%8F%A4%E6%96%8B%E6%97%A7%E4%B9%A6%E5%BA%97%20%E4%B8%8A%E6%B5%B7',
  },
  {
    id: 'yutopia', name: '悦悦书店', city: '上海', address: '徐汇区南丹东路 107 号', image: photos.shelves,
    tags: ['独立书店', '活动与讲座', '安静阅读', '女性主义'], description: '偏重人文社科与文学，常有作者分享，像一间愿意聊天的书房。', mapUrl: 'https://www.amap.com/search?query=%E6%82%A6%E6%82%A6%E4%B9%A6%E5%BA%97%20%E4%B8%8A%E6%B5%B7', reviewUrl: 'https://www.amap.com/search?query=%E6%82%A6%E6%82%A6%E4%B9%A6%E5%BA%97%20%E4%B8%8A%E6%B5%B7',
  },
  {
    id: 'child', name: '蒲蒲兰绘本馆', city: '上海', address: '静安区江宁路 495 号', image: photos.reading,
    tags: ['亲子', '安静阅读', '活动与讲座'], description: '精心挑选的童书和舒适阅读角，适合陪孩子找到第一本喜欢的书。', mapUrl: 'https://www.amap.com/search?query=%E8%92%B2%E8%92%B2%E5%85%B0%E7%BB%98%E6%9C%AC%E9%A6%86%20%E4%B8%8A%E6%B5%B7', reviewUrl: 'https://www.amap.com/search?query=%E8%92%B2%E8%92%B2%E5%85%B0%E7%BB%98%E6%9C%AC%E9%A6%86%20%E4%B8%8A%E6%B5%B7',
  },
  {
    id: 'artbook', name: '香蕉鱼书店', city: '上海', address: '黄浦区南昌路 202 号', image: photos.tables,
    tags: ['独立书店', '艺术／设计', '活动与讲座', '女性主义'], description: '小而有鲜明个性的独立书店，选书常常通向独立出版与当代文化。', mapUrl: 'https://www.amap.com/search?query=%E9%A6%99%E8%95%89%E9%B1%BC%E4%B9%A6%E5%BA%97%20%E4%B8%8A%E6%B5%B7', reviewUrl: 'https://www.amap.com/search?query=%E9%A6%99%E8%95%89%E9%B1%BC%E4%B9%A6%E5%BA%97%20%E4%B8%8A%E6%B5%B7',
  },
]
