import { appStateStore } from './appStateStore'

const DEFAULT_API_BASE_URL = 'http://localhost:8080/api/v1'

function normalizeBaseUrl(url) {
  return (url || DEFAULT_API_BASE_URL).replace(/\/$/, '')
}

export const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL)

export class ApiError extends Error {
  constructor(message, { status = 0, data = null } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

export function getAccessToken() {
  return appStateStore.getSession()?.accessToken ?? null
}

export function isApiEnabled() {
  return Boolean(API_BASE_URL)
}

export async function apiRequest(path, { method = 'GET', body, token = getAccessToken(), headers = {} } = {}) {
  const requestHeaders = {
    Accept: 'application/json',
    ...headers,
  }

  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json'
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`
  }

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch (error) {
    throw new ApiError('No se pudo conectar con el backend.', { data: error })
  }

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    const message = typeof data === 'object' ? data.detail || Object.values(data).flat().join(' ') : data
    throw new ApiError(message || 'La peticion al backend fallo.', { status: response.status, data })
  }

  return data
}

export function normalizeBackendRole(role) {
  return role === 'owner' ? 'company' : role
}

export function toBackendRole(role) {
  return role === 'company' ? 'owner' : role
}
