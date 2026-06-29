# Phase 2 Refinement: One-Screen Reference Login Layout

## 1. Objective

Refine the current `/login` page because it is too tall and does not match the requested reference closely enough.

The login must fit in a single desktop viewport and visually resemble the reference composition:

- One large rounded blue container.
- Left blue welcome panel with very little text.
- Right floating white login card.
- No long feature lists.
- No dashboard-style cards.
- No "route active", progress, course, or opportunity cards.
- No excessive vertical scrolling on desktop.
- Mobile-first responsive behavior.

This is a visual refinement only.

Do not implement real OAuth2, real SSO, Keycloak, JWT validation, backend calls, protected routes, PWA, IndexedDB, Redis, or microservices.

---

## 2. Current issue to fix

The current login screen has these problems:

- It is too tall.
- It scrolls too much on desktop.
- The left panel contains too much content.
- It looks like another landing section instead of a login screen.
- The right side is too separated and feels like a full page area, not a floating card.
- The composition does not closely match the reference image.
- The screen should feel compact, centered, and balanced.

The login must become simpler and closer to the reference.

---

## 3. Language rule

Technical project elements must remain in English:

- Routes.
- File names.
- Folder names.
- Component names.
- Function names.
- Variables.
- Constants.
- Comments.
- LocalStorage keys.
- Mock data keys.

Visible user-facing UI copy must remain in Spanish.

Examples:

Technical English:

```txt
Login.jsx
handleSubmit
handleGoogleSignIn
showPassword
rememberMe
authMessage
nexojobs_mock_session
```

Visible Spanish:

```txt
Bienvenido nuevamente
Iniciar sesión
Correo electrónico
Contraseña
Recordarme
Continuar con Google
Crear cuenta
```

---

## 4. Route

Keep the login route as:

```txt
/login
```

Do not create new routes.

---

## 5. Files to inspect first

Inspect before modifying:

- `src/pages/auth/Login.jsx`
- `src/routes/AppRouter.jsx`
- `src/index.css`
- `src/App.css`
- `src/assets/`, if it exists
- `public/`, if it contains logo or icon assets

---

## 6. Files likely to be modified

Preferred file:

```txt
src/pages/auth/Login.jsx
```

Only modify supporting components if the current login uses them.

Do not modify the landing page.

---

## 7. Required desktop layout

On desktop, the login must fit in one viewport.

Use a layout similar to:

```txt
Full viewport soft background
  Centered rounded blue auth container
    Left blue area
      Logo or NexoJobs badge
      Bienvenido nuevamente
      One short line
    Right area
      Floating white login card
```

Important:

- The outer page should use `min-h-screen`.
- The main auth container should have a controlled height on desktop.
- The desktop layout should avoid page scrolling unless the viewport is unusually small.
- Do not create content that pushes the page downward.

Recommended desktop sizing idea:

```jsx
className="min-h-screen bg-[var(--color-primary-softer)] px-4 py-6 lg:flex lg:items-center lg:justify-center lg:overflow-hidden"
```

Recommended container sizing idea:

```jsx
className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] bg-[var(--color-primary)] shadow-2xl lg:h-[min(720px,calc(100vh-48px))] lg:grid-cols-[1.1fr_0.9fr]"
```

If the project setup does not support `min()` inside arbitrary Tailwind values, use a safe fixed desktop max height such as:

```jsx
className="lg:h-[720px] lg:max-h-[calc(100vh-48px)]"
```

---

## 8. Left panel must be minimal

Remove excessive left-side content.

Do not show:

- Three large feature cards.
- Route active cards.
- Course/progress cards.
- Long paragraphs.
- Dashboard-like information.
- Big stacked content blocks.

The left panel should contain only:

```txt
NexoJobs
Bienvenido nuevamente
Continúa donde lo dejaste y accede a nuevas oportunidades.
```

Optional:

- Use the existing official logo/icon if available.
- Add at most two small chips:
  - `Aprende`
  - `Trabaja`

Do not add more than two chips.

Do not add large cards below the welcome text.

The left side should feel spacious, clean, and close to the reference.

---

## 9. Right card must look like the reference

The right side must contain a floating white card.

The right side should not look like a full plain white page.

The white card must:

- Be centered inside the right area.
- Have rounded corners.
- Have soft shadow.
- Have compact vertical spacing.
- Have max width around `420px`.
- Not exceed available viewport height.
- Keep all form content visible in desktop view.

Suggested card sizing:

```jsx
className="mx-auto w-full max-w-[420px] rounded-[1.75rem] bg-white p-6 shadow-2xl md:p-8"
```

Avoid:

- Large header blocks inside the form card.
- Excessive padding.
- Large vertical gaps.
- Huge titles that push the form down.
- Large dividers.

---

## 10. Exact visual hierarchy

Use this visible Spanish copy only.

Left panel:

```txt
NexoJobs
Bienvenido nuevamente
Continúa donde lo dejaste y accede a nuevas oportunidades.
```

Optional chips:

```txt
Aprende
Trabaja
```

Right card:

```txt
Iniciar sesión
Accede a tu cuenta para continuar.
Correo electrónico
Contraseña
Mostrar
Ocultar
Recordarme
¿Olvidaste tu contraseña?
Iniciar sesión
o continúa con
Continuar con Google
¿No tienes cuenta? Crear cuenta
```

Do not add extra explanatory copy.

Do not add feature lists.

Do not add route/progress blocks.

---

## 11. Background and decorative shapes

The reference uses simple abstract shapes.

Recreate them with subtle CSS only:

Allowed:

- One or two soft circles.
- Subtle blue gradient.
- Very light translucent overlays.

Forbidden:

- Many floating elements.
- Noisy decoration.
- Watermarked reference image.
- External stock images.
- Decorations covering text or inputs.

Decorations must not increase the page height.

Use `absolute` elements inside containers with `overflow-hidden`.

---

## 12. Official palette

Use only the official palette:

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
}
```

Use Tailwind arbitrary values:

```jsx
bg-[var(--color-primary)]
bg-[var(--color-primary-strong)]
bg-[var(--color-primary-soft)]
bg-[var(--color-primary-softer)]
border-[var(--color-primary-border)]
text-[var(--color-text)]
text-[var(--color-text-muted)]
bg-[var(--color-amber-soft)]
text-[var(--color-amber)]
```

Do not use green.

Do not introduce unrelated colors.

---

## 13. Mobile behavior

Mobile should still be responsive.

On mobile:

- The layout may stack vertically.
- The blue welcome panel should be compact.
- The form card should appear below it.
- Page scrolling is acceptable on small screens.
- No horizontal scroll.
- Buttons and inputs must be touch-friendly.
- Decorative elements should be reduced or hidden if needed.

Desktop one-screen behavior is the priority for this refinement.

---

## 14. Form behavior

Keep existing basic behavior if already implemented:

- Email input.
- Password input.
- Password show/hide.
- Remember me checkbox.
- Forgot password link.
- Submit button.
- Register link to `/register`.
- Google button visual only.

Mock login may continue to:

- Validate email/password presence.
- Save minimal mock session.
- Redirect to `/app/worker`.

Do not add fake JWTs.

Do not add real authentication.

---

## 15. Google button rule

The Google button remains visual only.

Allowed:

- Show:
  - `Continuar con Google`
- On click, show:
  - `El acceso con Google se conectará en la fase de SSO.`

Forbidden:

- Google SDK.
- Google Client ID.
- OAuth redirect.
- Keycloak configuration.
- Token handling.
- Backend calls.

---

## 16. Acceptance criteria

This refinement is complete when:

- `/login` fits in one desktop viewport without excessive vertical scrolling.
- The screen visually resembles the reference much more closely.
- The left panel is minimal.
- The right form is inside a floating white card.
- No dashboard-style cards remain in the left panel.
- No long explanatory content remains in the left panel.
- The design uses the official NexoJobs palette.
- Visible copy is in Spanish.
- Technical names are in English.
- Mobile layout remains usable.
- The landing page remains unchanged.
- No real OAuth, Keycloak, JWT, backend, PWA, Redis, or microservices are added.
- The project runs without build errors.

---

## 17. Testing instructions

Run:

```bash
npm run dev
```

Test:

```txt
/login
```

Desktop checks:

- 1366x768 or similar viewport.
- Login should fit without needing to scroll much.
- Left side should be minimal.
- Right card should be clearly floating.
- No large cards below the welcome text.

Mobile checks:

- 375px width.
- Content stacks correctly.
- No horizontal overflow.
- Inputs and buttons are usable.

Also check:

- Password toggle works.
- Register link goes to `/register`.
- Google button does not perform real OAuth.
- Mock login goes to `/app/worker`, if mock login exists.

---

## 18. Required final report

At the end, report:

### What changed visually

Explain how the page was made closer to the reference.

### What content was removed

Mention removed excessive left-side feature/dashboard content.

### Files modified

List modified files.

### Viewport fit

Confirm that desktop layout was constrained to fit a single screen.

### Login behavior

Explain mock behavior, if any.

### Google SSO status

Confirm Google remains visual only and Keycloak/SSO is future work.

### Responsive checklist

Confirm:

- Desktop checked.
- Mobile checked.
- No horizontal overflow.
- Inputs and buttons are touch-friendly.

### Language checklist

Confirm:

- Technical names are English.
- Visible UI copy is Spanish.

### Pending work

Mention:

- Real SSO with Keycloak is future work.
- Protected routes are future work.
- Backend integration is future work.
