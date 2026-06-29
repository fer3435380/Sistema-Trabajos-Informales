import companyBadgeIcon from '../assets/landing/marca-de-verificacion-empresa.png'
import workerPhotoOne from '../assets/landing/persona_m3.jpg'
import workerPhotoTwo from '../assets/landing/persona_h2.jpg'
import workerPhotoThree from '../assets/landing/persona_m4.jpg'
import workerPhotoFour from '../assets/landing/persona_h4.jpg'
import workerPhotoFive from '../assets/landing/persona_m5.jpg'
import mariaProfileImage from '../assets/landing/maria-profile.png'
import {
  companyCourses,
  companyMicrojobs,
  companyNotifications,
  companySettings,
  defaultCompanyProfile,
} from './mockCompanyData'
import { workerNotifications, workerSettings } from './mockWorkerData'

// Distance + worker-facing hints keyed by canonical microjob id.
// In production these would be resolved by jobs-service; here they are mocked.
const microjobWorkerHints = {
  'company-microjob-001': { distanceKm: 1.2 },
  'company-microjob-002': { distanceKm: 2.8 },
  'company-microjob-003': { distanceKm: null },
  'company-microjob-004': { distanceKm: 3.6 },
  'company-microjob-005': { distanceKm: 0.9 },
}

const COMPANY_ID = 'company-001'

function buildMicrojobs() {
  return companyMicrojobs.map((microjob) => ({
    ...microjob,
    companyId: COMPANY_ID,
    company: defaultCompanyProfile.commercialName,
    companyLogo: companyBadgeIcon,
    distanceKm: microjobWorkerHints[microjob.id]?.distanceKm ?? null,
    // Publish the fifth microjob so the worker has an unlocked opportunity to apply to.
    status: microjob.id === 'company-microjob-005' ? 'Activo' : microjob.status,
  }))
}

function buildCourses() {
  return companyCourses.map((course) => ({
    ...course,
    companyId: COMPANY_ID,
    // Publish the third course so the worker has an available course to start.
    status: course.id === 'company-course-003' ? 'Publicado' : course.status,
    modules:
      course.id === 'company-course-003'
        ? course.modules.map((module) => ({ ...module, status: 'Publicado' }))
        : course.modules,
  }))
}

// Worker profiles double as company "applicant" records: they hold both the
// dashboard-facing fields and the applicant-detail fields the company sees.
function buildWorkerProfiles() {
  return [
    {
      id: 'worker-001',
      name: 'María Piedra',
      initials: 'MP',
      city: 'Cuenca',
      neighborhood: 'El Vergel',
      email: 'maria.piedra@nexojobs.ec',
      phone: '+593 98 123 4567',
      availability: 'Lunes a sábado · Mañanas y tardes',
      profileImageSrc: mariaProfileImage,
      profileImageAlt: 'Foto de perfil de María',
      imageSrc: workerPhotoOne,
      tagline: 'Lista para avanzar en microtrabajos locales y remotos.',
      unreadNotifications: 3,
      profileCompleted: '92%',
      distanceKm: 1.2,
      education: 'Bachillerato completo con curso corto de servicio al cliente.',
      experience: 'Apoyo en eventos comunitarios y registro de asistentes.',
      completedCourses: ['Atención al cliente básica', 'Introducción a microtrabajos'],
      relatedCourses: ['Atención al cliente básica', 'Introducción a microtrabajos'],
      mainData: ['Cuenca', 'Disponible fines de semana', 'Contacto activo'],
      shortHistory: 'Ha completado 3 microtrabajos con buena puntualidad.',
      profileStatus: {
        personalData: { label: 'Datos personales', status: 'Completo', helperText: 'Tu identificación y contacto están al día.', progress: 100 },
        education: { label: 'Educación', status: 'Completo', helperText: 'Tu nivel formativo ya está registrado.', progress: 100 },
        work: { label: 'Trabajo', status: 'Pendiente', helperText: 'Falta agregar experiencias o tareas previas.', progress: 45 },
        finance: { label: 'Finanzas', status: 'Revisar', helperText: 'Hay un dato de cobro pendiente de confirmar.', progress: 60 },
        preferences: { label: 'Preferencias', status: 'Completo', helperText: 'Tus intereses ya ayudan a mostrar mejores coincidencias.', progress: 100 },
        completionPercentage: 80,
      },
    },
    {
      id: 'worker-002',
      name: 'Kevin Patiño',
      initials: 'KP',
      city: 'Cuenca',
      neighborhood: 'Totoracocha',
      email: 'kevin.patino@nexojobs.ec',
      phone: '+593 99 222 1188',
      availability: 'Lunes a sábado desde las 14:00',
      profileImageSrc: workerPhotoFour,
      profileImageAlt: 'Foto de perfil de Kevin',
      imageSrc: workerPhotoFour,
      tagline: 'Atención en mostrador y apoyo en tienda.',
      unreadNotifications: 0,
      profileCompleted: '84%',
      distanceKm: 2.8,
      education: 'Formación técnica en ventas básicas.',
      experience: 'Atención en mostrador y apoyo en reposición de producto.',
      completedCourses: ['Atención al cliente básica'],
      relatedCourses: ['Atención al cliente básica'],
      mainData: ['Cuenca', 'Disponible tardes', 'Teléfono verificado'],
      shortHistory: 'Participó en activaciones locales y tiene buenas referencias.',
    },
    {
      id: 'worker-003',
      name: 'Diana Uchuari',
      initials: 'DU',
      city: 'Cuenca',
      neighborhood: 'Remoto',
      email: 'diana.uchuari@nexojobs.ec',
      phone: '+593 98 765 4321',
      availability: 'Noches y horarios flexibles',
      profileImageSrc: workerPhotoFive,
      profileImageAlt: 'Foto de perfil de Diana',
      imageSrc: workerPhotoFive,
      tagline: 'Validación de datos remota con alta precisión.',
      unreadNotifications: 0,
      profileCompleted: '96%',
      distanceKm: 0,
      education: 'Estudiante de administración con formación en hojas de cálculo.',
      experience: 'Validación de catálogos y revisión de registros digitales.',
      completedCourses: ['Herramientas digitales básicas', 'Encuestas y recolección de datos'],
      relatedCourses: ['Herramientas digitales básicas'],
      mainData: ['Remoto', 'Laptop propia', 'Internet estable'],
      shortHistory: 'Ya completó una tarea remota con alta precisión.',
    },
    {
      id: 'worker-004',
      name: 'Sofía Campoverde',
      initials: 'SC',
      city: 'Cuenca',
      neighborhood: 'El Batán',
      email: 'sofia.campoverde@nexojobs.ec',
      phone: '+593 97 111 9080',
      availability: 'Solo mañanas',
      profileImageSrc: workerPhotoTwo,
      profileImageAlt: 'Foto de perfil de Sofía',
      imageSrc: workerPhotoTwo,
      tagline: 'Apoyo en eventos escolares y comunitarios.',
      unreadNotifications: 0,
      profileCompleted: '71%',
      distanceKm: 4.4,
      education: 'Bachillerato en curso.',
      experience: 'Apoyos ocasionales en eventos escolares.',
      completedCourses: ['Introducción a microtrabajos'],
      relatedCourses: ['Introducción a microtrabajos'],
      mainData: ['Cuenca', 'Disponible mañanas', 'Sin experiencia reciente'],
      shortHistory: 'Perfil con interés alto, pero cupos cerrados para su horario.',
    },
    {
      id: 'worker-005',
      name: 'Luis Guamán',
      initials: 'LG',
      city: 'Cuenca',
      neighborhood: 'Remoto',
      email: 'luis.guaman@nexojobs.ec',
      phone: '+593 96 543 2210',
      availability: 'Flexible en la tarde y noche',
      profileImageSrc: workerPhotoThree,
      profileImageAlt: 'Foto de perfil de Luis',
      imageSrc: workerPhotoThree,
      tagline: 'Control de calidad de datos en campañas.',
      unreadNotifications: 0,
      profileCompleted: '88%',
      distanceKm: 0,
      education: 'Tecnólogo con énfasis en soporte operativo.',
      experience: 'Control de calidad de datos en campañas comerciales.',
      completedCourses: ['Herramientas digitales básicas'],
      relatedCourses: ['Herramientas digitales básicas'],
      mainData: ['Remoto', 'Tableta propia', 'Disponibilidad flexible'],
      shortHistory: 'Buen desempeño en tareas de revisión documental.',
    },
    {
      id: 'worker-006',
      name: 'Ana Merchán',
      initials: 'AM',
      city: 'Cuenca',
      neighborhood: 'San Sebastián',
      email: 'ana.merchan@nexojobs.ec',
      phone: '+593 95 808 7766',
      availability: 'Miércoles a domingo',
      profileImageSrc: workerPhotoOne,
      profileImageAlt: 'Foto de perfil de Ana',
      imageSrc: workerPhotoOne,
      tagline: 'Aplicación de encuestas y apoyo en promociones.',
      unreadNotifications: 0,
      profileCompleted: '90%',
      distanceKm: 3.6,
      education: 'Bachillerato completo.',
      experience: 'Aplicación de encuestas y apoyo en promociones.',
      completedCourses: ['Encuestas y recolección de datos', 'Atención al cliente básica'],
      relatedCourses: ['Encuestas y recolección de datos', 'Atención al cliente básica'],
      mainData: ['Cuenca', 'Disponible mañana y tarde', 'Movilidad urbana frecuente'],
      shortHistory: 'Tiene afinidad alta con campañas en campo y registro móvil.',
    },
  ]
}

const remoteSchedule = {
  assignedDate: 'Miércoles 3 de julio',
  startTime: '09:00',
  endTime: '12:00',
  locationName: 'Remoto',
  address: 'Trabajo en línea',
  latitude: null,
  longitude: null,
  mapsUrl: null,
  directions: 'La coordinación se realiza en línea; conéctate 10 minutos antes.',
  contactName: 'Camila Torres',
  instructions: 'Ten lista tu laptop, conexión estable y el acceso al panel de revisión.',
  recommendations: [
    'Confirma tu disponibilidad por mensaje antes de iniciar.',
    'Trabaja en un espacio sin interrupciones para cuidar la precisión.',
  ],
}

const onsiteSchedule = {
  assignedDate: 'Sábado 5 de julio',
  startTime: '14:00',
  endTime: '17:00',
  locationName: 'Tienda La Esquina',
  address: 'Av. Loja y Don Bosco, Cuenca',
  latitude: -2.911763,
  longitude: -79.014981,
  mapsUrl: 'https://www.google.com/maps?q=-2.911763,-79.014981',
  directions: 'Preséntate en la caja principal 10 minutos antes de iniciar.',
  contactName: 'Jorge Mena',
  instructions: 'Lleva tu cédula y ropa cómoda para apoyo en tienda.',
  recommendations: [
    'Confirma tu llegada por mensaje antes de las 13:45.',
    'Usa calzado cómodo para la jornada de apoyo.',
  ],
}

function buildApplications() {
  return [
    // María's applications (the demo worker) — one of each status to exercise the flow.
    {
      id: 'application-001',
      microjobId: 'company-microjob-001',
      workerId: 'worker-001',
      companyId: COMPANY_ID,
      status: 'En revisión',
      appliedAt: '2026-06-27',
      schedule: null,
      result: 'Tu perfil sigue en revisión por parte del organizador.',
    },
    {
      id: 'application-002',
      microjobId: 'company-microjob-002',
      workerId: 'worker-001',
      companyId: COMPANY_ID,
      status: 'Aceptada',
      appliedAt: '2026-06-25',
      schedule: onsiteSchedule,
      result: 'Fuiste seleccionada para la jornada del sábado.',
    },
    {
      id: 'application-003',
      microjobId: 'company-microjob-003',
      workerId: 'worker-001',
      companyId: COMPANY_ID,
      status: 'Completada',
      appliedAt: '2026-06-20',
      schedule: null,
      result: 'La empresa calificó tu trabajo como claro y puntual.',
    },
    // Other workers, so the company's "Postulantes" list has variety out of the box.
    {
      id: 'application-004',
      microjobId: 'company-microjob-002',
      workerId: 'worker-002',
      companyId: COMPANY_ID,
      status: 'En revisión',
      appliedAt: '2026-06-26',
      schedule: null,
      result: 'Postulación recibida y en revisión.',
    },
    {
      id: 'application-005',
      microjobId: 'company-microjob-003',
      workerId: 'worker-003',
      companyId: COMPANY_ID,
      status: 'Aceptada',
      appliedAt: '2026-06-24',
      schedule: remoteSchedule,
      result: 'Seleccionada para la validación remota.',
    },
    {
      id: 'application-006',
      microjobId: 'company-microjob-001',
      workerId: 'worker-004',
      companyId: COMPANY_ID,
      status: 'Rechazada',
      appliedAt: '2026-06-22',
      schedule: null,
      result: 'La empresa priorizó perfiles con disponibilidad más amplia.',
    },
    {
      id: 'application-007',
      microjobId: 'company-microjob-003',
      workerId: 'worker-005',
      companyId: COMPANY_ID,
      status: 'En revisión',
      appliedAt: '2026-06-26',
      schedule: null,
      result: 'Postulación recibida y en revisión.',
    },
    {
      id: 'application-008',
      microjobId: 'company-microjob-004',
      workerId: 'worker-006',
      companyId: COMPANY_ID,
      status: 'En revisión',
      appliedAt: '2026-06-25',
      schedule: null,
      result: 'Postulación recibida y en revisión.',
    },
  ]
}

// Per-worker course progress.
// - course-001 completed -> unlocks microjob-001.
// - course-002 in progress -> microjob-004 stays locked until María finishes it (unlock demo).
function buildWorkerCourses() {
  return [
    {
      workerId: 'worker-001',
      courseId: 'company-course-001',
      isStarted: true,
      progress: 100,
      completedModuleIds: ['company-module-001', 'company-module-002', 'company-module-003'],
    },
    {
      workerId: 'worker-001',
      courseId: 'company-course-002',
      isStarted: true,
      progress: 33,
      completedModuleIds: ['company-module-004'],
    },
  ]
}

function buildUsers() {
  return [
    {
      id: 'user-company-001',
      role: 'company',
      email: defaultCompanyProfile.accountEmail,
      password: 'empresa123',
      authProvider: 'manual',
      name: defaultCompanyProfile.commercialName,
      profileId: COMPANY_ID,
    },
    {
      id: 'user-worker-001',
      role: 'worker',
      email: 'maria.piedra@nexojobs.ec',
      password: 'maria123',
      authProvider: 'manual',
      name: 'María Piedra',
      profileId: 'worker-001',
    },
  ]
}

export function createSeedState() {
  return {
    users: buildUsers(),
    companyProfiles: [{ ...defaultCompanyProfile, id: COMPANY_ID, ownerUserId: 'user-company-001' }],
    workerProfiles: buildWorkerProfiles(),
    microjobs: buildMicrojobs(),
    courses: buildCourses(),
    applications: buildApplications(),
    workerCourses: buildWorkerCourses(),
    companyNotifications: companyNotifications.map((item) => ({ ...item })),
    workerNotifications: workerNotifications.map((item) => ({ ...item })),
    companySettings: companySettings.map((item) => ({ ...item })),
    workerSettings: workerSettings.map((item) => ({ ...item })),
  }
}

export const DEMO_CREDENTIALS = {
  company: { email: defaultCompanyProfile.accountEmail, password: 'empresa123' },
  worker: { email: 'maria.piedra@nexojobs.ec', password: 'maria123' },
}
