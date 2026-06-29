# AGENTS.md

## 1. Project identity

This project is **NexoJobs**, a web platform for microjobs and skill-based onboarding.

The product connects workers with microjobs and allows companies or local businesses to publish opportunities, create courses, manage applicants, and unlock work through learning.

The application must feel professional, trustworthy, accessible, modern, and clean.

This is not a simple landing page.

The landing page only explains the business and directs users to register or log in. After login or registration, users enter role-based application dashboards.

---

## 2. Current frontend stack

The current frontend uses:

```txt
React
Vite
Tailwind CSS
JavaScript or JSX
```

Do not introduce new UI frameworks unless explicitly requested.

Use Tailwind first.

Do not use external UI libraries unless approved by the user.

---

## 3. Main language rule

All technical project elements must be in English.

This includes:

```txt
Routes
URL paths
File names
Folder names
Component names
Function names
Variable names
Constants
Code comments
Mock data keys
Repository/service names
LocalStorage keys
Internal labels
```

All visible user-facing UI copy must be in Spanish.

Examples of technical English:

```txt
/app/worker
/app/company
Login.jsx
RegisterWorker.jsx
WorkerDashboard.jsx
CompanyDashboard.jsx
handleSubmit
activeSection
selectedMicrojob
workerDashboardRepository.js
companyDashboardRepository.js
nexojobs_mock_session
```

Examples of visible Spanish UI copy:

```txt
Iniciar sesión
Crear cuenta
Postulaciones
Microtrabajos
Cursos disponibles
Cursos en progreso
Estado del perfil
Publicar microtrabajo
Crear curso
```

Do not create Spanish code identifiers.

Do not create Spanish file names.

Do not create Spanish routes.

---

## 4. Official routes

Use these canonical routes:

```txt
/
 /login
/register
/register/worker
/register/company
/app/worker
/app/company
```

Do not create these as canonical routes:

```txt
/registro
/registro/trabajador
/registro/empresa
/app/trabajador
/app/empresa
```

If legacy Spanish redirects already exist, keep them only as redirects.

---

## 5. Official landing anchors

Use English technical anchor ids:

```txt
#home
#how-it-works
#opportunities
#workers
#companies
#stories
#legal
```

Visible navigation text can remain Spanish.

Examples:

```txt
Inicio
Cómo funciona
Oportunidades
Trabajadores
Empresas
Historias
Legal
```

---

## 6. Official palette

Use this palette exactly.

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

Use Tailwind arbitrary values when practical:

```jsx
className="bg-[var(--color-primary)]"
className="bg-[var(--color-primary-strong)]"
className="bg-[var(--color-primary-soft)]"
className="bg-[var(--color-primary-softer)]"
className="border-[var(--color-primary-border)]"
className="text-[var(--color-text)]"
className="text-[var(--color-text-muted)]"
className="bg-[var(--color-amber-soft)]"
className="text-[var(--color-amber)]"
className="bg-[var(--color-danger-soft)]"
className="text-[var(--color-danger)]"
className="border-[var(--color-danger-border)]"
className="bg-[var(--color-success-soft)]"
className="text-[var(--color-success)]"
className="border-[var(--color-success-border)]"
```

Do not introduce green as a primary brand color.

Do not introduce unrelated palettes.

Status colors must stay consistent:

```txt
En revisión -> amber
Aceptada -> blue
Completada -> success green
Rechazada -> danger red
```

Important:

```txt
Aceptada and Completada must not use the same color.
```

---

## 7. Visual design principles

All screens must feel:

```txt
Professional
Minimal
Rounded
Accessible
Trustworthy
Responsive
Clean
Modern
Consistent with NexoJobs
```

Use:

```txt
Rounded cards
Soft borders
Subtle shadows
Good spacing
Clear hierarchy
Readable contrast
Polished empty states
Responsive grids
Modal/drawer details
Table-card hybrids when needed
```

Avoid:

```txt
Ugly bullet lists as main UI
Unstyled raw tables
Huge paragraphs
Landing-like content inside app dashboards
Overloaded cards
Dead buttons
Generic AI-looking layouts
Repeated explanatory text from the landing
```

---

## 8. Accessibility rules

All interactive UI must be accessible.

Use:

```txt
Readable button text
Visible focus states
Labels for inputs
htmlFor/id connections
aria-live for validation messages when practical
aria-pressed for selectable chips when practical
aria-current for active navigation when practical
aria-modal for modals when practical
Status text in addition to color
Progress labels
Accessible sidebar toggle labels
Accessible close buttons in modals
```

Do not rely only on color to communicate state.

Do not use icon-only buttons without accessible labels.

---

## 9. Responsive rules

Use mobile-first Tailwind.

Mobile behavior:

```txt
Cards stack vertically
Sidebar collapses or becomes overlay
Modals become full-screen or bottom sheets
Tables become stacked cards
Filters open as full-screen modal or bottom sheet
No horizontal overflow
Touch-friendly buttons and inputs
```

Desktop behavior:

```txt
Sidebar visible by default
Sidebar can collapse
Main content uses grid layout
Cards and table-card layouts have comfortable spacing
Details can use centered modals or right drawers
```

---

## 10. Phase execution protocol for Codex

Before modifying files, Codex must report:

```txt
1. Phase objective
2. Files to inspect
3. Files expected to be modified or created
4. Risks
5. Expected result
```

Then implement the phase.

At the end, Codex must report:

```txt
What was done
Files created
Files modified
Routes available
Behavior implemented
Responsive checklist
Language checklist
Pending work
```

Do not skip this.

---

## 11. Current phase roadmap

Completed or planned phases:

```txt
Phase 0: Project diagnosis
Phase 1: Routing normalization
Phase 2: Visual login
Phase 3: Visual registration
Phase 4: Advanced worker dashboard experience
Phase 5: Advanced company dashboard experience
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

Do not implement future phases early.

---

## 12. Phase 0: diagnosis

Diagnosis is read-only.

Codex must inspect the project and identify:

```txt
Existing structure
Routes
Landing structure
Auth pages
Dashboard placeholders
Palette usage
Broken links
Risky files
Recommended next steps
```

No code changes.

---

## 13. Phase 1: routing normalization

Phase 1 normalizes public/app routes and technical references.

Canonical routes:

```txt
/
 /login
/register
/register/worker
/register/company
/app/worker
/app/company
```

Landing must remain visually unchanged.

If old Spanish paths exist, redirect them only if needed.

---

## 14. Phase 2: visual login

Login route:

```txt
/login
```

The login must:

```txt
Match the reference style closely
Use one-screen desktop layout
Use a large rounded blue container
Use a minimal welcome area
Use a floating white login card
Use Spanish visible copy
Use English code
Use official palette
Be mobile-first
```

Google login in Phase 2 is visual/mock only.

Allowed:

```txt
Continuar con Google button
Mock message that SSO comes later
Simple mock login
```

Forbidden:

```txt
Real Google SDK
Client IDs
OAuth redirects
Keycloak
JWT
Backend calls
ProtectedRoute
```

---

## 15. Phase 3: centered complete registration

Registration routes:

```txt
/register
/register/worker
/register/company
```

Registration must be:

```txt
Centered
White-card based
Guided by steps/tabs/pills
Complete but not visually overwhelming
No large lateral panels
No landing-like text
```

Worker registration sections:

```txt
Datos personales
Educación
Trabajo
Finanzas
Preferencias
```

Company registration sections:

```txt
Empresa
Responsable
Operación
Facturación
Preferencias
```

Google registration path:

```txt
Visual/mock only
Prefill only identity data
Worker: prefill name and email
Company: prefill responsible person name and email
Hide password fields when Google mock is used
Continue asking missing profile/business data
```

No real OAuth or Keycloak in this phase.

---

## 16. Phase 4: advanced worker dashboard

Worker route:

```txt
/app/worker
```

The Phase 4 worker dashboard must include these sections:

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

The header must say:

```txt
Hola, María
Aquí puedes revisar tus postulaciones, cursos y microtrabajos.
```

Do not use:

```txt
Panel del trabajador
```

Sidebar must be:

```txt
Grouped
Collapsible
Expandable
Without bottom profile card
```

Suggested sidebar grouping:

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

### Worker filters

Filters must not be only permanent buttons.

Use:

```txt
Filtros
Aplicar filtros
Limpiar
Cancelar
```

Filters open in modal/drawer.

### Worker application statuses

Must include:

```txt
En revisión
Aceptada
Completada
Rechazada
```

Color rules:

```txt
En revisión -> amber
Aceptada -> blue
Completada -> green
Rechazada -> red
```

### Accepted application continuation

When clicking `Continuar` on an accepted application, open a schedule modal showing:

```txt
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

Use mock lat/lng.

No real Google Maps API.

Allowed map link:

```js
const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
```

or:

```js
const osmUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`;
```

### Worker microjobs

Microjobs are the opportunities the worker can apply to.

Initial cards must show compact info only.

Details must open in modal/drawer.

Description max:

```txt
150 words
```

Microjobs must be shown from nearest to farthest in this mock phase.

Use mock logic:

```js
const visibleMicrojobs = microjobs
  .filter((microjob) => microjob.isUnlocked)
  .sort((a, b) => a.distanceKm - b.distanceKm);
```

Architecture note:

```txt
In production, sorting, unlocking and relevance belong to jobs-service.
The frontend only renders returned results.
```

Locked microjobs:

```txt
Must appear muted/opaque
Must have overlay
Must explain required course
Must not allow Postular
Must include Ver curso requerido
```

### Worker courses

Available courses:

```txt
Show compact cards
Details open in modal/drawer
Iniciar curso moves course to Cursos en progreso
```

In-progress courses:

```txt
Show progress bars
Continuar curso opens a mock course player
Course player shows video/module/activity/question structure
H5P is future integration only
```

### Worker mock data

Use centralized mock data and repository/service layer:

```txt
src/data/mockWorkerData.js
src/services/workerDashboardRepository.js
```

Repository functions should be easy to replace with API calls later.

No real API calls.

---

## 17. Phase 5: advanced company dashboard

Company route:

```txt
/app/company
```

The company dashboard must visually match the Phase 4 worker dashboard.

It must include:

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

The header must say:

```txt
Hola, [CompanyName]
Gestiona microtrabajos, cursos y postulantes desde un solo lugar.
```

Do not use:

```txt
Panel de empresa
```

Sidebar grouping:

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

Sidebar must be collapsible and must not include a bottom profile card.

### Company/local business rule

Do not create two dashboards.

Do not create separate local and company routes.

Use one profile field:

```txt
workMode
```

Technical values:

```txt
local_economy
enterprise_front
both
```

Visible options:

```txt
Economía local
Frente empresarial
Ambas modalidades
```

`workMode` changes labels and suggestions only.

If `workMode` is `both`, the microjob wizard may ask for:

```txt
Modalidad de origen
```

Options:

```txt
Economía local
Frente empresarial
```

### Company registration data used by dashboard

The dashboard must align with registration data:

```txt
Modalidad de trabajo
Nombre completo o nombre comercial si es negocio local
Nombre de la empresa o razón social si es empresa
Cédula, RUC o identificación
Correo de la cuenta
Ciudad
Dirección
Nombre del responsable
Correo del responsable
Cargo
Teléfono de contacto
Tipo de tareas
Escala de operación
Modalidad
Nombre completo o razón social para facturación
RUC o identificación de facturación
Correo de facturación
Dirección fiscal
Método de pago preferido
Objetivo principal
Frecuencia estimada
```

Allowed options:

```txt
Cargo:
Propietario
Gerente
Recursos humanos
Operaciones
Administración
Otro

Tipo de tareas:
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

Escala de operación:
Piloto
Por ciudad
Varias ciudades
Nacional
Flexible

Modalidad:
Presencial
Remota
Híbrida
Por tarea
Por campaña

Método de pago preferido:
Transferencia
Tarjeta
Contrato empresarial
Por definir

Objetivo principal:
Contratar por tarea
Validar información
Realizar encuestas
Apoyo operativo
Campañas locales

Frecuencia estimada:
Una vez
Semanal
Mensual
Por campaña
Por definir
```

### Company microjob creation

Use a wizard, not a huge form.

Steps:

```txt
Información
Ubicación
Requisitos
Fechas y cupos
Imagen
Revisión
```

User-facing microjob fields:

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

After choosing a mock map point, fill:

```txt
Dirección
Latitud
Longitud
```

No real Google Maps API.

No real geocoding.

No real server upload.

### Company course creation

Use a wizard, not a huge form.

Steps:

```txt
Información
Evaluación
Portada
Relaciones
Módulos
Revisión
```

User-facing course fields:

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

If module type is video, show:

```txt
Título del video
Descripción corta
Miniatura o imagen del video
Archivo de video o URL del video
Duración
Transcripción o material de apoyo opcional
```

H5P is future integration only.

No real H5P integration.

No real video upload.

No real media storage.

### Company applicants

Company can list applicants and open details.

Applicant detail includes:

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

Accept/reject is mock local state only.

### Company data layer

Use centralized mock data and repository/service layer:

```txt
src/data/mockCompanyData.js
src/services/companyDashboardRepository.js
```

No real API calls.

---

## 18. Future Phase 6: simulated protected routes

Phase 6 introduces frontend-only route protection.

Create:

```txt
ProtectedRoute.jsx
RoleBasedRoute.jsx
```

Rules:

```txt
No mock session -> redirect /login
worker role -> /app/worker
company role -> /app/company
wrong role -> redirect or show access denied
```

Still no real JWT.

---

## 19. Future Phase 7: PWA base

Add:

```txt
manifest.json
service worker
installable behavior
app icons
standalone mode
theme color
```

No advanced offline yet.

---

## 20. Future Phase 8: offline-first with IndexedDB

Add local persistence:

```txt
IndexedDB
offline queue
profile cache
courses cache
microjobs cache
pending applications
pending company publications
```

No server sync yet.

---

## 21. Future Phase 9: offline synchronization

Add:

```txt
Online/offline detection
Pending action queue
Retry logic
Sync status
User messages
```

Actions may include:

```txt
Enviar postulación
Guardar progreso de curso
Publicar microtrabajo
Crear curso
Actualizar perfil
```

---

## 22. Future Phase 10: API Gateway

Create:

```txt
api-gateway/
```

Recommended stack:

```txt
Node.js + Express
```

Responsibilities:

```txt
Single frontend entry point
Route API requests
Validate tokens later
Proxy to microservices
```

---

## 23. Future Phase 11: microservices

Recommended services:

```txt
users-learning-service
jobs-service
notifications-service
support-service
```

Use at least two stacks if required by the academic project, for example:

```txt
Node.js + Express
Python + FastAPI
```

Business logic location:

```txt
jobs-service:
  microjob filtering
  unlocking
  matching
  distance sorting
  applications

users-learning-service:
  profiles
  courses
  modules
  progress
  skills unlocked
```

Frontend must not own final business rules.

---

## 24. Future Phase 12: Keycloak SSO + JWT

Implement real security here, not earlier.

Use:

```txt
Keycloak
OAuth2/OIDC
JWT
Roles
Google as external identity provider if needed
```

Roles:

```txt
worker
company
admin
```

Flow:

```txt
React -> Keycloak -> JWT -> API Gateway -> microservices
```

Frontend responsibilities:

```txt
Login redirect
Logout
Token handling through approved library
Role-based UI
```

Backend responsibilities:

```txt
JWT validation
Role validation
Endpoint protection
```

---

## 25. Future Phase 13: Redis + AI support

Add:

```txt
Redis
FAQ cache
Support assistant endpoint
Repeated query cache
Temporary support context
```

The assistant can answer questions about:

```txt
Completing profile
Applying to microjobs
Publishing microjobs
Starting courses
Using company dashboard
```

---

## 26. Future Phase 14: HTTPS deployment

Add:

```txt
HTTPS
Environment variables
Cloudflare Tunnel or equivalent
Public frontend
Public API Gateway
Internal microservices
Production configuration
```

---

## 27. Future Phase 15: final testing and documentation

Create:

```txt
README.md
ARCHITECTURE.md
DEPLOYMENT.md
SECURITY.md
PWA-OFFLINE.md
MICROSERVICES.md
```

Include diagrams for:

```txt
Architecture
Authentication flow
Offline flow
Worker application flow
Company publication flow
Microservice communication
```

---

## 28. Mock vs real implementation rule

Current frontend phases may simulate behavior with mock data.

Mock is allowed for:

```txt
Login
Registration
Worker applications
Microjobs
Courses
Course player
Company publications
Applicants
Map coordinates
Image/video previews
Filters
Modals
```

Mock is not allowed to pretend to be secure production behavior.

Do not create fake JWTs.

Do not store fake Google tokens.

Do not call fake APIs that look real.

Prefer repository/service functions returning local mock data.

---

## 29. Backend responsibility rule

These belong to backend later:

```txt
Real authentication
JWT validation
Role validation
Google OAuth
Keycloak
Microjob filtering
Distance sorting
Unlocking logic
Matching logic
Application persistence
Course persistence
Video storage
File upload
Payment processing
Real maps/geocoding
Notifications
Offline sync with server
```

Frontend in current phases only renders and simulates.

---

## 30. Google and SSO rule

Google login/registration is visual or mock only until the SSO phase.

Allowed before SSO phase:

```txt
Continuar con Google button
Registrarme con Google button
Mock identity prefill
Hide password fields in Google mock registration
Show message that SSO will be connected later
```

Forbidden before SSO phase:

```txt
Google SDK
Client IDs
OAuth redirect URIs
Authorization code exchange
ID token verification
Keycloak configuration
Fake Google tokens
Fake JWTs
Backend auth endpoints
```

---

## 31. Maps rule

Before backend/maps phase:

Allowed:

```txt
Mock latitude and longitude
Static map preview card
Google Maps URL with lat/lng
OpenStreetMap URL with lat/lng
```

Forbidden:

```txt
Google Maps API keys
Real geocoding
Real Places API
Real map SDK integration
```

---

## 32. Media and upload rule

Before backend/storage phase:

Allowed:

```txt
Upload UI
Local preview if easy
Mock file name
Mock image URL
Alt text field
Video URL field
```

Forbidden:

```txt
Real upload to server
Real video hosting
Cloud storage integration
Processing media files
```

---

## 33. Payment and billing rule

Before secure backend/payment phase:

Allowed:

```txt
Billing summary
Preferred payment method
Invoice-related mock fields
```

Forbidden:

```txt
Card number
CVV
Banking password
Real payment processing
Payment tokenization
```

---

## 34. H5P rule

H5P is future integration only.

Before the H5P phase:

Allowed:

```txt
H5P option in evaluation type
H5P module type
Message: Las actividades H5P se conectarán en una fase posterior.
```

Forbidden:

```txt
Real H5P package integration
Real H5P content rendering
H5P backend
```

---

## 35. Final development guardrails

Always preserve:

```txt
Landing visual integrity
Auth visual integrity
Official palette
English technical naming
Spanish visible copy
Mobile-first responsiveness
Accessibility
No dead buttons
No unrequested future architecture
No backend before backend phases
Mock data isolated from UI
```

When in doubt:

```txt
Keep UI polished.
Keep data mocked.
Keep business logic ready to move to backend.
Keep screens useful and not overloaded.
```
