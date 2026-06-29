import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout, resetDemoData } from '../../services/authRepository'
import CompanyApplicants from '../../components/company/CompanyApplicants'
import CompanyBillingSummary from '../../components/company/CompanyBillingSummary'
import CompanyCourses from '../../components/company/CompanyCourses'
import CompanyDashboardShell from '../../components/company/CompanyDashboardShell'
import CompanyHeader from '../../components/company/CompanyHeader'
import CompanyProfileEditModal from '../../components/company/CompanyProfileEditModal'
import CompanyMicrojobs from '../../components/company/CompanyMicrojobs'
import CompanyModules from '../../components/company/CompanyModules'
import CompanyProfileStatus from '../../components/company/CompanyProfileStatus'
import CompanySettingsPanel from '../../components/company/CompanySettingsPanel'
import CompanySidebar from '../../components/company/CompanySidebar'
import CompanySummaryCards from '../../components/company/CompanySummaryCards'
import ApplicantDetailModal from '../../components/company/ApplicantDetailModal'
import CourseDetailModal from '../../components/company/CourseDetailModal'
import CourseFormWizard from '../../components/company/CourseFormWizard'
import FilterModal from '../../components/company/FilterModal'
import MicrojobDetailModal from '../../components/company/MicrojobDetailModal'
import MicrojobFormWizard from '../../components/company/MicrojobFormWizard'
import { ModuleEditorModal } from '../../components/company/ModuleBuilder'
import { workModeLabels } from '../../data/mockCompanyData'
import {
  createCourse,
  createMicrojob,
  deleteCourse,
  deleteCourseModule,
  deleteMicrojob,
  getApplicantDetail,
  getCompanyCourses,
  getCompanyDashboardState,
  getCompanyDashboardSummary,
  getCompanyMicrojobs,
  getCompanyApplicants,
  getCompanyStatusBlocks,
  getCourseDetail,
  hydrateCompanyProfile,
  getMicrojobDetail,
  saveCourseModule,
  updateCourse,
  updateApplicantStatus,
  updateMicrojob,
} from '../../services/companyDashboardRepository'

const sectionIds = {
  panel: 'panel',
  microjobs: 'microjobs',
  applicants: 'applicants',
  courses: 'courses',
  modules: 'modules',
  companyStatus: 'companyStatus',
  billing: 'billing',
  configuration: 'configuration',
}

const navigationGroups = [
  {
    label: 'PRINCIPAL',
    items: [
      { id: sectionIds.panel, label: 'Panel', icon: 'panel' },
      { id: sectionIds.microjobs, label: 'Microtrabajos', icon: 'microjobs' },
      { id: sectionIds.applicants, label: 'Postulantes', icon: 'applicants' },
    ],
  },
  {
    label: 'FORMACIÓN',
    items: [
      { id: sectionIds.courses, label: 'Cursos', icon: 'courses' },
      { id: sectionIds.modules, label: 'Módulos', icon: 'modules' },
    ],
  },
  {
    label: 'NEGOCIO',
    items: [
      { id: sectionIds.companyStatus, label: 'Estado de la empresa', icon: 'companyStatus' },
      { id: sectionIds.billing, label: 'Facturación', icon: 'billing' },
    ],
  },
  {
    label: 'CUENTA',
    items: [{ id: sectionIds.configuration, label: 'Configuración', icon: 'configuration' }],
  },
]

const emptyMicrojobFilters = {
  status: 'all',
  microjobType: 'all',
  modality: 'all',
  requiredCourse: 'all',
  date: 'all',
  capacity: 'all',
}

const emptyApplicantFilters = {
  status: 'all',
  microjob: 'all',
  coursesCompleted: 'all',
  availability: 'all',
  distance: 'all',
}

const emptyCourseFilters = {
  category: 'all',
  level: 'all',
  status: 'all',
  skillUnlocked: 'all',
}

function countActiveFilters(filters) {
  return Object.values(filters).filter((value) => value !== 'all').length
}

function buildFlattenedModules(courses) {
  return courses.flatMap((course) =>
    course.modules.map((module) => ({
      ...module,
      courseId: course.id,
      courseTitle: course.title,
      courseImageSrc: course.imageSrc,
      courseImageAlt: course.imageAlt,
    }))
  )
}

function getModeGuidance(workMode) {
  if (workMode === 'local_economy') {
    return {
      title: 'Economía local activa',
      description:
        'Usaremos referencias cercanas, microtrabajos locales y mensajes pensados para operación de barrio o punto físico.',
    }
  }

  if (workMode === 'enterprise_front') {
    return {
      title: 'Frente empresarial activo',
      description:
        'Priorizaremos campañas, sedes operativas y cursos asociados a flujos más estructurados.',
    }
  }

  return {
    title: 'Ambas modalidades activas',
    description:
      'Puedes publicar oportunidades locales y empresariales desde el mismo panel. El wizard solo pedirá modalidad de origen cuando haga falta.',
  }
}

function CompanyDashboard() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [microjobs, setMicrojobs] = useState([])
  const [applicants, setApplicants] = useState([])
  const [courses, setCourses] = useState([])
  const [settings, setSettings] = useState([])
  const [statusBlocks, setStatusBlocks] = useState([])
  const [summary, setSummary] = useState({
    activeMicrojobs: 0,
    newApplicants: 0,
    publishedCourses: 0,
    availableSeats: 0,
  })
  const [visibleMicrojobs, setVisibleMicrojobs] = useState([])
  const [visibleApplicants, setVisibleApplicants] = useState([])
  const [visibleCourses, setVisibleCourses] = useState([])
  const [activeSection, setActiveSection] = useState(sectionIds.panel)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [activeFilterModal, setActiveFilterModal] = useState(null)
  const [microjobFilters, setMicrojobFilters] = useState(emptyMicrojobFilters)
  const [applicantFilters, setApplicantFilters] = useState(emptyApplicantFilters)
  const [courseFilters, setCourseFilters] = useState(emptyCourseFilters)
  const [selectedMicrojob, setSelectedMicrojob] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedApplicant, setSelectedApplicant] = useState(null)
  const [isMicrojobWizardOpen, setIsMicrojobWizardOpen] = useState(false)
  const [isCourseWizardOpen, setIsCourseWizardOpen] = useState(false)
  const [editingMicrojob, setEditingMicrojob] = useState(null)
  const [editingCourse, setEditingCourse] = useState(null)
  const [editingModule, setEditingModule] = useState(null)
  const [activeSettingsAction, setActiveSettingsAction] = useState(null)
  const [isProfileEditModalOpen, setIsProfileEditModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [isReady, setIsReady] = useState(false)

  const flattenedModules = useMemo(() => buildFlattenedModules(courses), [courses])
  const modeGuidance = useMemo(
    () => (profile ? getModeGuidance(profile.workMode) : null),
    [profile]
  )

  useEffect(() => {
    async function loadDashboardState() {
      const dashboardState = await getCompanyDashboardState()

      setProfile(dashboardState.profile)
      setNotifications(dashboardState.notifications)
      setMicrojobs(dashboardState.microjobs)
      setApplicants(dashboardState.applicants)
      setCourses(dashboardState.courses)
      setSettings(dashboardState.settings)
      setStatusBlocks(dashboardState.statusBlocks)
      setIsReady(true)
    }

    loadDashboardState()
  }, [])

  useEffect(() => {
    if (!isReady || !profile) {
      return
    }

    async function refreshVisibleData() {
      const [nextMicrojobs, nextApplicants, nextCourses, nextSummary] = await Promise.all([
        getCompanyMicrojobs(microjobFilters, microjobs),
        getCompanyApplicants(applicantFilters, applicants),
        getCompanyCourses(courseFilters, courses),
        getCompanyDashboardSummary({ microjobs, applicants, courses }),
      ])

      setVisibleMicrojobs(nextMicrojobs)
      setVisibleApplicants(nextApplicants)
      setVisibleCourses(nextCourses)
      setSummary(nextSummary)
      setStatusBlocks(getCompanyStatusBlocks(profile))
    }

    refreshVisibleData()
  }, [
    applicantFilters,
    applicants,
    courseFilters,
    courses,
    isReady,
    microjobFilters,
    microjobs,
    profile,
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

  function handleSectionChange(sectionId) {
    setActiveSection(sectionId)
    setIsMobileSidebarOpen(false)
    setIsNotificationPanelOpen(false)
    setIsAccountMenuOpen(false)
  }

  async function openMicrojobDetail(microjobId) {
    const detail = await getMicrojobDetail(microjobId, microjobs, courses)
    setSelectedMicrojob(detail)
  }

  async function openCourseDetail(courseId) {
    const detail = await getCourseDetail(courseId, courses, microjobs)
    setSelectedCourse(detail)
  }

  async function openApplicantDetail(applicantId) {
    const detail = await getApplicantDetail(applicantId, applicants, microjobs)
    setSelectedApplicant(detail)
  }

  async function handleCreateMicrojob(payload) {
    if (editingMicrojob) {
      const result = await updateMicrojob(editingMicrojob.id, payload, microjobs)

      setMicrojobs(result.microjobs)
      setEditingMicrojob(null)
      setIsMicrojobWizardOpen(false)
      setActiveSection(sectionIds.microjobs)
      setToastMessage('Microtrabajo actualizado')
      return
    }

    const result = await createMicrojob(payload, microjobs)

    setMicrojobs(result.microjobs)
    setIsMicrojobWizardOpen(false)
    setActiveSection(sectionIds.microjobs)
    setToastMessage(result.successMessage)
  }

  async function handleCreateCourse(payload) {
    if (editingCourse) {
      const result = await updateCourse(editingCourse.id, payload, courses)

      setCourses(result.courses)
      setEditingCourse(null)
      setIsCourseWizardOpen(false)
      setActiveSection(sectionIds.courses)
      setToastMessage('Curso actualizado')
      return
    }

    const result = await createCourse(payload, courses)

    setCourses(result.courses)
    setIsCourseWizardOpen(false)
    setActiveSection(sectionIds.courses)
    setToastMessage(result.successMessage)
  }

  async function handleUpdateApplicantStatus(applicantId, status) {
    const result = await updateApplicantStatus(applicantId, status, applicants)

    setApplicants(result.applicants)
    setToastMessage(result.successMessage)

    if (selectedApplicant?.id === applicantId) {
      const detail = await getApplicantDetail(applicantId, result.applicants, microjobs)
      setSelectedApplicant(detail)
    }
  }

  function handleOpenEditProfile() {
    setActiveSection(sectionIds.companyStatus)
    setIsProfileEditModalOpen(true)
  }

  function handleSaveProfile(updatedProfile) {
    setProfile(hydrateCompanyProfile(updatedProfile))
    setIsProfileEditModalOpen(false)
    setToastMessage('Información de la empresa actualizada')
  }

  async function handleSaveEditedModule(updatedModule) {
    const courseId = updatedModule.courseId
    const modulePayload = { ...updatedModule }
    delete modulePayload.courseId
    delete modulePayload.courseTitle
    delete modulePayload.courseImageSrc
    delete modulePayload.courseImageAlt
    const result = await saveCourseModule(courseId, modulePayload)
    setCourses(result.courses)
    setEditingModule(null)
    setToastMessage(result.successMessage)
  }

  async function handleDeleteModule(courseId, moduleId) {
    const result = await deleteCourseModule(courseId, moduleId)
    setCourses(result.courses)
    setEditingModule(null)
    setToastMessage(result.successMessage)
  }

  async function handleDeleteMicrojob(microjobId) {
    const result = await deleteMicrojob(microjobId)
    setMicrojobs(result.microjobs)
    setSelectedMicrojob(null)
    setToastMessage(result.successMessage)
  }

  async function handleDeleteCourse(courseId) {
    const result = await deleteCourse(courseId)
    setCourses(result.courses)
    setSelectedCourse(null)
    setToastMessage(result.successMessage)
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function handleResetDemoData() {
    resetDemoData()
    navigate('/login')
  }

  function handleOpenCreateMicrojob() {
    setEditingMicrojob(null)
    setIsMicrojobWizardOpen(true)
  }

  function handleOpenCreateCourse() {
    setEditingCourse(null)
    setIsCourseWizardOpen(true)
  }

  function handleOpenEditMicrojob() {
    if (!selectedMicrojob) {
      return
    }

    setEditingMicrojob(selectedMicrojob)
    setSelectedMicrojob(null)
    setIsMicrojobWizardOpen(true)
  }

  function handleOpenEditCourse() {
    if (!selectedCourse) {
      return
    }

    setEditingCourse(selectedCourse)
    setSelectedCourse(null)
    setIsCourseWizardOpen(true)
  }

  function renderOverviewSection() {
    return (
      <div className="space-y-4">
        <section className="rounded-[1.45rem] border border-[var(--color-primary-border)] bg-white p-5 shadow-[0_18px_32px_rgba(4,44,83,0.05)]">
          <p className="text-sm font-semibold text-[var(--color-primary)]">Panel</p>
          <h2 className="mt-1 text-[1.55rem] font-extrabold tracking-[-0.05em] text-[var(--color-primary-strong)]">
            Resumen de tus publicaciones, cursos y postulantes.
          </h2>
          <div className="mt-4">
            <CompanySummaryCards summary={summary} />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[1.45rem] border border-[var(--color-primary-border)] bg-white p-5 shadow-[0_18px_32px_rgba(4,44,83,0.05)]">
            <p className="text-sm font-semibold text-[var(--color-primary)]">Acciones rápidas</p>
            <h3 className="mt-2 text-[1.4rem] font-extrabold tracking-[-0.05em] text-[var(--color-primary-strong)]">
              Publica y revisa desde el mismo panel
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-text-muted)]">
              Activa nuevos microtrabajos, crea cursos que desbloquean habilidades y revisa candidaturas sin salir del dashboard.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleOpenCreateMicrojob}
                className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-strong)]"
              >
                Publicar microtrabajo
              </button>
              <button
                type="button"
                onClick={handleOpenCreateCourse}
                className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] border border-[var(--color-primary-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary-strong)]"
              >
                Crear curso
              </button>
              <button
                type="button"
                onClick={() => handleSectionChange(sectionIds.applicants)}
                className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] border border-[var(--color-primary-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary-strong)]"
              >
                Revisar postulantes
              </button>
            </div>
          </article>

          <article className="rounded-[1.45rem] border border-[var(--color-primary-border)] bg-[linear-gradient(180deg,#042c53_0%,#185fa5_100%)] p-5 text-white shadow-[0_18px_32px_rgba(4,44,83,0.12)]">
            <p className="text-sm font-semibold text-white/75">{modeGuidance?.title}</p>
            <h3 className="mt-2 text-[1.4rem] font-extrabold tracking-[-0.05em]">
              {workModeLabels[profile.workMode]}
            </h3>
            <p className="mt-3 text-sm leading-7 text-white/80">
              {modeGuidance?.description}
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
        <CompanyMicrojobs
          microjobs={visibleMicrojobs}
          activeFiltersCount={countActiveFilters(microjobFilters)}
          workModeLabel={workModeLabels[profile.workMode]}
          onOpenFilters={() => setActiveFilterModal('microjobs')}
          onOpenWizard={handleOpenCreateMicrojob}
          onOpenDetail={openMicrojobDetail}
        />
      )
    }

    if (activeSection === sectionIds.applicants) {
      return (
        <CompanyApplicants
          applicants={visibleApplicants}
          activeFiltersCount={countActiveFilters(applicantFilters)}
          onOpenFilters={() => setActiveFilterModal('applicants')}
          onOpenDetail={openApplicantDetail}
          onUpdateStatus={handleUpdateApplicantStatus}
        />
      )
    }

    if (activeSection === sectionIds.courses) {
      return (
        <CompanyCourses
          courses={visibleCourses}
          activeFiltersCount={countActiveFilters(courseFilters)}
          onOpenFilters={() => setActiveFilterModal('courses')}
          onOpenWizard={handleOpenCreateCourse}
          onOpenDetail={openCourseDetail}
        />
      )
    }

    if (activeSection === sectionIds.modules) {
      return (
        <CompanyModules
          modules={flattenedModules}
          onEditModule={setEditingModule}
          onViewCourse={openCourseDetail}
        />
      )
    }

    if (activeSection === sectionIds.companyStatus) {
      return (
        <CompanyProfileStatus
          profile={profile}
          statusBlocks={statusBlocks}
          onEditProfile={handleOpenEditProfile}
          onOpenSettings={() => handleSectionChange(sectionIds.configuration)}
        />
      )
    }

    if (activeSection === sectionIds.billing) {
      return <CompanyBillingSummary profile={profile} />
    }

    return (
      <CompanySettingsPanel
        settings={settings}
        activeAction={activeSettingsAction}
        onOpenAction={(setting) => {
          if (setting.actionType === 'logout') {
            handleLogout()
            return
          }
          setActiveSettingsAction(setting)
        }}
        onCloseAction={() => setActiveSettingsAction(null)}
        onResetDemoData={handleResetDemoData}
      />
    )
  }

  if (!isReady || !profile) {
    return (
      <main className="min-h-screen bg-[var(--color-primary-softer)] px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-[1.5rem] border border-[var(--color-primary-border)] bg-white p-8 text-center shadow-[0_18px_32px_rgba(4,44,83,0.05)]">
          <p className="text-sm font-semibold text-[var(--color-primary)]">Cargando</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.05em] text-[var(--color-primary-strong)]">
            Preparando tu dashboard de empresa
          </h1>
        </div>
      </main>
    )
  }

  const microjobFilterSections = [
    {
      key: 'status',
      label: 'Estado',
      options: [
        { value: 'all', label: 'Todos' },
        { value: 'Activo', label: 'Activo' },
        { value: 'Borrador', label: 'Borrador' },
      ],
    },
    {
      key: 'microjobType',
      label: 'Tipo de microtrabajo',
      options: [
        { value: 'all', label: 'Todos' },
        ...Array.from(new Set(microjobs.map((microjob) => microjob.microjobType))).map((option) => ({
          value: option,
          label: option,
        })),
      ],
    },
    {
      key: 'modality',
      label: 'Modalidad',
      options: [
        { value: 'all', label: 'Todas' },
        ...Array.from(new Set(microjobs.map((microjob) => microjob.modality))).map((option) => ({
          value: option,
          label: option,
        })),
      ],
    },
    {
      key: 'requiredCourse',
      label: 'Curso requerido',
      options: [
        { value: 'all', label: 'Todos' },
        { value: 'required', label: 'Con curso requerido' },
        { value: 'optional', label: 'Sin curso requerido' },
      ],
    },
    {
      key: 'date',
      label: 'Fecha',
      options: [
        { value: 'all', label: 'Todas' },
        { value: 'next7', label: 'Próximos 7 días' },
        { value: 'next30', label: 'Próximos 30 días' },
      ],
    },
    {
      key: 'capacity',
      label: 'Cupos',
      options: [
        { value: 'all', label: 'Todos' },
        { value: 'low', label: 'Hasta 3' },
        { value: 'medium', label: '4 a 7' },
        { value: 'high', label: '8 o más' },
      ],
    },
  ]

  const applicantFilterSections = [
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
      key: 'microjob',
      label: 'Microtrabajo',
      options: [
        { value: 'all', label: 'Todos' },
        ...microjobs.map((microjob) => ({
          value: microjob.id,
          label: microjob.title,
        })),
      ],
    },
    {
      key: 'coursesCompleted',
      label: 'Cursos completados',
      options: [
        { value: 'all', label: 'Todos' },
        { value: '1', label: '1 o más' },
        { value: '2', label: '2 o más' },
      ],
    },
    {
      key: 'availability',
      label: 'Disponibilidad',
      options: [
        { value: 'all', label: 'Todas' },
        { value: 'mañana', label: 'Mañana' },
        { value: 'tarde', label: 'Tarde' },
        { value: 'flexible', label: 'Flexible' },
      ],
    },
    {
      key: 'distance',
      label: 'Distancia',
      options: [
        { value: 'all', label: 'Todas' },
        { value: 'upTo3', label: 'Hasta 3 km' },
        { value: 'upTo6', label: 'Hasta 6 km' },
        { value: 'remote', label: 'Remoto' },
      ],
    },
  ]

  const courseFilterSections = [
    {
      key: 'category',
      label: 'Categoría',
      options: [
        { value: 'all', label: 'Todas' },
        ...Array.from(new Set(courses.map((course) => course.category))).map((option) => ({
          value: option,
          label: option,
        })),
      ],
    },
    {
      key: 'level',
      label: 'Nivel',
      options: [
        { value: 'all', label: 'Todos' },
        ...Array.from(new Set(courses.map((course) => course.level))).map((option) => ({
          value: option,
          label: option,
        })),
      ],
    },
    {
      key: 'status',
      label: 'Estado',
      options: [
        { value: 'all', label: 'Todos' },
        ...Array.from(new Set(courses.map((course) => course.status))).map((option) => ({
          value: option,
          label: option,
        })),
      ],
    },
    {
      key: 'skillUnlocked',
      label: 'Habilidad que desbloquea',
      options: [
        { value: 'all', label: 'Todas' },
        ...Array.from(new Set(courses.map((course) => course.skillUnlocked))).map((option) => ({
          value: option,
          label: option,
        })),
      ],
    },
  ]

  return (
    <>
      <CompanyDashboardShell
        sidebar={
          <CompanySidebar
            activeSection={activeSection}
            navigationGroups={navigationGroups}
            isCollapsed={isSidebarCollapsed}
            isMobileOpen={isMobileSidebarOpen}
            onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)}
            onSelectSection={handleSectionChange}
          />
        }
        header={
          <CompanyHeader
            companyProfile={profile}
            workMode={profile.workMode}
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
            onViewCompanyStatus={() => handleSectionChange(sectionIds.companyStatus)}
            onEditProfile={handleOpenEditProfile}
            onOpenSettings={() => handleSectionChange(sectionIds.configuration)}
            onSwitchAccount={handleLogout}
            onLogout={handleLogout}
          />
        }
      >
        {renderActiveSection()}
      </CompanyDashboardShell>

      <FilterModal
        key={`company-microjobs-${JSON.stringify(microjobFilters)}`}
        isOpen={activeFilterModal === 'microjobs'}
        title="Filtrar microtrabajos"
        description="Aplica filtros por estado, tipo, modalidad, curso requerido, fecha y cupos."
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
        key={`company-applicants-${JSON.stringify(applicantFilters)}`}
        isOpen={activeFilterModal === 'applicants'}
        title="Filtrar postulantes"
        description="Refina por estado, microtrabajo, cursos, disponibilidad y distancia."
        sections={applicantFilterSections}
        initialValues={applicantFilters}
        onApply={(values) => {
          setApplicantFilters(values)
          setActiveFilterModal(null)
        }}
        onClear={(values) => {
          setApplicantFilters(values)
          setActiveFilterModal(null)
        }}
        onClose={() => setActiveFilterModal(null)}
      />

      <FilterModal
        key={`company-courses-${JSON.stringify(courseFilters)}`}
        isOpen={activeFilterModal === 'courses'}
        title="Filtrar cursos"
        description="Busca cursos por categoría, nivel, estado o habilidad que desbloquean."
        sections={courseFilterSections}
        initialValues={courseFilters}
        onApply={(values) => {
          setCourseFilters(values)
          setActiveFilterModal(null)
        }}
        onClear={(values) => {
          setCourseFilters(values)
          setActiveFilterModal(null)
        }}
        onClose={() => setActiveFilterModal(null)}
      />

      {isMicrojobWizardOpen ? (
        <MicrojobFormWizard
          isOpen={isMicrojobWizardOpen}
          onClose={() => {
            setIsMicrojobWizardOpen(false)
            setEditingMicrojob(null)
          }}
          onSubmit={handleCreateMicrojob}
          workMode={profile.workMode}
          availableCourses={courses}
          initialData={editingMicrojob}
        />
      ) : null}

      {isCourseWizardOpen ? (
        <CourseFormWizard
          isOpen={isCourseWizardOpen}
          onClose={() => {
            setIsCourseWizardOpen(false)
            setEditingCourse(null)
          }}
          onSubmit={handleCreateCourse}
          microjobs={microjobs}
          initialData={editingCourse}
        />
      ) : null}

      <MicrojobDetailModal
        microjob={selectedMicrojob}
        isOpen={Boolean(selectedMicrojob)}
        onClose={() => setSelectedMicrojob(null)}
        onEdit={handleOpenEditMicrojob}
        onDelete={handleDeleteMicrojob}
      />

      <CourseDetailModal
        course={selectedCourse}
        isOpen={Boolean(selectedCourse)}
        onClose={() => setSelectedCourse(null)}
        onEdit={handleOpenEditCourse}
        onDelete={handleDeleteCourse}
        onEditModule={(module) =>
          setEditingModule({
            ...module,
            courseId: selectedCourse?.id,
            courseTitle: selectedCourse?.title,
          })
        }
      />

      <ApplicantDetailModal
        applicant={selectedApplicant}
        isOpen={Boolean(selectedApplicant)}
        onClose={() => setSelectedApplicant(null)}
      />

      {isProfileEditModalOpen ? (
        <CompanyProfileEditModal
          profile={profile}
          isOpen={isProfileEditModalOpen}
          onClose={() => setIsProfileEditModalOpen(false)}
          onSave={handleSaveProfile}
        />
      ) : null}

      {editingModule ? (
        <ModuleEditorModal
          module={editingModule}
          isOpen={Boolean(editingModule)}
          onClose={() => setEditingModule(null)}
          onSave={handleSaveEditedModule}
          onDelete={
            editingModule.id
              ? () => handleDeleteModule(editingModule.courseId, editingModule.id)
              : undefined
          }
        />
      ) : null}


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

export default CompanyDashboard
