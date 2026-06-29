# Phase 5: Advanced Company Dashboard Experience

## 1. Objective

Create the advanced company/business dashboard for NexoJobs at:

```txt
/app/company
```

This phase must keep the same professional visual language created for the Phase 4 worker dashboard:

- Official NexoJobs palette.
- Rounded cards and panels.
- Grouped collapsible sidebar.
- Greeting header with `Hola, [NombreEmpresa]`.
- Modal/drawer details.
- Wizard flows for long forms.
- Mock data separated from UI through a repository/service layer.
- Mobile-first Tailwind.
- Spanish visible UI copy.
- English code, routes, file names, functions, variables and comments.

This phase is frontend/mock only.

Do not implement real backend calls, real Google Maps API, geocoding API, real file upload, real video hosting, real H5P integration, Keycloak, OAuth2, JWT, ProtectedRoute, PWA, IndexedDB, Redis, API Gateway, or microservices.

---

## 2. Phase position

Completed:

```txt
Phase 0: Project diagnosis
Phase 1: Routing normalization
Phase 2: Visual login
Phase 3: Visual registration
Phase 4: Advanced worker dashboard experience
```

Current:

```txt
Phase 5: Advanced company dashboard experience
```

Later:

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
Phase 15: Final testing and documentation
```

---

## 3. Language rule

Technical elements must be in English:

```txt
CompanyDashboard.jsx
CompanySidebar.jsx
CompanyHeader.jsx
MicrojobFormWizard.jsx
CourseFormWizard.jsx
LocationPickerModal.jsx
companyDashboardRepository.js
mockCompanyData.js
activeSection
workMode
selectedMicrojob
selectedCourse
selectedApplicant
```

Visible UI copy must be in Spanish:

```txt
Hola, Eventos Austro
Microtrabajos
Publicar microtrabajo
Cursos
Crear curso
Postulantes
Estado de la empresa
Facturación
```

Do not create Spanish file names, function names, variable names or routes.

---

## 4. Files to inspect first

Inspect before modifying:

```txt
AGENTS.md
docs/phases/04-worker-dashboard.md
src/routes/AppRouter.jsx
src/pages/company/CompanyDashboard.jsx
src/pages/company/
src/components/company/
src/components/worker/
src/components/ui/
src/components/layout/
src/services/
src/data/
src/index.css
src/App.css
package.json
```

Use Phase 4 worker dashboard as the visual and interaction reference.

---

## 5. Files likely to be created or modified

Preferred page:

```txt
src/pages/company/CompanyDashboard.jsx
```

Recommended components:

```txt
src/components/company/CompanyDashboardShell.jsx
src/components/company/CompanySidebar.jsx
src/components/company/CompanyHeader.jsx
src/components/company/CompanySummaryCards.jsx
src/components/company/CompanyMicrojobs.jsx
src/components/company/CompanyApplicants.jsx
src/components/company/CompanyCourses.jsx
src/components/company/CompanyModules.jsx
src/components/company/CompanyProfileStatus.jsx
src/components/company/CompanyBillingSummary.jsx
src/components/company/MicrojobFormWizard.jsx
src/components/company/CourseFormWizard.jsx
src/components/company/ModuleBuilder.jsx
src/components/company/VideoResourceForm.jsx
src/components/company/LocationPickerModal.jsx
src/components/company/MapPreview.jsx
src/components/company/ImageUploadPreview.jsx
src/components/company/FilterModal.jsx
src/components/company/MicrojobDetailModal.jsx
src/components/company/CourseDetailModal.jsx
src/components/company/ApplicantDetailModal.jsx
src/components/company/StatusBadge.jsx
src/components/company/EmptyState.jsx
```

Recommended data layer:

```txt
src/data/mockCompanyData.js
src/services/companyDashboardRepository.js
```

Do not over-engineer. Smaller structure is acceptable if it stays clean and maintainable.

---

## 6. Official palette

Use the official palette exactly:

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

## 7. Visual style

The company dashboard must be visually aligned with Phase 4 worker dashboard.

It must be:

- Professional.
- Minimal.
- Rounded.
- Clean.
- Accessible.
- Business-oriented.
- Not overloaded.
- Not fake-looking.
- Not a landing page.

Use:

- Grouped sidebar.
- Collapsible sidebar.
- Summary cards.
- Table-card hybrid rows.
- Modals/drawers for details.
- Wizards for creating microjobs and courses.
- Short visible content.
- Full details only after clicking.

Avoid:

- Huge one-page forms.
- All details visible in cards.
- Long marketing text.
- Dead buttons.
- Unstyled raw inputs.
- Real API calls.

---

## 8. Company/local behavior rule

Do not create separate dashboards for local business and company.

Use one company dashboard only.

The difference between local and enterprise behavior comes from the registered profile field:

```txt
workMode
```

Allowed technical values:

```txt
local_economy
enterprise_front
both
```

Visible Spanish labels:

```txt
Economía local
Frente empresarial
Ambas modalidades
```

This field changes labels and suggestions, not routes.

Examples:

- `local_economy`:
  - `Nombre completo o nombre comercial`
  - `Referencia de ubicación`
  - `Microtrabajo local`
- `enterprise_front`:
  - `Nombre de la empresa o razón social`
  - `Sede o punto de operación`
  - `Campaña empresarial`
- `both`:
  - use neutral labels
  - allow choosing `Modalidad de origen` inside the microjob wizard:
    - `Economía local`
    - `Frente empresarial`

Do not ask again if it is local or company on every form unless `workMode` is `both`.

---

## 9. Sidebar requirements

Sidebar groups:

```txt
PRINCIPAL
  Panel
  Microtrabajos
  Postulantes

FORMACIÓN
  Cursos
  Módulos

NEGOCIO
  Estado de la empresa
  Facturación

CUENTA
  Configuración
```

Rules:

- Background: `--color-primary-strong`.
- Active item: `--color-primary`.
- Group labels small and muted.
- Sidebar collapsible and expandable.
- Collapsed mode shows icons only.
- Expanded mode shows icons and labels.
- Visible toggle button.
- No bottom profile card.

Use local state:

```txt
isSidebarCollapsed
```

---

## 10. Header requirements

Main header:

```txt
Hola, Eventos Austro
Gestiona microtrabajos, cursos y postulantes desde un solo lugar.
```

If mock profile is a local business:

```txt
Hola, Tienda La Esquina
Gestiona microtrabajos, cursos y postulantes desde un solo lugar.
```

Header must include:

- Sidebar toggle.
- Notification button.
- Company/avatar initials.
- Optional mode badge:
  - `Economía local`
  - `Frente empresarial`
  - `Ambas modalidades`

Do not use `Panel de empresa` as the main heading.

---

## 11. Main sections

The company dashboard must include:

```txt
Panel
Microtrabajos
Postulantes
Cursos
Módulos
Estado de la empresa
Facturación
Configuración
```

Default active section:

```txt
Panel
```

Use local state:

```txt
activeSection
```

No nested routes are required.

---

## 12. Mock repository layer

Do not hardcode all data directly in JSX.

Create:

```txt
src/data/mockCompanyData.js
src/services/companyDashboardRepository.js
```

Repository functions should be easy to replace with API calls later:

```js
export async function getCompanyDashboardSummary() {}
export async function getCompanyProfile() {}
export async function getCompanyMicrojobs(filters) {}
export async function getCompanyApplicants(filters) {}
export async function getCompanyCourses(filters) {}
export async function getCourseModules(courseId) {}
export async function createMicrojob(payload) {}
export async function updateMicrojob(microjobId, payload) {}
export async function createCourse(payload) {}
export async function updateCourse(courseId, payload) {}
export async function createCourseModule(courseId, payload) {}
export async function getMicrojobDetail(microjobId) {}
export async function getCourseDetail(courseId) {}
export async function getApplicantDetail(applicantId) {}
```

In this phase, these functions return mock data only.

Later, they can call API Gateway endpoints.

---

## 13. Panel section

Title:

```txt
Panel
```

Subtitle:

```txt
Resumen de tus publicaciones, cursos y postulantes.
```

Summary cards:

```txt
Microtrabajos activos
Postulantes nuevos
Cursos publicados
Cupos disponibles
```

Quick actions:

```txt
Publicar microtrabajo
Crear curso
Revisar postulantes
```

These actions must switch sections or open the corresponding wizard. No dead buttons.

---

## 14. Microtrabajos section

Title:

```txt
Microtrabajos
```

Subtitle:

```txt
Publica y administra las oportunidades disponibles para trabajadores.
```

Actions:

```txt
Publicar microtrabajo
Filtros
```

Initial card/row content only:

```txt
Título
Tipo
Modalidad
Ubicación o remoto
Pago estimado
Cupos
Estado
Acción
```

Do not show all microjob details in the initial list.

Clicking `Ver detalle` opens `MicrojobDetailModal`.

Detail must include:

```txt
Título del microtrabajo
Descripción breve
Tipo de microtrabajo
Modalidad
Ubicación
Dirección
Latitud
Longitud
Nombre de ubicación o referencia corta
Pago estimado
Duración estimada
Habilidad requerida
Curso requerido si aplica
Horario o franja disponible
Fechas disponibles
Cupos disponibles
Supervisor o responsable
Documentos o requisitos
Imagen o portada del microtrabajo
Texto alternativo de la imagen
Estado
Postulantes asociados
```

Description must be no more than 150 words.

---

## 15. Publicar microtrabajo wizard

Clicking `Publicar microtrabajo` opens `MicrojobFormWizard`.

Do not show a giant form.

Use steps:

```txt
Información
Ubicación
Requisitos
Fechas y cupos
Imagen
Revisión
```

### Step 1: Información

Fields:

```txt
Título del microtrabajo
Descripción breve
Tipo de microtrabajo
Modalidad
Pago estimado
Duración estimada
Habilidad requerida
Curso requerido si aplica
```

`Tipo de microtrabajo` options:

```txt
Encuestas
Etiquetado de datos
Validación de información
Eventos
Promociones
Tareas operativas
Pruebas de producto
Ayuda en tienda local
Albañilería o apoyo manual
Apoyo logístico
```

`Modalidad` options:

```txt
Presencial
Remota
Híbrida
Por tarea
Por campaña
```

### Step 2: Ubicación

Fields:

```txt
Ubicación en mapa
Nombre de ubicación o referencia corta
Dirección
Latitud
Longitud
```

Behavior:

- Show a map preview card.
- Include button:
  - `Elegir punto en mapa`
- After choosing a mock point, automatically fill:
  - Dirección
  - Latitud
  - Longitud

Mock points:

```txt
Centro de Cuenca
Latitud: -2.900128
Longitud: -79.004530

Mall del Río
Latitud: -2.918815
Longitud: -79.034240

Parque Calderón
Latitud: -2.897414
Longitud: -79.004481
```

Allowed map URLs:

```js
const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
const osmUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`;
```

No API keys. No real geocoding.

### Step 3: Requisitos

Fields:

```txt
Documentos o requisitos
Supervisor o responsable
```

Requirement chips:

```txt
Cédula
Disponibilidad horaria
Experiencia previa
Curso completado
Teléfono activo
Puntualidad
```

### Step 4: Fechas y cupos

Fields:

```txt
Horario o franja disponible
Fechas disponibles
Cupos disponibles
```

Schedule options:

```txt
Mañana
Tarde
Noche
Fines de semana
Flexible
```

The UI must allow adding more than one date visually.

No real calendar API.

### Step 5: Imagen

Fields:

```txt
Imagen o portada del microtrabajo
Texto alternativo de la imagen
```

Behavior:

- Show visual upload area.
- Local preview is allowed if easy.
- No server upload.
- Alt text required visually.

### Step 6: Revisión

Show a clean summary.

Actions:

```txt
Anterior
Publicar microtrabajo
Guardar borrador
Cancelar
```

Publishing behavior:

- Add microjob to mock company microjobs.
- Show success message:
  - `Microtrabajo publicado`
- Close modal or return to list.

No backend calls.

---

## 16. Postulantes section

Title:

```txt
Postulantes
```

Subtitle:

```txt
Revisa candidatos y gestiona el estado de sus postulaciones.
```

Initial cards/rows show:

```txt
Nombre
Microtrabajo
Estado
Perfil completado
Cursos relacionados
Acción
```

Actions:

```txt
Ver perfil
Aceptar
Rechazar
```

`Ver perfil` opens `ApplicantDetailModal`.

Detail shows:

```txt
Nombre del postulante
Microtrabajo aplicado
Estado actual
Datos principales
Educación
Experiencia
Cursos completados
Disponibilidad
Distancia aproximada
Historial breve
```

Accepting/rejecting is mock local state only.

No sensitive data beyond mock data.

---

## 17. Cursos section

Title:

```txt
Cursos
```

Subtitle:

```txt
Crea cursos que desbloquean habilidades y microtrabajos.
```

Actions:

```txt
Crear curso
Filtros
```

Initial course card content:

```txt
Nombre del curso
Categoría
Nivel
Duración estimada
Habilidad que desbloquea
Microtrabajos relacionados
Estado
Acción
```

`Ver detalle` opens `CourseDetailModal`.

---

## 18. Crear curso wizard

Clicking `Crear curso` opens `CourseFormWizard`.

Use steps:

```txt
Información
Evaluación
Portada
Relaciones
Módulos
Revisión
```

### Step 1: Información

Fields:

```txt
Nombre del curso
Descripción breve
Categoría
Nivel
Duración estimada
Habilidad que desbloquea
```

`Categoría` options:

```txt
Atención al cliente
Ventas
Datos
Alimentos
Herramientas digitales
Seguridad
Operaciones
```

`Nivel` options:

```txt
Básico
Intermedio
Avanzado
```

Description max 150 words.

### Step 2: Evaluación

Field:

```txt
Tipo de evaluación
```

Options:

```txt
Preguntas
Actividad práctica
H5P
Evaluación final
Sin evaluación
```

If `H5P` is selected, show:

```txt
Las actividades H5P se conectarán en una fase posterior.
```

Do not integrate H5P.

### Step 3: Portada

Fields:

```txt
Imagen o portada del curso
Texto alternativo de la imagen
```

No server upload.

### Step 4: Relaciones

Field:

```txt
Microtrabajos relacionados
```

Allow selecting existing company microjobs as chips/cards.

This relation will later help unlock microjobs after course completion.

### Step 5: Módulos

The company must be able to add modules.

Each module includes:

```txt
Título del módulo
Tipo de módulo
Duración estimada
Contenido o resumen
Orden del módulo
```

Module type options:

```txt
Video
Lectura
Actividad
Pregunta
H5P
Evaluación
```

If type is `Video`, show:

```txt
Título del video
Descripción corta
Miniatura o imagen del video
Archivo de video o URL del video
Duración
Transcripción o material de apoyo opcional
```

No real upload. No real H5P integration.

### Step 6: Revisión

Actions:

```txt
Anterior
Crear curso
Guardar borrador
Cancelar
```

Creating behavior:

- Add course to mock company courses.
- Show success message:
  - `Curso creado`
- Close modal or return to list.

No backend calls.

---

## 19. Módulos section

Title:

```txt
Módulos
```

Subtitle:

```txt
Organiza el contenido de tus cursos por módulos.
```

Show rows/cards:

```txt
Curso
Título del módulo
Tipo
Duración
Orden
Estado
Acción
```

Actions:

```txt
Editar módulo
Ver curso
```

`Editar módulo` may open a simple modal reusing the module form.

---

## 20. Estado de la empresa section

Title:

```txt
Estado de la empresa
```

Subtitle:

```txt
Revisa la información necesaria para operar en NexoJobs.
```

Show status blocks from registration data:

```txt
Datos de la cuenta y del negocio
Datos del responsable
Datos de operación
Datos de facturación
Preferencias de uso
```

States:

```txt
Completo
Pendiente
Revisar
```

Show overall completion:

```txt
85% completo
```

---

## 21. Facturación section

Title:

```txt
Facturación
```

Subtitle:

```txt
Consulta la información que se usará para facturación.
```

Show:

```txt
Nombre completo o razón social para facturación
RUC o identificación de facturación
Correo de facturación
Dirección fiscal
Método de pago preferido
```

Allowed payment options:

```txt
Transferencia
Tarjeta
Contrato empresarial
Por definir
```

Do not process payments. Do not ask for card number. Do not ask for CVV.

---

## 22. Configuración section

If implemented, keep it simple:

```txt
Preferencias de notificación
Preferencias de idioma
Privacidad básica
Tema visual
Cerrar sesión
```

Do not connect real auth/logout yet.

If not fully implemented, show a polished placeholder. The button must not be dead.

---

## 23. Registration data used by company dashboard

The dashboard must align with registration data.

### Account and business data

```txt
Modalidad de trabajo
Nombre completo o nombre comercial si es negocio local
Nombre de la empresa o razón social si es empresa
Cédula, RUC o identificación
Correo de la cuenta
Ciudad
Dirección
```

If entered with Google:

```txt
Do not ask for password manually.
Still complete the rest of the business data.
```

### Responsible person data

```txt
Nombre del responsable
Correo del responsable
Cargo
Teléfono de contacto
```

Cargo options:

```txt
Propietario
Gerente
Recursos humanos
Operaciones
Administración
Otro
```

### Operation data

```txt
Tipo de tareas
Escala de operación
Modalidad
```

Tipo de tareas options:

```txt
Encuestas
Etiquetado de datos
Validación de información
Eventos
Promociones
Tareas operativas
Pruebas de producto
Ayuda en tienda local
Albañilería o apoyo manual
Apoyo logístico
```

Escala de operación options:

```txt
Piloto
Por ciudad
Varias ciudades
Nacional
Flexible
```

Modalidad options:

```txt
Presencial
Remota
Híbrida
Por tarea
Por campaña
```

### Billing data

```txt
Nombre completo o razón social para facturación
RUC o identificación de facturación
Correo de facturación
Dirección fiscal
Método de pago preferido
```

Método de pago preferido options:

```txt
Transferencia
Tarjeta
Contrato empresarial
Por definir
```

### Usage preferences

```txt
Objetivo principal
Frecuencia estimada
```

Objetivo principal options:

```txt
Contratar por tarea
Validar información
Realizar encuestas
Apoyo operativo
Campañas locales
```

Frecuencia estimada options:

```txt
Una vez
Semanal
Mensual
Por campaña
Por definir
```

---

## 24. Upload criteria: microjob

The frontend must collect user-facing fields only:

```txt
Título del microtrabajo
Descripción breve
Tipo de microtrabajo
Modalidad
Ubicación en mapa
Nombre de ubicación o referencia corta
Pago estimado
Duración estimada
Habilidad requerida
Curso requerido si aplica
Horario o franja disponible
Fechas disponibles
Cupos disponibles
Supervisor o responsable
Documentos o requisitos
Imagen o portada del microtrabajo
Texto alternativo de la imagen
```

After choosing a point on the map, the mock system fills:

```txt
Dirección
Latitud
Longitud
```

No real file upload. No real geocoding.

---

## 25. Upload criteria: course

The frontend must collect user-facing fields only:

```txt
Nombre del curso
Descripción breve
Categoría
Nivel
Duración estimada
Habilidad que desbloquea
Tipo de evaluación
Imagen o portada del curso
Texto alternativo de la imagen
Microtrabajos relacionados
Módulos del curso
```

Module fields:

```txt
Título del módulo
Tipo de módulo
Duración estimada
Contenido o resumen
Orden del módulo
```

If module type is video:

```txt
Título del video
Descripción corta
Miniatura o imagen del video
Archivo de video o URL del video
Duración
Transcripción o material de apoyo opcional
```

No real video upload. No real H5P. No real media storage.

---

## 26. Filters behavior

Use `Filtros` button that opens modal/drawer.

Actions:

```txt
Aplicar filtros
Limpiar
Cancelar
```

Filter groups:

### Microjob filters

```txt
Estado
Tipo de microtrabajo
Modalidad
Curso requerido
Fecha
Cupos
```

### Applicant filters

```txt
Estado
Microtrabajo
Cursos completados
Disponibilidad
Distancia
```

### Course filters

```txt
Categoría
Nivel
Estado
Habilidad que desbloquea
```

Mock filtering is acceptable.

---

## 27. Required modals/drawers

The dashboard must include:

```txt
FilterModal
MicrojobFormWizard
MicrojobDetailModal
CourseFormWizard
CourseDetailModal
ApplicantDetailModal
LocationPickerModal
```

Optional:

```txt
ModuleEditorModal
ImagePreviewModal
```

Mobile: full-screen or bottom sheet.

Desktop: centered modal or right drawer.

All buttons implying detail or action must work.

---

## 28. Mock data requirements

### Company profile

Include mock fields:

```txt
companyName
commercialName
workMode
identification
accountEmail
city
address
responsibleName
responsibleEmail
responsibleRole
responsiblePhone
operationTaskTypes
operationScale
operationModalities
billingName
billingIdentification
billingEmail
billingAddress
preferredPaymentMethod
mainObjective
estimatedFrequency
completionPercentage
```

### Microjobs

Minimum 5:

```txt
Apoyo en feria local
Ayuda en tienda de barrio
Validación de datos comerciales
Encuestas en zona comercial
Promoción de campaña barrial
```

Requirements:

- At least 2 local/economy examples.
- At least 2 enterprise/campaign examples.
- At least 1 remote.
- At least 1 with required course.
- At least 1 draft.

### Applicants

Minimum 5 applicants.

Statuses:

```txt
Nueva
En revisión
Aceptada
Rechazada
```

### Courses

Minimum 3:

```txt
Atención al cliente básica
Encuestas y recolección de datos
Herramientas digitales básicas
```

Each course must include modules.

At least one course must include a video module.

---

## 29. Responsive requirements

Mobile-first:

- Sidebar collapses or becomes overlay.
- Wizards become full-screen or bottom-sheet.
- Tables become stacked cards.
- Cards stack vertically.
- No horizontal overflow.
- Touch-friendly controls.

Desktop:

- Sidebar expanded by default.
- Sidebar can collapse.
- Summary cards in grid.
- Lists use polished table-card hybrid.
- Wizards use modal/drawer with steps.

---

## 30. Accessibility requirements

Include:

- Readable button labels.
- Modal close buttons.
- Focus states.
- Status text plus color.
- Progress labels.
- Map link text.
- Upload labels.
- Image alt text fields.
- Sidebar collapse button label.
- Wizard step labels.
- Filter modal actions.

Do not rely only on color.

---

## 31. Acceptance criteria

This phase is complete when:

- `/app/company` shows the advanced company dashboard.
- The dashboard visually matches the Phase 4 worker dashboard style.
- Sidebar is grouped and collapsible.
- Header says `Hola, [CompanyName]` or equivalent.
- No bottom sidebar profile card appears.
- Panel section is default.
- Microjobs can be listed.
- `Publicar microtrabajo` opens a wizard.
- Microjob wizard includes all required user-facing fields.
- Map mock selection fills address/lat/lng.
- Image/cover and alt text fields exist.
- Microjob detail modal exists.
- Applicants can be listed.
- Applicant detail modal exists.
- Courses can be listed.
- `Crear curso` opens a wizard.
- Course wizard includes all required user-facing fields.
- Module builder exists.
- Video module fields appear when module type is `Video`.
- Course detail modal exists.
- Filters open in modal/drawer with `Aplicar filtros`, `Limpiar`, and `Cancelar`.
- Mock data is centralized.
- Repository/service layer exists or equivalent abstraction exists.
- No real backend, maps API, uploads, H5P, auth, Redis, IndexedDB, or microservices are added.

---

## 32. Testing instructions

Run:

```bash
npm run dev
```

Test:

```txt
/app/company
```

Check:

- Sidebar collapse/expand.
- Panel default section.
- Microtrabajos section.
- Publicar microtrabajo wizard.
- Map mock point selection fills address/lat/lng.
- Image/cover preview or placeholder works.
- Microjob detail modal works.
- Postulantes section and applicant detail.
- Cursos section.
- Crear curso wizard.
- Module builder works.
- Video module fields appear only for video module type.
- Course detail modal works.
- Módulos section works or shows useful module management.
- Estado de la empresa section shows registration-based completion.
- Facturación section shows billing summary without payment processing.
- Configuración is not dead.
- Mobile layout works.
- Desktop layout works.
- No horizontal overflow.
- No backend requests are made.
- Landing, login, registration, and worker dashboard remain unchanged.

---

## 33. Required final report

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
/app/company
```

### Sidebar behavior

Confirm grouped sections, collapsible/expandable, and no bottom profile card.

### Company/local behavior

Confirm `workMode` drives local/company labels and no separate dashboards were created.

### Microjob behavior

Confirm list, detail modal, creation wizard, map mock, image/alt text.

### Course behavior

Confirm list, detail modal, creation wizard, module builder, video module fields, H5P future only.

### Applicants behavior

Confirm list, detail modal, and accept/reject mock behavior if implemented.

### Data architecture

Confirm centralized mock data and repository/service abstraction.

### Responsive checklist

Confirm mobile, tablet, desktop and no horizontal overflow.

### Pending work

Mention protected routes, backend/API Gateway, Keycloak/SSO, real maps/geocoding, real media storage, H5P, offline/PWA, and microservices.

---

## 34. Forbidden in this phase

Do not:

- Build another worker dashboard.
- Create separate dashboards for local and company.
- Add real backend calls.
- Add real Google Maps API.
- Add API keys.
- Add real geocoding.
- Add real file upload to server.
- Add real video hosting.
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
- Ask for card numbers or CVV.
- Process payments.
- Show one huge form with all fields at once.
- Leave dead buttons.
- Use unstyled raw UI.
