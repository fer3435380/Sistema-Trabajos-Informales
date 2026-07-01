import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout, resetDemoData } from '../../services/authRepository'
import AccountActionModal from '../../components/worker/AccountActionModal'
import ApplicationDetailModal from '../../components/worker/ApplicationDetailModal'
import ApplicationScheduleModal from '../../components/worker/ApplicationScheduleModal'
import CourseDetailModal from '../../components/worker/CourseDetailModal'
import CoursePlayerModal from '../../components/worker/CoursePlayerModal'
import FilterModal from '../../components/worker/FilterModal'
import MicrojobDetailModal from '../../components/worker/MicrojobDetailModal'
import WorkerApplications from '../../components/worker/WorkerApplications'
import WorkerAvailableCourses from '../../components/worker/WorkerAvailableCourses'
import WorkerDashboardShell from '../../components/worker/WorkerDashboardShell'
import WorkerHeader from '../../components/worker/WorkerHeader'
import WorkerInProgressCourses from '../../components/worker/WorkerInProgressCourses'
import WorkerMicrojobs from '../../components/worker/WorkerMicrojobs'
import WorkerProfileStatus from '../../components/worker/WorkerProfileStatus'
import WorkerSettingsPanel from '../../components/worker/WorkerSettingsPanel'
import WorkerSidebar from '../../components/worker/WorkerSidebar'
import WorkerSummaryCards from '../../components/worker/WorkerSummaryCards'
import {
  advanceCourseModule,
  applyToMicrojob,
  cancelApplication,
  getApplicationDetail,
  getApplications,
  getAvailableCourses,
  getCourseDetail,
  getCoursesInProgress,
  getMicrojobDetail,
  getMicrojobs,
  getWorkerDashboardState,
  getWorkerDashboardSummary,
  startCourse,
} from '../../services/workerDashboardRepository'
import { connectNotificationSocket, upsertNotification } from '../../services/notificationSocket'

const sectionIds = {
  panel: 'panel',
  microjobs: 'microjobs',
  applications: 'applications',
  availableCourses: 'availableCourses',
  coursesInProgress: 'coursesInProgress',
  profileStatus: 'profileStatus',
  configuration: 'configuration',
}

const navigationGroups = [
  {
    label: 'PRINCIPAL',
    items: [
      { id: sectionIds.panel, label: 'Panel', icon: 'panel' },
      { id: sectionIds.microjobs, label: 'Microtrabajos', icon: 'microjobs' },
      { id: sectionIds.applications, label: 'Postulaciones', icon: 'applications' },
    ],
  },
  {
    label: 'FORMACIÓN',
    items: [
      { id: sectionIds.availableCourses, label: 'Cursos disponibles', icon: 'availableCourses' },
      { id: sectionIds.coursesInProgress, label: 'En progreso', icon: 'coursesInProgress' },
    ],
  },
  {
    label: 'CUENTA',
    items: [
      { id: sectionIds.profileStatus, label: 'Estado del perfil', icon: 'profileStatus' },
      { id: sectionIds.configuration, label: 'Configuración', icon: 'configuration' },
    ],
  },
]

const emptyApplicationFilters = {
  status: 'all',
  date: 'all',
  modality: 'all',
  payment: 'all',
}

const emptyMicrojobFilters = {
  distance: 'all',
  modality: 'all',
  payment: 'all',
  skill: 'all',
  availability: 'all',
}

const emptyAvailableCourseFilters = {
  category: 'all',
  level: 'all',
  duration: 'all',
  status: 'all',
}

const emptyInProgressCourseFilters = {
  category: 'all',
  level: 'all',
  duration: 'all',
  status: 'all',
}

const applicationFilterSections = [
  {
    key: 'status',
    label: 'Estado',
    options: [
      { value: 'all', label: 'Todos' },
      { value: 'En revisión', label: 'En revisión' },
      { value: 'Aceptada', label: 'Aceptada' },
      { value: 'Completada', label: 'Completada' },
      { value: 'Rechazada', label: 'Rechazada' },
    ],
  },
  {
    key: 'date',
    label: 'Fecha',
    options: [
      { value: 'all', label: 'Todas' },
      { value: 'today', label: 'Hoy' },
      { value: 'last7', label: 'Últimos 7 días' },
      { value: 'last30', label: 'Últimos 30 días' },
    ],
  },
  {
    key: 'modality',
    label: 'Modalidad',
    options: [
      { value: 'all', label: 'Todas' },
      { value: 'Onsite', label: 'Presencial' },
      { value: 'Remote', label: 'Remoto' },
      { value: 'Hybrid', label: 'Híbrido' },
    ],
  },
  {
    key: 'payment',
    label: 'Pago estimado',
    options: [
      { value: 'all', label: 'Todos' },
      { value: 'under10', label: 'Menos de $10' },
      { value: 'between10and20', label: '$10 a $20' },
      { value: 'over20', label: 'Más de $20' },
    ],
  },
]

const microjobFilterSections = [
  {
    key: 'distance',
    label: 'Distancia',
    options: [
      { value: 'all', label: 'Todas' },
      { value: 'upTo2', label: 'Hasta 2 km' },
      { value: 'upTo5', label: 'Hasta 5 km' },
      { value: 'upTo10', label: 'Hasta 10 km' },
      { value: 'remote', label: 'Remoto' },
    ],
  },
  {
    key: 'modality',
    label: 'Modalidad',
    options: [
      { value: 'all', label: 'Todas' },
      { value: 'Onsite', label: 'Presencial' },
      { value: 'Remote', label: 'Remoto' },
      { value: 'Hybrid', label: 'Híbrido' },
    ],
  },
  {
    key: 'payment',
    label: 'Pago estimado',
    options: [
      { value: 'all', label: 'Todos' },
      { value: 'under10', label: 'Menos de $10' },
      { value: 'between10and20', label: '$10 a $20' },
      { value: 'over20', label: 'Más de $20' },
    ],
  },
  {
    key: 'skill',
    label: 'Habilidad',
    options: [
      { value: 'all', label: 'Todas' },
      { value: 'Atención', label: 'Atención al cliente' },
      { value: 'Recolección', label: 'Recolección de datos' },
      { value: 'Herramientas', label: 'Herramientas digitales' },
      { value: 'Validación', label: 'Validación de información' },
    ],
  },
  {
    key: 'availability',
    label: 'Disponibilidad',
    options: [
      { value: 'all', label: 'Todas' },
      { value: 'weekdays', label: 'Entre semana' },
      { value: 'weekend', label: 'Fin de semana' },
      { value: 'flexible', label: 'Flexible' },
    ],
  },
]

const availableCourseFilterSections = [
  {
    key: 'category',
    label: 'Categoría',
    options: [
      { value: 'all', label: 'Todas' },
      { value: 'Empleabilidad', label: 'Empleabilidad' },
      { value: 'Servicio', label: 'Servicio' },
      { value: 'Tecnología', label: 'Tecnología' },
      { value: 'Investigación', label: 'Investigación' },
      { value: 'Alimentos', label: 'Alimentos' },
    ],
  },
  {
    key: 'level',
    label: 'Nivel',
    options: [
      { value: 'all', label: 'Todos' },
      { value: 'Inicial', label: 'Inicial' },
      { value: 'Intermedio', label: 'Intermedio' },
    ],
  },
  {
    key: 'duration',
    label: 'Duración',
    options: [
      { value: 'all', label: 'Todas' },
      { value: 'short', label: 'Hasta 45 min' },
      { value: 'medium', label: '45 a 60 min' },
      { value: 'long', label: 'Más de 60 min' },
    ],
  },
  {
    key: 'status',
    label: 'Estado',
    options: [
      { value: 'all', label: 'Todos' },
      { value: 'Disponible', label: 'Disponible' },
    ],
  },
]

const inProgressCourseFilterSections = [
  {
    key: 'category',
    label: 'Categoría',
    options: [
      { value: 'all', label: 'Todas' },
      { value: 'Servicio', label: 'Servicio' },
      { value: 'Alimentos', label: 'Alimentos' },
      { value: 'Tecnología', label: 'Tecnología' },
      { value: 'Investigación', label: 'Investigación' },
    ],
  },
  {
    key: 'level',
    label: 'Nivel',
    options: [
      { value: 'all', label: 'Todos' },
      { value: 'Inicial', label: 'Inicial' },
      { value: 'Intermedio', label: 'Intermedio' },
    ],
  },
  {
    key: 'duration',
    label: 'Duración',
    options: [
      { value: 'all', label: 'Todas' },
      { value: 'short', label: 'Hasta 45 min' },
      { value: 'medium', label: '45 a 60 min' },
      { value: 'long', label: 'Más de 60 min' },
    ],
  },
  {
    key: 'status',
    label: 'Estado',
    options: [
      { value: 'all', label: 'Todos' },
      { value: 'En progreso', label: 'En progreso' },
      { value: 'Casi completo', label: 'Casi completo' },
    ],
  },
]

function countActiveFilters(filters) {
  return Object.values(filters).filter((value) => value !== 'all').length
}

function formatRelativeDate(isoDate) {
  const currentDate = new Date('2026-06-28T12:00:00')
  const targetDate = new Date(`${isoDate}T12:00:00`)
  const difference = Math.floor(
    (currentDate.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (difference === 0) {
    return 'Hoy'
  }

  if (difference === 1) {
    return 'Ayer'
  }

  if (difference < 7) {
    return `Hace ${difference} días`
  }

  if (difference < 14) {
    return 'Hace 1 semana'
  }

  return `Hace ${Math.floor(difference / 7)} semanas`
}

function formatModality(modality) {
  if (modality === 'Onsite') {
    return 'Presencial'
  }

  if (modality === 'Hybrid') {
    return 'Híbrido'
  }

  return 'Remoto'
}

function formatDuration(durationMinutes) {
  if (durationMinutes < 60) {
    return `${durationMinutes} min`
  }

  const hours = Math.floor(durationMinutes / 60)
  const minutes = durationMinutes % 60

  if (!minutes) {
    return `${hours} h`
  }

  return `${hours} h ${minutes} min`
}

function buildCourseMap(courseCatalog, coursesInProgress) {
  const courseMap = new Map()

  courseCatalog.forEach((course) => {
    courseMap.set(course.id, course)
  })

  coursesInProgress.forEach((course) => {
    courseMap.set(course.id, course)
  })

  return courseMap
}

function buildMicrojobMap(microjobs) {
  const microjobMap = new Map()

  microjobs.forEach((microjob) => {
    microjobMap.set(microjob.id, microjob)
  })

  return microjobMap
}

function enrichApplication(application) {
  return {
    ...application,
    appliedAtLabel: formatRelativeDate(application.appliedAt),
    modalityLabel: formatModality(application.modality),
    locationLabel:
      application.locationName === 'Remoto'
        ? 'Remoto'
        : `${application.locationName} · ${application.address}`,
  }
}

function enrichMicrojob(microjob, courseMap) {
  return {
    ...microjob,
    modalityLabel: formatModality(microjob.modality),
    locationLabel:
      microjob.locationName === 'Remoto'
        ? 'Remoto'
        : `${microjob.locationName} · ${microjob.address}`,
    requiredCourseLabel: microjob.requiredCourseId
      ? courseMap.get(microjob.requiredCourseId)?.title ?? 'Curso requerido'
      : null,
  }
}

function enrichCourse(course, microjobMap) {
  return {
    ...course,
    durationLabel: formatDuration(course.durationMinutes),
    relatedMicrojobTitles: course.relatedMicrojobIds
      .map((microjobId) => microjobMap.get(microjobId)?.title)
      .filter(Boolean),
  }
}

function enrichProfileStatus(profileStatus) {
  return {
    completionPercentage: profileStatus.completionPercentage,
    sections: [
      { id: 'personalData', ...profileStatus.personalData },
      { id: 'education', ...profileStatus.education },
      { id: 'work', ...profileStatus.work },
      { id: 'finance', ...profileStatus.finance },
      { id: 'preferences', ...profileStatus.preferences },
    ],
  }
}

function buildAccountAction(actionType, workerProfile) {
  const actionMap = {
    editProfile: {
      title: 'Editar perfil',
      description: 'Aquí podrás actualizar tus datos personales, experiencia y preferencias.',
      helperText: `${workerProfile.name} tiene un perfil visible con correo ${workerProfile.email} y zona base en ${workerProfile.neighborhood}.`,
      nextStepText:
        'En una fase posterior este flujo abrirá un formulario real conectado al backend de usuarios y aprendizaje.',
    },
    notificationPreferences: {
      title: 'Preferencias de notificación',
      description: 'Podrás decidir qué alertas llegan primero y cómo se priorizan.',
      helperText:
        'Las notificaciones del panel actual usan datos mock, pero ya respetan un contrato útil para backend.',
      nextStepText:
        'Más adelante podrás activar o desactivar alertas de cursos, postulaciones y oportunidades cercanas.',
    },
    privacy: {
      title: 'Privacidad básica',
      description: 'Controla qué datos compartes cuando postulas o continúas un microtrabajo.',
      helperText:
        'Por ahora no se envían datos reales. Esta pantalla simula el punto de control de privacidad futura.',
      nextStepText:
        'En una fase posterior se conectarán permisos reales, visibilidad de perfil y preferencias de uso de datos.',
    },
    logout: {
      title: 'Cerrar sesión',
      description: 'El cierre de sesión todavía es simulado en esta fase visual.',
      helperText:
        'No hay autenticación real ni JWT conectados aún, así que esta acción todavía no invalida una sesión protegida.',
      nextStepText:
        'Cuando exista autenticación protegida, este flujo limpiará sesión y redirigirá a login.',
    },
    switchAccount: {
      title: 'Iniciar sesión con otra cuenta',
      description: 'El cambio de cuenta también se mantiene como mock por ahora.',
      helperText:
        'La interfaz ya reserva este espacio para alternar cuentas cuando exista login real.',
      nextStepText:
        'En una fase posterior te llevará a autenticación para cambiar entre cuentas sin romper la experiencia.',
    },
  }

  return actionMap[actionType] ?? null
}

function WorkerDashboard() {
  const navigate = useNavigate()
  const [workerProfile, setWorkerProfile] = useState(null)
  const [applications, setApplications] = useState([])
  const [microjobs, setMicrojobs] = useState([])
  const [courseCatalog, setCourseCatalog] = useState([])
  const [coursesInProgress, setCoursesInProgress] = useState([])
  const [profileStatus, setProfileStatus] = useState(null)
  const [settings, setSettings] = useState([])
  const [notifications, setNotifications] = useState([])

  const [visibleApplications, setVisibleApplications] = useState([])
  const [visibleMicrojobs, setVisibleMicrojobs] = useState({
    unlockedMicrojobs: [],
    lockedMicrojobs: [],
  })
  const [visibleAvailableCourses, setVisibleAvailableCourses] = useState([])
  const [visibleCoursesInProgress, setVisibleCoursesInProgress] = useState([])
  const [summary, setSummary] = useState({
    totalApplications: 0,
    acceptedApplications: 0,
    nearbyMicrojobs: [],
    availableCourseCount: 0,
    inProgressCourses: [],
    profileCompletionPercentage: 0,
  })

  const [activeSection, setActiveSection] = useState(sectionIds.applications)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [activeFilterModal, setActiveFilterModal] = useState(null)
  const [applicationFilters, setApplicationFilters] = useState(emptyApplicationFilters)
  const [microjobFilters, setMicrojobFilters] = useState(emptyMicrojobFilters)
  const [availableCourseFilters, setAvailableCourseFilters] = useState(emptyAvailableCourseFilters)
  const [inProgressCourseFilters, setInProgressCourseFilters] = useState(emptyInProgressCourseFilters)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [selectedScheduleApplication, setSelectedScheduleApplication] = useState(null)
  const [selectedMicrojob, setSelectedMicrojob] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [activeCoursePlayer, setActiveCoursePlayer] = useState(null)
  const [selectedAccountAction, setSelectedAccountAction] = useState(null)
  const [toastMessage, setToastMessage] = useState('')
  const [isReady, setIsReady] = useState(false)

  const courseMap = useMemo(
    () => buildCourseMap(courseCatalog, coursesInProgress),
    [courseCatalog, coursesInProgress]
  )
  const microjobMap = useMemo(() => buildMicrojobMap(microjobs), [microjobs])
  const appliedMicrojobIds = useMemo(
    () => new Set(applications.map((application) => application.microjobId)),
    [applications]
  )

  useEffect(() => {
    async function loadDashboardState() {
      const dashboardState = await getWorkerDashboardState()

      setWorkerProfile(dashboardState.workerProfile)
      setApplications(dashboardState.applications)
      setMicrojobs(dashboardState.microjobs)
      setCourseCatalog(dashboardState.courseCatalog)
      setCoursesInProgress(dashboardState.coursesInProgress)
      setProfileStatus(dashboardState.profileStatus)
      setSettings(dashboardState.settings)
      setNotifications(dashboardState.notifications)
      setIsReady(true)
    }

    loadDashboardState()
  }, [])

  useEffect(() => {
    if (!isReady) {
      return
    }

    async function refreshVisibleData() {
      const [nextApplications, nextMicrojobs, nextAvailableCourses, nextProgressCourses, nextSummary] =
        await Promise.all([
          getApplications(applications, applicationFilters),
          getMicrojobs(microjobs, microjobFilters),
          getAvailableCourses(courseCatalog, coursesInProgress, availableCourseFilters),
          getCoursesInProgress(coursesInProgress, inProgressCourseFilters),
          getWorkerDashboardSummary({
            applications,
            microjobs,
            courseCatalog,
            coursesInProgress,
            profileStatus,
          }),
        ])

      setVisibleApplications(nextApplications.map((application) => enrichApplication(application)))
      setVisibleMicrojobs({
        unlockedMicrojobs: nextMicrojobs.unlockedMicrojobs.map((microjob) =>
          enrichMicrojob(microjob, courseMap)
        ),
        lockedMicrojobs: nextMicrojobs.lockedMicrojobs.map((microjob) =>
          enrichMicrojob(microjob, courseMap)
        ),
      })
      setVisibleAvailableCourses(
        nextAvailableCourses.map((course) => enrichCourse(course, microjobMap))
      )
      setVisibleCoursesInProgress(
        nextProgressCourses.map((course) => enrichCourse(course, microjobMap))
      )
      setSummary({
        ...nextSummary,
        nearbyMicrojobs: nextSummary.nearbyMicrojobs.map((microjob) =>
          enrichMicrojob(microjob, courseMap)
        ),
        inProgressCourses: nextSummary.inProgressCourses.map((course) =>
          enrichCourse(course, microjobMap)
        ),
      })
    }

    refreshVisibleData()
  }, [
    applicationFilters,
    applications,
    availableCourseFilters,
    courseCatalog,
    courseMap,
    coursesInProgress,
    inProgressCourseFilters,
    isReady,
    microjobFilters,
    microjobMap,
    microjobs,
    profileStatus,
  ])

  useEffect(() => {
    if (!toastMessage) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setToastMessage('')
    }, 2400)

    return () => window.clearTimeout(timeoutId)
  }, [toastMessage])

  useEffect(() => {
    if (!isReady) {
      return undefined
    }

    const notificationSocket = connectNotificationSocket({
      onNotification: (notification) => {
        setNotifications((currentNotifications) => upsertNotification(currentNotifications, notification))
        setToastMessage(notification.description)
      },
    })

    return () => notificationSocket.close()
  }, [isReady])

  async function openApplicationDetail(applicationId) {
    const detail = await getApplicationDetail(applicationId, applications)
    setSelectedApplication(detail ? enrichApplication(detail) : null)
  }

  async function openApplicationSchedule(applicationId) {
    const detail = await getApplicationDetail(applicationId, applications)
    setSelectedScheduleApplication(detail ? enrichApplication(detail) : null)
  }

  async function openMicrojobDetail(microjobId) {
    const detail = await getMicrojobDetail(microjobId, microjobs)
    setSelectedMicrojob(detail ? enrichMicrojob(detail, courseMap) : null)
  }

  async function openCourseDetail(courseId) {
    const detail = await getCourseDetail(courseId, courseCatalog, coursesInProgress)
    setSelectedCourse(detail ? enrichCourse(detail, microjobMap) : null)
  }

  async function handleApplyToMicrojob(microjobId) {
    const result = await applyToMicrojob(microjobId, applications, microjobs)

    setApplications(result.applications)
    setSelectedMicrojob(null)
    setActiveSection(sectionIds.applications)
    setToastMessage(result.successMessage || 'Postulación enviada')
  }

  async function handleCancelApplication(applicationId) {
    const result = await cancelApplication(applicationId)

    setApplications(result.applications)
    setSelectedApplication(null)
    if (result.successMessage) {
      setToastMessage(result.successMessage)
    }
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function handleResetDemoData() {
    resetDemoData()
    navigate('/login')
  }

  async function handleStartCourse(courseId) {
    const result = await startCourse(courseId, courseCatalog, coursesInProgress)

    setCoursesInProgress(result.coursesInProgress)
    setSelectedCourse(null)
    setActiveSection(sectionIds.coursesInProgress)
    setToastMessage(result.successMessage || 'Curso agregado a progreso')
  }

  async function handleContinueCourse(courseId) {
    const detail = await getCourseDetail(courseId, courseCatalog, coursesInProgress)
    setActiveCoursePlayer(detail ? enrichCourse(detail, microjobMap) : null)
  }

  async function handleAdvanceCourse(courseId) {
    const result = await advanceCourseModule(courseId, coursesInProgress)

    setCoursesInProgress(result.coursesInProgress)
    setActiveCoursePlayer(
      result.updatedCourse ? enrichCourse(result.updatedCourse, microjobMap) : null
    )
    setToastMessage(result.successMessage || 'Avance del curso actualizado')
  }

  function handleSectionChange(sectionId) {
    setActiveSection(sectionId)
    setIsMobileSidebarOpen(false)
    setIsNotificationPanelOpen(false)
    setIsAccountMenuOpen(false)
  }

  function handleOpenRequiredCourse(courseId) {
    openCourseDetail(courseId)
  }

  function handleOpenAccountAction(actionType) {
    const action = buildAccountAction(actionType, workerProfile)
    setSelectedAccountAction(action)
  }

  function renderOverviewSection() {
    return (
      <div className="space-y-4">
        <WorkerSummaryCards
          summary={summary}
          onNavigate={handleSectionChange}
          sectionIds={sectionIds}
        />

        <section className="grid grid-cols-1 gap-3 xl:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[1.45rem] border border-[var(--color-primary-border)] bg-white p-5 shadow-[0_18px_32px_rgba(4,44,83,0.05)]">
            <p className="text-sm font-semibold text-[var(--color-primary)]">Siguiente paso</p>
            <h2 className="mt-2 text-[1.4rem] font-extrabold tracking-[-0.05em] text-[var(--color-primary-strong)]">
              Mantén activas tus oportunidades
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-text-muted)]">
              Revisa tus postulaciones aceptadas, desbloquea cursos clave y prioriza los microtrabajos más cercanos para reducir tiempos de traslado.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleSectionChange(sectionIds.applications)}
                className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
              >
                Ver postulaciones
              </button>
              <button
                type="button"
                onClick={() => handleSectionChange(sectionIds.microjobs)}
                className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] border border-[var(--color-primary-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
              >
                Explorar microtrabajos
              </button>
            </div>
          </article>

          <article className="rounded-[1.45rem] border border-[var(--color-primary-border)] bg-[linear-gradient(180deg,#042c53_0%,#185fa5_100%)] p-5 text-white shadow-[0_18px_32px_rgba(4,44,83,0.12)]">
            <p className="text-sm font-semibold text-white/75">Ruta sugerida</p>
            <h2 className="mt-2 text-[1.4rem] font-extrabold tracking-[-0.05em]">
              {summary.availableCourseCount} cursos disponibles para desbloquear más tareas
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/80">
              La lógica de ranking y desbloqueo hoy está simulada en frontend. Más adelante la resolverá el jobs-service y aquí solo se mostrará el resultado del backend.
            </p>
          </article>
        </section>
      </div>
    )
  }

  function renderActiveSection() {
    if (activeSection === sectionIds.panel) {
      return renderOverviewSection()
    }

    if (activeSection === sectionIds.microjobs) {
      return (
        <WorkerMicrojobs
          unlockedMicrojobs={visibleMicrojobs.unlockedMicrojobs}
          lockedMicrojobs={visibleMicrojobs.lockedMicrojobs}
          activeFiltersCount={countActiveFilters(microjobFilters)}
          onOpenFilters={() => setActiveFilterModal('microjobs')}
          appliedMicrojobIds={appliedMicrojobIds}
          onOpenDetail={openMicrojobDetail}
          onApply={handleApplyToMicrojob}
          onOpenRequiredCourse={handleOpenRequiredCourse}
        />
      )
    }

    if (activeSection === sectionIds.availableCourses) {
      return (
        <WorkerAvailableCourses
          courses={visibleAvailableCourses}
          activeFiltersCount={countActiveFilters(availableCourseFilters)}
          onOpenFilters={() => setActiveFilterModal('availableCourses')}
          onOpenDetail={openCourseDetail}
          onStartCourse={handleStartCourse}
        />
      )
    }

    if (activeSection === sectionIds.coursesInProgress) {
      return (
        <WorkerInProgressCourses
          courses={visibleCoursesInProgress}
          activeFiltersCount={countActiveFilters(inProgressCourseFilters)}
          onOpenFilters={() => setActiveFilterModal('coursesInProgress')}
          onOpenDetail={openCourseDetail}
          onContinueCourse={handleContinueCourse}
          onNavigateToAvailableCourses={() => handleSectionChange(sectionIds.availableCourses)}
        />
      )
    }

    if (activeSection === sectionIds.profileStatus && profileStatus) {
      return (
        <WorkerProfileStatus
          profileStatus={enrichProfileStatus(profileStatus)}
          workerProfile={workerProfile}
          onEditProfile={() => handleOpenAccountAction('editProfile')}
          onOpenSettings={() => handleSectionChange(sectionIds.configuration)}
        />
      )
    }

    if (activeSection === sectionIds.configuration) {
      return (
        <WorkerSettingsPanel
          settings={settings}
          workerProfile={workerProfile}
          onAction={(setting) => {
            if (setting.actionType === 'logout' || setting.actionType === 'switchAccount') {
              handleLogout()
              return
            }
            handleOpenAccountAction(setting.actionType)
          }}
          onResetDemoData={handleResetDemoData}
        />
      )
    }

    return (
      <WorkerApplications
        applications={visibleApplications}
        activeFiltersCount={countActiveFilters(applicationFilters)}
        onOpenFilters={() => setActiveFilterModal('applications')}
        onOpenDetail={openApplicationDetail}
        onOpenSchedule={openApplicationSchedule}
        onCancel={handleCancelApplication}
        onNavigateToMicrojobs={() => handleSectionChange(sectionIds.microjobs)}
      />
    )
  }

  if (!isReady || !workerProfile || !profileStatus) {
    return (
      <main className="min-h-screen bg-[var(--color-primary-softer)] px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-[1.5rem] border border-[var(--color-primary-border)] bg-white p-8 text-center shadow-[0_18px_32px_rgba(4,44,83,0.05)]">
          <p className="text-sm font-semibold text-[var(--color-primary)]">Cargando</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.05em] text-[var(--color-primary-strong)]">
            Preparando tu dashboard
          </h1>
        </div>
      </main>
    )
  }

  return (
    <>
      <WorkerDashboardShell
        sidebar={
          <WorkerSidebar
            activeSection={activeSection}
            navigationGroups={navigationGroups}
            isCollapsed={isSidebarCollapsed}
            isMobileOpen={isMobileSidebarOpen}
            onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)}
            onSelectSection={handleSectionChange}
          />
        }
        header={
          <WorkerHeader
            workerName={workerProfile.name}
            workerProfile={workerProfile}
            unreadNotifications={notifications.filter((notification) => notification.isUnread).length}
            notifications={notifications}
            isNotificationPanelOpen={isNotificationPanelOpen}
            isAccountMenuOpen={isAccountMenuOpen}
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleDesktopSidebar={() => setIsSidebarCollapsed((currentValue) => !currentValue)}
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
            onToggleNotifications={() => {
              setIsAccountMenuOpen(false)
              setIsNotificationPanelOpen((currentValue) => !currentValue)
            }}
            onCloseNotifications={() => setIsNotificationPanelOpen(false)}
            onToggleAccountMenu={() => {
              setIsNotificationPanelOpen(false)
              setIsAccountMenuOpen((currentValue) => !currentValue)
            }}
            onCloseAccountMenu={() => setIsAccountMenuOpen(false)}
            onViewProfile={() => handleSectionChange(sectionIds.profileStatus)}
            onEditProfile={() => handleOpenAccountAction('editProfile')}
            onOpenSettings={() => handleSectionChange(sectionIds.configuration)}
            onSwitchAccount={handleLogout}
            onLogout={handleLogout}
          />
        }
      >
        {renderActiveSection()}
      </WorkerDashboardShell>

      <FilterModal
        key={`applications-${JSON.stringify(applicationFilters)}`}
        isOpen={activeFilterModal === 'applications'}
        title="Filtrar postulaciones"
        description="Aplica filtros por estado, fecha, modalidad o pago estimado."
        sections={applicationFilterSections}
        initialValues={applicationFilters}
        onApply={(values) => {
          setApplicationFilters(values)
          setActiveFilterModal(null)
        }}
        onClear={(values) => {
          setApplicationFilters(values)
          setActiveFilterModal(null)
        }}
        onClose={() => setActiveFilterModal(null)}
      />

      <FilterModal
        key={`microjobs-${JSON.stringify(microjobFilters)}`}
        isOpen={activeFilterModal === 'microjobs'}
        title="Filtrar microtrabajos"
        description="Refina oportunidades por distancia, modalidad, pago, habilidad y disponibilidad."
        sections={microjobFilterSections}
        initialValues={microjobFilters}
        onApply={(values) => {
          setMicrojobFilters(values)
          setActiveFilterModal(null)
        }}
        onClear={(values) => {
          setMicrojobFilters(values)
          setActiveFilterModal(null)
        }}
        onClose={() => setActiveFilterModal(null)}
      />

      <FilterModal
        key={`available-courses-${JSON.stringify(availableCourseFilters)}`}
        isOpen={activeFilterModal === 'availableCourses'}
        title="Filtrar cursos disponibles"
        description="Encuentra cursos por categoría, nivel, duración y estado."
        sections={availableCourseFilterSections}
        initialValues={availableCourseFilters}
        onApply={(values) => {
          setAvailableCourseFilters(values)
          setActiveFilterModal(null)
        }}
        onClear={(values) => {
          setAvailableCourseFilters(values)
          setActiveFilterModal(null)
        }}
        onClose={() => setActiveFilterModal(null)}
      />

      <FilterModal
        key={`progress-courses-${JSON.stringify(inProgressCourseFilters)}`}
        isOpen={activeFilterModal === 'coursesInProgress'}
        title="Filtrar cursos en progreso"
        description="Organiza tus cursos activos por categoría, nivel, duración o estado."
        sections={inProgressCourseFilterSections}
        initialValues={inProgressCourseFilters}
        onApply={(values) => {
          setInProgressCourseFilters(values)
          setActiveFilterModal(null)
        }}
        onClear={(values) => {
          setInProgressCourseFilters(values)
          setActiveFilterModal(null)
        }}
        onClose={() => setActiveFilterModal(null)}
      />

      <ApplicationDetailModal
        application={selectedApplication}
        isOpen={Boolean(selectedApplication)}
        onClose={() => setSelectedApplication(null)}
        onCancel={handleCancelApplication}
      />

      <ApplicationScheduleModal
        application={selectedScheduleApplication}
        isOpen={Boolean(selectedScheduleApplication)}
        onClose={() => setSelectedScheduleApplication(null)}
      />

      <MicrojobDetailModal
        microjob={selectedMicrojob}
        isOpen={Boolean(selectedMicrojob)}
        onClose={() => setSelectedMicrojob(null)}
        onApply={handleApplyToMicrojob}
      />

      <CourseDetailModal
        course={selectedCourse}
        isOpen={Boolean(selectedCourse)}
        onClose={() => setSelectedCourse(null)}
        onStartCourse={handleStartCourse}
      />

      <CoursePlayerModal
        course={activeCoursePlayer}
        isOpen={Boolean(activeCoursePlayer)}
        onClose={() => setActiveCoursePlayer(null)}
        onMarkCompleted={handleAdvanceCourse}
      />

      <AccountActionModal
        action={selectedAccountAction}
        isOpen={Boolean(selectedAccountAction)}
        onClose={() => setSelectedAccountAction(null)}
      />

      {toastMessage ? (
        <div className="fixed bottom-4 right-4 z-[130] max-w-sm rounded-[1rem] border border-[var(--color-primary-border)] bg-white px-4 py-3 shadow-[0_18px_32px_rgba(4,44,83,0.14)]">
          <p className="text-sm font-semibold text-[var(--color-primary-strong)]">
            {toastMessage}
          </p>
        </div>
      ) : null}
    </>
  )
}

export default WorkerDashboard
