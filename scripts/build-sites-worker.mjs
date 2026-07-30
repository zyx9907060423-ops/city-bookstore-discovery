import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'

const editorialSource = await readFile(new URL('../src/data/bookstoreEditorial.ts', import.meta.url), 'utf8')
const editorialRulesSource = await readFile(new URL('../src/data/bookstoreEditorialRules.ts', import.meta.url), 'utf8')
const profilePattern = /amapId: '([^']+)',\s*tags: \[([^\]]*)\],\s*description: '([^']*)',\s*sources: \[([^\]]*)\]/g
const profiles = []

for (const match of editorialSource.matchAll(profilePattern)) {
  const [, amapId, rawTags, description, rawSources] = match
  profiles.push({
    amapId,
    tags: [...rawTags.matchAll(/'([^']+)'/g)].map((entry) => entry[1]),
    description,
    sources: [...rawSources.matchAll(/'([^']+)'/g)].map((entry) => entry[1]),
  })
}

if (profiles.length === 0) throw new Error('未能读取已批准的书店编辑档案。')

const nameRulePattern = /city: '([^']+)', nameIncludes: '([^']+)', tags: \[([^\]]*)\],\s*description: '([^']*)',\s*sources: \[([^\]]*)\], confidence: '([^']+)'/g
const nameRules = []
for (const match of editorialRulesSource.matchAll(nameRulePattern)) {
  const [, city, nameIncludes, rawTags, description, rawSources, confidence] = match
  nameRules.push({
    city,
    nameIncludes,
    tags: [...rawTags.matchAll(/'([^']+)'/g)].map((entry) => entry[1]),
    description,
    sources: [...rawSources.matchAll(/'([^']+)'/g)].map((entry) => entry[1]),
    confidence,
  })
}

if (nameRules.length === 0) throw new Error('未能读取城市书店编辑规则。')

const distDirectory = new URL('../dist/', import.meta.url)
const staticAssets = {
  '/': { body: await readFile(new URL('index.html', distDirectory), 'utf8'), contentType: 'text/html; charset=utf-8' },
  '/index.html': { body: await readFile(new URL('index.html', distDirectory), 'utf8'), contentType: 'text/html; charset=utf-8' },
}
for (const fileName of await readdir(new URL('assets/', distDirectory))) {
  const contentType = fileName.endsWith('.css') ? 'text/css; charset=utf-8'
    : fileName.endsWith('.js') ? 'text/javascript; charset=utf-8'
      : 'application/octet-stream'
  staticAssets[`/assets/${fileName}`] = {
    body: await readFile(new URL(`assets/${fileName}`, distDirectory), 'utf8'),
    contentType,
  }
}

const worker = `
const editorialProfiles = ${JSON.stringify(profiles)};
const editorialNameRules = ${JSON.stringify(nameRules)};
const staticAssets = ${JSON.stringify(staticAssets)};
const editorialByAmapId = new Map(editorialProfiles.map((profile) => [profile.amapId, profile]));
const mallAddressPattern = /购物中心|商场|广场|百货|\\b(?:mall)\\b|大悦城|万象城|万达(?:广场)?|来福士|太古里|太古汇|银泰(?:城|百货)?|龙之梦|印象城|吾悦(?:广场)?|世茂(?:广场)?|缤纷城|天街|天地|奥特莱斯|奥莱/i;
const fallbackImage = 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=85';

function ruleTags(name, address, existingTags = []) {
  const tags = new Set(existingTags.filter((tag) => tag !== '书店'));
  if (name.includes('古籍') || name.includes('古旧书') || name.includes('古书')) tags.add('古籍');
  if (name.includes('教材') || name.includes('教辅') || name.includes('课本') || name.includes('人教')) tags.add('教材书');
  if (name.includes('书城')) tags.add('书城');
  if (name.includes('外文书') || name.includes('港版书') || name.includes('香港版书')) tags.add('外文书');
  if (name.includes('旧书') || name.includes('二手书')) tags.add('二手书');
  if (name.includes('儿童') || name.includes('童书') || name.includes('绘本') || name.includes('少儿')) tags.add('亲子');
  if (name.includes('咖啡')) tags.add('咖啡阅读');
  if (name.includes('艺术') || name.includes('美术') || name.includes('设计')) tags.add('艺术／设计');
  if (name.includes('影视') || name.includes('电影') || name.includes('戏剧') || name.includes('剧本')) tags.add('影视戏剧');
  if (name.includes('女性主义') || name.includes('女权')) tags.add('女性主义');
  if (name.includes('独立书店')) tags.add('独立书店');
  if (name.includes('江景') || name.includes('滨江')) tags.add('江景');
  if (name.includes('海景')) tags.add('海景');
  if (mallAddressPattern.test(address)) tags.add('商场内书店');
  return tags.size ? [...tags].slice(0, 4) : ['书店'];
}

function editorialProfileFor(poi, city) {
  return editorialByAmapId.get(poi.id)
    || editorialNameRules.find((rule) => (poi.cityname || city).includes(rule.city) && poi.name.includes(rule.nameIncludes));
}

function isBookstore(poi) {
  return typeof poi.type === 'string' && poi.type.split(';').some((item) => item.trim() === '书店');
}

function mapUrl(poi) {
  const query = new URLSearchParams({ src: 'city-bookstore', callnative: '1', poiid: poi.id, name: poi.name });
  return 'https://uri.amap.com/marker?' + query.toString();
}

function createDescription(poi, tags) {
  const area = poi.adname ? '位于' + poi.adname + '的' : '这家';
  if (tags.includes('书城')) return area + '实体书城，适合集中挑选不同门类图书。';
  if (tags.includes('古籍')) return area + '古籍书店，可从版本与旧书线索开始寻书。';
  if (tags.includes('教材书')) return area + '教材书店，适合按学习需求查找教学用书。';
  if (tags.includes('商场内书店')) return area + '商场内书店，适合在逛店时顺路挑书。';
  return area + '实体书店，可通过地图与书友分享了解近期到店信息。';
}

async function searchBookstores(url, env) {
  if (!env.AMAP_API_KEY) throw new Error('地图数据服务尚未配置。');
  const city = url.searchParams.get('city')?.trim() || '上海';
  const requestedTags = (url.searchParams.get('tags') || '').split(',').map((tag) => tag.trim()).filter(Boolean);
  const keyword = url.searchParams.get('keyword')?.trim() || '';
  const queryKeyword = [keyword, ...requestedTags, '书店'].filter(Boolean).join(' ');
  const pois = [];
  for (let page = 1; page <= 8; page += 1) {
    const query = new URLSearchParams({
      key: env.AMAP_API_KEY,
      keywords: queryKeyword,
      region: city,
      city_limit: 'true',
      show_fields: 'photos,business',
      page_size: '25',
      page_num: String(page),
    });
    const response = await fetch('https://restapi.amap.com/v5/place/text?' + query.toString());
    if (!response.ok) throw new Error('地点服务暂时不可用。');
    const payload = await response.json();
    if (payload.status !== '1') throw new Error(payload.info || '地点服务暂时不可用。');
    const pagePois = payload.pois || [];
    pois.push(...pagePois);
    if (pagePois.length < 25) break;
  }
  const uniquePois = [...new Map(pois.filter(isBookstore).map((poi) => [poi.id, poi])).values()];
  const data = uniquePois.map((poi) => {
    const profile = editorialProfileFor(poi, city);
    const address = [poi.adname, poi.address].filter(Boolean).join(' · ') || '高德未提供详细地址';
    const tags = ruleTags(poi.name, poi.address || '', profile?.tags || []);
    const link = mapUrl(poi);
    return {
      id: 'amap-' + poi.id,
      name: poi.name,
      city: poi.cityname || city,
      address,
      image: (poi.photos?.find((photo) => photo.url)?.url || fallbackImage).replace(/^http:/i, 'https:'),
      tags,
      description: [...(profile?.description || createDescription(poi, tags))].slice(0, 45).join(''),
      mapUrl: link,
      reviewUrl: link,
    };
  });
  return requestedTags.length ? data.filter((store) => requestedTags.every((tag) => store.tags.includes(tag))) : data;
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
}

function staticResponse(pathname) {
  const asset = staticAssets[pathname];
  return asset ? new Response(asset.body, { headers: { 'content-type': asset.contentType, 'cache-control': pathname.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'no-store' } }) : null;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/health') return json({ ok: true });
    if (url.pathname === '/api/bookstores') {
      try {
        const data = await searchBookstores(url, env);
        return json({ data, meta: { count: data.length, source: 'amap', fallback: false } });
      } catch (error) {
        return json({ message: error instanceof Error ? error.message : '暂时无法读取书店数据，请稍后重试。' }, 503);
      }
    }
    const asset = staticResponse(url.pathname);
    if (asset) return asset;
    if (request.headers.get('accept')?.includes('text/html')) return staticResponse('/') || new Response('Not found', { status: 404 });
    return new Response('Not found', { status: 404 });
  },
};
`

const outputDirectory = new URL('../dist/server/', import.meta.url)
await mkdir(outputDirectory, { recursive: true })
await writeFile(new URL('index.js', outputDirectory), worker)
console.log(`Generated Sites worker with ${profiles.length} approved editorial profiles.`)
