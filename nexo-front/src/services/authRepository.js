import { appStateStore } from './appStateStore'
import { apiRequest, normalizeBackendRole, toBackendRole } from './apiClient'
import { createSeedState } from '../data/seedAppState'
import { defaultCompanyProfile } from '../data/mockCompanyData'
import companyBadgeIcon from '../assets/landing/marca-de-verificacion-empresa.png'
import mariaProfileImage from '../assets/landing/maria-profile.png'

const OAUTH_AUTHORITY = (import.meta.env.VITE_OAUTH_AUTHORITY || 'http://localhost:8081/realms/nexojobs').replace(/\/$/, '')
const OAUTH_CLIENT_ID = import.meta.env.VITE_OAUTH_CLIENT_ID || 'nexojobs-front'
const OAUTH_REDIRECT_PATH = import.meta.env.VITE_OAUTH_REDIRECT_PATH || '/auth/callback'
const OAUTH_STATE_KEY = 'nexojobs_oauth_state'
const OAUTH_VERIFIER_KEY = 'nexojobs_oauth_code_verifier'
const OAUTH_RETURN_TO_KEY = 'nexojobs_oauth_return_to'

function ensureStore() {
  appStateStore.ensureInitialized(createSeedState)
}

function normalizeEmail(email = '') {
  return email.trim().toLowerCase()
}

function base64UrlEncode(value) {
  const bytes = value instanceof Uint8Array ? value : new Uint8Array(value)
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return window.btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function randomBase64Url(byteLength = 32) {
  const bytes = new Uint8Array(byteLength)
  window.crypto.getRandomValues(bytes)
  return base64UrlEncode(bytes)
}

async function sha256Base64Url(value) {
  const digest = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return base64UrlEncode(digest)
}

function getOAuthRedirectUri() {
  return `${window.location.origin}${OAUTH_REDIRECT_PATH}`
}

function decodeJwtPayload(token) {
  const payload = token.split('.')[1]
  if (!payload) return {}
  const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  return JSON.parse(window.atob(padded))
}

function extractOAuthRole(payload = {}) {
  const roles = new Set([
    payload.role,
    ...(payload.realm_access?.roles || []),
    ...(payload.resource_access?.[OAUTH_CLIENT_ID]?.roles || []),
  ].filter(Boolean))

  if (roles.has('admin')) return 'admin'
  if (roles.has('owner')) return 'company'
  if (roles.has('worker')) return 'worker'
  return 'worker'
}

function toWorkMode(businessModel) {
  if (businessModel === 'Economía local') return 'local_economy'
  if (businessModel === 'Frente empresarial') return 'enterprise_front'
  return 'both'
}

export function emailExists(email) {
  ensureStore()
  const state = appStateStore.getState()
  const target = normalizeEmail(email)
  return (state.users || []).some((user) => normalizeEmail(user.email) === target)
}

// Build a company profile object (dashboard-ready) from the registration payload.
function buildCompanyProfile(registration, profileId) {
  const company = registration.company || {}
  const responsible = registration.responsiblePerson || {}
  const operation = registration.operation || {}
  const billing = registration.billing || {}
  const preferences = registration.preferences || {}
  const workMode = toWorkMode(company.businessModel)
  const isLocalMode = workMode === 'local_economy'

  return {
    id: profileId,
    ownerUserId: null,
    companyName: company.companyName || defaultCompanyProfile.companyName,
    commercialName: company.companyName || defaultCompanyProfile.commercialName,
    profileImageSrc: companyBadgeIcon,
    profileImageAlt: `Imagen de perfil de ${company.companyName || 'la empresa'}`,
    workMode,
    identification: company.companyId || defaultCompanyProfile.identification,
    accountEmail: company.corporateEmail || defaultCompanyProfile.accountEmail,
    city: company.city || defaultCompanyProfile.city,
    address: company.address || defaultCompanyProfile.address,
    responsibleName: responsible.contactName || defaultCompanyProfile.responsibleName,
    responsibleEmail: responsible.contactEmail || defaultCompanyProfile.responsibleEmail,
    responsibleRole: responsible.responsibleRole || defaultCompanyProfile.responsibleRole,
    responsiblePhone: responsible.contactPhone || defaultCompanyProfile.responsiblePhone,
    operationTaskTypes: operation.taskTypes?.length ? operation.taskTypes : defaultCompanyProfile.operationTaskTypes,
    operationScale: operation.operationScale?.[0] || defaultCompanyProfile.operationScale,
    operationModalities: operation.operationModalities?.length
      ? operation.operationModalities
      : defaultCompanyProfile.operationModalities,
    billingName: billing.billingName || (isLocalMode ? company.companyName : defaultCompanyProfile.billingName),
    billingIdentification: billing.billingId || defaultCompanyProfile.billingIdentification,
    billingEmail: billing.billingEmail || defaultCompanyProfile.billingEmail,
    billingAddress: billing.billingAddress || defaultCompanyProfile.billingAddress,
    preferredPaymentMethod: billing.billingPaymentMethod || defaultCompanyProfile.preferredPaymentMethod,
    mainObjective: preferences.primaryObjectives?.[0] || defaultCompanyProfile.mainObjective,
    estimatedFrequency: preferences.estimatedFrequencies?.[0] || defaultCompanyProfile.estimatedFrequency,
    tagline: 'Cuenta lista para publicar microtrabajos, cursos y campañas.',
  }
}

// Build a worker profile (dashboard + applicant fields) from the registration payload.
function buildWorkerProfile(registration, profileId) {
  const personal = registration.personalData || {}
  const education = registration.education || {}
  const work = registration.work || {}
  const preferences = registration.preferences || {}
  const fullName = personal.fullName || 'Nuevo trabajador'
  const firstName = fullName.split(' ')[0]
  const initials = fullName
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')

  const availabilityLabel = work.availability?.length
    ? work.availability.join(' · ')
    : 'Disponibilidad por confirmar'

  return {
    id: profileId,
    name: fullName,
    firstName,
    initials: initials || 'NT',
    city: personal.city || 'Cuenca',
    neighborhood: personal.zone || 'Sin definir',
    email: personal.email || '',
    phone: personal.phone || '',
    availability: availabilityLabel,
    profileImageSrc: mariaProfileImage,
    profileImageAlt: `Foto de perfil de ${firstName}`,
    imageSrc: mariaProfileImage,
    tagline: 'Perfil nuevo listo para postular a microtrabajos.',
    unreadNotifications: 0,
    profileCompleted: '70%',
    distanceKm: 2,
    education: education.educationLevel
      ? `${education.educationLevel}${education.institution ? ` · ${education.institution}` : ''}`
      : 'Formación por registrar.',
    experience: work.previousExperience
      ? `Experiencia: ${work.previousExperience}.${work.experienceAreas?.length ? ` Áreas: ${work.experienceAreas.join(', ')}.` : ''}`
      : 'Experiencia por registrar.',
    completedCourses: [],
    relatedCourses: preferences.interests?.slice(0, 2) || [],
    mainData: [
      personal.city || 'Cuenca',
      availabilityLabel,
      personal.phone ? 'Contacto activo' : 'Contacto pendiente',
    ],
    shortHistory: 'Perfil recién creado en NexoJobs.',
    profileStatus: {
      personalData: { label: 'Datos personales', status: 'Completo', helperText: 'Tu identificación y contacto están al día.', progress: 100 },
      education: { label: 'Educación', status: education.educationLevel ? 'Completo' : 'Pendiente', helperText: 'Tu nivel formativo ya está registrado.', progress: education.educationLevel ? 100 : 40 },
      work: { label: 'Trabajo', status: work.previousExperience ? 'Completo' : 'Pendiente', helperText: 'Agrega experiencias para mejorar coincidencias.', progress: work.previousExperience ? 100 : 45 },
      finance: { label: 'Finanzas', status: registration.finance?.paymentMethod ? 'Completo' : 'Revisar', helperText: 'Confirma tu método de cobro.', progress: registration.finance?.paymentMethod ? 100 : 60 },
      preferences: { label: 'Preferencias', status: preferences.interests?.length ? 'Completo' : 'Pendiente', helperText: 'Tus intereses ayudan a mostrar mejores coincidencias.', progress: preferences.interests?.length ? 100 : 50 },
      completionPercentage: 78,
    },
  }
}

function persistBackendSession(authResponse) {
  const role = normalizeBackendRole(authResponse.user.role)
  appStateStore.setSession({
    userId: `api-user-${authResponse.user.id}`,
    role,
    profileId: role === 'company' ? 'company-001' : 'worker-001',
    email: authResponse.user.email,
    accessToken: authResponse.access_token,
    tokenType: authResponse.token_type,
    backendUserId: authResponse.user.id,
  })
  return { success: true, role }
}

function persistOAuthSession(tokenResponse) {
  const payload = decodeJwtPayload(tokenResponse.access_token)
  const role = extractOAuthRole(payload)
  const email = payload.email || payload.preferred_username || ''

  appStateStore.setSession({
    userId: `oauth-user-${payload.sub}`,
    role,
    profileId: role === 'company' ? 'company-001' : 'worker-001',
    email,
    accessToken: tokenResponse.access_token,
    idToken: tokenResponse.id_token,
    refreshToken: tokenResponse.refresh_token,
    tokenType: tokenResponse.token_type || 'Bearer',
    expiresAt: Date.now() + Number(tokenResponse.expires_in || 0) * 1000,
    backendUserId: null,
    authProvider: 'keycloak',
  })

  return { success: true, role }
}

function registerWorkerLocal(registration) {
  ensureStore()
  const email = registration.personalData?.email
  if (emailExists(email)) {
    return { success: false, message: 'Ya existe una cuenta con este correo.' }
  }

  const userId = appStateStore.generateId('user-worker')
  const profileId = appStateStore.generateId('worker')
  const profile = buildWorkerProfile(registration, profileId)
  const user = {
    id: userId,
    role: 'worker',
    email: (email || '').trim(),
    password: registration.password || null,
    authProvider: registration.authProvider || 'manual',
    name: profile.name,
    profileId,
  }

  appStateStore.patchState((state) => {
    state.users = [...(state.users || []), user]
    state.workerProfiles = [...(state.workerProfiles || []), profile]
    return state
  })

  return { success: true, user: { id: userId, role: 'worker', email: user.email } }
}

function registerCompanyLocal(registration) {
  ensureStore()
  const email = registration.company?.corporateEmail
  if (emailExists(email)) {
    return { success: false, message: 'Ya existe una cuenta con este correo.' }
  }

  const userId = appStateStore.generateId('user-company')
  const profileId = appStateStore.generateId('company')
  const profile = { ...buildCompanyProfile(registration, profileId), ownerUserId: userId }
  const user = {
    id: userId,
    role: 'company',
    email: (email || '').trim(),
    password: registration.password || null,
    authProvider: registration.authProvider || 'manual',
    name: profile.commercialName,
    profileId,
  }

  appStateStore.patchState((state) => {
    state.users = [...(state.users || []), user]
    state.companyProfiles = [...(state.companyProfiles || []), profile]
    return state
  })

  return { success: true, user: { id: userId, role: 'company', email: user.email } }
}

function loginLocal(email, password, { allowGoogleMock = false } = {}) {
  ensureStore()
  const state = appStateStore.getState()
  const target = normalizeEmail(email)
  const user = (state.users || []).find((item) => normalizeEmail(item.email) === target)

  if (!user) {
    return { success: false, message: 'No encontramos una cuenta con este correo.' }
  }

  const isGoogleAccount = user.authProvider === 'google_mock'
  if (!isGoogleAccount && !allowGoogleMock) {
    if (!user.password || user.password !== password) {
      return { success: false, message: 'La contraseña no es correcta.' }
    }
  }

  appStateStore.setSession({ userId: user.id, role: user.role, profileId: user.profileId, email: user.email })
  return { success: true, role: user.role }
}

export async function registerWorker(registration) {
  const localResult = registerWorkerLocal(registration)
  if (!localResult.success) return localResult

  if (registration.authProvider === 'google_mock' || !registration.password) {
    return localResult
  }

  try {
    await apiRequest('/auth/register/', {
      method: 'POST',
      body: {
        name: registration.personalData?.fullName || 'Trabajador Nexo',
        email: registration.personalData?.email,
        password: registration.password,
        role: toBackendRole('worker'),
      },
    })
  } catch {
    // The local registration remains valid so the frontend keeps working offline/demo.
  }

  return localResult
}

export async function registerCompany(registration) {
  const localResult = registerCompanyLocal(registration)
  if (!localResult.success) return localResult

  if (registration.authProvider === 'google_mock' || !registration.password) {
    return localResult
  }

  try {
    await apiRequest('/auth/register/', {
      method: 'POST',
      body: {
        name: registration.company?.companyName || 'Empresa Nexo',
        email: registration.company?.corporateEmail,
        password: registration.password,
        role: toBackendRole('company'),
      },
    })
  } catch {
    // The local registration remains valid so the frontend keeps working offline/demo.
  }

  return localResult
}

export async function login(email, password, { allowGoogleMock = false } = {}) {
  if (!allowGoogleMock) {
    try {
      const authResponse = await apiRequest('/auth/login/', {
        method: 'POST',
        body: { email, password },
        token: null,
      })
      return persistBackendSession(authResponse)
    } catch {
      // Fall back to the existing local demo store to avoid breaking the frontend.
    }
  }

  return loginLocal(email, password, { allowGoogleMock })
}

export async function beginOAuthLogin({ loginHint = '', returnTo = '/app/worker' } = {}) {
  const state = randomBase64Url(24)
  const verifier = randomBase64Url(64)
  const challenge = await sha256Base64Url(verifier)
  const authUrl = new URL(`${OAUTH_AUTHORITY}/protocol/openid-connect/auth`)

  window.sessionStorage.setItem(OAUTH_STATE_KEY, state)
  window.sessionStorage.setItem(OAUTH_VERIFIER_KEY, verifier)
  window.sessionStorage.setItem(OAUTH_RETURN_TO_KEY, returnTo)

  authUrl.searchParams.set('client_id', OAUTH_CLIENT_ID)
  authUrl.searchParams.set('redirect_uri', getOAuthRedirectUri())
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', 'openid profile email roles')
  authUrl.searchParams.set('state', state)
  authUrl.searchParams.set('code_challenge', challenge)
  authUrl.searchParams.set('code_challenge_method', 'S256')
  if (loginHint) {
    authUrl.searchParams.set('login_hint', loginHint.trim())
  }

  window.location.assign(authUrl.toString())
}

export async function handleOAuthCallback(callbackUrl = window.location.href) {
  const url = new URL(callbackUrl)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const error = url.searchParams.get('error')

  if (error) {
    return { success: false, message: url.searchParams.get('error_description') || error }
  }

  const expectedState = window.sessionStorage.getItem(OAUTH_STATE_KEY)
  const verifier = window.sessionStorage.getItem(OAUTH_VERIFIER_KEY)
  const returnTo = window.sessionStorage.getItem(OAUTH_RETURN_TO_KEY) || '/app/worker'

  if (!code || !state || !expectedState || state !== expectedState || !verifier) {
    return { success: false, message: 'No se pudo validar el retorno OAuth2.' }
  }

  const body = new URLSearchParams()
  body.set('grant_type', 'authorization_code')
  body.set('client_id', OAUTH_CLIENT_ID)
  body.set('code', code)
  body.set('redirect_uri', getOAuthRedirectUri())
  body.set('code_verifier', verifier)

  const response = await fetch(`${OAUTH_AUTHORITY}/protocol/openid-connect/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!response.ok) {
    return { success: false, message: 'No se pudo intercambiar el codigo OAuth2 por tokens.' }
  }

  const tokenResponse = await response.json()
  const result = persistOAuthSession(tokenResponse)

  window.sessionStorage.removeItem(OAUTH_STATE_KEY)
  window.sessionStorage.removeItem(OAUTH_VERIFIER_KEY)
  window.sessionStorage.removeItem(OAUTH_RETURN_TO_KEY)

  return { ...result, returnTo }
}

export function getSession() {
  ensureStore()
  const session = appStateStore.getSession()
  if (session?.expiresAt && session.expiresAt <= Date.now()) {
    appStateStore.setSession(null)
    return null
  }
  return session
}

export function getCurrentUser() {
  ensureStore()
  const session = appStateStore.getSession()
  if (!session) return null
  const state = appStateStore.getState()
  return (state.users || []).find((user) => user.id === session.userId) || null
}

export function logout() {
  appStateStore.setSession(null)
}

export function resetDemoData() {
  appStateStore.resetToSeed(createSeedState)
}
