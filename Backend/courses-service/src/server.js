import crypto from 'node:crypto'
import http from 'node:http'
import { URL } from 'node:url'
import pg from 'pg'

const { Pool } = pg

const PORT = Number(process.env.PORT || 3002)
const DATABASE_URL = process.env.DATABASE_URL
const POSTGRES_USER = process.env.POSTGRES_USER || process.env.PGUSER || 'postgres'
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || process.env.PGPASSWORD
const POSTGRES_HOST = process.env.POSTGRES_HOST || process.env.PGHOST || 'postgres'
const POSTGRES_PORT = Number(process.env.POSTGRES_PORT || process.env.PGPORT || 5432)
const POSTGRES_DB = process.env.POSTGRES_DB || process.env.PGDATABASE || 'trabajos_db'

if (!DATABASE_URL && !POSTGRES_PASSWORD) {
  throw new Error('DATABASE_URL o POSTGRES_PASSWORD debe definirse para courses-service.')
}

const pool = new Pool(DATABASE_URL
  ? {
      connectionString: DATABASE_URL,
      max: Number(process.env.DB_POOL_SIZE || 10),
    }
  : {
      host: POSTGRES_HOST,
      port: POSTGRES_PORT,
      database: POSTGRES_DB,
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      max: Number(process.env.DB_POOL_SIZE || 10),
    })

function log(level, message, meta = {}) {
  console.log(JSON.stringify({ level, message, timestamp: new Date().toISOString(), ...meta }))
}

function nowIso() {
  return new Date().toISOString()
}

function generateId(prefix) {
  return `${prefix}-${crypto.randomUUID()}`
}

function normalizeCourse(course) {
  return {
    ...course,
    durationLabel: course.durationMinutes >= 60 ? `${Math.round(course.durationMinutes / 60)} h` : `${course.durationMinutes} min`,
    modules: [...(course.modules || [])].sort((left, right) => Number(left.order) - Number(right.order)),
  }
}

function courseFromRow(row) {
  if (!row) return null

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    level: row.level,
    durationMinutes: Number(row.duration_minutes),
    skillUnlocked: row.skill_unlocked,
    assessmentType: row.assessment_type,
    imageSrc: row.image_src,
    imageAlt: row.image_alt,
    relatedMicrojobIds: row.related_microjob_ids || [],
    status: row.status,
    modules: row.modules || [],
    ownerUserId: row.owner_user_id,
    created_at: row.created_at?.toISOString?.() || row.created_at,
    updated_at: row.updated_at?.toISOString?.() || row.updated_at,
  }
}

function progressFromRow(row) {
  if (!row) return null

  return {
    id: row.id,
    userId: row.user_id,
    courseId: row.course_id,
    progress: Number(row.progress),
    completedModuleIds: row.completed_module_ids || [],
    isStarted: row.is_started,
    created_at: row.created_at?.toISOString?.() || row.created_at,
    updated_at: row.updated_at?.toISOString?.() || row.updated_at,
  }
}

async function migrateDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      level TEXT NOT NULL,
      duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
      skill_unlocked TEXT NOT NULL,
      assessment_type TEXT NOT NULL,
      image_src TEXT,
      image_alt TEXT,
      related_microjob_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
      status TEXT NOT NULL DEFAULT 'Borrador',
      modules JSONB NOT NULL DEFAULT '[]'::jsonb,
      owner_user_id TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS course_progress (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
      completed_module_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
      is_started BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (user_id, course_id)
    );

    CREATE INDEX IF NOT EXISTS idx_courses_filters ON courses(status, category, level);
    CREATE INDEX IF NOT EXISTS idx_course_progress_user ON course_progress(user_id);
  `)
}

async function seedCourse(course) {
  await pool.query(
    `INSERT INTO courses (
      id, title, description, category, level, duration_minutes, skill_unlocked,
      assessment_type, image_src, image_alt, related_microjob_ids, status, modules,
      owner_user_id, created_at, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11::jsonb, $12, $13::jsonb,
      $14, NOW(), NOW()
    )
    ON CONFLICT (id) DO NOTHING`,
    [
      course.id,
      course.title,
      course.description,
      course.category,
      course.level,
      course.durationMinutes,
      course.skillUnlocked,
      course.assessmentType,
      course.imageSrc || null,
      course.imageAlt || null,
      JSON.stringify(course.relatedMicrojobIds || []),
      course.status || 'Publicado',
      JSON.stringify(course.modules || []),
      course.ownerUserId || null,
    ],
  )
}

async function seedData() {
  const result = await pool.query('SELECT COUNT(*)::int AS count FROM courses')
  if (Number(result.rows[0]?.count || 0) > 0) return

  await seedCourse({
    id: 'course-001',
    title: 'Atencion al cliente basica',
    description: 'Refuerza bienvenida, escucha activa y respuestas breves para tareas presenciales.',
    category: 'Atencion al cliente',
    level: 'Basico',
    durationMinutes: 55,
    skillUnlocked: 'Atencion al cliente',
    assessmentType: 'Preguntas',
    status: 'Publicado',
    modules: [
      { id: 'module-001', title: 'Bienvenida y tono de voz', moduleType: 'Video', durationMinutes: 12, order: 1 },
      { id: 'module-002', title: 'Escucha activa en punto', moduleType: 'Lectura', durationMinutes: 10, order: 2 },
      { id: 'module-003', title: 'Caso guiado de atencion', moduleType: 'Actividad', durationMinutes: 18, order: 3 },
    ],
  })

  await seedCourse({
    id: 'course-002',
    title: 'Encuestas y recoleccion de datos',
    description: 'Organiza preguntas, registro de respuestas y control de calidad para campanas presenciales.',
    category: 'Datos',
    level: 'Intermedio',
    durationMinutes: 48,
    skillUnlocked: 'Recoleccion de datos',
    assessmentType: 'Actividad practica',
    status: 'Publicado',
    modules: [
      { id: 'module-004', title: 'Objetivo y flujo de encuesta', moduleType: 'Video', durationMinutes: 9, order: 1 },
      { id: 'module-005', title: 'Errores comunes', moduleType: 'Pregunta', durationMinutes: 14, order: 2 },
      { id: 'module-006', title: 'Simulacion de ruta comercial', moduleType: 'Evaluacion', durationMinutes: 25, order: 3 },
    ],
  })

  await seedCourse({
    id: 'course-003',
    title: 'Herramientas digitales basicas',
    description: 'Introduce validacion de campos, uso de plantillas y reporte de incidencias en tareas remotas.',
    category: 'Herramientas digitales',
    level: 'Basico',
    durationMinutes: 52,
    skillUnlocked: 'Validacion de informacion',
    assessmentType: 'H5P',
    status: 'Publicado',
    modules: [
      { id: 'module-007', title: 'Lectura de formularios', moduleType: 'Lectura', durationMinutes: 11, order: 1 },
      { id: 'module-008', title: 'Checklist de revision digital', moduleType: 'Actividad', durationMinutes: 16, order: 2 },
      { id: 'module-009', title: 'Actividad interactiva futura', moduleType: 'H5P', durationMinutes: 25, order: 3 },
    ],
  })
}

function getUser(request) {
  return {
    id: request.headers['x-user-id'] || null,
    role: request.headers['x-user-role'] || null,
  }
}

function canManageCourses(user) {
  return user.role === 'owner' || user.role === 'admin'
}

function canUseCourses(user) {
  return Boolean(user.id) && ['worker', 'owner', 'admin'].includes(user.role)
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(payload))
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let raw = ''
    request.on('data', (chunk) => {
      raw += chunk
      if (raw.length > 1024 * 1024) {
        reject(new Error('Payload demasiado grande.'))
        request.destroy()
      }
    })
    request.on('end', () => {
      if (!raw) {
        resolve({})
        return
      }
      try {
        resolve(JSON.parse(raw))
      } catch (error) {
        reject(error)
      }
    })
    request.on('error', reject)
  })
}

async function filterCourses(requestUrl) {
  const filters = []
  const values = []

  for (const [queryKey, column] of [
    ['status', 'status'],
    ['category', 'category'],
    ['level', 'level'],
  ]) {
    const value = requestUrl.searchParams.get(queryKey)
    if (value && value !== 'all') {
      values.push(value)
      filters.push(`${column} = $${values.length}`)
    }
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : ''
  const result = await pool.query(
    `SELECT * FROM courses ${whereClause} ORDER BY created_at DESC, title ASC`,
    values,
  )

  return result.rows.map(courseFromRow).map(normalizeCourse)
}

async function findCourse(courseId) {
  const result = await pool.query('SELECT * FROM courses WHERE id = $1', [courseId])
  return courseFromRow(result.rows[0])
}

function validateCoursePayload(payload, partial = false) {
  const requiredFields = ['title', 'description', 'category', 'level', 'durationMinutes', 'skillUnlocked', 'assessmentType']
  if (!partial) {
    const missing = requiredFields.filter((field) => payload[field] === undefined || payload[field] === '')
    if (missing.length > 0) {
      throw new Error(`Faltan campos requeridos: ${missing.join(', ')}.`)
    }
  }

  if (payload.durationMinutes !== undefined && Number(payload.durationMinutes) < 1) {
    throw new Error('durationMinutes debe ser mayor a 0.')
  }
}

function buildCourseFromPayload(payload, existingCourse = {}) {
  const modules = payload.modules ?? existingCourse.modules ?? []
  return {
    ...existingCourse,
    title: payload.title ?? existingCourse.title,
    description: payload.description ?? existingCourse.description,
    category: payload.category ?? existingCourse.category,
    level: payload.level ?? existingCourse.level,
    durationMinutes: Number(payload.durationMinutes ?? existingCourse.durationMinutes ?? 0),
    skillUnlocked: payload.skillUnlocked ?? existingCourse.skillUnlocked,
    assessmentType: payload.assessmentType ?? existingCourse.assessmentType,
    imageSrc: payload.imageSrc ?? payload.imagePreview ?? existingCourse.imageSrc ?? null,
    imageAlt: payload.imageAlt ?? existingCourse.imageAlt ?? null,
    relatedMicrojobIds: payload.relatedMicrojobIds ?? existingCourse.relatedMicrojobIds ?? [],
    status: payload.status ?? existingCourse.status ?? 'Borrador',
    modules: modules.map((module, index) => ({
      id: module.id || generateId('module'),
      title: module.title,
      moduleType: module.moduleType || module.type || 'Lectura',
      durationMinutes: Number(module.durationMinutes || 0),
      order: Number(module.order || index + 1),
      status: module.status || payload.status || existingCourse.status || 'Borrador',
      summary: module.summary || '',
    })),
    updated_at: nowIso(),
  }
}

async function insertCourse(course) {
  const result = await pool.query(
    `INSERT INTO courses (
      id, title, description, category, level, duration_minutes, skill_unlocked,
      assessment_type, image_src, image_alt, related_microjob_ids, status, modules,
      owner_user_id, created_at, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11::jsonb, $12, $13::jsonb,
      $14, NOW(), NOW()
    )
    RETURNING *`,
    [
      course.id,
      course.title,
      course.description,
      course.category,
      course.level,
      course.durationMinutes,
      course.skillUnlocked,
      course.assessmentType,
      course.imageSrc,
      course.imageAlt,
      JSON.stringify(course.relatedMicrojobIds || []),
      course.status,
      JSON.stringify(course.modules || []),
      course.ownerUserId || null,
    ],
  )

  return courseFromRow(result.rows[0])
}

async function updateCourse(course) {
  const result = await pool.query(
    `UPDATE courses
    SET title = $2,
      description = $3,
      category = $4,
      level = $5,
      duration_minutes = $6,
      skill_unlocked = $7,
      assessment_type = $8,
      image_src = $9,
      image_alt = $10,
      related_microjob_ids = $11::jsonb,
      status = $12,
      modules = $13::jsonb,
      updated_at = NOW()
    WHERE id = $1
    RETURNING *`,
    [
      course.id,
      course.title,
      course.description,
      course.category,
      course.level,
      course.durationMinutes,
      course.skillUnlocked,
      course.assessmentType,
      course.imageSrc,
      course.imageAlt,
      JSON.stringify(course.relatedMicrojobIds || []),
      course.status,
      JSON.stringify(course.modules || []),
    ],
  )

  return courseFromRow(result.rows[0])
}

async function deleteCourse(courseId) {
  await pool.query('DELETE FROM courses WHERE id = $1', [courseId])
}

async function listProgressForUser(userId) {
  const result = await pool.query(
    'SELECT * FROM course_progress WHERE user_id = $1 ORDER BY updated_at DESC',
    [userId],
  )
  return result.rows.map(progressFromRow)
}

async function getProgress(userId, courseId) {
  const result = await pool.query(
    'SELECT * FROM course_progress WHERE user_id = $1 AND course_id = $2',
    [userId, courseId],
  )
  return progressFromRow(result.rows[0])
}

async function upsertProgress(userId, courseId, patch) {
  const current = await getProgress(userId, courseId)
  const next = {
    id: current?.id || generateId('course-progress'),
    userId,
    courseId,
    progress: patch.progress ?? current?.progress ?? 0,
    completedModuleIds: patch.completedModuleIds ?? current?.completedModuleIds ?? [],
    isStarted: patch.isStarted ?? current?.isStarted ?? true,
  }

  const result = await pool.query(
    `INSERT INTO course_progress (
      id, user_id, course_id, progress, completed_module_ids, is_started, created_at, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5::jsonb, $6, NOW(), NOW()
    )
    ON CONFLICT (user_id, course_id)
    DO UPDATE SET
      progress = EXCLUDED.progress,
      completed_module_ids = EXCLUDED.completed_module_ids,
      is_started = EXCLUDED.is_started,
      updated_at = NOW()
    RETURNING *`,
    [
      next.id,
      next.userId,
      next.courseId,
      next.progress,
      JSON.stringify(next.completedModuleIds),
      next.isStarted,
    ],
  )

  return progressFromRow(result.rows[0])
}

async function handleRequest(request, response) {
  const requestUrl = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`)
  const pathname = requestUrl.pathname.replace(/\/$/, '')
  const user = getUser(request)
  const startedAt = Date.now()

  try {
    if (request.method === 'GET' && pathname === '/api/v1/courses/health') {
      await pool.query('SELECT 1')
      sendJson(response, 200, { status: 'ok', service: 'courses-service', storage: 'postgresql' })
      return
    }

    if (request.method === 'GET' && pathname === '/api/v1/courses/progress') {
      if (!canUseCourses(user)) {
        sendJson(response, 403, { detail: 'No tienes permisos para consultar progreso de cursos.' })
        return
      }
      sendJson(response, 200, await listProgressForUser(user.id))
      return
    }

    if (request.method === 'GET' && pathname === '/api/v1/courses') {
      sendJson(response, 200, await filterCourses(requestUrl))
      return
    }

    if (request.method === 'POST' && pathname === '/api/v1/courses') {
      if (!canManageCourses(user)) {
        sendJson(response, 403, { detail: 'Solo owner o admin pueden crear cursos.' })
        return
      }
      const payload = await readBody(request)
      validateCoursePayload(payload)
      const course = await insertCourse({
        ...buildCourseFromPayload(payload),
        id: generateId('course'),
        ownerUserId: user.id,
        created_at: nowIso(),
      })
      sendJson(response, 201, normalizeCourse(course))
      return
    }

    const courseMatch = pathname.match(/^\/api\/v1\/courses\/([^/]+)$/)
    if (courseMatch) {
      const course = await findCourse(courseMatch[1])
      if (!course) {
        sendJson(response, 404, { detail: 'Curso no encontrado.' })
        return
      }

      if (request.method === 'GET') {
        sendJson(response, 200, normalizeCourse(course))
        return
      }

      if (request.method === 'PATCH') {
        if (!canManageCourses(user)) {
          sendJson(response, 403, { detail: 'Solo owner o admin pueden actualizar cursos.' })
          return
        }
        const payload = await readBody(request)
        validateCoursePayload(payload, true)
        const updatedCourse = await updateCourse(buildCourseFromPayload(payload, course))
        sendJson(response, 200, normalizeCourse(updatedCourse))
        return
      }

      if (request.method === 'DELETE') {
        if (!canManageCourses(user)) {
          sendJson(response, 403, { detail: 'Solo owner o admin pueden eliminar cursos.' })
          return
        }
        await deleteCourse(course.id)
        sendJson(response, 200, { deleted: true })
        return
      }
    }

    const startMatch = pathname.match(/^\/api\/v1\/courses\/([^/]+)\/start$/)
    if (request.method === 'POST' && startMatch) {
      if (!canUseCourses(user)) {
        sendJson(response, 403, { detail: 'No tienes permisos para iniciar cursos.' })
        return
      }
      const course = await findCourse(startMatch[1])
      if (!course) {
        sendJson(response, 404, { detail: 'Curso no encontrado.' })
        return
      }
      const current = await getProgress(user.id, course.id)
      const progress = await upsertProgress(user.id, course.id, { progress: Math.max(current?.progress || 0, 5) })
      sendJson(response, 200, { course: normalizeCourse(course), progress })
      return
    }

    const advanceMatch = pathname.match(/^\/api\/v1\/courses\/([^/]+)\/advance$/)
    if (request.method === 'POST' && advanceMatch) {
      if (!canUseCourses(user)) {
        sendJson(response, 403, { detail: 'No tienes permisos para avanzar cursos.' })
        return
      }
      const course = await findCourse(advanceMatch[1])
      if (!course) {
        sendJson(response, 404, { detail: 'Curso no encontrado.' })
        return
      }
      const current = (await getProgress(user.id, course.id)) || (await upsertProgress(user.id, course.id, { progress: 5 }))
      const moduleIds = normalizeCourse(course).modules.map((module) => module.id)
      const nextModuleId = moduleIds.find((moduleId) => !current.completedModuleIds.includes(moduleId))
      const completedModuleIds = nextModuleId ? [...current.completedModuleIds, nextModuleId] : current.completedModuleIds
      const progress = moduleIds.length > 0 ? Math.round((completedModuleIds.length / moduleIds.length) * 100) : 100
      const nextProgress = await upsertProgress(user.id, course.id, { completedModuleIds, progress })
      sendJson(response, 200, { course: normalizeCourse(course), progress: nextProgress })
      return
    }

    sendJson(response, 404, { detail: 'Ruta no encontrada en courses-service.' })
  } catch (error) {
    log('error', 'request failed', { error: error.message })
    sendJson(response, 400, { detail: error.message || 'Solicitud invalida.' })
  } finally {
    log('info', 'request handled', {
      method: request.method,
      path: requestUrl.pathname,
      status_ms: Date.now() - startedAt,
      user_id: user.id,
      user_role: user.role,
    })
  }
}

async function start() {
  await migrateDatabase()
  await seedData()

  const result = await pool.query('SELECT COUNT(*)::int AS count FROM courses')
  const server = http.createServer((request, response) => {
    handleRequest(request, response)
  })

  server.listen(PORT, () => {
    log('info', 'courses-service started', {
      port: PORT,
      courses: Number(result.rows[0]?.count || 0),
      storage: 'postgresql',
    })
  })
}

start().catch((error) => {
  log('error', 'courses-service failed to start', { error: error.message })
  process.exit(1)
})
