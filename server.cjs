// server.cjs - 纯前端 SPA 托管入口（无外部依赖，仅用 Node 内置模块）
'use strict'
const fs = require('fs')
const http = require('http')
const path = require('path')

const STATIC_DIR = path.resolve(__dirname, 'dist')
const INDEX_HTML = path.join(STATIC_DIR, 'index.html')
const PORT = parseInt(process.env.APP_PORT || process.env.PORT || '3000', 10)

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
}

function getMime(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  return MIME_TYPES[ext] || 'application/octet-stream'
}

const server = http.createServer(async (req, res) => {
  const pathname = (req.url || '/').split('?')[0]

  // /health endpoint（SSO 不拦截）
  if (pathname === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ ok: true, ts: Date.now() }))
    return
  }

  // SSO 检查：所有业务请求必须带 Decrypted-Userinfo header
  const ssoRaw = req.headers['decrypted-userinfo']
  if (!ssoRaw) {
    res.writeHead(401, { 'content-type': 'text/plain' })
    res.end('Unauthorized: SSO header missing')
    return
  }
  // latin-1 → utf-8 重编码（中文用户名需要）
  let ssoUser = null
  try {
    const fixed = Buffer.from(ssoRaw, 'latin1').toString('utf-8')
    ssoUser = JSON.parse(fixed)
  } catch (e) {
    res.writeHead(401, { 'content-type': 'text/plain' })
    res.end('Unauthorized: SSO header parse error')
    return
  }
  // 注：本 demo 不需要识别用户身份，ssoUser 解析后未使用

  // 尝试静态文件
  let filePath = path.join(STATIC_DIR, pathname)

  // 安全检查：不允许路径遍历
  if (!filePath.startsWith(STATIC_DIR)) {
    res.writeHead(403)
    res.end('Forbidden')
    return
  }

  // 如果文件存在且是文件（非目录），直接返回
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const mime = getMime(filePath)
    res.writeHead(200, { 'content-type': mime })
    fs.createReadStream(filePath).pipe(res)
    return
  }

  // SPA history fallback：无扩展名路径 → index.html
  const baseName = pathname.split('/').pop() || ''
  if (!baseName.includes('.')) {
    filePath = INDEX_HTML
    if (fs.existsSync(filePath)) {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
      fs.createReadStream(filePath).pipe(res)
      return
    }
  }

  // 404
  res.writeHead(404, { 'content-type': 'text/plain' })
  res.end('Not Found')
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[server] listening on http://0.0.0.0:${PORT}`)
})

process.on('SIGTERM', () => server.close(() => process.exit(0)))
process.on('SIGINT', () => server.close(() => process.exit(0)))
