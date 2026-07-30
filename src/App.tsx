import { useEffect, useState } from 'react'
import { styleOptions } from './data/bookstores'
import { searchBookstores } from './services/bookstoreService'
import type { Bookstore, BookstoreSearchParams } from './types/bookstore'

const cityOptions = ['上海', '北京', '杭州', '成都']

function PinIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z" /><circle cx="12" cy="9" r="2.4" /></svg>
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 9 7 7 7-7" /></svg>
}

function getUgcUrl(store: Bookstore) {
  if (store.ugcUrl) return store.ugcUrl
  const keyword = encodeURIComponent(`${store.name} ${store.city} 书店`)
  return `https://www.xiaohongshu.com/searchresult?keyword=${keyword}&source=web_explore_feed`
}

export default function App() {
  const [city, setCity] = useState('上海')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [results, setResults] = useState<Bookstore[]>([])
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [dataNotice, setDataNotice] = useState('')

  const loadBookstores = async (params: BookstoreSearchParams) => {
    setStatus('loading')
    setErrorMessage('')
    try {
      const response = await searchBookstores(params)
      setResults(response.data)
      setDataNotice(response.meta.fallback
        ? '高德数据暂时不可用，当前展示本地示例书店。'
        : response.meta.source === 'amap'
          ? '地点信息来自高德地图 POI 搜索。'
          : '当前展示本地示例书店。')
      setStatus('success')
    } catch (error) {
      setResults([])
      setErrorMessage(error instanceof Error ? error.message : '暂时无法加载书店数据，请稍后重试。')
      setStatus('error')
    }
  }

  useEffect(() => {
    void loadBookstores({ city: '上海' })
  }, [])

  const toggleTag = (tag: string) => {
    setSelectedTags((current) => current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag])
  }

  const handleSearch = () => {
    setHasSearched(true)
    void loadBookstores({ city, tags: selectedTags })
    document.querySelector('#results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const resetFilters = () => {
    setCity('上海')
    setSelectedTags([])
    setHasSearched(true)
    void loadBookstores({ city: '上海' })
  }

  return (
    <main>
      <section className="hero" aria-labelledby="page-title">
        <nav className="nav-shell" aria-label="主导航">
          <a className="brand" href="#top" aria-label="页间首页"><span>页</span><span>间</span></a>
          <p>城市里的阅读坐标</p>
        </nav>
        <div className="hero-content" id="top">
          <p className="eyebrow">BOOKSTORES, SLOWLY FOUND</p>
          <h1 id="page-title">去那间属于你的书店</h1>
          <p className="hero-copy">在书架之间找到愿意多停留一会儿的地方。</p>
        </div>
      </section>

      <section className="finder" aria-label="书店搜索">
        <div className="finder-inner">
          <div className="control-block city-control">
            <label htmlFor="city">你在哪座城市？</label>
            <div className="select-wrap">
              <PinIcon />
              <select id="city" value={city} onChange={(event) => setCity(event.target.value)}>
                {cityOptions.map((option) => <option key={option} value={option} />)}
              </select>
              <ArrowIcon />
            </div>
          </div>
          <fieldset className="control-block style-control">
            <legend>想找怎样的书店？</legend>
            <div className="tag-list">
              {styleOptions.map((tag) => (
                <button className={selectedTags.includes(tag) ? 'tag active' : 'tag'} type="button" key={tag} onClick={() => toggleTag(tag)} aria-pressed={selectedTags.includes(tag)}>
                  {tag}
                </button>
              ))}
            </div>
          </fieldset>
          <button className="search-button" type="button" onClick={handleSearch}>开始寻找 <span>↗</span></button>
        </div>
      </section>

      <section className="results-section" id="results" aria-live="polite">
        <div className="results-heading">
          <div>
            <p className="eyebrow">YOUR BOOKISH STOPS</p>
            <h2>{hasSearched ? '为你找到的书店' : '上海的书店选择'}</h2>
          </div>
          <p className="result-count">{status === 'loading' ? '...' : results.length} <span>家书店</span></p>
        </div>
        {dataNotice && status === 'success' && <p className="data-notice">{dataNotice}</p>}

        {status === 'loading' ? (
          <div className="feedback-state loading-state">
            <span aria-hidden="true">⌁</span>
            <h3>正在翻找书架</h3>
            <p>为你整理城市里的阅读去处。</p>
          </div>
        ) : status === 'error' ? (
          <div className="feedback-state error-state">
            <span aria-hidden="true">!</span>
            <h3>书店数据暂时无法加载</h3>
            <p>{errorMessage}</p>
            <button type="button" onClick={handleSearch}>重新尝试</button>
          </div>
        ) : results.length ? (
          <div className="bookstore-grid">
            {results.map((store, index) => (
              <article className="bookstore-card" key={store.id}>
                <div className="image-wrap">
                  <img src={store.image} alt={`${store.name} 的书店空间`} loading={index > 2 ? 'lazy' : 'eager'} />
                  <span className="card-number">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <div className="card-body">
                  <div className="card-title-row"><h3>{store.name}</h3><span className="bookmark" aria-hidden="true">♡</span></div>
                  <p className="address"><PinIcon />{store.address}</p>
                  <div className="card-tags">{store.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <p className="description">{store.description}</p>
                  <div className="card-links">
                    {store.mapUrl && <a className="map-link" href={store.mapUrl} target="_blank" rel="noreferrer">在地图中查看 <span>↗</span></a>}
                    <a className="map-link" href={getUgcUrl(store)} target="_blank" rel="noreferrer">小红书看友分享 <span>↗</span></a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="feedback-state empty-state">
            <span aria-hidden="true">⌁</span>
            <h3>暂时没有找到这样的书店</h3>
            <p>试试减少一个风格标签，或者回到上海看看已有的书店。</p>
            <button type="button" onClick={resetFilters}>清空筛选条件</button>
          </div>
        )}
      </section>
      <footer>页间 · 让每一次找书，都成为一次散步</footer>
    </main>
  )
}
