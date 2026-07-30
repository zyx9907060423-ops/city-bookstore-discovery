import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { createApp } from './app.js'

const port = Number(process.env.PORT || process.env.BOOKSTORE_PORT || 5173)
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const app = createApp()

app.use(express.static(path.join(projectRoot, 'dist')))
app.use((_request, response) => response.sendFile(path.join(projectRoot, 'dist', 'index.html')))
app.listen(port, '0.0.0.0', () => console.log(`Listening on http://localhost:${port}`))
