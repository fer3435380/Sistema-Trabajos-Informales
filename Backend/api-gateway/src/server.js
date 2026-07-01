import crypto from 'node:crypto'
import http from 'node:http'
import { URL } from 'node:url'

const PORT = Number(process.env.PORT || 8080)
const BACKEND_SERVICE_URL = process.env.BACKEND_SERVICE_URL || process.env.PYTHON_API_BASE_URL?.replace(/\/api\/v1\/?$/, '') || 'http://backend-python:8000'
const NOTIFIER_SERVICE_URL = process.env.NOTIFIER_SERVICE_URL || 'http://notifier:8001'
const COURSES_SERVICE_URL = process.env.COURSES_SERVICE_URL || BACKEND_SERVICE_URL
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const JWT_ALGORITHM = process.env.JWT_ALGORITHM || 'HS256'
const KEYCLOAK_ISSUER_URL = process.env.KEYCLOAK_ISSUER_URL || ''
const KEYCLOAK_JWKS_URL = process.env.KEYCLOAK_JWKS_URL || (KEYCLOAK_ISSUER_URL ? `${KEYCLOAK_ISSUER_URL}/protocol/openid-connect/certs` : '')
const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID || 'nexojobs-front'
const CORS_ALLOWED_ORIGINS = (process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

const PUBLIC_ROUTES = [
  { method: 'GET', pattern: /^\/api\/v1\/health\/?$/ },
  { method: 'POST', pattern: /^\/api\/v1\/auth\/login\/?$/ },
  { method: 'POST', pattern: /^\/api\/v1\/auth\/register\/?$/ },
  { method: 'GET', pattern: /^\/api\/v1\/users\/stats\/?$/ },
  { method: 'GET', pattern: /^\/api\/v1\/jobs\/?$/ },
  { method: 'GET', pattern: /^\/api\/v1\/jobs\/\d+\/?$/ },
]

let jwksCache = { fetchedAt: 0, keys: [] }

function log(level, message, meta = {}) {
  const entry = { level, message, timestamp: new Date().toISOString(), ...meta }
  console.log(JSON.stringify(entry))
}

function base64UrlDecode(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  return Buffer.from(padded, 'base64')
}

function base64UrlEncode(buffer) {
  return Buffer.from(buffer).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function parseJsonSegment(segment) {
  return JSON.parse(base64UrlDecode(segment).toString('utf8'))
}

function extractRole(payload) {
  const roles = new Set([
    payload.role,
    ...(payload.realm_access?.roles || []),
    ...(payload.resource_access?.[KEYCLOAK_CLIENT_ID]?.roles || []),
  ].filter(Boolean))

  if (roles.has('admin')) return 'admin'
  if (roles.has('owner')) return 'owner'
  if (roles.has('worker')) return 'worker'
  return null
}

function normalizeUserPayload(payload) {
  const role = extractRole(payload)
  return {
    ...payload,
    role,
    email: payload.email || payload.preferred_username || payload.sub,
    name: payload.name || payload.preferred_username || payload.email || payload.sub,
  }
}

function verifyLegacyJwt(token) {
  if (!JWT_SECRET_KEY) {
    throw new Error('JWT_SECRET_KEY no configurado en api-gateway.')
  }

  const parts = token.split('.')
  if (parts.length !== 3) {
    throw new Error('JWT mal formado.')
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts
  const header = parseJsonSegment(encodedHeader)
  const payload = parseJsonSegment(encodedPayload)

  if (header.alg !== JWT_ALGORITHM || JWT_ALGORITHM !== 'HS256') {
    throw new Error('Algoritmo JWT no soportado.')
  }

  const expectedSignature = base64UrlEncode(
    crypto.createHmac('sha256', JWT_SECRET_KEY).update(`${encodedHeader}.${encodedPayload}`).digest()
  )

  const expected = Buffer.from(expectedSignature)
  const provided = Buffer.from(encodedSignature)
  if (expected.length !== provided.length || !crypto.timingSafeEqual(expected, provided)) {
    throw new Error('Firma JWT invalida.')
  }

  const now = Math.floor(Date.now() / 1000)
  if (payload.exp && payload.exp < now) {
    throw new Error('Token expirado.')
  }

  return normalizeUserPayload(payload)
}

async function getJwksKeys() {
  if (!KEYCLOAK_JWKS_URL) {
    throw new Error('KEYCLOAK_JWKS_URL no configurado.')
  }

  const maxAgeMs = 5 * 60 * 1000
  if (jwksCache.keys.length > 0 && Date.now() - jwksCache.fetchedAt < maxAgeMs) {
    return jwksCache.keys
  }

  const response = await fetch(KEYCLOAK_JWKS_URL)
  if (!response.ok) {
    throw new Error('No se pudo obtener JWKS de Keycloak.')
  }

  const jwks = await response.json()
  jwksCache = { fetchedAt: Date.now(), keys: jwks.keys || [] }
  return jwksCache.keys
}

async function verifyKeycloakJwt(token, header, payload, encodedHeader, encodedPayload, encodedSignature) {
  if (KEYCLOAK_ISSUER_URL && payload.iss !== KEYCLOAK_ISSUER_URL) {
    throw new Error('Issuer JWT invalido.')
  }

  if (KEYCLOAK_CLIENT_ID && payload.azp && payload.azp !== KEYCLOAK_CLIENT_ID) {
    throw new Error('Cliente JWT invalido.')
  }

  const keys = await getJwksKeys()
  const jwk = keys.find((key) => key.kid === header.kid)
  if (!jwk) {
    jwksCache = { fetchedAt: 0, keys: [] }
    throw new Error('Llave JWT no encontrada.')
  }

  const verifier = crypto.createVerify('RSA-SHA256')
  verifier.update(`${encodedHeader}.${encodedPayload}`)
  verifier.end()
  const publicKey = crypto.createPublicKey({ key: jwk, format: 'jwk' })
  const valid = verifier.verify(publicKey, base64UrlDecode(encodedSignature))
  if (!valid) {
    throw new Error('Firma JWT invalida.')
  }

  const now = Math.floor(Date.now() / 1000)
  if (payload.exp && payload.exp < now) {
    throw new Error('Token expirado.')
  }

  const normalizedPayload = normalizeUserPayload(payload)
  if (!normalizedPayload.role) {
    throw new Error('Token sin rol valido.')
  }
  return normalizedPayload
}

async function verifyJwt(token) {
  const parts = token.split('.')
  if (parts.length !== 3) {
    throw new Error('JWT mal formado.')
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts
  const header = parseJsonSegment(encodedHeader)
  const payload = parseJsonSegment(encodedPayload)

  if (header.alg === 'HS256') {
    return verifyLegacyJwt(token)
  }

  if (header.alg === 'RS256') {
    return verifyKeycloakJwt(token, header, payload, encodedHeader, encodedPayload, encodedSignature)
  }

  throw new Error('Algoritmo JWT no soportado.')
}

function getBearerToken(request) {
  const header = request.headers.authorization || ''
  const match = header.match(/^Bearer\s+(.+)$/i)
  if (match) return match[1]

  const requestUrl = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`)
  const queryToken = requestUrl.searchParams.get('token')
  if (queryToken) return queryToken

  const protocolHeader = request.headers['sec-websocket-protocol'] || ''
  const protocols = protocolHeader
    .split(',')
    .map((protocol) => protocol.trim())
    .filter(Boolean)
  const bearerIndex = protocols.findIndex((protocol) => protocol.toLowerCase() === 'bearer')
  if (bearerIndex >= 0 && protocols[bearerIndex + 1]) {
    return protocols[bearerIndex + 1]
  }

  return null
}

function isPublicRoute(method, pathname) {
  return PUBLIC_ROUTES.some((route) => route.method === method && route.pattern.test(pathname))
}

function getCorsOrigin(origin) {
  if (!origin) return null
  if (CORS_ALLOWED_ORIGINS.includes('*') || CORS_ALLOWED_ORIGINS.includes(origin)) {
    return origin
  }
  return null
}

function setCorsHeaders(request, response) {
  const allowedOrigin = getCorsOrigin(request.headers.origin)
  if (allowedOrigin) {
    response.setHeader('Access-Control-Allow-Origin', allowedOrigin)
    response.setHeader('Vary', 'Origin')
  }
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  response.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type,X-Requested-With')
  response.setHeader('Access-Control-Expose-Headers', 'Content-Type')
}

function sendJson(request, response, statusCode, payload) {
  setCorsHeaders(request, response)
  response.writeHead(statusCode, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(payload))
}

function resolveTargetUrl(pathname) {
  if (pathname.startsWith('/ws/notifications/')) {
    return NOTIFIER_SERVICE_URL
  }
  if (pathname === '/api/v1/courses' || pathname.startsWith('/api/v1/courses/')) {
    return COURSES_SERVICE_URL
  }
  if (
    pathname === '/api/v1/health' ||
    pathname.startsWith('/api/v1/auth/') ||
    pathname.startsWith('/api/v1/users/') ||
    pathname === '/api/v1/jobs' ||
    pathname.startsWith('/api/v1/jobs/') ||
    pathname === '/api/v1/applications' ||
    pathname.startsWith('/api/v1/applications/') ||
    pathname === '/api/v1/notifications' ||
    pathname.startsWith('/api/v1/notifications/') ||
    pathname === '/api/v1/worker/dashboard' ||
    pathname.startsWith('/api/v1/worker/dashboard/') ||
    pathname === '/api/v1/company/dashboard' ||
    pathname.startsWith('/api/v1/company/dashboard/') ||
    pathname.startsWith('/api/v1/health/')
  ) {
    return BACKEND_SERVICE_URL
  }
  return null
}

function createInternalJwt(userPayload) {
  if (!JWT_SECRET_KEY || !userPayload) return null
  const now = Math.floor(Date.now() / 1000)
  const encodedHeader = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const encodedPayload = base64UrlEncode(
    JSON.stringify({
      sub: userPayload.email || userPayload.sub,
      email: userPayload.email || null,
      role: userPayload.role,
      jti: crypto.randomUUID(),
      iat: now,
      exp: now + 60 * 60,
    })
  )
  const signature = base64UrlEncode(crypto.createHmac('sha256', JWT_SECRET_KEY).update(`${encodedHeader}.${encodedPayload}`).digest())
  return `${encodedHeader}.${encodedPayload}.${signature}`
}

function buildProxyHeaders(request, userPayload, { internalAuth = false } = {}) {
  const headers = { ...request.headers }
  delete headers.host
  delete headers.connection

  if (userPayload) {
    headers['x-user-id'] = String(userPayload.sub)
    headers['x-user-role'] = String(userPayload.role || '')
    headers['x-user-email'] = String(userPayload.email || '')
  }

  if (internalAuth && userPayload) {
    const internalToken = createInternalJwt(userPayload)
    if (internalToken) {
      headers.authorization = `Bearer ${internalToken}`
    }
  }

  return headers
}

function replaceWebSocketToken(request, target, internalToken) {
  if (!internalToken) return request.headers['sec-websocket-protocol']

  const protocolHeader = request.headers['sec-websocket-protocol'] || ''
  const protocols = protocolHeader
    .split(',')
    .map((protocol) => protocol.trim())
    .filter(Boolean)

  const bearerIndex = protocols.findIndex((protocol) => protocol.toLowerCase() === 'bearer')
  if (bearerIndex >= 0) {
    protocols[bearerIndex + 1] = internalToken
    return protocols.join(', ')
  }

  if (target.searchParams.has('token')) {
    target.searchParams.set('token', internalToken)
    return protocolHeader || undefined
  }

  target.searchParams.set('token', internalToken)
  return protocolHeader || undefined
}

function proxyHttpRequest(request, response, targetBaseUrl, userPayload) {
  const target = new URL(request.url, targetBaseUrl)
  const startedAt = Date.now()
  const internalAuth = targetBaseUrl === BACKEND_SERVICE_URL

  const proxyRequest = http.request(
    target,
    {
      method: request.method,
      headers: buildProxyHeaders(request, userPayload, { internalAuth }),
    },
    (proxyResponse) => {
      setCorsHeaders(request, response)
      response.writeHead(proxyResponse.statusCode || 502, proxyResponse.headers)
      proxyResponse.pipe(response)
      proxyResponse.on('end', () => {
        log('info', 'request proxied', {
          method: request.method,
          path: request.url,
          target: target.origin,
          status: proxyResponse.statusCode,
          duration_ms: Date.now() - startedAt,
          user_id: userPayload?.sub || null,
          user_role: userPayload?.role || null,
        })
      })
    }
  )

  proxyRequest.on('error', (error) => {
    log('error', 'proxy request failed', { path: request.url, target: target.origin, error: error.message })
    sendJson(request, response, 502, { detail: 'No se pudo contactar al servicio interno.' })
  })

  request.pipe(proxyRequest)
}

async function authenticateRequest(request, pathname) {
  if (isPublicRoute(request.method || 'GET', pathname)) {
    return null
  }

  const token = getBearerToken(request)
  if (!token) {
    throw new Error('Falta token Bearer.')
  }

  return verifyJwt(token)
}

const server = http.createServer(async (request, response) => {
  setCorsHeaders(request, response)

  if (request.method === 'OPTIONS') {
    response.writeHead(204)
    response.end()
    return
  }

  const requestUrl = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`)
  const targetBaseUrl = resolveTargetUrl(requestUrl.pathname)

  if (!targetBaseUrl) {
    sendJson(request, response, 404, { detail: 'Ruta no gestionada por api-gateway.' })
    return
  }

  let userPayload = null
  try {
    userPayload = await authenticateRequest(request, requestUrl.pathname)
  } catch (error) {
    log('warn', 'request rejected by gateway auth', { path: request.url, error: error.message })
    sendJson(request, response, 401, { detail: error.message })
    return
  }

  proxyHttpRequest(request, response, targetBaseUrl, userPayload)
})

server.on('upgrade', async (request, socket, head) => {
  const requestUrl = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`)
  if (!requestUrl.pathname.startsWith('/ws/notifications/')) {
    socket.destroy()
    return
  }

  let userPayload
  try {
    userPayload = await authenticateRequest(request, requestUrl.pathname)
  } catch (error) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
    socket.destroy()
    log('warn', 'websocket rejected by gateway auth', { path: request.url, error: error.message })
    return
  }

  const target = new URL(request.url || '/', NOTIFIER_SERVICE_URL)
  const internalToken = createInternalJwt(userPayload)
  const upgradeHeaders = {
    ...buildProxyHeaders(request, userPayload, { internalAuth: true }),
    connection: 'Upgrade',
    upgrade: 'websocket',
  }
  const websocketProtocol = replaceWebSocketToken(request, target, internalToken)
  if (websocketProtocol) {
    upgradeHeaders['sec-websocket-protocol'] = websocketProtocol
  } else {
    delete upgradeHeaders['sec-websocket-protocol']
  }
  const proxySocketRequest = http.request({
    host: target.hostname,
    port: target.port || 80,
    path: `${target.pathname}${target.search}`,
    method: 'GET',
    headers: upgradeHeaders,
  })

  proxySocketRequest.on('upgrade', (proxyResponse, proxySocket, proxyHead) => {
    socket.write(
      `HTTP/1.1 ${proxyResponse.statusCode} ${proxyResponse.statusMessage}\r\n` +
        Object.entries(proxyResponse.headers)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\r\n') +
        '\r\n\r\n'
    )
    if (proxyHead.length) socket.write(proxyHead)
    if (head.length) proxySocket.write(head)
    proxySocket.pipe(socket)
    socket.pipe(proxySocket)
  })

  proxySocketRequest.on('error', (error) => {
    log('error', 'websocket proxy failed', { path: request.url, error: error.message })
    socket.destroy()
  })

  proxySocketRequest.end()
})

server.listen(PORT, () => {
  log('info', 'api-gateway started', {
    port: PORT,
    backend_service_url: BACKEND_SERVICE_URL,
    notifier_service_url: NOTIFIER_SERVICE_URL,
    courses_service_url: COURSES_SERVICE_URL,
  })
})
