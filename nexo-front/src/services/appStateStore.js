const STORE_KEY = 'nexojobs_app_state'
const SESSION_KEY = 'nexojobs_session'

function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function cloneDeep(value) {
  return JSON.parse(JSON.stringify(value))
}

function getState() {
  try {
    const raw = window.localStorage.getItem(STORE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function setState(nextState) {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(nextState))
  } catch {
    /* storage unavailable or full */
  }
}

function patchState(patcher) {
  const current = getState() || {}
  const next = patcher(cloneDeep(current))
  setState(next)
  return next
}

function getSession() {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function setSession(session) {
  if (session) {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } else {
    window.localStorage.removeItem(SESSION_KEY)
  }
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
  ensureInitialized,
  resetToSeed,
}
