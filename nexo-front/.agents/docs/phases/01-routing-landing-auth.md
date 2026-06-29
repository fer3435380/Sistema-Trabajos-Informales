# Phase 1: English Routing Normalization and Landing/Auth Boundary

## 1. Objective

Normalize the current frontend routing and technical references so the project uses English as the canonical technical language.

This phase must create a clear boundary between:

- Public landing page.
- Authentication pages.
- Future private worker/company dashboards.

This is not a visual redesign phase.

This is not a backend phase.

This is not an authentication logic phase.

The goal is to make the project routes, anchors, technical references, and initial placeholders coherent, canonical, and ready for later visual/auth phases.

---

## 2. Context from Phase 0

Phase 0 found that routing may already exist, so this phase must be treated as a **normalization phase**, not as a first-time routing setup.

Known risks:

- The landing may break if header scroll logic or section ids are changed carelessly.
- Existing Spanish/non-English routes may exist.
- Existing Spanish/non-English anchor ids may exist.
- Some footer links may still be placeholder `#` links.
- Auth pages may exist but may be visually inconsistent.
- Some unused UI files may confuse refactors.
- There is not yet a strong public/private app boundary.
- `index.html` may still have generic metadata such as title `nexo-front`.

---

## 3. Main rule

Keep the landing visually intact.

Do not redesign the landing.

Do not modify animations, palette, or layout unless needed for technical naming and routing correctness.

Do not implement real authentication.

Do not implement protected routes yet.

Do not implement backend, PWA, IndexedDB, SSO, JWT, Redis, or microservices.

---

## 4. English-only technical rule

All technical references touched in this phase must be English.

This includes:

- Routes.
- URL paths.
- Anchor ids.
- Route constants, if any.
- Link destinations.
- Component names for new files.
- New file names.
- New folder names.
- New variables and functions.
- New comments.
- Placeholder UI copy.

Do not create new Spanish technical names.

Do not create Spanish canonical routes.

Do not create Spanish canonical anchors.

---

## 5. Canonical routes

Use English routes as the canonical route family.

Canonical routes:

```txt
/                         Public landing
/login                    Login page
/register                 Account type selection
/register/worker          Worker registration
/register/company         Company registration
/app/worker               Worker dashboard placeholder
/app/company              Company dashboard placeholder
```

If non-English routes already exist, do not use them in navigation.

Preferred behavior:

- Replace internal links so they point to the canonical English routes.
- If removing existing non-English routes could break current navigation, keep temporary redirects using React Router `<Navigate />`.

Temporary legacy redirects may include:

```txt
/registro                 → /register
/registro/trabajador      → /register/worker
/registro/empresa         → /register/company
/app/trabajador           → /app/worker
/app/empresa              → /app/company
```

Only add these redirects if those routes already exist or are currently referenced.

Do not promote non-English routes as official routes.

---

## 6. Canonical landing anchor ids

Use English anchor ids as the canonical anchor family.

Canonical landing anchors:

```txt
#home
#how-it-works
#opportunities
#workers
#companies
#stories
#legal
```

If the landing currently uses non-English anchors such as:

```txt
#inicio
#como-funciona
#oportunidades
#trabajadores
#empresas
#historias
#legal
```

then migrate them carefully to the English canonical anchors.

When migrating anchor ids:

1. Update the section `id`.
2. Update header links.
3. Update footer links.
4. Update CTA links if they target sections.
5. Update CSS scroll-margin selectors.
6. Verify smooth scrolling still works.
7. Verify no section is visually affected.

Do not change section layout, text, spacing, colors, or animation while migrating ids.

---

## 7. Files to inspect first

Before modifying anything, inspect:

- `src/routes/AppRouter.jsx`
- `src/App.jsx`
- `src/pages/public/Home.jsx`
- `src/components/layout/Header.jsx`
- `src/components/layout/Footer.jsx`
- `src/components/sections/Hero.jsx`
- `src/components/ui/OpportunityMockPanel.jsx`
- Existing files under `src/pages/auth/`
- Existing files under `src/pages/worker/`
- Existing files under `src/pages/company/`
- `src/index.css`
- `src/App.css`
- `package.json`
- `index.html`

---

## 8. Files likely to be modified

Modify only what is necessary.

Likely existing files:

- `src/routes/AppRouter.jsx`
- `src/components/layout/Header.jsx`
- `src/components/layout/Footer.jsx`
- `src/components/sections/Hero.jsx`
- `src/components/ui/OpportunityMockPanel.jsx`
- `src/index.css`
- `src/App.jsx`, only if needed
- Existing auth pages, only if route links need canonical cleanup

Likely new files:

- `src/pages/worker/WorkerDashboard.jsx`
- `src/pages/company/CompanyDashboard.jsx`

Optional:

- `src/pages/auth/RegisterSelect.jsx`, only if missing
- `src/pages/auth/RegisterWorker.jsx`, only if missing
- `src/pages/auth/RegisterCompany.jsx`, only if missing
- `src/pages/auth/Login.jsx`, only if missing

Do not create duplicate pages if equivalent pages already exist.

---

## 9. Routing requirements

The app router must expose these canonical routes:

```txt
/
/login
/register
/register/worker
/register/company
/app/worker
/app/company
```

The root route `/` must render the existing landing page:

```txt
src/pages/public/Home.jsx
```

The dashboard routes must render simple placeholders if real dashboards do not exist yet.

The placeholder dashboards must:

- Use the official palette.
- Use mobile-first Tailwind classes.
- Be clearly marked as temporary visual placeholders.
- Not require authentication yet.
- Not fetch backend data.

Do not implement `ProtectedRoute` in this phase.

---

## 10. Landing navigation requirements

The landing header/menu must keep anchor navigation for landing sections.

Header links should behave like this:

```txt
Home               → #home
How it works       → #how-it-works
Opportunities      → #opportunities
Workers            → #workers
Companies          → #companies
Stories            → #stories
Legal              → #legal
Log in             → /login
Create account     → /register
```

If worker/company sections do not exist yet, do not invent large new sections. Either:

1. Link to existing equivalent sections after renaming ids, or
2. Report that the anchor was deferred because the section does not exist.

---

## 11. CTA normalization requirements

Normalize all landing CTAs to the canonical English routes.

Examples:

```txt
"Create account"              → /register
"Get started"                 → /register
"I want to work"              → /register/worker
"I am a worker"               → /register/worker
"I am a company"              → /register/company
"Post opportunities"          → /register/company
"Log in"                      → /login
```

If a CTA is only meant to scroll within the landing, keep it as an English anchor.

Do not convert section navigation links into React Router routes.

---

## 12. Footer link requirements

Review footer links.

If links are placeholders using `#`, use one of these options:

1. If the link points to a landing section, change it to the correct English anchor.
2. If the future page does not exist yet, leave it as `#` but document it as deferred.
3. Do not create legal, privacy, or help pages in this phase unless the user explicitly requests them.

Footer must not become a new feature phase.

---

## 13. App.jsx rule

If `App.jsx` already renders the router correctly, do not move the router just to match the target structure.

The preferred final structure is:

```txt
src/app/router/AppRouter.jsx
```

However, if the project currently uses:

```txt
src/routes/AppRouter.jsx
```

then keep it there for now unless moving it is very low-risk.

Do not move router files just for folder perfection in this phase.

If you keep `src/routes/AppRouter.jsx`, report it as a conscious decision.

---

## 14. Mobile-first and Tailwind requirements

Any new placeholder page must be mobile-first.

Use Tailwind classes based on small screens first, then enhance with breakpoints.

Examples:

```jsx
className="min-h-screen bg-[var(--color-primary-softer)] px-4 py-8 md:px-8 lg:px-12"
className="mx-auto w-full max-w-6xl"
className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
```

Avoid:

- Fixed desktop-only widths.
- Horizontal overflow.
- Tiny mobile buttons.
- Non-wrapping cards.

---

## 15. Official palette requirements

Use the official landing palette from `AGENTS.md`.

Use CSS variables directly where practical:

```jsx
className="bg-[var(--color-primary)] text-white"
className="text-[var(--color-text)]"
className="text-[var(--color-text-muted)]"
className="border-[var(--color-primary-border)]"
className="bg-[var(--color-primary-softer)]"
className="bg-[var(--color-amber-soft)]"
```

Do not introduce unrelated colors.

Do not use the old provisional green palette.

---

## 16. Dashboard placeholder requirements

If `WorkerDashboard.jsx` does not exist, create it.

It should communicate that this is the future worker area.

Suggested content:

- Title: "Worker dashboard"
- Short description.
- Cards for:
  - Available courses.
  - Unlocked microjobs.
  - Applications.
- Button or link back to landing.
- Temporary note that functionality will be implemented in later phases.

If `CompanyDashboard.jsx` does not exist, create it.

Suggested content:

- Title: "Company dashboard"
- Short description.
- Cards for:
  - Post a microjob.
  - Active tasks.
  - Applicants.
- Button or link back to landing.
- Temporary note that functionality will be implemented in later phases.

Use English UI copy for visible application text in newly created placeholders.

---

## 17. Auth pages rule

Do not redesign auth pages in this phase.

If auth pages already exist, only modify links/routing if needed.

If auth pages are missing, create minimal placeholders only.

Full visual login belongs to Phase 2.

Full visual registration belongs to Phase 3.

Use English UI copy for any placeholder auth page created in this phase.

---

## 18. index.html metadata

If safe, update generic metadata:

- Keep or set `lang="en"`.
- Change title from generic `nexo-front` to a project title such as:
  - `NexoJobs`
  - `NexoJobs | Microjobs and Learning`

Only do this if it is clearly present and low-risk.

Do not perform large text encoding cleanup in this phase.

---

## 19. Acceptance criteria

This phase is complete when:

- `/` renders the existing landing unchanged.
- `/login` works.
- `/register` works.
- `/register/worker` works.
- `/register/company` works.
- `/app/worker` works with a temporary placeholder.
- `/app/company` works with a temporary placeholder.
- Landing section anchors use English ids.
- Landing section anchors still scroll correctly.
- Landing auth CTAs use canonical English routes.
- Visible placeholder UI copy is in English.
- No real authentication has been implemented.
- No protected routes have been implemented.
- No backend has been added.
- New UI uses the official palette.
- New UI is mobile-first and responsive.
- The project runs without build errors.

---

## 20. Testing instructions

After implementation, run:

```bash
npm run dev
```

Then test manually:

```txt
/
/login
/register
/register/worker
/register/company
/app/worker
/app/company
```

Also test landing anchors:

```txt
#home
#how-it-works
#opportunities
#workers
#companies
#stories
#legal
```

Check in browser:

- Mobile width.
- Tablet width.
- Desktop width.
- Header navigation.
- CTA navigation.
- No horizontal scroll.
- No broken landing animations.
- No color inconsistency.

---

## 21. Required final report

At the end, report:

### What was done

Brief summary.

### Files created

List new files.

### Files modified

List modified files.

### Routes available

List final canonical routes.

### Legacy redirects

List any temporary redirects kept, if any.

### Anchor migration

List old anchors migrated to English anchors.

### Landing preservation

Confirm whether the landing remained visually unchanged.

### Responsive checklist

Confirm:

- Mobile layout checked.
- Tablet layout checked.
- Desktop layout checked.
- No horizontal overflow found.
- Touch-friendly buttons.

### English naming checklist

Confirm:

- Routes are English.
- Anchor ids are English.
- New files are English.
- New components are English.
- New placeholder UI copy is English.
- No new Spanish technical names were introduced.

### Pending work

Mention that:

- Visual login is Phase 2.
- Visual registration is Phase 3.
- Protected routes are Phase 5.
- Backend and SSO are later phases.

---

## 22. Forbidden in this phase

Do not:

- Redesign the landing.
- Change the official palette.
- Implement login logic.
- Implement `ProtectedRoute`.
- Add real authentication.
- Add JWT validation.
- Add backend code.
- Add PWA setup.
- Add IndexedDB.
- Add Redis.
- Add microservices.
- Delete unused files unless explicitly approved.
