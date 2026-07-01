const STORE_KEY = 'nexojobs_app_state'
const SESSION_KEY = 'nexojobs_session'
const DB_NAME = 'nexojobs_offline_db'
const DB_VERSION = 1
const KV_STORE = 'key_value'

const memoryStore = new Map()
let dbPromise = null

function isBrowserStorageAvailable() {
  return typeof window !== 'undefined' && 'indexedDB' in window
}

function parseJson(value) {
  if (!value) return null
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

function readLegacyLocalStorage(key) {
  try {
    return parseJson(window.localStorage.getItem(key))
  } catch {
    return null
  }
}

function openDatabase() {
  if (!isBrowserStorageAvailable()) {
    return Promise.resolve(null)
  }

  if (dbPromise) return dbPromise

  dbPromise = new Promise((resolve) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(KV_STORE)) {
        db.createObjectStore(KV_STORE, { keyPath: 'key' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => resolve(null)
    request.onblocked = () => resolve(null)
  })

  return dbPromise
}

function readFromIndexedDb(key) {
  return openDatabase().then((db) => new Promise((resolve) => {
    if (!db) {
      resolve(null)
      return
    }

    const transaction = db.transaction(KV_STORE, 'readonly')
    const store = transaction.objectStore(KV_STORE)
    const request = store.get(key)

    request.onsuccess = () => resolve(request.result?.value ?? null)
    request.onerror = () => resolve(null)
  }))
}

function writeToIndexedDb(key, value) {
  return openDatabase().then((db) => new Promise((resolve) => {
    if (!db) {
      resolve(false)
      return
    }

    const transaction = db.transaction(KV_STORE, 'readwrite')
    const store = transaction.objectStore(KV_STORE)
    store.put({ key, value, updatedAt: new Date().toISOString() })
    transaction.oncomplete = () => resolve(true)
    transaction.onerror = () => resolve(false)
  }))
}

function deleteFromIndexedDb(key) {
  return openDatabase().then((db) => new Promise((resolve) => {
    if (!db) {
      resolve(false)
      return
    }

    const transaction = db.transaction(KV_STORE, 'readwrite')
    const store = transaction.objectStore(KV_STORE)
    store.delete(key)
    transaction.oncomplete = () => resolve(true)
    transaction.onerror = () => resolve(false)
  }))
}

function primeLegacyCache() {
  if (typeof window === 'undefined') return

  const legacyState = readLegacyLocalStorage(STORE_KEY)
  const legacySession = readLegacyLocalStorage(SESSION_KEY)

  if (legacyState) memoryStore.set(STORE_KEY, legacyState)
  if (legacySession) memoryStore.set(SESSION_KEY, legacySession)

  readFromIndexedDb(STORE_KEY).then((value) => {
    if (value) memoryStore.set(STORE_KEY, value)
    if (!value && legacyState) writeToIndexedDb(STORE_KEY, legacyState)
  })

  readFromIndexedDb(SESSION_KEY).then((value) => {
    if (value) memoryStore.set(SESSION_KEY, value)
    if (!value && legacySession) writeToIndexedDb(SESSION_KEY, legacySession)
  })
}

primeLegacyCache()

function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function cloneDeep(value) {
  return JSON.parse(JSON.stringify(value))
}

function getState() {
  return memoryStore.get(STORE_KEY) || null
}

function setState(nextState) {
  memoryStore.set(STORE_KEY, cloneDeep(nextState))
  writeToIndexedDb(STORE_KEY, nextState)
}

function patchState(patcher) {
  const current = getState() || {}
  const next = patcher(cloneDeep(current))
  setState(next)
  return next
}

function getSession() {
  return memoryStore.get(SESSION_KEY) || null
}

function setSession(session) {
  if (session) {
    memoryStore.set(SESSION_KEY, cloneDeep(session))
    writeToIndexedDb(SESSION_KEY, session)
  } else {
    memoryStore.delete(SESSION_KEY)
    deleteFromIndexedDb(SESSION_KEY)
  }
}

function setOfflineRecord(key, value) {
  memoryStore.set(key, cloneDeep(value))
  writeToIndexedDb(key, value)
}

function getOfflineRecord(key) {
  return memoryStore.get(key) || null
}

function ensureInitialized(seedFn) {
  const existing = getState()
  if (!existing || !existing.initialized) {
    setState({ ...seedFn(), initialized: true })
  }
}

function resetToSeed(seedFn) {
  setState({ ...seedFn(), initialized: true })
  setSession(null)
}

export const appStateStore = {
  generateId,
  cloneDeep,
  getState,
  setState,
  patchState,
  getSession,
  setSession,
  getOfflineRecord,
  setOfflineRecord,
  ensureInitialized,
  resetToSeed,
}
