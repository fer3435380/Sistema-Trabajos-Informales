import { appStateStore } from './appStateStore'
import { createSeedState } from '../data/seedAppState'
import { defaultCompanyProfile } from '../data/mockCompanyData'
import companyBadgeIcon from '../assets/landing/marca-de-verificacion-empresa.png'
import mariaProfileImage from '../assets/landing/maria-profile.png'

function ensureStore() {
  appStateStore.ensureInitialized(createSeedState)
}

function normalizeEmail(email = '') {
  return email.trim().toLowerCase()
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

export function registerWorker(registration) {
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

export function registerCompany(registration) {
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

export function login(email, password, { allowGoogleMock = false } = {}) {
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

export function getSession() {
  ensureStore()
  return appStateStore.getSession()
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
