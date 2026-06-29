# Phase 4: Advanced Worker Dashboard Experience

## 1. Objective

Create an advanced, polished, mobile-first worker dashboard for NexoJobs.

This phase is only for the worker dashboard.

The worker dashboard must look professional, minimal, rounded, accessible, and consistent with the NexoJobs palette.

This phase must go beyond static cards. It must include functional mock interactions that can later be connected to a real backend with minimal refactoring.

The dashboard must include:

- Sidebar grouped by sections.
- Collapsible and expandable sidebar.
- Greeting header with `Hola, [Nombre]`.
- Worker sections.
- Modal-based filters.
- Detail modal/drawer for applications, microjobs, and courses.
- Accepted application continuation flow with schedule and map data.
- Microjob cards with short visible content and full detail on click.
- Course cards with short visible content and full course flow on click.
- Locked microjobs with an overlay explaining the required course.
- Mock repository/service layer to isolate mock data from UI.
- Responsive and mobile-first Tailwind implementation.

This is still a frontend/mock phase.

Do not implement real backend calls, Keycloak, OAuth2, JWT, protected routes, API Gateway, PWA, IndexedDB, Redis, microservices, or real maps API integration.

---

## 2. Phase position

Completed phases:

```txt
Phase 0: Project diagnosis
Phase 1: Routing normalization
Phase 2: Visual login
Phase 3: Visual registration
```

Current phase:

```txt
Phase 4: Advanced worker dashboard experience
```

Next phase:

```txt
Phase 5: Company dashboard visual experience
```

Later phases:

```txt
Phase 6: Simulated protected routes
Phase 7: PWA base
Phase 8: Offline-first with IndexedDB
Phase 9: Offline synchronization
Phase 10: API Gateway
Phase 11: Microservices
Phase 12: SSO with Keycloak, OAuth2/OIDC, JWT, and roles
Phase 13: Redis + AI support
Phase 14: HTTPS deployment
Phase 15: Final testing and academic documentation
```

---

## 3. Language rule

All technical project elements must be in English:

- Routes.
- URL paths.
- File names.
- Folder names.
- Component names.
- Function names.
- Variable names.
- Constants.
- Code comments.
- Mock data keys.
- LocalStorage keys.
- Internal labels.

All visible user-facing UI copy must be in Spanish.

Examples of technical English:

```txt
/app/worker
WorkerDashboard.jsx
WorkerSidebar.jsx
WorkerHeader.jsx
WorkerApplications.jsx
WorkerMicrojobs.jsx
WorkerCourses.jsx
WorkerCoursePlayer.jsx
WorkerProfileStatus.jsx
ApplicationDetailModal.jsx
ApplicationScheduleModal.jsx
MicrojobDetailModal.jsx
CourseDetailModal.jsx
FilterModal.jsx
workerDashboardRepository.js
mockWorkerData.js
activeSection
isSidebarCollapsed
selectedApplication
selectedMicrojob
selectedCourse
appliedFilters
```

Examples of visible Spanish UI copy:

```txt
Hola, María
Mis postulaciones
Microtrabajos
Cursos disponibles
Cursos en progreso
Estado del perfil
Filtros
Aplicar filtros
Ver detalle
Continuar
Postular
Iniciar curso
```

Do not create Spanish code identifiers.

Do not create Spanish routes.

Do not create Spanish file names.

---

## 4. Route

The worker dashboard must be available at:

```txt
/app/worker
```

Do not create Spanish dashboard routes such as:

```txt
/app/trabajador
```

If Spanish legacy redirects already exist, leave them unless explicitly requested.

---

## 5. Files to inspect first

Before modifying anything, inspect:

- `AGENTS.md`
- `src/routes/AppRouter.jsx`
- `src/pages/worker/WorkerDashboard.jsx`
- `src/pages/worker/`
- `src/components/worker/`
- `src/components/layout/`
- `src/components/ui/`
- `src/index.css`
- `src/App.css`
- `src/assets/`, if it exists
- `public/`, if it contains logo or icon assets
- `package.json`

If an existing worker dashboard prototype exists, use it as visual reference but improve it substantially.

---

## 6. Files likely to be modified or created

Preferred page file:

```txt
src/pages/worker/WorkerDashboard.jsx
```

Recommended structure:

```txt
src/components/worker/WorkerDashboardShell.jsx
src/components/worker/WorkerSidebar.jsx
src/components/worker/WorkerHeader.jsx
src/components/worker/WorkerSummaryCards.jsx
src/components/worker/WorkerApplications.jsx
src/components/worker/WorkerMicrojobs.jsx
src/components/worker/WorkerAvailableCourses.jsx
src/components/worker/WorkerInProgressCourses.jsx
src/components/worker/WorkerProfileStatus.jsx
src/components/worker/ApplicationRow.jsx
src/components/worker/MicrojobCard.jsx
src/components/worker/CourseCard.jsx
src/components/worker/CourseProgressCard.jsx
src/components/worker/LockedOverlay.jsx
src/components/worker/StatusBadge.jsx
src/components/worker/ProgressBar.jsx
src/components/worker/EmptyState.jsx
src/components/worker/FilterModal.jsx
src/components/worker/ApplicationDetailModal.jsx
src/components/worker/ApplicationScheduleModal.jsx
src/components/worker/MicrojobDetailModal.jsx
src/components/worker/CourseDetailModal.jsx
src/components/worker/CoursePlayerModal.jsx
src/components/worker/MapPreview.jsx
```

Recommended data/service files:

```txt
src/data/mockWorkerData.js
src/services/workerDashboardRepository.js
```

Do not over-engineer.

Do not modify landing, login, or registration unless `/app/worker` routing is broken.

---

## 7. Official palette

Use the official NexoJobs palette exactly:

```css
:root {
  --color-primary: #185fa5;
  --color-primary-strong: #042c53;
  --color-primary-soft: #e7f0fa;
  --color-primary-softer: #f4f7fb;
  --color-primary-border: #d5e1ef;
  --color-text: #102a43;
  --color-text-muted: #61758a;
  --color-amber: #eba92f;
  --color-amber-soft: #fff4de;
  --color-danger: #b42318;
  --color-danger-soft: #fff1f0;
  --color-danger-border: #f2b8b5;
  --color-success: #15803d;
  --color-success-soft: #ecfdf3;
  --color-success-border: #bbf7d0;
}
```

Use Tailwind arbitrary values where practical.

---

## 8. Visual style

The worker dashboard must look:

- Professional.
- Minimal.
- Rounded.
- Accessible.
- Trustworthy.
- Clean.
- Less overloaded than a generic admin panel.
- More polished than the current prototype.
- Consistent with the reference style where the sidebar is grouped by sections.

Use:

- Rounded panels.
- Soft borders.
- Subtle shadows.
- Comfortable spacing.
- Simple iconography.
- Tables only when visually polished.
- Cards only when they help readability.
- Modals/drawers for details.
- Short visible card content.
- Full content only after clicking details.

Avoid:

- Showing all details on initial cards.
- Overloaded buttons.
- Generic image-heavy cards.
- Raw bullet lists.
- Unstyled tables.
- Long paragraphs on the dashboard.
- Real API calls.

---

## 9. Sidebar requirements

The sidebar must be grouped into sections.

Use this visual structure:

```txt
PRINCIPAL
  Panel
  Microtrabajos
  Postulaciones

FORMACIÓN
  Cursos disponibles
  En progreso

CUENTA
  Estado del perfil
  Configuración
```

Rules:

- Sidebar uses `--color-primary-strong`.
- Active item uses `--color-primary`.
- Group labels must be small and muted.
- Sidebar must be collapsible and expandable.
- In collapsed mode, show only icons.
- In expanded mode, show icons and labels.
- Include a visible toggle button.
- Do not include a bottom profile card.
- The top header avatar is enough.

Use local state:

```txt
isSidebarCollapsed
```

---

## 10. Header requirements

The main header must greet the user.

Use:

```txt
Hola, María
Aquí puedes revisar tus postulaciones, cursos y microtrabajos.
```

Do not use:

```txt
Panel del trabajador
```

Header must include:

- Sidebar toggle button.
- Notification button.
- User initials avatar.
- Clean spacing.

---

## 11. Main worker sections

The dashboard must have these main sections:

```txt
Postulaciones
Microtrabajos
Cursos disponibles
Cursos en progreso
Estado del perfil
```

Default active section:

```txt
Postulaciones
```

Use local state:

```txt
activeSection
```

Do not add other main sections unless explicitly requested later.

---

## 12. Data architecture: mock repository layer

Do not hardcode all data directly inside JSX.

Create a mock data layer that can later be replaced by API calls.

Recommended file:

```txt
src/services/workerDashboardRepository.js
```

This file should expose functions such as:

```js
export async function getWorkerDashboardSummary() {}
export async function getApplications(filters) {}
export async function getMicrojobs(filters) {}
export async function getAvailableCourses(filters) {}
export async function getCoursesInProgress() {}
export async function getProfileStatus() {}
export async function applyToMicrojob(microjobId) {}
export async function startCourse(courseId) {}
export async function getApplicationDetail(applicationId) {}
export async function getMicrojobDetail(microjobId) {}
export async function getCourseDetail(courseId) {}
```

Recommended mock data file:

```txt
src/data/mockWorkerData.js
```

The UI should call the repository functions.

This makes it easier to replace mock data with a real backend later.

Architectural note:

```txt
In this phase, the repository returns local mock data.
In a later backend phase, the same repository functions can call API Gateway endpoints.
```

No real API calls in this phase.

---

## 13. Filters behavior

Do not show all filters as permanent buttons only.

The dashboard may show compact quick filter chips if useful, but real filtering must happen through a modal/drawer.

Required:

- Show a clear button:
  - `Filtros`
- When clicked, open a modal or drawer.
- The modal must include filter controls.
- The user must click:
  - `Aplicar filtros`
- Include:
  - `Limpiar`
  - `Cancelar`
- Show a small indicator if filters are active.

### Application filters

In the `Postulaciones` section, filter modal should include:

```txt
Estado
Fecha
Modalidad
Pago estimado
```

Status options:

```txt
En revisión
Aceptada
Completada
Rechazada
```

Date options:

```txt
Hoy
Últimos 7 días
Últimos 30 días
```

Modality options:

```txt
Presencial
Remoto
Híbrido
```

Payment options:

```txt
Menos de $10
$10 a $20
Más de $20
```

### Microjob filters

In the `Microtrabajos` section, filter modal should include:

```txt
Distancia
Modalidad
Pago estimado
Habilidad
Disponibilidad
```

Distance options:

```txt
Hasta 2 km
Hasta 5 km
Hasta 10 km
Remoto
```

### Course filters

In course sections, filter modal should include:

```txt
Categoría
Nivel
Duración
Estado
```

Do not overbuild filtering logic.

Mock filtering is acceptable.

---

## 14. Modal and drawer system

The dashboard must include functional modals or drawers for details.

Required modals/drawers:

```txt
FilterModal
ApplicationDetailModal
ApplicationScheduleModal
MicrojobDetailModal
CourseDetailModal
CoursePlayerModal
```

Rules:

- Modals must be responsive.
- On mobile, use full-screen or bottom-sheet style.
- On desktop, use centered modal or right drawer.
- Include close button.
- Include accessible labels if practical.
- Do not leave dead buttons.
- All buttons that imply detail must open something.

---

## 15. Section: Postulaciones

### Purpose

Show applications the worker already submitted.

### Required visible title

```txt
Mis postulaciones
```

Subtitle:

```txt
Revisa el estado de los microtrabajos a los que aplicaste.
```

### Required application states

Include at least these statuses:

```txt
En revisión
Aceptada
Completada
Rechazada
```

Status colors:

- `En revisión` → amber.
- `Aceptada` → blue.
- `Completada` → success green.
- `Rechazada` → danger red.

Important:

- `Aceptada` and `Completada` must be different colors.
- Use text labels, not only color.

### Application list design

Initial row/card must show only compact information:

```txt
Microtrabajo
Empresa
Fecha
Pago estimado
Estado
Acción
```

Do not show full description in the row.

Action buttons:

```txt
Ver detalle
Continuar
Ver resultado
```

### Application detail

When clicking `Ver detalle`, open `ApplicationDetailModal`.

The detail modal must show:

```txt
Título del microtrabajo
Empresa
Estado
Descripción
Pago estimado
Modalidad
Ubicación o remoto
Fecha de postulación
Requisitos
Curso recomendado, if applicable
```

Description must be no more than 150 words.

### Accepted application continuation

When an application is `Aceptada`, the `Continuar` button must open `ApplicationScheduleModal`.

The schedule modal must show:

```txt
Microtrabajo aceptado
Día asignado
Hora de inicio
Hora de fin
Ubicación
Latitud
Longitud
Mapa
Cómo llegar
Contacto o responsable
Recomendaciones
```

Example:

```txt
Día asignado: Miércoles 3 de julio
Horario: 09:00 a 12:00
Ubicación: Centro de Convenciones Mall del Río
Latitud: -2.900128
Longitud: -79.004530
```

### Map requirement

Do not integrate a real Google Maps API in this phase.

Use one of these mock-safe approaches:

- Static map preview card using latitude and longitude.
- Link to Google Maps using lat/lng.
- Link to OpenStreetMap using lat/lng.
- Button text:
  - `Abrir en Google Maps`
  - `Abrir en mapa`

Allowed link format:

```js
const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
```

or:

```js
const osmUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`;
```

No API keys.

No real geocoding.

Latitude and longitude come from mock data now and from backend later.

### Application empty state

If no applications exist:

```txt
Aún no tienes postulaciones
Postula a un microtrabajo y vuelve aquí para seguir su estado.
Postula ya
```

The button must switch to `Microtrabajos`.

---

## 16. Section: Microtrabajos

### Purpose

Show microjobs the worker can apply to.

These are the actual opportunities.

### Required title

```txt
Microtrabajos
```

Subtitle:

```txt
Postula a microtrabajos disponibles según tu perfil y ubicación.
```

### Initial microjob card content

Do not show every detail on the initial card.

The card should show only:

```txt
Título
Empresa
Modalidad
Distancia or Remoto
Pago estimado
Tiempo estimado
Estado de desbloqueo
Primary action
```

Actions:

```txt
Ver detalle
Postular
```

### Microjob detail modal

When clicking `Ver detalle`, open `MicrojobDetailModal`.

The detail modal must show:

```txt
Título
Empresa
Descripción
Pago estimado
Duración
Modalidad
Tipo de microtrabajo
Ubicación
Latitud
Longitud
Habilidad requerida
Curso requerido, if any
Documentos o requisitos
Fecha estimada
Cupos disponibles
```

Description must be no more than 150 words.

### Local vs company microjobs

Mock data must distinguish microjob type:

```txt
Local
Empresarial
Remoto
```

Examples:

- Local microjobs may include:
  - distanceKm
  - local area
  - physical meeting point
  - schedule window
- Company microjobs may include:
  - company name
  - campaign name
  - supervisor
  - company address
- Remote microjobs may include:
  - platform
  - expected delivery time
  - online instructions

Use code keys:

```txt
microjobType
locationType
distanceKm
latitude
longitude
company
scheduleWindow
supervisorName
```

### Sorting and unlocking

In this phase, sorting/unlocking is mock/frontend only.

Required mock behavior:

```js
const visibleMicrojobs = microjobs
  .filter((microjob) => microjob.isUnlocked)
  .sort((a, b) => a.distanceKm - b.distanceKm);
```

Architecture note:

```txt
In production, this logic belongs to jobs-service.
The frontend will only render backend results.
```

### Locked microjobs

Locked microjobs must appear visually blocked, not just with a tiny badge.

Requirements:

- Card appears muted/opaque.
- Overlay on top.
- Clear lock icon or text.
- Explain why it is locked.
- Give the required course.
- Include button:
  - `Ver curso requerido`

Example overlay:

```txt
Microtrabajo bloqueado
Completa el curso “Atención al cliente básica” para postular.
Ver curso requerido
```

Locked cards must not allow `Postular`.

### Applying to a microjob

When clicking `Postular`:

- Add a mock application.
- Set status to `En revisión`.
- Return to `Postulaciones`.
- Avoid duplicate application.
- Show a small success message:
  - `Postulación enviada`

No backend calls.

---

## 17. Section: Cursos disponibles

### Purpose

Show courses the worker can start.

### Required title

```txt
Cursos disponibles
```

Subtitle:

```txt
Elige un curso para desbloquear nuevas opciones de trabajo.
```

### Initial course card content

Do not show all course details on the initial card.

The card should show:

```txt
Nombre del curso
Categoría
Nivel
Duración
Habilidad que desbloquea
Estado
Primary action
```

Actions:

```txt
Ver detalle
Iniciar curso
```

### Course detail modal

When clicking `Ver detalle`, open `CourseDetailModal`.

The detail modal must show:

```txt
Nombre del curso
Descripción
Categoría
Nivel
Duración estimada
Módulos
Habilidad que desbloquea
Microtrabajos relacionados
Evaluación
Recursos
```

Description must be no more than 150 words.

### Course upload criteria

This phase must define the visual/data criteria expected for future course upload.

Each course mock object should include:

```txt
id
title
description
category
level
durationMinutes
thumbnailType
skillUnlocked
modules
assessmentType
h5pEnabled
relatedMicrojobIds
isStarted
progress
```

Each module should include:

```txt
id
title
type
durationMinutes
isCompleted
```

Module types:

```txt
Video
Lectura
Actividad
Pregunta
H5P
Evaluación
```

### Starting a course

When clicking `Iniciar curso`:

- Move course to `Cursos en progreso`.
- Set progress to `5%`.
- Open or switch to `Cursos en progreso`.
- Do not call backend.

---

## 18. Section: Cursos en progreso

### Purpose

Show courses already started.

### Required title

```txt
Cursos en progreso
```

Subtitle:

```txt
Continúa tus cursos y revisa tu avance.
```

### Course progress card

Show:

```txt
Nombre del curso
Categoría
Porcentaje
Módulos completados
Siguiente actividad
Tiempo restante
Continuar curso
```

Use progress bars.

### Course player modal

When clicking `Continuar curso`, open `CoursePlayerModal`.

The player must be mock only but visually functional.

Show:

```txt
Nombre del curso
Módulo actual
Video placeholder
Contenido del módulo
Pregunta o actividad
Progreso
Siguiente
Marcar como completado
```

H5P note:

```txt
Las actividades interactivas se conectarán con H5P en una fase posterior.
```

Do not implement H5P integration in this phase.

### Course progress behavior

Allowed mock behavior:

- Mark current module as completed.
- Increase progress percentage.
- Move to next module.
- Show completion message if course reaches 100%.

No backend calls.

---

## 19. Section: Estado del perfil

### Purpose

Show a compact profile completion summary.

Required title:

```txt
Estado del perfil
```

Subtitle:

```txt
Revisa qué datos ayudan a mejorar tus oportunidades.
```

Show:

```txt
Datos personales
Educación
Trabajo
Finanzas
Preferencias
```

Each block should show state:

```txt
Completo
Pendiente
Revisar
```

Show overall completion:

```txt
80% completo
```

Actions:

```txt
Completar datos
Actualizar preferencias
```

Do not build full profile editing in this phase.

---

## 20. Configuración section

The sidebar may include `Configuración`.

If implemented in this phase, keep it simple.

It may show:

```txt
Preferencias de notificación
Preferencias de idioma
Privacidad básica
Tema visual
Cerrar sesión
```

Do not connect real auth/logout yet.

If not implemented as a full section, clicking `Configuración` may show a polished placeholder card:

```txt
Configuración
Aquí podrás ajustar tus preferencias más adelante.
```

But the button must not be dead.

---

## 21. Upload criteria for future backend/admin/company flows

Although this phase is only the worker dashboard, the worker dashboard must be built around a clean data contract so future upload flows are easy.

### Microjob data criteria

A microjob must support:

```txt
id
title
company
description
microjobType
locationType
locationName
address
latitude
longitude
distanceKm
estimatedPay
estimatedTime
requiredSkill
requiredCourseId
isUnlocked
unlockReason
scheduleWindow
availableDates
capacity
supervisorName
status
```

### Application data criteria

An application must support:

```txt
id
microjobId
workerId
title
company
status
appliedAt
estimatedPay
schedule
location
latitude
longitude
description
requirements
result
```

### Course data criteria

A course must support:

```txt
id
title
description
category
level
durationMinutes
skillUnlocked
thumbnailType
modules
assessmentType
h5pEnabled
relatedMicrojobIds
progress
isStarted
```

### Worker profile status criteria

A worker profile status must support:

```txt
personalData
education
work
finance
preferences
completionPercentage
```

These criteria should be reflected in mock data structure, not necessarily in visible UI.

---

## 22. Mock data requirements

Use realistic mock data.

### Applications

Minimum 4 applications:

```txt
Auxiliar en evento local — Eventos Austro — En revisión
Encuesta de satisfacción — MercaData — Aceptada
Validación de datos comerciales — InfoPlus — Completada
Apoyo logístico en activación — BrandBoost — Rechazada
```

Accepted application must include:

```txt
assignedDate
startTime
endTime
locationName
address
latitude
longitude
supervisorName
instructions
```

### Microjobs

Minimum 6 microjobs:

- At least 4 unlocked.
- At least 1 locked due to missing course.
- At least 1 remote.
- At least 1 local.
- At least 1 company/campaign-style microjob.

### Available courses

Minimum 4 courses:

```txt
Introducción a microtrabajos
Atención al cliente básica
Herramientas digitales básicas
Encuestas y recolección de datos
```

At least one microjob must require one of these courses.

### Courses in progress

Minimum 2 courses:

```txt
Atención al cliente básica — 65%
Manejo de alimentos — 35%
```

### Profile status

Example:

```txt
Datos personales — Completo
Educación — Completo
Trabajo — Pendiente
Finanzas — Revisar
Preferencias — Completo
```

---

## 23. Responsive requirements

Mobile-first behavior:

- Sidebar collapses or becomes overlay.
- Main cards stack.
- Modals become full-screen or bottom sheets.
- Tables become stacked cards.
- Filters open in full-screen modal or bottom sheet.
- No horizontal overflow.
- Touch-friendly buttons.
- Details remain readable.

Desktop behavior:

- Sidebar expanded by default.
- Collapsible sidebar works.
- Cards use grid layout.
- Applications use table-like card layout.
- Details can be modal or right drawer.

---

## 24. Accessibility requirements

Include:

- Buttons with readable text.
- Modal close buttons.
- `aria-modal` where practical.
- Focusable controls.
- Visible focus states.
- Status text in addition to color.
- Progress labels.
- Map link text.
- Sidebar collapse button accessible label.
- Filter modal actions clearly labeled.

Do not rely only on color.

---

## 25. Acceptance criteria

This phase is complete when:

- `/app/worker` shows the advanced worker dashboard.
- Sidebar is grouped and collapsible.
- Header says `Hola, [Nombre]`.
- No bottom profile card appears in sidebar.
- `Postulaciones` is the default active section.
- Filters open in a modal/drawer and require `Aplicar filtros`.
- Application details open in modal/drawer.
- Accepted application `Continuar` opens schedule and map data.
- Map link uses mock latitude/longitude without API keys.
- `Microtrabajos` shows compact cards.
- Microjob detail opens in modal/drawer.
- Locked microjobs are visually muted with overlay explaining the required course.
- `Postular` creates a mock application.
- `Cursos disponibles` shows compact cards.
- Course detail opens in modal/drawer.
- `Iniciar curso` moves the course to `Cursos en progreso`.
- `Cursos en progreso` opens a mock course player.
- Course player shows module/video/activity/question structure.
- H5P is mentioned only as future integration.
- Mock data is isolated in repository/service files.
- Design remains professional, minimal, rounded, and responsive.
- No real backend, auth, maps API, H5P, Redis, IndexedDB, or microservices are added.

---

## 26. Testing instructions

Run:

```bash
npm run dev
```

Test:

```txt
/app/worker
```

Check:

- Sidebar collapse and expand.
- Default section is `Postulaciones`.
- `Filtros` opens modal.
- `Aplicar filtros` changes visible data.
- `Limpiar` resets filters.
- `Ver detalle` opens details.
- Accepted row `Continuar` opens schedule modal.
- Map link opens a URL with latitude/longitude.
- Microjobs sort from nearest to farthest.
- Locked microjob overlay appears.
- Locked microjob cannot be applied to.
- `Ver curso requerido` opens course detail or switches to course.
- `Postular` creates mock application.
- `Iniciar curso` creates/updates course in progress.
- `Continuar curso` opens course player.
- Course player module actions work in mock state.
- Responsive mobile layout works.
- No horizontal overflow.
- No backend requests are made.
- Landing, login, and registration remain unchanged.

---

## 27. Required final report

At the end, report:

### What was done

Brief summary.

### Files created

List created files.

### Files modified

List modified files.

### Route available

Confirm:

```txt
/app/worker
```

### Sidebar behavior

Confirm:

- Grouped sections.
- Collapsible/expandable.
- No bottom profile card.

### Filters behavior

Confirm:

- Filters open in modal/drawer.
- `Aplicar filtros`, `Limpiar`, and `Cancelar` exist.

### Modal behavior

Confirm:

- Application detail modal.
- Application schedule modal.
- Microjob detail modal.
- Course detail modal.
- Course player modal.

### Applications behavior

Confirm:

- Four statuses are present.
- Accepted `Continuar` opens schedule and map details.
- Description is shown only in detail, not initial row.

### Microjobs behavior

Confirm:

- Sorted from nearest to farthest.
- Only unlocked/relevant items shown as primary options.
- Locked cards have overlay explaining required course.
- `Postular` creates mock application.

### Courses behavior

Confirm:

- Available courses visible.
- Course detail visible.
- Start course behavior.
- Courses in progress with progress bars.
- Course player mock works.
- H5P is future integration only.

### Data architecture

Confirm:

- Mock data is centralized.
- Repository/service layer exists or equivalent abstraction exists.
- Backend replacement path is clear.

### Responsive checklist

Confirm:

- Mobile checked.
- Tablet checked.
- Desktop checked.
- No horizontal overflow.

### Pending work

Mention:

- Company dashboard is Phase 5.
- Protected routes are future work.
- Real backend/API Gateway is future work.
- Keycloak/SSO is future work.
- Real Maps API or geocoding is future work.
- H5P integration is future work.
- Offline/PWA is future work.
- Microservices are later phases.

---

## 28. Forbidden in this phase

Do not:

- Build the company dashboard.
- Add real backend calls.
- Add real Google Maps API.
- Add API keys.
- Add H5P integration.
- Configure Keycloak.
- Add OAuth2/OIDC.
- Add JWT validation.
- Add ProtectedRoute.
- Add API Gateway.
- Add PWA setup.
- Add IndexedDB.
- Add Redis.
- Add microservices.
- Store real sensitive financial data.
- Show all details on initial cards.
- Use dead buttons.
- Leave filter buttons without modal behavior.
- Use unstyled raw UI.
