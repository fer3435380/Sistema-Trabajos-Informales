# Phase 3: Centered Complete Registration Flow with Google Completion Path

## 1. Objective

Create a complete, polished, mobile-first registration flow for NexoJobs.

The registration must collect the necessary information properly, but it must be organized inside a clean centered white card, not as a long landing-style page.

This phase must also prepare the visual flow for users who register with Google.

Important:

- Google registration is visual/mock only in this phase.
- Real Google OAuth, Keycloak, JWT, and backend validation are future work.
- Google should only prefill basic identity data such as name and email.
- After choosing Google registration, the user must continue to a second step/window to complete the missing profile data.
- If the user registers with Google, do not ask for password fields in the visual flow.
- If the user registers manually, show password and confirm password fields.

This phase must create or refine these routes:

```txt
/register
/register/worker
/register/company
```

This is a frontend visual and structural phase only.

Do not implement real backend registration, Keycloak, OAuth2, JWT, protected routes, API Gateway, PWA, IndexedDB, Redis, or microservices in this phase.

---

## 2. Core design rule

Do not create a registration page with a big left text panel.

Do not repeat what the landing already explains.

Do not create a long one-page form that looks endless.

The correct layout is:

```txt
Soft full-screen background
  Centered white registration card
    Top compact brand/header area
    Step navigation / bullet navigation
    Current form section
    Previous / Next buttons
    Final submit button
```

The form must feel like a guided registration process.

The user should not see every field at once.

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
- LocalStorage keys.
- Mock data keys.
- Internal labels.

All visible user-facing UI copy must be in Spanish.

Examples of technical English:

```txt
/register
/register/worker
/register/company
RegisterSelect.jsx
RegisterWorker.jsx
RegisterCompany.jsx
currentStep
authMethod
workerForm
companyForm
handleGoogleRegistration
handleManualRegistration
googleMockProfile
selectedSkills
selectedDocuments
nexojobs_mock_worker_registration
nexojobs_mock_company_registration
```

Examples of visible Spanish UI copy:

```txt
Crear cuenta
Registrarme con Google
Completar perfil
Datos personales
Datos educativos
Datos laborales
Datos financieros
Siguiente
Anterior
Finalizar registro
```

Do not create Spanish code identifiers.

Do not create Spanish routes.

Do not create Spanish file names.

---

## 4. Routes

Use only these canonical routes:

```txt
/register
/register/worker
/register/company
```

Do not create Spanish routes.

If legacy redirects from Spanish routes already exist, leave them unless explicitly requested.

---

## 5. Files to inspect first

Before modifying anything, inspect:

- `AGENTS.md`
- `src/routes/AppRouter.jsx`
- `src/pages/auth/RegisterSelect.jsx`
- `src/pages/auth/RegisterWorker.jsx`
- `src/pages/auth/RegisterCompany.jsx`
- `src/pages/auth/Login.jsx`
- `src/components/auth/`
- `src/components/ui/`
- `src/index.css`
- `src/App.css`
- `src/assets/`, if it exists
- `public/`, if it contains logo or icon assets

---

## 6. Files likely to be modified or created

Preferred files:

```txt
src/pages/auth/RegisterSelect.jsx
src/pages/auth/RegisterWorker.jsx
src/pages/auth/RegisterCompany.jsx
```

Optional shared components, only if they help keep the code clean:

```txt
src/components/auth/RegisterCard.jsx
src/components/auth/RegisterStepNav.jsx
src/components/auth/FormField.jsx
src/components/auth/SelectableChip.jsx
src/components/auth/GoogleAuthButton.jsx
```

Do not over-engineer.

Do not modify the landing page.

Do not modify the login page unless a registration link is broken.

---

## 7. Google registration concept

The registration flow must support two visual paths:

```txt
Manual registration
  → User fills basic identity fields
  → User creates password
  → User completes profile sections

Google registration
  → User clicks "Registrarme con Google"
  → Mock Google identity is used in this phase
  → Name and email are prefilled
  → Password fields are hidden
  → User completes missing profile sections
```

Google can only provide basic identity information.

In this phase, treat Google profile as mock data:

```js
{
  fullName: "Usuario Nexo",
  email: "usuario@nexojobs.com",
  avatarUrl: "",
  authProvider: "google_mock"
}
```

Do not use real Google tokens.

Do not install Google SDK.

Do not configure Keycloak.

Do not call backend services.

---

## 8. Google button behavior in Phase 3

Allowed:

- Show a visual button:
  - `Registrarme con Google`
- On click, set `authMethod` to `"google_mock"`.
- Prefill name and email fields with mock values.
- Hide password and confirm password fields.
- Move the user to the profile completion form.
- Show a small badge:
  - `Google conectado`
- Show short helper text:
  - `Completa los datos restantes para finalizar tu registro.`

Forbidden:

- Do not install Google SDK packages.
- Do not add Google Client IDs.
- Do not add OAuth redirect URIs.
- Do not exchange authorization codes.
- Do not verify Google ID tokens.
- Do not configure Keycloak.
- Do not create backend auth endpoints.
- Do not store fake Google tokens.
- Do not generate fake JWTs.

Real Google SSO belongs to the future Keycloak/OAuth2 phase.

---

## 9. Register selection page: `/register`

Create a simple centered page for choosing account type.

### Required visual layout

```txt
Soft background
  Centered white card
    NexoJobs badge
    Crear cuenta
    Elige el tipo de cuenta
    Two selectable cards/buttons
```

### Required visible copy

Title:

```txt
Crear cuenta
```

Subtitle:

```txt
Elige el tipo de cuenta.
```

Worker option:

```txt
Trabajador
```

Worker short text:

```txt
Crear perfil personal.
```

Company option:

```txt
Empresa
```

Company short text:

```txt
Registrar organización.
```

Login link:

```txt
¿Ya tienes cuenta? Iniciar sesión
```

### Navigation

Worker option must link to:

```txt
/register/worker
```

Company option must link to:

```txt
/register/company
```

Login link must go to:

```txt
/login
```

### Content limit

Do not add benefits lists.

Do not add more than one short sentence per card.

---

## 10. General visual structure for worker and company pages

Worker and company registration pages should use:

```txt
Soft background
  Centered white card
    Compact header
    Auth method area
      Manual registration fields OR Google connected badge
    Step navigation
    Current section content
    Navigation buttons
```

There must be no large lateral text panel.

The centered white card is the main visual element.

Suggested outer layout:

```jsx
className="min-h-screen bg-[var(--color-primary-softer)] px-4 py-6 md:px-8 lg:flex lg:items-center lg:justify-center"
```

Suggested card:

```jsx
className="mx-auto w-full max-w-5xl rounded-[2rem] border border-[var(--color-primary-border)] bg-white p-5 shadow-2xl md:p-8"
```

---

## 11. Step navigation / bullet navigation

The registration must use visual sections.

Use one of these patterns:

- Horizontal pills.
- Stepper.
- Bullet navigation.
- Tabs.

The sections must be short labels, not questions.

Worker sections:

```txt
Datos personales
Educación
Trabajo
Finanzas
Preferencias
```

Company sections:

```txt
Empresa
Responsable
Operación
Facturación
Preferencias
```

Use the current active section to display only the fields for that section.

Do not display all sections expanded at once.

---

## 12. Worker registration page: `/register/worker`

Create a complete worker registration flow, organized by sections.

### 12.1 Page title and subtitle

Title:

```txt
Registro de trabajador
```

Subtitle:

```txt
Completa tus datos para crear tu perfil.
```

### 12.2 Auth method area

At the beginning of the form, show:

```txt
Registrarme con Google
```

and a subtle divider or manual path label:

```txt
o completa tus datos
```

If the user clicks Google:

- Prefill:
  - Nombre completo
  - Correo electrónico
- Hide:
  - Contraseña
  - Confirmar contraseña
- Show badge:
  - `Google conectado`
- Continue with the remaining sections.

If the user does not use Google:

- Show all manual fields including password and confirm password.

---

### 12.3 Section: Datos personales

Fields:

```txt
Nombre completo
Correo electrónico
Teléfono
Cédula o identificación
Fecha de nacimiento
Ciudad
Sector o zona
Contraseña
Confirmar contraseña
```

For Google registration:

- `Nombre completo` can be prefilled.
- `Correo electrónico` can be prefilled.
- Password fields must be hidden.
- The user still completes the remaining fields.

---

### 12.4 Section: Educación

Fields:

```txt
Nivel educativo
Área de formación
Institución
Actualmente estudias
```

Suggested options for `Nivel educativo`:

```txt
Básica
Bachillerato
Técnico
Universidad
Cursos cortos
Sin estudios formales
```

Suggested options for `Actualmente estudias`:

```txt
Sí
No
```

Chips for `Área de formación`:

```txt
Administración
Tecnología
Servicios
Alimentos
Electricidad
Ventas
Otro
```

---

### 12.5 Section: Trabajo

Fields:

```txt
Experiencia previa
Área de experiencia
Disponibilidad
Modalidad preferida
```

Options for `Experiencia previa`:

```txt
Sin experiencia
Menos de 1 año
1 a 2 años
Más de 2 años
```

Chips for `Área de experiencia`:

```txt
Atención al cliente
Manejo de alimentos
Reparaciones
Encuestas
Datos
Ventas
Limpieza
Eventos
```

Chips for `Disponibilidad`:

```txt
Mañana
Tarde
Noche
Fines de semana
Flexible
```

Chips for `Modalidad preferida`:

```txt
Cerca de mi zona
Remota
Por horas
Por tarea
```

---

### 12.6 Section: Finanzas

Fields:

```txt
Método de pago preferido
Entidad financiera o billetera
Número de cuenta o referencia
Tipo de cuenta
```

Options for `Método de pago preferido`:

```txt
Cuenta bancaria
Billetera móvil
Pago en efectivo
Por definir
```

Options for `Tipo de cuenta`:

```txt
Ahorros
Corriente
No aplica
```

Important:

- This is visual/mock only.
- Do not validate real banking information.
- Do not store sensitive financial data in real services.
- Do not request card numbers.
- Do not request CVV.
- Do not request bank passwords or banking credentials.

Short helper text:

```txt
Esta información se usará más adelante para configurar pagos.
```

---

### 12.7 Section: Preferencias

Use chips/buttons.

Groups:

```txt
Intereses
Tipo de oportunidades
```

Interest chips:

```txt
Atención al cliente
Alimentos
Reparaciones
Encuestas
Datos
Ventas
Eventos
```

Opportunity type chips:

```txt
Aprender primero
Trabajar pronto
Cerca de mi zona
Remoto
Flexible
```

Primary submit button:

```txt
Finalizar registro
```

Secondary/back link:

```txt
Cambiar tipo de cuenta
```

Login link:

```txt
¿Ya tienes cuenta? Iniciar sesión
```

---

## 13. Company registration page: `/register/company`

Create a complete company registration flow, organized by sections.

### 13.1 Page title and subtitle

Title:

```txt
Registro de empresa
```

Subtitle:

```txt
Completa los datos para crear tu cuenta.
```

### 13.2 Auth method area

At the beginning of the form, show:

```txt
Registrarme con Google
```

and a subtle divider or manual path label:

```txt
o completa los datos
```

If the user clicks Google:

- Prefill:
  - Nombre del responsable
  - Correo del responsable
- Hide:
  - Contraseña
  - Confirmar contraseña
- Show badge:
  - `Google conectado`
- Continue with company data.

Google should not prefill company legal data, RUC, billing data, or operation data.

---

### 13.3 Section: Empresa

Fields:

```txt
Nombre de la empresa
RUC o identificación
Tipo de empresa
Sector
Ciudad
Dirección
Correo corporativo
Contraseña
Confirmar contraseña
```

For Google registration:

- Do not prefill company name.
- Do not prefill RUC.
- Do not prefill billing info.
- Password fields must be hidden.
- The user still completes company information.

Options for `Tipo de empresa`:

```txt
Emprendimiento
Pyme
Empresa mediana
Empresa grande
Organización
```

Options for `Sector`:

```txt
Comercio
Servicios
Tecnología
Alimentos
Educación
Salud
Otro
```

---

### 13.4 Section: Responsable

Fields:

```txt
Nombre del responsable
Cargo
Teléfono de contacto
Correo del responsable
```

For Google registration:

- `Nombre del responsable` may be prefilled.
- `Correo del responsable` may be prefilled.
- The user still completes role and phone.

Options for `Cargo`:

```txt
Propietario
Gerente
Recursos humanos
Operaciones
Administración
Otro
```

---

### 13.5 Section: Operación

Fields and chips:

```txt
Tipo de tareas
Escala de operación
Modalidad
```

Task chips:

```txt
Encuestas
Etiquetado de datos
Validación de información
Eventos
Promociones
Tareas operativas
Pruebas de producto
```

Scale chips:

```txt
Piloto
Por ciudad
Varias ciudades
Nacional
Flexible
```

Modality chips:

```txt
Presencial
Remota
Híbrida
Por tarea
Por campaña
```

---

### 13.6 Section: Facturación

Fields:

```txt
Razón social
RUC de facturación
Correo de facturación
Dirección fiscal
Método de pago preferido
```

Options for `Método de pago preferido`:

```txt
Transferencia
Tarjeta
Contrato empresarial
Por definir
```

Important:

- This is visual/mock only.
- Do not process payments.
- Do not ask for card number.
- Do not ask for CVV.
- Do not store payment credentials.
- Real billing/payment handling belongs to a future backend/security phase.

Short helper text:

```txt
Estos datos se usarán para configurar facturación más adelante.
```

---

### 13.7 Section: Preferencias

Use chips/buttons.

Groups:

```txt
Objetivo principal
Frecuencia estimada
```

Objective chips:

```txt
Contratar por tarea
Validar información
Realizar encuestas
Apoyo operativo
Campañas locales
```

Frequency chips:

```txt
Una vez
Semanal
Mensual
Por campaña
Por definir
```

Primary submit button:

```txt
Finalizar registro
```

Secondary/back link:

```txt
Cambiar tipo de cuenta
```

Login link:

```txt
¿Ya tienes cuenta? Iniciar sesión
```

---

## 14. Step behavior

The registration flow may use local React state to move between sections.

Required behavior:

- Show the current section.
- Allow moving to the next section.
- Allow moving to the previous section.
- Highlight the active section.
- Do not show all fields at once.
- On the final section, show the final submit button.

Suggested button copy:

```txt
Anterior
Siguiente
Finalizar registro
```

Basic validation may happen per step or at final submit.

Keep validation simple.

---

## 15. Validation behavior

Allowed validation:

- Required fields must not be empty.
- Email fields should not be empty.
- Password and confirm password must match for manual registration.
- Password validation must be skipped for Google mock registration.
- At least one chip should be selected in relevant chip groups.

Use short Spanish messages:

```txt
Completa los datos requeridos.
Las contraseñas no coinciden.
Selecciona al menos una opción.
```

Do not add validation libraries.

Do not create complex validation schemas.

---

## 16. Mock behavior

Allowed in this phase:

- Use local React state.
- Save mock data in localStorage.
- Include `authProvider` in mock data:
  - `"manual"`
  - `"google_mock"`
- Redirect after mock submission:
  - Worker → `/app/worker`
  - Company → `/app/company`

Suggested keys:

```txt
nexojobs_mock_worker_registration
nexojobs_mock_company_registration
```

Do not call a backend.

Do not create real users.

Do not create fake JWTs.

Do not claim this is secure registration.

---

## 17. Data safety rule

This phase may visually include financial and billing fields, but it must not implement real financial processing.

Do not request:

- Card number.
- CVV.
- Bank password.
- Online banking credentials.
- Sensitive authentication credentials.

If localStorage mock data is used, keep it clearly temporary and avoid storing high-risk financial credentials.

---

## 18. Mobile-first and responsive requirements

All pages must be mobile-first.

Mobile:

- White card centered with full width.
- Step navigation can wrap or scroll horizontally.
- Inputs stack vertically.
- Chips wrap naturally.
- Buttons are touch-friendly.
- No horizontal overflow.

Desktop:

- Centered card.
- Fields can use two columns.
- Step navigation remains compact.
- Form should not feel like a long landing page.
- The page may scroll if necessary, but only the centered card should carry the flow.

Recommended outer layout:

```jsx
className="min-h-screen bg-[var(--color-primary-softer)] px-4 py-6 md:px-8 lg:flex lg:items-center lg:justify-center"
```

Recommended card:

```jsx
className="mx-auto w-full max-w-5xl rounded-[2rem] border border-[var(--color-primary-border)] bg-white p-5 shadow-2xl md:p-8"
```

Recommended form grid:

```jsx
className="grid grid-cols-1 gap-4 md:grid-cols-2"
```

Recommended step navigation:

```jsx
className="flex gap-2 overflow-x-auto pb-2"
```

---

## 19. Acceptance criteria

`/register` is complete when:

- It shows a centered white card.
- It offers worker and company registration.
- It contains little text.
- It links to `/register/worker`.
- It links to `/register/company`.
- It links to `/login`.

`/register/worker` is complete when:

- It uses a centered white card.
- It has step/bullet navigation.
- It includes:
  - Datos personales.
  - Educación.
  - Trabajo.
  - Finanzas.
  - Preferencias.
- It supports manual registration.
- It supports visual/mock Google registration.
- With Google mock, name/email are prefilled and password fields are hidden.
- It does not show all fields at once.
- It uses chips/buttons for selectable options.
- It does not call backend services.

`/register/company` is complete when:

- It uses a centered white card.
- It has step/bullet navigation.
- It includes:
  - Empresa.
  - Responsable.
  - Operación.
  - Facturación.
  - Preferencias.
- It supports manual registration.
- It supports visual/mock Google registration.
- With Google mock, responsible person name/email are prefilled and password fields are hidden.
- It does not prefill legal company or billing fields with Google.
- It does not show all fields at once.
- It uses chips/buttons for selectable options.
- It does not call backend services.

All pages must:

- Use Spanish visible copy.
- Use English technical names.
- Be responsive.
- Use the official palette.
- Not repeat landing content.
- Not implement real OAuth, Keycloak, JWT, backend, PWA, Redis, or microservices.

---

## 20. Testing instructions

Run:

```bash
npm run dev
```

Test these routes:

```txt
/register
/register/worker
/register/company
/login
```

Check:

- `/register` links correctly to worker and company registration.
- Worker manual registration moves between sections.
- Company manual registration moves between sections.
- Worker Google mock registration prefills name/email and hides password fields.
- Company Google mock registration prefills responsible person name/email and hides password fields.
- Chips can be selected and unselected.
- Password confirmation validation works for manual registration.
- Password validation is skipped for Google mock registration.
- Required field validation works.
- Login link goes to `/login`.
- Back link goes to `/register`.
- Pages visually match the login style.
- Pages do not repeat landing content.
- Mobile layout works.
- Desktop layout works.
- No horizontal overflow.
- No backend requests are made.

---

## 21. Required final report

At the end, report:

### What was done

Brief summary.

### Files created

List created files.

### Files modified

List modified files.

### Routes available

Confirm:

```txt
/register
/register/worker
/register/company
```

### Registration structure

Summarize the worker and company steps.

### Google registration behavior

Explain that Google is mock/visual only in this phase.

Confirm:

- Worker Google path prefills personal name/email.
- Company Google path prefills responsible person name/email.
- Password fields are hidden for Google mock registration.
- The remaining profile/company data still must be completed.

### Data safety

Confirm that no real financial processing, real OAuth, tokens, or sensitive payment credentials were implemented.

### Responsive checklist

Confirm:

- Mobile checked.
- Tablet checked.
- Desktop checked.
- No horizontal overflow.
- Inputs and buttons are touch-friendly.
- Step navigation works.
- Chips wrap correctly.

### Language checklist

Confirm:

- Code and technical names are English.
- Routes are English.
- Visible UI copy is Spanish.

### Pending work

Mention:

- Real backend registration is future work.
- Real Google OAuth/Keycloak SSO is future work.
- JWT validation is future work.
- Protected routes are future work.
- API Gateway and microservices are later phases.

---

## 22. Forbidden in this phase

Do not:

- Redesign the landing page.
- Redesign the login page unless a registration link is broken.
- Add big lateral text panels.
- Add landing-style explanation sections.
- Add marketing sections.
- Show all registration fields at once.
- Change the official palette.
- Add real backend registration.
- Configure Keycloak.
- Add OAuth2/OIDC.
- Add JWT validation.
- Add ProtectedRoute.
- Add API Gateway.
- Add PWA setup.
- Add IndexedDB.
- Add Redis.
- Add microservices.
- Add payment processing.
- Ask for card number or CVV.
- Add Google SDK.
- Add Google Client IDs.
- Store fake Google tokens.
- Add external UI libraries without approval.
