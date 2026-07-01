import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve, sep } from 'node:path'

const host = process.env.SPA_HOST || '127.0.0.1'
const port = Number(process.env.SPA_PORT || 5173)
const root = resolve(process.argv[2] || 'dist')

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
}

function filePathForUrl(url) {
  const parsedUrl = new URL(url, `http://${host}:${port}`)
  const pathname = decodeURIComponent(parsedUrl.pathname)
  const normalizedPath = normalize(pathname).replace(/^[/\\]+/, '')
  const candidate = resolve(join(root, normalizedPath))

  if (!candidate.startsWith(`${root}${sep}`) && candidate !== root) {
    return join(root, 'index.html')
  }

  if (existsSync(candidate) && statSync(candidate).isFile()) {
    return candidate
  }

  return join(root, 'index.html')
}

createServer((request, response) => {
  const filePath = filePathForUrl(request.url || '/')
  const extension = extname(filePath)
  response.setHeader('Content-Type', contentTypes[extension] || 'application/octet-stream')

  if (filePath.endsWith('sw.js')) {
    response.setHeader('Cache-Control', 'no-cache')
  }

  createReadStream(filePath)
    .on('error', () => {
      response.writeHead(404)
      response.end('Not found')
    })
    .pipe(response)
}).listen(port, host, () => {
  console.log(`Serving ${root} on http://${host}:${port}`)
})
