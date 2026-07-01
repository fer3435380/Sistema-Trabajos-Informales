import { API_BASE_URL, getAccessToken } from './apiClient'

const DEFAULT_RECONNECT_DELAYS = [1000, 2000, 5000, 10000]

function buildDefaultWsUrl() {
  const apiUrl = new URL(API_BASE_URL, window.location.origin)
  apiUrl.protocol = apiUrl.protocol === 'https:' ? 'wss:' : 'ws:'
  apiUrl.pathname = apiUrl.pathname.replace(/\/api\/v1\/?$/, '/ws/notifications/')
  apiUrl.search = ''
  apiUrl.hash = ''
  return apiUrl.toString()
}

export const WS_URL = import.meta.env.VITE_WS_URL || buildDefaultWsUrl()

function formatNotificationTitle(type = '') {
  return type
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ') || 'Notificacion'
}

function formatTimeLabel(createdAt) {
  if (!createdAt) return 'Ahora'

  const createdDate = new Date(createdAt)
  if (Number.isNaN(createdDate.getTime())) return 'Ahora'

  const minutes = Math.floor((Date.now() - createdDate.getTime()) / 60000)
  if (minutes < 1) return 'Ahora'
  if (minutes < 60) return `Hace ${minutes} min`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Hace ${hours} h`

  return createdAt.slice(0, 10)
}

export function adaptRealtimeNotification(notification = {}) {
  return {
    id: `api-notification-${notification.id}`,
    apiNotificationId: notification.id,
    title: formatNotificationTitle(notification.type),
    description: notification.message || 'Tienes una nueva notificacion.',
    timeLabel: formatTimeLabel(notification.created_at),
    category: notification.type || 'Backend',
    isUnread: !notification.is_read,
    extraData: notification.extra_data || {},
  }
}

export function upsertNotification(notifications, nextNotification) {
  if (!nextNotification?.id) return notifications

  return [
    nextNotification,
    ...notifications.filter((notification) => notification.id !== nextNotification.id),
  ].slice(0, 20)
}

export function connectNotificationSocket({
  token = getAccessToken(),
  onNotification,
  onStatusChange,
  reconnectDelays = DEFAULT_RECONNECT_DELAYS,
} = {}) {
  if (!token || typeof WebSocket === 'undefined') {
    return { close() {} }
  }

  let socket = null
  let closedByClient = false
  let reconnectAttempt = 0
  let reconnectTimeoutId = null

  function emitStatus(status) {
    if (onStatusChange) onStatusChange(status)
  }

  function scheduleReconnect() {
    if (closedByClient) return

    const delay = reconnectDelays[Math.min(reconnectAttempt, reconnectDelays.length - 1)]
    reconnectAttempt += 1
    emitStatus('reconnecting')
    reconnectTimeoutId = window.setTimeout(openSocket, delay)
  }

  function handleMessage(event) {
    let payload
    try {
      payload = JSON.parse(event.data)
    } catch {
      return
    }

    if (payload.type === 'connected') {
      emitStatus('connected')
      return
    }

    if (payload.type === 'notification.created' && payload.notification) {
      onNotification?.(adaptRealtimeNotification(payload.notification), payload)
      return
    }

    if (payload.notification) {
      onNotification?.(adaptRealtimeNotification(payload.notification), payload)
    }
  }

  function openSocket() {
    socket = new WebSocket(WS_URL, ['bearer', token])
    emitStatus('connecting')

    socket.addEventListener('open', () => {
      reconnectAttempt = 0
      emitStatus('connected')
    })

    socket.addEventListener('message', handleMessage)
    socket.addEventListener('close', scheduleReconnect)
    socket.addEventListener('error', () => {
      emitStatus('error')
    })
  }

  openSocket()

  return {
    close() {
      closedByClient = true
      if (reconnectTimeoutId) {
        window.clearTimeout(reconnectTimeoutId)
      }
      if (socket && socket.readyState !== WebSocket.CLOSED) {
        socket.close()
      }
    },
  }
}
