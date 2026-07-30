import 'dotenv/config'
import { createServer as createViteServer } from 'vite'
import { createApp } from './app.js'

const port = Number(process.env.PORT || process.env.BOOKSTORE_PORT || 5173)
const app = createApp()
const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' })

app.use(vite.middlewares)
app.listen(port, '0.0.0.0', () => {
  console.log(`\n  Local:   http://localhost:${port}/`)
  console.log(`  Network: use your computer's LAN IP with port ${port}\n`)
})
