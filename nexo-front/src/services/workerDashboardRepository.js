import { appStateStore } from './appStateStore'
import { apiRequest, getAccessToken } from './apiClient'
import { createSeedState } from '../data/seedAppState'

function ensureStore() {
  appStateStore.ensureInitialized(createSeedState)
}

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value))
}

function apiMicrojobId(jobId) {
  return `api-job-${jobId}`
}

function parseApiJobId(microjobId) {
  const match = String(microjobId).match(/^api-job-(\d+)$/)
  return match ? Number(match[1]) : null
}

function formatPayment(payment) {
  const amount = Number(payment)
  return Number.isFinite(amount) ? `$${amount.toFixed(2)}` : `$${payment}`
}

function adaptApiJobForWorker(job) {
  const modality = job.modality || 'Onsite'
  const duration = job.duration || 'Por coordinar'
  const requirements = Array.isArray(job.requirements) ? job.requirements : []
  const availableDates = Array.isArray(job.available_dates) ? job.available_dates : []

  return {
    id: apiMicrojobId(job.id),
    apiJobId: job.id,
    title: job.title,
    company: job.creator_name || 'Empresa',
    companyLogo: null,
    description: job.description,
    microjobType: job.type,
    locationType: modality.toLowerCase().includes('remot') ? 'remote' : 'onsite',
    modality,
    locationName: job.location,
    address: job.location,
    latitude: null,
    longitude: null,
    distanceKm: 2,
    estimatedPay: formatPayment(job.payment),
    estimatedPayAmount: Number(job.payment) || 0,
    estimatedTime: duration,
    requiredSkill: job.type,
    requiredCourseId: null,
    requiredCourseLabel: null,
    isUnlocked: true,
    unlockReason: 'Tu perfil cumple los requisitos para postular.',
    scheduleWindow: availableDates[0] || 'Horario por coordinar',
    availableDates,
    capacity: job.capacity || 1,
    supervisorName: job.creator_name || 'Responsable del microtrabajo',
    status: job.status === 'open' ? 'Open' : 'Locked',
    documents: [],
    requirements,
    imageSrc: null,
    imageAlt: job.title,
  }
}

function toFrontendApplicationStatus(status) {
  if (status === 'accepted') return 'Aceptada'
  if (status === 'rejected') return 'Rechazada'
  return 'En revisión'
}

function adaptApiApplicationForWorker(application, apiJobs = []) {
  const job = apiJobs.find((item) => item.id === application.job) || {}
  return {
    id: `api-application-${application.id}`,
    apiApplicationId: application.id,
    microjobId: apiMicrojobId(application.job),
    workerId: 'worker-001',
    title: application.job_title || job.title || 'Microtrabajo',
    company: job.creator_name || 'Empresa',
    companyLogo: null,
    imageSrc: null,
    imageAlt: application.job_title || 'Microtrabajo',
    status: toFrontendApplicationStatus(application.status),
    appliedAt: application.created_at?.slice(0, 10) || '2026-06-28',
    estimatedPay: job.payment ? formatPayment(job.payment) : '$0',
    estimatedPayAmount: Number(job.payment) || 0,
    modality: 'Onsite',
    locationName: job.location || 'Por coordinar',
    address: job.location || 'Por coordinar',
    latitude: null,
    longitude: null,
    description: job.description || application.cover_letter || '',
    requirements: [],
    result: application.status === 'accepted' ? 'Fuiste seleccionado(a) para este microtrabajo.' : 'Postulacion en seguimiento.',
    estimatedTime: 'Por coordinar',
    schedule: null,
    courseRecommendation: null,
  }
}

function adaptApiNotification(notification) {
  return {
    id: `api-notification-${notification.id}`,
    title: notification.type || 'Notificacion',
    description: notification.message,
    timeLabel: notification.created_at?.slice(0, 10) || 'Reciente',
    category: notification.type || 'Backend',
    isUnread: !notification.is_read,
  }
}

async function getApiWorkerCollections() {
  const token = getAccessToken()
  if (!token) return null

  try {
    const dashboard = await apiRequest('/worker/dashboard/', { token })
    return {
      microjobs: (dashboard.microjobs || []).map(adaptApiJobForWorker),
      applications: (dashboard.applications || []).map((application) => adaptApiApplicationForWorker(application, dashboard.microjobs || [])),
      notifications: (dashboard.notifications || []).map(adaptApiNotification),
    }
  } catch {
    // Fall back to the non-aggregated endpoints while the backend is rolling forward.
  }

  try {
    const [jobs, applicationsResponse, notificationsResponse] = await Promise.all([
      apiRequest('/jobs/?status=open', { token }),
      apiRequest('/applications/mine/', { token }),
      apiRequest('/notifications/?limit=20', { token }),
    ])

    return {
      microjobs: jobs.map(adaptApiJobForWorker),
      applications: applicationsResponse.map((application) => adaptApiApplicationForWorker(application, jobs)),
      notifications: (notificationsResponse.items || []).map(adaptApiNotification),
    }
  } catch {
    return null
  }
}

function normalizeText(value = '') {
  return value
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

function getActiveWorkerId() {
  const session = appStateStore.getSession()
  if (session?.role === 'worker' && session.profileId) {
    return session.profileId
  }

  const state = appStateStore.getState()
  return state.workerProfiles?.[0]?.id ?? null
}

function getWorkerProfileById(workerId) {
  const state = appStateStore.getState()
  return state.workerProfiles?.find((profile) => profile.id === workerId) ?? null
}

// ---------------------------------------------------------------------------
// Adapters: canonical store entities -> worker-facing view shapes
// ---------------------------------------------------------------------------

function modalityFromLocationType(locationType) {
  if (locationType === 'remote') return 'Remote'
  if (locationType === 'hybrid') return 'Hybrid'
  return 'Onsite'
}

function getCompletedCourseIds(state, workerId) {
  return new Set(
    (state.workerCourses || [])
      .filter((entry) => entry.workerId === workerId && entry.progress >= 100)
      .map((entry) => entry.courseId)
  )
}

function adaptMicrojobForWorker(microjob, state, workerId) {
  const completedCourseIds = getCompletedCourseIds(state, workerId)
  const requiredCourse = microjob.requiredCourseId
    ? state.courses.find((course) => course.id === microjob.requiredCourseId)
    : null
  const isUnlocked = !microjob.requiredCourseId || completedCourseIds.has(microjob.requiredCourseId)

  return {
    id: microjob.id,
    title: microjob.title,
    company: microjob.company,
    companyLogo: microjob.companyLogo,
    description: microjob.description || microjob.shortDescription,
    microjobType: microjob.microjobType,
    locationType: microjob.locationType,
    modality: modalityFromLocationType(microjob.locationType),
    locationName: microjob.locationName,
    address: microjob.address,
    latitude: microjob.latitude,
    longitude: microjob.longitude,
    distanceKm: microjob.distanceKm,
    estimatedPay: microjob.estimatedPay,
    estimatedPayAmount: microjob.estimatedPayAmount,
    estimatedTime: microjob.estimatedDuration,
    requiredSkill: microjob.requiredSkill,
    requiredCourseId: microjob.requiredCourseId,
    requiredCourseLabel: requiredCourse?.title ?? null,
    isUnlocked,
    unlockReason: isUnlocked
      ? 'Tu perfil cumple los requisitos para postular.'
      : `Completa el curso “${requiredCourse?.title ?? 'requerido'}” para desbloquear esta tarea.`,
    scheduleWindow: microjob.scheduleWindows?.[0] || 'Horario por coordinar',
    availableDates: microjob.availableDates || [],
    capacity: microjob.capacity,
    supervisorName: microjob.supervisorName,
    status: isUnlocked ? 'Open' : 'Locked',
    documents: microjob.documents || [],
    imageSrc: microjob.imageSrc,
    imageAlt: microjob.imageAlt,
  }
}

function adaptCourseForWorker(course, workerCourseEntry) {
  const modules = (course.modules || []).map((module) => ({
    id: module.id,
    title: module.title,
    type: module.moduleType || module.type,
    durationMinutes: module.durationMinutes ?? 0,
    isCompleted: workerCourseEntry ? workerCourseEntry.completedModuleIds.includes(module.id) : false,
  }))

  const completedModules = modules.filter((module) => module.isCompleted).length
  const totalModules = modules.length
  const nextModule = modules.find((module) => !module.isCompleted)
  const remainingModules = Math.max(totalModules - completedModules, 0)

  return {
    id: course.id,
    title: course.title,
    description: course.description,
    category: course.category,
    level: course.level,
    durationMinutes: course.durationMinutes,
    skillUnlocked: course.skillUnlocked,
    assessmentType: course.assessmentType,
    imageSrc: course.imageSrc,
    imageAlt: course.imageAlt,
    relatedMicrojobIds: course.relatedMicrojobIds || [],
    modules,
    isStarted: Boolean(workerCourseEntry),
    progress: workerCourseEntry ? workerCourseEntry.progress : 0,
    completedModules,
    totalModules,
    nextModuleTitle: nextModule?.title ?? 'Curso completado',
    remainingTimeLabel: `${Math.max(remainingModules * 12, 0)} min restantes`,
  }
}

function getWorkerApplications(state, workerId) {
  const microjobById = new Map(state.microjobs.map((microjob) => [microjob.id, microjob]))

  return state.applications
    .filter((application) => application.workerId === workerId)
    .map((application) => {
      const microjob = microjobById.get(application.microjobId) || {}
      const adapted = microjob.id ? adaptMicrojobForWorker(microjob, state, workerId) : {}

      return {
        id: application.id,
        microjobId: application.microjobId,
        workerId: application.workerId,
        title: microjob.title || 'Microtrabajo',
        company: microjob.company || 'Empresa',
        companyLogo: microjob.companyLogo,
        imageSrc: microjob.imageSrc,
        imageAlt: microjob.imageAlt,
        status: application.status,
        appliedAt: application.appliedAt,
        estimatedPay: microjob.estimatedPay || '$0',
        estimatedPayAmount: microjob.estimatedPayAmount || 0,
        modality: adapted.modality || 'Onsite',
        locationName: microjob.locationName || 'Remoto',
        address: microjob.address || 'Trabajo en línea',
        latitude: microjob.latitude ?? null,
        longitude: microjob.longitude ?? null,
        description: microjob.description || microjob.shortDescription || '',
        requirements: microjob.documents || [],
        result: application.result || 'Postulación en seguimiento.',
        estimatedTime: microjob.estimatedDuration || 'Por confirmar',
        schedule: application.schedule || null,
        courseRecommendation: adapted.requiredCourseLabel || null,
      }
    })
}

function getWorkerMicrojobs(state, workerId) {
  return state.microjobs
    .filter((microjob) => microjob.status === 'Activo')
    .map((microjob) => adaptMicrojobForWorker(microjob, state, workerId))
}

function getWorkerCourseCatalog(state, workerId) {
  const startedIds = new Set((state.workerCourses || []).filter((entry) => entry.workerId === workerId).map((entry) => entry.courseId))
  return state.courses
    .filter((course) => course.status === 'Publicado')
    .map((course) => adaptCourseForWorker(course, null))
    .map((course) => ({ ...course, isStarted: startedIds.has(course.id) }))
}

function getWorkerCoursesInProgress(state, workerId) {
  const entries = (state.workerCourses || []).filter((entry) => entry.workerId === workerId)
  const courseById = new Map(state.courses.map((course) => [course.id, course]))

  return entries
    .map((entry) => {
      const course = courseById.get(entry.courseId)
      return course ? adaptCourseForWorker(course, entry) : null
    })
    .filter(Boolean)
}

// ---------------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------------

function matchesPaymentRange(amount, paymentRange) {
  if (!paymentRange || paymentRange === 'all') return true
  if (paymentRange === 'under10') return amount < 10
  if (paymentRange === 'between10and20') return amount >= 10 && amount <= 20
  return amount > 20
}

function getDaysDifference(isoDate) {
  const currentDate = new Date('2026-06-28T12:00:00')
  const targetDate = new Date(`${isoDate}T12:00:00`)
  return Math.floor((currentDate.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24))
}

function matchesDateRange(isoDate, dateRange) {
  if (!dateRange || dateRange === 'all') return true
  const daysDifference = getDaysDifference(isoDate)
  if (dateRange === 'today') return daysDifference === 0
  if (dateRange === 'last7') return daysDifference <= 7
  return daysDifference <= 30
}

function matchesMicrojobDistance(microjob, distanceRange) {
  if (!distanceRange || distanceRange === 'all') return true
  if (distanceRange === 'remote') return microjob.locationType === 'remote'
  if (microjob.locationType === 'remote') return false
  if (distanceRange === 'upTo2') return microjob.distanceKm <= 2
  if (distanceRange === 'upTo5') return microjob.distanceKm <= 5
  return microjob.distanceKm <= 10
}

function matchesCourseDuration(durationMinutes, durationFilter) {
  if (!durationFilter || durationFilter === 'all') return true
  if (durationFilter === 'short') return durationMinutes <= 45
  if (durationFilter === 'medium') return durationMinutes > 45 && durationMinutes <= 60
  return durationMinutes > 60
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getWorkerDashboardState() {
  ensureStore()
  const state = appStateStore.getState()
  const workerId = getActiveWorkerId()
  const baseProfile = getWorkerProfileById(workerId) || state.workerProfiles[0]
  const apiCollections = await getApiWorkerCollections()
  const workerProfile = {
    ...cloneValue(baseProfile),
    name: baseProfile.firstName || baseProfile.name?.split(' ')[0] || baseProfile.name,
    fullName: baseProfile.name,
  }

  return {
    workerProfile,
    applications: apiCollections?.applications?.length ? apiCollections.applications : getWorkerApplications(state, workerId),
    microjobs: apiCollections?.microjobs?.length ? apiCollections.microjobs : getWorkerMicrojobs(state, workerId),
    courseCatalog: getWorkerCourseCatalog(state, workerId),
    coursesInProgress: getWorkerCoursesInProgress(state, workerId),
    profileStatus: cloneValue(baseProfile.profileStatus),
    settings: cloneValue(state.workerSettings),
    notifications: apiCollections?.notifications?.length ? apiCollections.notifications : cloneValue(state.workerNotifications),
  }
}

export async function getApplications(sourceApplications = [], filters = {}) {
  return cloneValue(sourceApplications).filter((application) => {
    const matchesStatus = !filters.status || filters.status === 'all' || application.status === filters.status
    const matchesDate = matchesDateRange(application.appliedAt, filters.date)
    const matchesModality = !filters.modality || filters.modality === 'all' || application.modality === filters.modality
    const matchesPayment = matchesPaymentRange(application.estimatedPayAmount, filters.payment)
    return matchesStatus && matchesDate && matchesModality && matchesPayment
  })
}

export async function getMicrojobs(sourceMicrojobs = [], filters = {}) {
  const microjobs = cloneValue(sourceMicrojobs)
  const filteredMicrojobs = microjobs.filter((microjob) => {
    const matchesModality = !filters.modality || filters.modality === 'all' || microjob.modality === filters.modality
    const matchesPayment = matchesPaymentRange(microjob.estimatedPayAmount, filters.payment)
    const matchesDistance = matchesMicrojobDistance(microjob, filters.distance)
    const matchesSkill =
      !filters.skill || filters.skill === 'all' || normalizeText(microjob.requiredSkill).includes(normalizeText(filters.skill))
    const matchesAvailability =
      !filters.availability ||
      filters.availability === 'all' ||
      (filters.availability === 'weekdays' && !normalizeText(microjob.scheduleWindow).includes('sabado') && !normalizeText(microjob.scheduleWindow).includes('fin')) ||
      (filters.availability === 'weekend' && (normalizeText(microjob.scheduleWindow).includes('sabado') || normalizeText(microjob.scheduleWindow).includes('fin'))) ||
      (filters.availability === 'flexible' && (microjob.locationType === 'remote' || normalizeText(microjob.scheduleWindow).includes('flexible')))

    return matchesModality && matchesPayment && matchesDistance && matchesSkill && matchesAvailability
  })

  const sortedMicrojobs = filteredMicrojobs.sort((leftMicrojob, rightMicrojob) => {
    const leftDistance = leftMicrojob.locationType === 'remote' ? Number.POSITIVE_INFINITY : leftMicrojob.distanceKm ?? Number.POSITIVE_INFINITY
    const rightDistance = rightMicrojob.locationType === 'remote' ? Number.POSITIVE_INFINITY : rightMicrojob.distanceKm ?? Number.POSITIVE_INFINITY
    return leftDistance - rightDistance
  })

  return {
    unlockedMicrojobs: sortedMicrojobs.filter((microjob) => microjob.isUnlocked),
    lockedMicrojobs: sortedMicrojobs.filter((microjob) => !microjob.isUnlocked),
  }
}

export async function getAvailableCourses(sourceCourseCatalog = [], sourceCoursesInProgress = [], filters = {}) {
  const startedCourseIds = new Set(cloneValue(sourceCoursesInProgress).map((course) => course.id))

  return cloneValue(sourceCourseCatalog).filter((course) => {
    const matchesStartedState = !startedCourseIds.has(course.id)
    const matchesCategory = !filters.category || filters.category === 'all' || course.category === filters.category
    const matchesLevel = !filters.level || filters.level === 'all' || course.level === filters.level
    const matchesDuration = matchesCourseDuration(course.durationMinutes, filters.duration)
    const matchesStatus = !filters.status || filters.status === 'all' || filters.status === 'Disponible'
    return matchesStartedState && matchesCategory && matchesLevel && matchesDuration && matchesStatus
  })
}

export async function getCoursesInProgress(sourceCoursesInProgress = [], filters = {}) {
  return cloneValue(sourceCoursesInProgress).filter((course) => {
    const matchesCategory = !filters.category || filters.category === 'all' || course.category === filters.category
    const matchesLevel = !filters.level || filters.level === 'all' || course.level === filters.level
    const matchesDuration = matchesCourseDuration(course.durationMinutes, filters.duration)
    const matchesStatus =
      !filters.status ||
      filters.status === 'all' ||
      (filters.status === 'En progreso' && course.progress < 100) ||
      (filters.status === 'Casi completo' && course.progress >= 80)
    return matchesCategory && matchesLevel && matchesDuration && matchesStatus
  })
}

export async function getWorkerDashboardSummary({ applications = [], microjobs = [], courseCatalog = [], coursesInProgress = [], profileStatus = {} } = {}) {
  const startedCourseIds = new Set(coursesInProgress.map((course) => course.id))
  const availableCourseCount = courseCatalog.filter((course) => !startedCourseIds.has(course.id)).length

  return {
    totalApplications: applications.length,
    acceptedApplications: applications.filter((application) => application.status === 'Aceptada').length,
    nearbyMicrojobs: cloneValue(microjobs)
      .filter((microjob) => microjob.isUnlocked)
      .sort((left, right) => {
        const leftDistance = left.locationType === 'remote' ? Number.POSITIVE_INFINITY : left.distanceKm ?? Number.POSITIVE_INFINITY
        const rightDistance = right.locationType === 'remote' ? Number.POSITIVE_INFINITY : right.distanceKm ?? Number.POSITIVE_INFINITY
        return leftDistance - rightDistance
      })
      .slice(0, 3),
    availableCourseCount,
    inProgressCourses: coursesInProgress,
    profileCompletionPercentage: profileStatus.completionPercentage ?? 0,
  }
}

export async function applyToMicrojob(microjobId) {
  const apiJobId = parseApiJobId(microjobId)
  const token = getAccessToken()
  if (apiJobId && token) {
    try {
      await apiRequest('/applications/', {
        method: 'POST',
        token,
        body: {
          job: apiJobId,
          cover_letter: 'Estoy disponible para realizar este microtrabajo.',
        },
      })
      const apiCollections = await getApiWorkerCollections()
      return {
        applications: apiCollections?.applications || [],
        createdApplication: null,
        successMessage: 'Postulacion enviada',
      }
    } catch (error) {
      return { applications: [], createdApplication: null, successMessage: error.message || 'No se pudo enviar la postulacion.' }
    }
  }

  ensureStore()
  const workerId = getActiveWorkerId()
  const state = appStateStore.getState()
  const microjob = state.microjobs.find((item) => item.id === microjobId)

  if (!microjob || microjob.status !== 'Activo') {
    return { applications: getWorkerApplications(state, workerId), createdApplication: null, successMessage: null }
  }

  const adapted = adaptMicrojobForWorker(microjob, state, workerId)
  if (!adapted.isUnlocked) {
    return { applications: getWorkerApplications(state, workerId), createdApplication: null, successMessage: 'Completa el curso requerido para postular.' }
  }

  const alreadyApplied = state.applications.some((application) => application.workerId === workerId && application.microjobId === microjobId)
  if (alreadyApplied) {
    return { applications: getWorkerApplications(state, workerId), createdApplication: null, successMessage: 'Ya habías enviado esta postulación.' }
  }

  const newApplication = {
    id: appStateStore.generateId('application'),
    microjobId,
    workerId,
    companyId: microjob.companyId,
    status: 'En revisión',
    appliedAt: '2026-06-28',
    schedule: null,
    result: 'Tu postulación fue enviada y será revisada pronto.',
  }

  const nextState = appStateStore.patchState((draft) => {
    draft.applications = [newApplication, ...draft.applications]
    return draft
  })

  return { applications: getWorkerApplications(nextState, workerId), createdApplication: newApplication, successMessage: 'Postulación enviada' }
}

export async function cancelApplication(applicationId) {
  ensureStore()
  const workerId = getActiveWorkerId()
  const state = appStateStore.getState()
  const application = state.applications.find((item) => item.id === applicationId)

  if (!application) {
    return { applications: getWorkerApplications(state, workerId), successMessage: null }
  }

  if (application.status !== 'En revisión') {
    return { applications: getWorkerApplications(state, workerId), successMessage: 'Solo puedes cancelar postulaciones en revisión.' }
  }

  const nextState = appStateStore.patchState((draft) => {
    draft.applications = draft.applications.filter((item) => item.id !== applicationId)
    return draft
  })

  return { applications: getWorkerApplications(nextState, workerId), successMessage: 'Postulación cancelada' }
}

export async function startCourse(courseId) {
  ensureStore()
  const workerId = getActiveWorkerId()
  const state = appStateStore.getState()
  const course = state.courses.find((item) => item.id === courseId)

  if (!course) {
    return { coursesInProgress: getWorkerCoursesInProgress(state, workerId), startedCourse: null, successMessage: null }
  }

  const existing = (state.workerCourses || []).find((entry) => entry.workerId === workerId && entry.courseId === courseId)
  if (existing) {
    return { coursesInProgress: getWorkerCoursesInProgress(state, workerId), startedCourse: null, successMessage: 'Este curso ya está en progreso.' }
  }

  const nextState = appStateStore.patchState((draft) => {
    draft.workerCourses = [{ workerId, courseId, isStarted: true, progress: 5, completedModuleIds: [] }, ...(draft.workerCourses || [])]
    return draft
  })

  return { coursesInProgress: getWorkerCoursesInProgress(nextState, workerId), successMessage: 'Curso agregado a progreso' }
}

export async function advanceCourseModule(courseId) {
  ensureStore()
  const workerId = getActiveWorkerId()
  let updatedCourse = null

  const nextState = appStateStore.patchState((draft) => {
    const course = draft.courses.find((item) => item.id === courseId)
    if (!course) return draft

    draft.workerCourses = (draft.workerCourses || []).map((entry) => {
      if (entry.workerId !== workerId || entry.courseId !== courseId) return entry

      const moduleIds = course.modules.map((module) => module.id)
      const nextModuleId = moduleIds.find((id) => !entry.completedModuleIds.includes(id))
      const completedModuleIds = nextModuleId ? [...entry.completedModuleIds, nextModuleId] : entry.completedModuleIds
      const progress = Math.min(100, Math.round((completedModuleIds.length / moduleIds.length) * 100))

      return { ...entry, completedModuleIds, progress, isStarted: true }
    })

    return draft
  })

  const entry = (nextState.workerCourses || []).find((item) => item.workerId === workerId && item.courseId === courseId)
  const course = nextState.courses.find((item) => item.id === courseId)
  if (entry && course) {
    updatedCourse = adaptCourseForWorker(course, entry)
  }

  return {
    coursesInProgress: getWorkerCoursesInProgress(nextState, workerId),
    updatedCourse,
    successMessage: updatedCourse?.progress === 100 ? 'Curso completado' : 'Avance del curso actualizado',
  }
}

export async function getApplicationDetail(applicationId, sourceApplications = []) {
  return cloneValue(sourceApplications).find((application) => application.id === applicationId) ?? null
}

export async function getMicrojobDetail(microjobId, sourceMicrojobs = []) {
  return cloneValue(sourceMicrojobs).find((microjob) => microjob.id === microjobId) ?? null
}

export async function getCourseDetail(courseId, sourceCourseCatalog = [], sourceCoursesInProgress = []) {
  const inProgress = cloneValue(sourceCoursesInProgress).find((course) => course.id === courseId)
  if (inProgress) return inProgress
  return cloneValue(sourceCourseCatalog).find((course) => course.id === courseId) ?? null
}
