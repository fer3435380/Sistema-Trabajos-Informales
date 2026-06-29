# Phase 5.2: Full Frontend Functional Audit, Unified Mock Store, CRUD, and Visual Responsibility

## 1. Objective

Perform a deep functional and visual audit over the full NexoJobs frontend, then implement the missing frontend behavior needed to make the current app flow work end-to-end using a unified mock data store.

This phase happens after the visual phases are complete.

The application is still frontend-only, but it must stop behaving like disconnected static mock screens.

The goal is to make the frontend behave like a real application prototype where the user can:

```txt
Create a worker account.
Create a company account.
Log in with created accounts.
Use role-based dashboards.
Publish microjobs as a company.
Publish courses as a company.
Create and manage course modules as a company.
View company-created microjobs as a worker.
View company-created courses as a worker.
Apply to microjobs as a worker.
Cancel/remove an application when allowed.
Accept or reject applications as a company.
See accepted/rejected status changes from both roles.
Continue an accepted application as a worker when supported.
View course details.
Start and continue courses.
Update course progress when supported.
Validate that created data appears in lists, details, edit flows, and dashboards.
```

This phase must also verify that:

```txt
Every visible button works.
Every required CRUD flow exists where the current UI requires it.
All information shown in details comes from the actual data captured by the current UI.
The current fields, sections, forms, and labels are respected.
The UI remains clean, mobile-first, modular, scalable, and visually polished.
```

This phase must **not** implement backend yet.

---

## 2. Critical correction: current UI is the source of truth

Codex must not impose fixed field lists from older phases.

Codex must inspect the current project and use what already exists.

Important:

```txt
Do not impose new required form fields.
Do not re-add fields that were removed by the user.
Do not use old phase field lists as mandatory contracts.
Do not replace current forms with older specifications.
Do not enlarge forms just because previous markdown files mentioned more fields.
```

The current frontend is the source of truth for:

```txt
Registration fields.
Login fields.
Worker dashboard sections.
Company dashboard sections.
Microjob form fields.
Course form fields.
Module form fields.
Application detail fields.
Applicant detail fields.
Status cards.
Configuration screens.
Modal content.
Buttons.
```

Codex must inspect the current code and detect the existing fields dynamically.

The job of this phase is not to force more fields.

The job is to make the existing data coherent and functional across the full frontend.

---

## 3. Core rule: no disconnected mock islands

Previous phases may have created static mock data inside components.

This phase must replace disconnected static mocks with a unified mock persistence layer.

Do not remove the mock concept.

Instead:

```txt
Remove disconnected hardcoded mock islands.
Create a single frontend mock store.
Persist user-created data.
Connect dashboards to the same data source.
Make worker and company flows affect each other.
```

Example expected behavior:

```txt
Company creates a microjob.
Worker dashboard can show that microjob if allowed by the current UI rules.

Worker applies to a microjob.
Company dashboard shows that applicant/postulation.

Company accepts the application.
Worker dashboard shows that application as accepted.

Company creates a course.
Worker dashboard can show that course if allowed by current UI rules.

Worker starts a course.
Worker dashboard moves that course to in-progress.
```

---

## 4. Scope

Analyze and validate at least these routes:

```txt
/
 /login
/register
/register/worker
/register/company
/app/worker
/app/company
```

Keep canonical routes in English.

Do not create Spanish canonical routes.

If Spanish legacy redirects already exist, keep them only as redirects.

---

## 5. Language rule

All technical project elements must remain in English:

```txt
Routes.
URL paths.
File names.
Folder names.
Component names.
Function names.
Variable names.
Constants.
Code comments.
Mock data keys.
Repository names.
Store names.
LocalStorage keys.
```

All visible user-facing UI copy must remain in Spanish.

Technical examples:

```txt
useNexoJobsStore
nexojobs_app_state
authRepository
workerRepository
companyRepository
courseRepository
microjobRepository
applicationRepository
createMicrojob
updateCourse
deleteModule
cancelApplication
acceptApplication
```

Visible Spanish examples:

```txt
Crear cuenta
Iniciar sesión
Publicar microtrabajo
Crear curso
Editar módulo
Cancelar postulación
Aceptar postulante
Rechazar postulante
```

Do not create Spanish code identifiers.

Do not create Spanish routes.

Do not create Spanish file names.

---

## 6. Official palette and visual identity

Keep the official NexoJobs palette.

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

Do not introduce unrelated palettes.

Do not change the project brand identity.

---

## 7. Files to inspect first

Before modifying anything, inspect:

```txt
AGENTS.md
src/routes/AppRouter.jsx
src/App.jsx
src/pages/auth/
src/pages/worker/
src/pages/company/
src/components/auth/
src/components/worker/
src/components/company/
src/components/ui/
src/components/layout/
src/services/
src/data/
src/index.css
src/App.css
package.json
```

Also inspect:

```txt
Existing localStorage keys.
Existing mock data files.
Existing repository/service files.
Existing dashboard components.
Existing modal/drawer components.
Existing shared UI components.
```

---

## 8. Required initial report before implementation

Before changing files, Codex must report the analysis.

### 8.1 Flow analysis

Analyze the current implementation of:

```txt
Landing -> Register.
Landing -> Login.
Login -> Worker dashboard.
Login -> Company dashboard.
Register worker -> Worker dashboard or login.
Register company -> Company dashboard or login.
Worker microjob application.
Company microjob creation.
Company course creation.
Course module creation.
Applicant acceptance/rejection.
Worker course start/continue.
Configuration actions.
```

### 8.2 Existing fields analysis

For each current form and modal, Codex must identify the fields that already exist in the code.

Areas to inspect:

```txt
Worker registration.
Company registration.
Login.
Microjob creation/editing.
Course creation/editing.
Module creation/editing.
Application/postulation details.
Applicant details.
Worker profile/status.
Company profile/status.
Billing/facturation summary if present.
Configuration if present.
```

Codex must not compare these fields against old required field lists.

The goal is consistency with the current UI.

### 8.3 Consistency analysis

Check that:

```txt
Data requested during worker registration appears consistently in worker dashboard/status where relevant.
Data requested during company registration appears consistently in company dashboard/status/billing where relevant.
Data requested during microjob creation appears consistently in list, detail, edit, worker visibility, and application flows.
Data requested during course creation appears consistently in list, detail, edit, worker course visibility, and course player flows.
Data requested during module creation appears consistently in module list, course detail, and course player where relevant.
Application data appears consistently in both worker and company views.
Accepted applications show schedule/map information if the current UI supports it.
```

If a detail screen shows data that is not captured anywhere:

```txt
Connect it to an existing captured field.
Or adjust/remove the displayed detail so it matches available data.
```

If a form captures data that is never shown anywhere important:

```txt
Show it in the appropriate list, detail, status, or edit flow.
```

### 8.4 Button audit

List and inspect all button categories:

```txt
Navigation buttons.
Submit buttons.
Detail buttons.
CRUD buttons.
Filter buttons.
Modal buttons.
Course actions.
Application actions.
Microjob actions.
Configuration buttons.
Sidebar/header buttons.
```

Identify:

```txt
Dead buttons.
Placeholder-only buttons.
Buttons that navigate to missing routes.
Buttons that open empty modals.
Buttons that do not update state.
Buttons that should be disabled with a reason.
```

### 8.5 CRUD audit

Inspect CRUD for these entity categories:

```txt
Worker account.
Company account.
Microjob.
Course.
Course module.
Application/postulation.
Applicant status.
Profile/status data.
Settings/configuration.
```

Report what already exists and what is missing.

### 8.6 Visual responsibility audit

Codex must also report visual quality issues.

Review:

```txt
Landing consistency.
Login clarity.
Registration card density.
Worker dashboard density.
Company dashboard density.
Sidebar readability.
Header balance.
Card spacing.
Button hierarchy.
Modal density.
Wizard readability.
Mobile layout.
Horizontal overflow.
Status badge clarity.
Icon consistency.
```

Report:

```txt
Screens that look visually correct.
Screens that feel overloaded.
Screens that need spacing or hierarchy improvements.
Buttons or actions that create visual noise.
Modals or forms that should be simplified.
Mobile risks.
```

### 8.7 Architecture audit

Check:

```txt
Component modularity.
Repository/service separation.
Mock data separation.
Tailwind usage.
Mobile-first layout.
Responsive behavior.
Accessibility basics.
Scalability for backend replacement.
Folder organization.
Repeated UI patterns.
Dead code from old disconnected mocks.
```

After reporting, implement the required changes.

---

## 9. Unified mock store

Create or refactor into a unified frontend mock data store.

Preferred localStorage key:

```txt
nexojobs_app_state
```

Recommended flexible top-level structure:

```js
{
  users: [],
  sessions: {
    currentUserId: null
  },
  workerProfiles: [],
  companyProfiles: [],
  microjobs: [],
  courses: [],
  courseModules: [],
  applications: [],
  notifications: [],
  settings: []
}
```

This is a flexible structure.

It must adapt to the fields currently present in the UI.

Do not force old fields into the store.

### Recommended files

```txt
src/data/seedAppState.js
src/services/appStateStore.js
src/services/authRepository.js
src/services/workerRepository.js
src/services/companyRepository.js
src/services/microjobRepository.js
src/services/courseRepository.js
src/services/applicationRepository.js
```

A smaller structure is acceptable if it stays clean and scalable.

### appStateStore responsibilities

The central store should support:

```js
getState()
setState(nextState)
resetState()
seedStateIfEmpty()
generateId(prefix)
subscribe(listener) // optional
```

### Repository rule

UI components should call repository functions instead of directly manipulating localStorage.

Example repository functions:

```js
authRepository.registerWorker(payload)
authRepository.registerCompany(payload)
authRepository.login(email, password)
authRepository.logout()

microjobRepository.createMicrojob(companyId, payload)
microjobRepository.updateMicrojob(microjobId, payload)
microjobRepository.deleteMicrojob(microjobId)
microjobRepository.getVisibleMicrojobsForWorker(workerId)

courseRepository.createCourse(companyId, payload)
courseRepository.updateCourse(courseId, payload)
courseRepository.deleteCourse(courseId)
courseRepository.createModule(courseId, payload)
courseRepository.updateModule(moduleId, payload)
courseRepository.deleteModule(moduleId)

applicationRepository.applyToMicrojob(workerId, microjobId)
applicationRepository.cancelApplication(applicationId)
applicationRepository.acceptApplication(applicationId, schedulePayload)
applicationRepository.rejectApplication(applicationId, reason)
```

Repository functions may accept flexible payloads based on the current UI fields.

---

## 10. Authentication mock behavior

Login and registration must work with the unified mock store.

### Worker registration

When a worker registers:

```txt
Create a user with role worker.
Create a worker profile using the fields currently present in the worker registration UI.
Store the submitted data.
Start a session or redirect to login depending on the current UX.
```

### Company registration

When a company registers:

```txt
Create a user with role company.
Create a company profile using the fields currently present in the company registration UI.
Store the submitted data.
Start a session or redirect to login depending on the current UX.
```

### Login

Login must:

```txt
Validate that the account exists in the mock store.
Validate password for manual accounts when password exists.
Skip password for google_mock accounts only if the current mock Google flow supports it.
Set current session.
Redirect by role:
worker -> /app/worker
company -> /app/company
```

Do not create fake JWTs.

Do not claim real security.

---

## 11. Google mock consistency

Google registration/login remains mock only.

Required behavior:

```txt
Google mock fills identity fields currently present in the UI.
Password fields are hidden for Google mock registration if the current UI supports that flow.
The remaining profile/company fields currently present in the UI are still required.
```

In the unified store, save:

```txt
authProvider: manual
```

or:

```txt
authProvider: google_mock
```

Do not store fake Google tokens.

Do not create fake JWTs.

---

## 12. Worker dashboard functional requirements

The worker dashboard must consume data from the unified store/repositories.

### 12.1 Postulaciones

Must show applications for the current worker.

Required operations:

```txt
Read applications.
View application detail.
Cancel/remove application when status allows it.
Continue accepted application if the UI has accepted-application flow.
View schedule/map details for accepted application if the UI supports it.
```

Cancel rule:

```txt
Can cancel if status is En revisión or Pendiente.
Cannot cancel if status is Aceptada, Completada, or Rechazada.
```

### 12.2 Microtrabajos

Must show microjobs published by companies.

Required behavior:

```txt
Show available/unlocked microjobs.
Show locked microjobs with overlay and reason if the UI has locked state.
Sort visible microjobs by distance in mock frontend if distance exists.
Open detail modal.
Apply to microjob.
Prevent duplicate applications.
```

Do not add new mandatory fields.

Use the current microjob data shape and extend only where necessary for flow consistency.

### 12.3 Cursos disponibles

Must show courses created by companies when allowed by current UI rules.

Required behavior:

```txt
View course detail.
Start course.
Started course moves to Cursos en progreso.
```

### 12.4 Cursos en progreso

Required behavior if course player/progress UI exists:

```txt
Show progress.
Open course player.
Show modules if modules exist.
Mark module as completed if supported.
Update progress.
Complete course when all modules are complete.
Unlock related skills/microjobs if current data supports it.
```

### 12.5 Estado del perfil

Must reflect stored worker registration data.

No static fake profile status disconnected from registration.

---

## 13. Company dashboard functional requirements

The company dashboard must consume data from the unified store/repositories.

### 13.1 Panel

Must show counts from actual store.

Examples of current cards may include:

```txt
Microtrabajos activos.
Postulantes nuevos.
Cursos publicados.
Cupos disponibles.
```

Use whatever summary cards currently exist, but populate them from store data.

### 13.2 Microtrabajos

Required CRUD:

```txt
Create microjob.
Read/list microjobs.
View detail.
Update/edit microjob.
Delete/archive microjob.
```

The create/edit form must use the fields currently present in the UI.

Do not add old fields that were removed.

### 13.3 Postulantes

Must show applications for company microjobs.

Required operations:

```txt
Read/list applicants.
View applicant detail.
Accept applicant.
Reject applicant.
```

When accepting:

```txt
Application status becomes Aceptada.
Schedule data must be collected, selected, or generated if accepted-application continuation exists.
Worker dashboard must show Continuar when applicable.
```

When rejecting:

```txt
Application status becomes Rechazada.
Worker dashboard must reflect Rechazada.
```

### 13.4 Cursos

Required CRUD:

```txt
Create course.
Read/list courses.
View detail.
Update/edit course.
Delete/archive course.
```

The create/edit form must use the fields currently present in the UI.

Do not add old fields that were removed.

### 13.5 Módulos

Required CRUD:

```txt
Create module.
Read/list modules.
View module detail if present.
Update/edit module.
Delete module.
Reorder modules if the UI exposes ordering.
```

The create/edit form must use the fields currently present in the UI.

Do not add old fields that were removed.

### 13.6 Estado de la empresa

Must reflect stored company registration data.

No disconnected static status.

### 13.7 Facturación

If the current UI has billing/facturation fields, it must reflect stored company registration data.

Do not process real payments.

---

## 14. CRUD matrix required

Codex must implement or verify CRUD for these entity categories.

| Entity | Create | Read | Update | Delete/Cancel |
|---|---:|---:|---:|---:|
| Worker account | Yes | Yes | Basic profile update if present | Optional |
| Company account | Yes | Yes | Basic company update if present | Optional |
| Microjob | Yes | Yes | Yes | Yes/archive |
| Course | Yes | Yes | Yes | Yes/archive |
| Course module | Yes | Yes | Yes | Yes |
| Application/postulation | Yes/apply | Yes | Yes/status | Yes/cancel when allowed |
| Applicant status | Company accepts/rejects | Yes | Yes | No hard delete required |
| Profile status | Derived | Yes | Through stored fields | No |
| Settings | Optional | Yes | Basic toggles/placeholders | No |

If any required CRUD is missing, implement it using the current UI fields.

If full edit UI is too large, implement an edit modal with the fields currently present in the corresponding create/detail UI.

No dead edit/delete buttons.

---

## 15. Data consistency rules

### 15.1 Registration to dashboard

Worker registration must populate:

```txt
Worker header name.
Worker profile/status.
Any worker detail cards currently shown.
Any worker matching fields currently used by the UI.
```

Company registration must populate:

```txt
Company header name.
Company mode badge if present.
Company status section.
Billing/facturation section if present.
Microjob wizard labels if they adapt to profile type.
```

### 15.2 Company microjob to worker microjob

A microjob created by company must appear in worker Microtrabajos if it meets the current UI rules.

Examples of current UI rules may include:

```txt
published/active state.
capacity.
archived/deleted state.
course requirement.
unlock state.
distance/relevance if present.
```

### 15.3 Company course to worker courses

A course created by company must appear in worker Cursos disponibles if it meets the current UI rules.

Examples:

```txt
published/active state.
not archived.
worker has not started it.
```

### 15.4 Worker application to company applicants

When worker applies:

```txt
Create application.
Application appears in worker Postulaciones.
Application appears in company Postulantes.
Related counts update.
```

### 15.5 Company acceptance to worker application

When company accepts:

```txt
Application status becomes Aceptada.
Schedule data exists if required by current accepted-flow UI.
Worker can click Continuar if current UI supports it.
Schedule/map modal opens if current UI supports it.
```

### 15.6 Course completion to microjob unlock

If the current UI supports locked microjobs by course/skill:

```txt
Completing a course should unlock related microjobs.
Locked overlay should disappear when requirements are met.
```

---

## 16. Button functionality audit and implementation

Every visible button must either:

```txt
Perform a frontend action.
Open a modal/drawer.
Navigate to an existing route/section.
Show a meaningful validation message.
Be intentionally disabled with a visible reason.
```

Forbidden:

```txt
Buttons that do nothing.
Buttons that only say "se implementará después".
Buttons that open empty modals.
Buttons that navigate to missing routes.
Buttons that change nothing in state.
```

Button categories to inspect:

### Public/auth

```txt
Crear cuenta.
Iniciar sesión.
Continuar con Google.
Registrarme con Google.
```

### Worker

```txt
Filtros.
Aplicar filtros.
Limpiar.
Postula ya.
Ver detalle.
Postular.
Cancelar postulación.
Continuar.
Abrir en mapa.
Iniciar curso.
Continuar curso.
Marcar como completado.
Ver curso requerido.
```

### Company

```txt
Publicar microtrabajo.
Guardar borrador.
Publicar.
Editar.
Eliminar.
Archivar.
Crear curso.
Crear módulo.
Editar módulo.
Eliminar módulo.
Aceptar.
Rechazar.
Ver perfil.
Elegir punto en mapa.
Subir imagen.
```

Codex must only implement buttons that exist in the current UI or are necessary to complete an existing flow.

Do not add a forest of new buttons.

If a listed button exists, it must work.

---

## 17. Validation rules

Implement basic frontend validation based on current fields.

Do not validate fields that no longer exist.

Validation must be derived from the current form structure.

General rules:

```txt
Required visible fields should be validated.
Email fields should have basic email validation if present.
Password confirmation should be validated if both password fields exist.
Description length should be validated if the UI has a description field with limit.
Numeric fields should be positive if the UI uses numeric values.
Image alt text should be required if the UI asks for an image and alt text.
Video-specific validation should only apply when the current module form has video-specific fields.
```

Use Spanish validation messages.

Do not add heavy validation libraries unless already present.

---

## 18. Visual responsibility rules

Phase 5.2 must not only make things work.

It must also ensure the UI still looks clean.

If something looks visually overloaded, confusing, too dense, too fake, too square, or hard to use, Codex must simplify and polish it while preserving current fields and functional flows.

### 18.1 What Codex should simplify

Codex may adjust:

```txt
Spacing.
Card layout.
Button hierarchy.
Modal layout.
Drawer layout.
Responsive layout.
Information grouping.
Which data appears on initial card vs detail modal.
Order of sections inside a modal or wizard.
Reusable UI components.
```

Codex may not change:

```txt
Canonical routes.
Current business model.
Current user roles.
Existing field decisions unless fixing bugs.
Official palette.
Spanish visible copy rule.
English technical naming rule.
Frontend-only scope.
```

### 18.2 Reduction principles

If a card shows too much:

```txt
Keep title, status, main metadata, and primary action visible.
Move full details into modal/drawer.
```

If too many buttons appear:

```txt
Keep primary actions visible.
Move secondary actions into clearer flows.
Use subtle secondary buttons.
Use danger styling only for destructive actions.
```

If a form feels too long:

```txt
Keep current fields.
Group them better.
Use steps if already part of the UI pattern.
Improve spacing.
Remove unnecessary helper paragraphs.
Do not remove saved data.
```

If a table is bad on mobile:

```txt
Convert to stacked cards.
Keep labels readable.
Avoid horizontal overflow.
```

If a modal is too dense:

```txt
Group content.
Improve spacing.
Use clear footer actions.
Make it scrollable on mobile.
```

### 18.3 Button hierarchy

Use consistent hierarchy:

```txt
Primary action: strong blue button.
Secondary action: outline or subtle button.
Danger action: danger soft/outline unless confirming deletion.
Disabled action: clear disabled style plus reason.
```

Avoid many strong blue buttons in one card.

Examples:

```txt
Primary: Publicar, Guardar, Postular, Continuar.
Secondary: Ver detalle, Editar, Cancelar.
Danger: Eliminar, Archivar, Rechazar.
```

### 18.4 Filters

Filters should not be permanently expanded unless they are very small quick filters.

Main filter logic should use:

```txt
Filtros.
Aplicar filtros.
Limpiar.
Cancelar.
```

in a modal or drawer.

### 18.5 Preserve user-created data

Do not delete data from the store just because it is hidden visually.

If a field exists and is saved, it can be shown in detail view instead of the main card.

---

## 19. UI consistency rules

Make sure:

```txt
Initial cards are compact.
Full detail is shown only in modals/drawers.
Filters are not permanently expanded.
Modals are responsive.
Tables become cards on mobile.
Sidebar behavior is consistent between worker and company.
Header style is consistent between worker and company.
Status colors are consistent.
Buttons have consistent hierarchy.
No screen feels fake or unfinished.
```

---

## 20. Structural review requirements

At the end, inspect and improve project structure.

Check:

```txt
React components are modular.
Large pages are split into components when needed.
Repeated UI patterns use shared components when practical.
Repository/service layer exists.
Mock data is centralized.
Tailwind is used consistently.
No unrelated CSS hacks.
Mobile-first classes are present.
No horizontal overflow.
Accessibility basics are present.
Routes are clean.
No duplicate route families.
No Spanish technical identifiers.
No dead code from old disconnected mocks.
```

If obvious structure issues exist, fix them within scope.

Do not rewrite the whole project if not necessary.

---

## 21. Recommended shared components

Create or reuse shared UI components if practical:

```txt
Modal.
Drawer.
Button.
StatusBadge.
ProgressBar.
EmptyState.
FilterModal.
ConfirmDialog.
FormField.
SelectField.
ChipSelector.
ImageUploadPreview.
MapPreview.
Stepper.
```

Keep components simple.

Do not create an oversized design system.

---

## 22. LocalStorage reset/debug tool

Add a small developer-only reset mechanism if useful.

Visible text:

```txt
Restablecer datos de prueba
```

This should reset `nexojobs_app_state` to seed data.

Do not present it as a production feature.

A good place is:

```txt
Configuración
```

if the current UI has it.

---

## 23. Forbidden in this phase

Do not:

```txt
Implement real backend calls.
Install Keycloak.
Add real OAuth2/OIDC.
Create real JWTs.
Add API Gateway.
Add microservices.
Add Redis.
Add IndexedDB.
Add PWA/offline sync.
Add real Google Maps API.
Add real geocoding.
Upload files to a server.
Host videos.
Integrate H5P.
Process payments.
Ask for CVV.
Ask for card number.
Store sensitive real financial credentials.
Reintroduce fields removed by the user.
Force old phase field lists onto the current UI.
Add large new sections not already part of the current UX.
```

This phase remains frontend-only.

---

## 24. Acceptance criteria

Phase 5.2 is complete when:

```txt
A worker account can be created and used.
A company account can be created and used.
Login works with stored mock accounts.
Worker dashboard uses stored data.
Company dashboard uses stored data.
Company can create/edit/delete/archive microjobs using current UI fields.
Company can create/edit/delete courses using current UI fields.
Company can create/edit/delete/reorder modules using current UI fields.
Worker can see company-created microjobs and courses when allowed by current UI rules.
Worker can apply to microjobs.
Company can see applicants.
Company can accept/reject applicants.
Worker sees accepted/rejected status changes.
Accepted application Continuar opens schedule/map if current UI supports it.
Worker can start and continue courses if current UI supports it.
Course progress updates from module completion if course player exists.
Course completion can unlock related microjobs if current UI supports it.
Filters work through modals/drawers if present.
Details show complete information from created data.
No visible button is dead.
Required CRUD exists.
Mock data is centralized.
Repository/service layer exists.
Registration data is consistent with dashboards.
Frontend remains mobile-first and responsive.
The project remains modular and scalable.
No real backend/auth/maps/uploads/payments were added.
No old removed fields were reintroduced.
Visual overload was reduced where needed.
```

---

## 25. Testing instructions

Run:

```bash
npm run dev
```

Test complete flows.

### 25.1 Worker account flow

```txt
Open /register/worker.
Create worker account using the currently visible fields.
Log in with that worker.
Open /app/worker.
Check profile data consistency.
Start a course if available.
Continue course if supported.
Complete modules if supported.
Apply to a microjob.
Cancel a pending application if allowed.
```

### 25.2 Company account flow

```txt
Open /register/company.
Create company account using the currently visible fields.
Log in with that company.
Open /app/company.
Check company status and billing consistency.
Create microjob.
Edit microjob.
Delete/archive microjob.
Create course.
Edit course.
Create modules.
Create video module if the current UI supports it.
Publish course if supported.
Review applicants.
Accept one applicant.
Reject one applicant.
```

### 25.3 Cross-role flow

```txt
Company creates microjob.
Worker sees microjob.
Worker applies.
Company sees applicant.
Company accepts with schedule if required.
Worker sees Aceptada.
Worker clicks Continuar if supported.
Schedule/map modal opens if supported.
```

### 25.4 Consistency checks

```txt
Created microjob detail matches current form data.
Created course detail matches current form data.
Created modules appear in course player if present.
Registration data appears in dashboards.
Buttons work.
No dead actions.
Responsive mobile view works.
No horizontal overflow.
No removed fields returned.
```

---

## 26. Required final report

At the end, report:

### Deep analysis summary

Explain what was found.

### Existing fields summary

Summarize detected field groups without claiming they are mandatory contracts.

### Visual audit summary

Explain what looked overloaded and what was simplified.

### Files created

List files.

### Files modified

List files.

### Unified mock store

Confirm:

```txt
localStorage key.
Store/repository files.
Seed behavior.
Reset behavior if added.
```

### Full flow validation

Confirm:

```txt
Worker registration.
Company registration.
Login.
Company microjob creation.
Company course creation.
Module creation.
Worker application.
Company acceptance/rejection.
Worker course flow.
```

### CRUD matrix

Report CRUD status for:

```txt
Microjobs.
Courses.
Modules.
Applications.
Applicants.
Profiles.
Settings.
```

### Button audit

Confirm no dead buttons remain.

### Consistency audit

Confirm:

```txt
Registration data.
Detail views.
Dashboards.
Created data.
Edit flows.
Cross-role flows.
```

### Architecture audit

Confirm:

```txt
Mobile-first.
Tailwind.
Component modularity.
Repository/service separation.
Scalable folder structure.
No Spanish technical identifiers.
No real backend added.
```

### Pending work

Mention:

```txt
Real backend/API Gateway.
Real auth/Keycloak/JWT.
Real database.
Real maps/geocoding.
Real file/video storage.
Real H5P integration.
PWA/offline.
Microservices.
```
