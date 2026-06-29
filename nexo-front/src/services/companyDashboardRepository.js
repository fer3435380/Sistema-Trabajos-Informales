import { appStateStore } from './appStateStore'
import { createSeedState } from '../data/seedAppState'
import { mockMapPoints, workModeLabels } from '../data/mockCompanyData'

function ensureStore() {
  appStateStore.ensureInitialized(createSeedState)
}

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value))
}

function normalizeText(value = '') {
  return value
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

function getActiveCompanyId() {
  const session = appStateStore.getSession()
  if (session?.role === 'company' && session.profileId) {
    return session.profileId
  }

  const state = appStateStore.getState()
  return state.companyProfiles?.[0]?.id ?? null
}

function getCompanyProfileById(companyId) {
  const state = appStateStore.getState()
  return state.companyProfiles?.find((profile) => profile.id === companyId) ?? null
}

// ---------------------------------------------------------------------------
// Profile completion meta (derived from the captured registration fields)
// ---------------------------------------------------------------------------

function getSectionStatus(fields) {
  const validFields = fields.filter((field) => (Array.isArray(field) ? field.length > 0 : Boolean(field)))

  if (validFields.length === fields.length) return 'Completo'
  if (validFields.length >= Math.max(1, Math.ceil(fields.length * 0.6))) return 'Revisar'
  return 'Pendiente'
}

function getSectionProgress(fields) {
  const completedFields = fields.filter((field) => (Array.isArray(field) ? field.length > 0 : Boolean(field))).length
  return Math.round((completedFields / fields.length) * 100)
}

function buildProfileMeta(profile) {
  const accountFields = [profile.workMode, profile.commercialName, profile.identification, profile.accountEmail, profile.city, profile.address]
  const responsibleFields = [profile.responsibleName, profile.responsibleEmail, profile.responsibleRole, profile.responsiblePhone]
  const operationFields = [profile.operationTaskTypes, profile.operationScale, profile.operationModalities]
  const billingFields = [profile.billingName, profile.billingIdentification, profile.billingEmail, profile.billingAddress, profile.preferredPaymentMethod]
  const preferenceFields = [profile.mainObjective, profile.estimatedFrequency]

  const sections = [
    { key: 'account', status: getSectionStatus(accountFields), progress: getSectionProgress(accountFields) },
    { key: 'responsible', status: getSectionStatus(responsibleFields), progress: getSectionProgress(responsibleFields) },
    { key: 'operation', status: getSectionStatus(operationFields), progress: getSectionProgress(operationFields) },
    { key: 'billing', status: getSectionStatus(billingFields), progress: getSectionProgress(billingFields) },
    { key: 'preferences', status: getSectionStatus(preferenceFields), progress: getSectionProgress(preferenceFields) },
  ]

  return {
    accountStatus: sections[0].status,
    responsibleStatus: sections[1].status,
    operationStatus: sections[2].status,
    billingStatus: sections[3].status,
    preferenceStatus: sections[4].status,
    completionPercentage: Math.round(sections.reduce((total, section) => total + section.progress, 0) / sections.length),
  }
}

function withDerivedProfileMeta(profile) {
  return { ...profile, ...buildProfileMeta(profile) }
}

function getProfileStatusBlocks(profile) {
  const hydratedProfile = withDerivedProfileMeta(profile)

  return [
    {
      id: 'account',
      title: 'Datos de la cuenta y del negocio',
      status: hydratedProfile.accountStatus,
      fields: [workModeLabels[hydratedProfile.workMode], hydratedProfile.commercialName, hydratedProfile.identification, hydratedProfile.accountEmail, hydratedProfile.city, hydratedProfile.address],
    },
    {
      id: 'responsible',
      title: 'Datos del responsable',
      status: hydratedProfile.responsibleStatus,
      fields: [hydratedProfile.responsibleName, hydratedProfile.responsibleEmail, hydratedProfile.responsibleRole, hydratedProfile.responsiblePhone],
    },
    {
      id: 'operation',
      title: 'Datos de operación',
      status: hydratedProfile.operationStatus,
      fields: [...hydratedProfile.operationTaskTypes, hydratedProfile.operationScale, ...hydratedProfile.operationModalities],
    },
    {
      id: 'billing',
      title: 'Datos de facturación',
      status: hydratedProfile.billingStatus,
      fields: [hydratedProfile.billingName, hydratedProfile.billingIdentification, hydratedProfile.billingEmail, hydratedProfile.billingAddress, hydratedProfile.preferredPaymentMethod],
    },
    {
      id: 'preferences',
      title: 'Preferencias de uso',
      status: hydratedProfile.preferenceStatus,
      fields: [hydratedProfile.mainObjective, hydratedProfile.estimatedFrequency],
    },
  ]
}

// ---------------------------------------------------------------------------
// Microjob description (mock, kept ≤150 words)
// ---------------------------------------------------------------------------

function isCourseRequired(courseId) {
  return Boolean(courseId)
}

function matchesFutureDates(dates, dateFilter) {
  if (!dateFilter || dateFilter === 'all') return true
  if (!dates?.length) return false

  const firstDate = new Date(`${dates[0]}T12:00:00`)
  const currentDate = new Date('2026-06-28T12:00:00')
  const daysDifference = Math.floor((firstDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))

  if (dateFilter === 'next7') return daysDifference <= 7
  return daysDifference <= 30
}

function matchesCapacity(capacity, capacityFilter) {
  if (!capacityFilter || capacityFilter === 'all') return true
  if (capacityFilter === 'low') return capacity <= 3
  if (capacityFilter === 'medium') return capacity >= 4 && capacity <= 7
  return capacity >= 8
}

function matchesApplicantDistance(distanceKm, distanceFilter) {
  if (!distanceFilter || distanceFilter === 'all') return true
  if (distanceFilter === 'remote') return distanceKm === 0
  if (distanceFilter === 'upTo3') return distanceKm <= 3
  return distanceKm <= 6
}

function createMapsUrl(latitude, longitude) {
  if (latitude == null || longitude == null) return null
  return `https://www.google.com/maps?q=${latitude},${longitude}`
}

function toLocationType(modality) {
  const normalizedModality = normalizeText(modality)
  if (normalizedModality === 'remota') return 'remote'
  if (normalizedModality === 'hibrida') return 'hybrid'
  return 'onsite'
}

function limitWords(text = '', maxWords = 150) {
  const words = text.trim().split(/\s+/).filter(Boolean)
  if (words.length <= maxWords) return text.trim()
  return `${words.slice(0, maxWords).join(' ')}...`
}

function buildMicrojobDescription(microjob, relatedCourseTitle = null) {
  const requirementList = microjob.documents?.length ? microjob.documents.join(', ') : 'requisitos básicos definidos por la empresa'
  const scheduleList = microjob.scheduleWindows?.length ? microjob.scheduleWindows.join(', ') : 'disponibilidad por coordinar'
  const dateList = microjob.availableDates?.length ? microjob.availableDates.join(', ') : 'fechas por confirmar'
  const courseSentence = relatedCourseTitle
    ? `Como parte de la preparación recomendada, se considera valioso haber revisado o completado el curso ${relatedCourseTitle}, ya que acelera la adaptación al flujo esperado.`
    : 'No requiere un curso obligatorio, pero sí disposición para seguir instrucciones y adaptarse rápidamente al contexto operativo.'
  const locationSentence =
    microjob.modality === 'Remota'
      ? 'La coordinación se realiza en línea, por lo que se espera orden en la comunicación, cumplimiento de tiempos y claridad al reportar avances.'
      : `La operación se apoya en la referencia ${microjob.referenceName || microjob.address}, de modo que el ingreso, la coordinación y el punto de ejecución sean fáciles de ubicar.`

  return limitWords(
    microjob.description ||
      `${microjob.title} es una oportunidad ${microjob.modality.toLowerCase()} pensada para apoyar tareas de ${microjob.microjobType.toLowerCase()} con una duración estimada de ${microjob.estimatedDuration} y un pago referencial de ${microjob.estimatedPay}. La persona seleccionada deberá aportar criterio práctico, buena comunicación y atención al detalle para cumplir el objetivo central de la actividad, siguiendo la supervisión de ${microjob.supervisorName} y respetando el ritmo de trabajo definido por la empresa. Se valora afinidad con ${microjob.requiredSkill}, cumplimiento de ${requirementList} y disponibilidad real en las franjas ${scheduleList}, especialmente en las fechas ${dateList}. ${courseSentence} ${locationSentence} Además de ejecutar la tarea principal, se espera una actitud responsable para registrar avances, atender indicaciones de último momento y cuidar la experiencia general de la operación.`,
    150
  )
}

function withMicrojobDescription(microjob, sourceCourses) {
  const relatedCourse = sourceCourses.find((course) => course.id === microjob.requiredCourseId)
  return {
    ...microjob,
    description: buildMicrojobDescription(microjob, relatedCourse?.title ?? null),
    requiredCourseLabel: relatedCourse?.title ?? null,
  }
}

// ---------------------------------------------------------------------------
// Applicant projection (joins applications + worker profiles + microjobs)
// ---------------------------------------------------------------------------

function buildApplicantsForCompany(state, companyId) {
  const companyMicrojobIds = new Set(state.microjobs.filter((microjob) => microjob.companyId === companyId).map((microjob) => microjob.id))
  const workerById = new Map(state.workerProfiles.map((worker) => [worker.id, worker]))
  const microjobById = new Map(state.microjobs.map((microjob) => [microjob.id, microjob]))

  return state.applications
    .filter((application) => companyMicrojobIds.has(application.microjobId))
    .map((application) => {
      const worker = workerById.get(application.workerId) || {}
      const microjob = microjobById.get(application.microjobId) || {}

      return {
        id: application.id,
        applicationId: application.id,
        workerId: application.workerId,
        microjobId: application.microjobId,
        microjobTitle: microjob.title || 'Microtrabajo',
        status: application.status,
        name: worker.name || 'Postulante',
        initials: worker.initials || 'NN',
        imageSrc: worker.imageSrc || worker.profileImageSrc,
        profileCompleted: worker.profileCompleted || '70%',
        relatedCourses: worker.relatedCourses || [],
        completedCourses: worker.completedCourses || [],
        mainData: worker.mainData || [worker.city || 'Cuenca'],
        education: worker.education || 'Sin datos de educación.',
        experience: worker.experience || 'Sin datos de experiencia.',
        availability: worker.availability || 'Por confirmar',
        distanceKm: worker.distanceKm ?? 0,
        shortHistory: worker.shortHistory || 'Sin historial registrado.',
      }
    })
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getCompanyDashboardState() {
  ensureStore()
  const state = appStateStore.getState()
  const companyId = getActiveCompanyId()
  const baseProfile = getCompanyProfileById(companyId) || state.companyProfiles[0]
  const profile = withDerivedProfileMeta(cloneValue(baseProfile))
  const courses = cloneValue(state.courses.filter((course) => course.companyId === companyId))
  const microjobs = cloneValue(state.microjobs.filter((microjob) => microjob.companyId === companyId)).map((microjob) =>
    withMicrojobDescription(microjob, courses)
  )

  return {
    profile,
    notifications: cloneValue(state.companyNotifications),
    microjobs,
    applicants: buildApplicantsForCompany(state, companyId),
    courses,
    settings: cloneValue(state.companySettings),
    statusBlocks: getProfileStatusBlocks(profile),
    mapPoints: cloneValue(mockMapPoints),
  }
}

export async function getCompanyDashboardSummary({ microjobs = [], applicants = [], courses = [] } = {}) {
  return {
    activeMicrojobs: microjobs.filter((microjob) => microjob.status === 'Activo').length,
    newApplicants: applicants.filter((applicant) => applicant.status === 'En revisión').length,
    publishedCourses: courses.filter((course) => course.status === 'Publicado').length,
    availableSeats: microjobs
      .filter((microjob) => microjob.status !== 'Borrador')
      .reduce((total, microjob) => total + (Number(microjob.capacity) || 0), 0),
  }
}

export async function getCompanyMicrojobs(filters = {}, sourceMicrojobs = []) {
  return cloneValue(sourceMicrojobs).filter((microjob) => {
    const matchesStatus = !filters.status || filters.status === 'all' || microjob.status === filters.status
    const matchesType = !filters.microjobType || filters.microjobType === 'all' || microjob.microjobType === filters.microjobType
    const matchesModality = !filters.modality || filters.modality === 'all' || microjob.modality === filters.modality
    const matchesRequiredCourse =
      !filters.requiredCourse ||
      filters.requiredCourse === 'all' ||
      (filters.requiredCourse === 'required' && isCourseRequired(microjob.requiredCourseId)) ||
      (filters.requiredCourse === 'optional' && !isCourseRequired(microjob.requiredCourseId))
    const matchesDate = matchesFutureDates(microjob.availableDates, filters.date)
    const matchesSeats = matchesCapacity(microjob.capacity, filters.capacity)

    return matchesStatus && matchesType && matchesModality && matchesRequiredCourse && matchesDate && matchesSeats
  })
}

export async function getCompanyApplicants(filters = {}, sourceApplicants = []) {
  return cloneValue(sourceApplicants).filter((applicant) => {
    const matchesStatus = !filters.status || filters.status === 'all' || applicant.status === filters.status
    const matchesMicrojob = !filters.microjob || filters.microjob === 'all' || applicant.microjobId === filters.microjob
    const matchesCourses = !filters.coursesCompleted || filters.coursesCompleted === 'all' || applicant.completedCourses.length >= Number(filters.coursesCompleted)
    const matchesAvailability =
      !filters.availability || filters.availability === 'all' || normalizeText(applicant.availability).includes(normalizeText(filters.availability))
    const matchesDistance = matchesApplicantDistance(applicant.distanceKm, filters.distance)

    return matchesStatus && matchesMicrojob && matchesCourses && matchesAvailability && matchesDistance
  })
}

export async function getCompanyCourses(filters = {}, sourceCourses = []) {
  return cloneValue(sourceCourses).filter((course) => {
    const matchesCategory = !filters.category || filters.category === 'all' || course.category === filters.category
    const matchesLevel = !filters.level || filters.level === 'all' || course.level === filters.level
    const matchesStatus = !filters.status || filters.status === 'all' || course.status === filters.status
    const matchesSkill =
      !filters.skillUnlocked || filters.skillUnlocked === 'all' || normalizeText(course.skillUnlocked).includes(normalizeText(filters.skillUnlocked))

    return matchesCategory && matchesLevel && matchesStatus && matchesSkill
  })
}

function persistCompanyMicrojobs() {
  const state = appStateStore.getState()
  const companyId = getActiveCompanyId()
  const courses = state.courses.filter((course) => course.companyId === companyId)
  return cloneValue(state.microjobs.filter((microjob) => microjob.companyId === companyId)).map((microjob) =>
    withMicrojobDescription(microjob, courses)
  )
}

function persistCompanyCourses() {
  const state = appStateStore.getState()
  const companyId = getActiveCompanyId()
  return cloneValue(state.courses.filter((course) => course.companyId === companyId))
}

export async function createMicrojob(payload) {
  ensureStore()
  const companyId = getActiveCompanyId()
  const profile = getCompanyProfileById(companyId)
  const normalizedShortDescription = limitWords(payload.shortDescription, 150)
  const id = appStateStore.generateId('company-microjob')

  const newMicrojob = {
    id,
    companyId,
    company: profile?.commercialName || 'Mi empresa',
    title: payload.title,
    shortDescription: normalizedShortDescription,
    description: normalizedShortDescription,
    microjobType: payload.microjobType,
    modality: payload.modality,
    originMode: payload.originMode || 'both',
    locationName: payload.locationName || 'Remoto',
    address: payload.address || 'Trabajo en línea',
    latitude: payload.latitude ?? null,
    longitude: payload.longitude ?? null,
    estimatedPay: payload.estimatedPay,
    estimatedPayAmount: Number(String(payload.estimatedPay).replace(/[^\d.]/g, '')) || 0,
    estimatedDuration: payload.estimatedDuration,
    requiredSkill: payload.requiredSkill,
    requiredCourseId: payload.requiredCourseId || null,
    scheduleWindows: payload.scheduleWindows || [],
    availableDates: payload.availableDates || [],
    capacity: Number(payload.capacity) || 0,
    supervisorName: payload.supervisorName,
    documents: payload.documents || [],
    status: payload.status,
    applicantsAssociated: [],
    imageSrc: payload.imagePreview || null,
    imageAlt: payload.imageAlt,
    referenceName: payload.referenceName,
    locationType: toLocationType(payload.modality),
    distanceKm: toLocationType(payload.modality) === 'remote' ? null : 2,
  }

  appStateStore.patchState((state) => {
    state.microjobs = [newMicrojob, ...state.microjobs]
    return state
  })

  return {
    microjobs: persistCompanyMicrojobs(),
    createdMicrojob: newMicrojob,
    successMessage: payload.status === 'Borrador' ? 'Borrador guardado' : 'Microtrabajo publicado',
  }
}

export async function updateMicrojob(microjobId, payload) {
  ensureStore()
  const normalizedShortDescription = limitWords(payload.shortDescription, 150)

  appStateStore.patchState((state) => {
    state.microjobs = state.microjobs.map((microjob) => {
      if (microjob.id !== microjobId) return microjob
      return {
        ...microjob,
        ...payload,
        shortDescription: normalizedShortDescription,
        description: normalizedShortDescription,
        estimatedPayAmount: Number(String(payload.estimatedPay).replace(/[^\d.]/g, '')) || microjob.estimatedPayAmount,
        capacity: Number(payload.capacity) || microjob.capacity,
        imageSrc: payload.imagePreview || microjob.imageSrc,
        imageAlt: payload.imageAlt,
        locationType: toLocationType(payload.modality),
        distanceKm: toLocationType(payload.modality) === 'remote' ? null : microjob.distanceKm ?? 2,
      }
    })
    return state
  })

  const microjobs = persistCompanyMicrojobs()
  return { microjobs, updatedMicrojob: microjobs.find((microjob) => microjob.id === microjobId) ?? null }
}

export async function deleteMicrojob(microjobId) {
  ensureStore()
  appStateStore.patchState((state) => {
    state.microjobs = state.microjobs.filter((microjob) => microjob.id !== microjobId)
    // Remove orphaned applications for this microjob.
    state.applications = state.applications.filter((application) => application.microjobId !== microjobId)
    return state
  })

  return { microjobs: persistCompanyMicrojobs(), successMessage: 'Microtrabajo eliminado' }
}

export async function createCourse(payload) {
  ensureStore()
  const companyId = getActiveCompanyId()
  const durationMinutes = Number(payload.durationMinutes) || 0
  const normalizedDescription = limitWords(payload.description, 150)
  const id = appStateStore.generateId('company-course')

  const newCourse = {
    id,
    companyId,
    title: payload.title,
    description: normalizedDescription,
    category: payload.category,
    level: payload.level,
    durationLabel: durationMinutes >= 60 ? `${Math.round(durationMinutes / 60)} h` : `${durationMinutes} min`,
    durationMinutes,
    skillUnlocked: payload.skillUnlocked,
    assessmentType: payload.assessmentType,
    imageSrc: payload.imagePreview || null,
    imageAlt: payload.imageAlt,
    relatedMicrojobIds: payload.relatedMicrojobIds || [],
    status: payload.status,
    modules: (payload.modules || []).map((module, index) => ({
      ...module,
      id: module.id || appStateStore.generateId('company-module'),
      order: module.order ?? index + 1,
      status: payload.status,
    })),
  }

  appStateStore.patchState((state) => {
    state.courses = [newCourse, ...state.courses]
    return state
  })

  return {
    courses: persistCompanyCourses(),
    createdCourse: newCourse,
    successMessage: payload.status === 'Borrador' ? 'Borrador guardado' : 'Curso creado',
  }
}

export async function updateCourse(courseId, payload) {
  ensureStore()
  const durationMinutes = Number(payload.durationMinutes) || 0
  const normalizedDescription = limitWords(payload.description, 150)

  appStateStore.patchState((state) => {
    state.courses = state.courses.map((course) => {
      if (course.id !== courseId) return course
      return {
        ...course,
        ...payload,
        description: normalizedDescription,
        durationMinutes,
        durationLabel: durationMinutes >= 60 ? `${Math.round(durationMinutes / 60)} h` : `${durationMinutes} min`,
        imageSrc: payload.imagePreview || course.imageSrc,
        imageAlt: payload.imageAlt,
        modules: (payload.modules || []).map((module, index) => ({
          ...module,
          id: module.id || appStateStore.generateId('company-module'),
          order: module.order ?? index + 1,
          status: payload.status,
        })),
      }
    })
    return state
  })

  const courses = persistCompanyCourses()
  return { courses, updatedCourse: courses.find((course) => course.id === courseId) ?? null }
}

export async function deleteCourse(courseId) {
  ensureStore()
  appStateStore.patchState((state) => {
    state.courses = state.courses.filter((course) => course.id !== courseId)
    // Detach the course requirement from any microjob that referenced it.
    state.microjobs = state.microjobs.map((microjob) =>
      microjob.requiredCourseId === courseId ? { ...microjob, requiredCourseId: null } : microjob
    )
    return state
  })

  return { courses: persistCompanyCourses(), successMessage: 'Curso eliminado' }
}

export async function saveCourseModule(courseId, modulePayload) {
  ensureStore()
  appStateStore.patchState((state) => {
    state.courses = state.courses.map((course) => {
      if (course.id !== courseId) return course

      const exists = course.modules.some((module) => module.id === modulePayload.id)
      const modules = exists
        ? course.modules.map((module) => (module.id === modulePayload.id ? { ...module, ...modulePayload } : module))
        : [...course.modules, { ...modulePayload, id: modulePayload.id || appStateStore.generateId('company-module'), status: course.status }]

      return {
        ...course,
        modules: modules.sort((left, right) => Number(left.order) - Number(right.order)),
      }
    })
    return state
  })

  return { courses: persistCompanyCourses(), successMessage: 'Módulo actualizado' }
}

export async function deleteCourseModule(courseId, moduleId) {
  ensureStore()
  appStateStore.patchState((state) => {
    state.courses = state.courses.map((course) =>
      course.id === courseId ? { ...course, modules: course.modules.filter((module) => module.id !== moduleId) } : course
    )
    return state
  })

  return { courses: persistCompanyCourses(), successMessage: 'Módulo eliminado' }
}

export async function getMicrojobDetail(microjobId, sourceMicrojobs = [], sourceCourses = []) {
  const microjob = cloneValue(sourceMicrojobs).find((item) => item.id === microjobId)
  if (!microjob) return null

  const relatedCourse = sourceCourses.find((course) => course.id === microjob.requiredCourseId)
  return {
    ...withMicrojobDescription(microjob, sourceCourses),
    requiredCourseLabel: relatedCourse?.title ?? null,
    mapsUrl: createMapsUrl(microjob.latitude, microjob.longitude),
  }
}

export async function getCourseDetail(courseId, sourceCourses = [], sourceMicrojobs = []) {
  const course = cloneValue(sourceCourses).find((item) => item.id === courseId)
  if (!course) return null

  return {
    ...course,
    relatedMicrojobs: cloneValue(sourceMicrojobs).filter((microjob) => course.relatedMicrojobIds.includes(microjob.id)),
  }
}

export async function getApplicantDetail(applicantId, sourceApplicants = [], sourceMicrojobs = []) {
  const applicant = cloneValue(sourceApplicants).find((item) => item.id === applicantId)
  if (!applicant) return null

  return {
    ...applicant,
    microjob: cloneValue(sourceMicrojobs).find((microjob) => microjob.id === applicant.microjobId),
  }
}

export async function updateApplicantStatus(applicationId, status) {
  ensureStore()
  const acceptedSchedule = {
    assignedDate: 'Por coordinar con la empresa',
    startTime: '09:00',
    endTime: '12:00',
    locationName: 'Según el microtrabajo',
    address: 'Se confirmará al aceptar',
    latitude: null,
    longitude: null,
    mapsUrl: null,
    directions: 'La empresa compartirá los detalles finales de coordinación.',
    contactName: 'Responsable del microtrabajo',
    instructions: 'Mantente atento a las indicaciones de la empresa.',
    recommendations: ['Confirma tu disponibilidad.', 'Llega o conéctate con puntualidad.'],
  }

  appStateStore.patchState((state) => {
    state.applications = state.applications.map((application) => {
      if (application.id !== applicationId) return application
      return {
        ...application,
        status,
        schedule: status === 'Aceptada' ? application.schedule || acceptedSchedule : application.schedule,
        result:
          status === 'Aceptada'
            ? 'Fuiste seleccionado(a) para este microtrabajo.'
            : status === 'Rechazada'
              ? 'La empresa decidió continuar con otros perfiles.'
              : application.result,
      }
    })
    return state
  })

  const companyId = getActiveCompanyId()
  const state = appStateStore.getState()
  return {
    applicants: buildApplicantsForCompany(state, companyId),
    successMessage: status === 'Aceptada' ? 'Postulante aceptado' : 'Postulante rechazado',
  }
}

export function getCompanyStatusBlocks(profile) {
  return getProfileStatusBlocks(profile)
}

export function hydrateCompanyProfile(profile) {
  ensureStore()
  const hydrated = withDerivedProfileMeta(profile)

  // Persist profile edits back to the store.
  appStateStore.patchState((state) => {
    state.companyProfiles = state.companyProfiles.map((item) => (item.id === hydrated.id ? hydrated : item))
    return state
  })

  return hydrated
}
