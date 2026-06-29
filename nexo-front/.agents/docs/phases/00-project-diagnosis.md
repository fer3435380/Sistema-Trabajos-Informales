# Phase 0: Project Diagnosis

## 1. Objective

Analyze the current React project without modifying any files.

This phase exists to understand how the landing page is currently built, what dependencies are installed, how Tailwind CSS is configured, what visual palette is actually being used, what non-English technical names exist, and what changes will be necessary before separating routes, login, registration, and dashboards.

## 2. Main rule

Do not modify files during this phase.

Only inspect, analyze, and report.

## 3. Files and folders to inspect

Inspect these files and folders if they exist:

- `package.json`
- `package-lock.json`
- `vite.config.js`
- `index.html`
- `src/App.jsx`
- `src/main.jsx`
- `src/index.css`
- `src/App.css`
- `tailwind.config.js`
- `postcss.config.js`
- `src/components/`
- `src/pages/`
- `src/routes/`
- `public/`
- Any file related to the landing page

## 4. Analysis requirements

### 4.1 Current structure

Identify:

- Where the landing page lives.
- Whether everything is inside `App.jsx`.
- Whether components are already separated.
- Whether a `pages` folder exists.
- Whether a `components` folder exists.
- Whether a routing structure already exists.
- Whether the project already has public/private layout separation.

### 4.2 Dependencies

Inspect `package.json` and report:

- Whether React is used.
- Whether Vite is used.
- Whether Tailwind CSS is used.
- Whether `react-router-dom` is installed.
- Whether any PWA-related dependency exists.
- Whether there are dependencies that look unused.
- Whether the project appears to use JavaScript or TypeScript.

### 4.3 Official landing palette verification

The official palette is defined in `AGENTS.md` and comes from the existing landing CSS variables.

Confirm whether the following variables exist in the project:

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

Report:

- Where these variables are defined.
- Whether they are used in components.
- Whether there are additional HEX, RGB, HSL, or Tailwind color classes in the landing.
- Whether new screens should use CSS variables directly or existing Tailwind classes.
- Whether any color seems inconsistent with the official palette.

Do not modify the palette.

Do not replace the palette.

Do not introduce green colors.

### 4.4 Tailwind and responsive status

Analyze:

- Whether Tailwind CSS is correctly configured.
- Whether the project appears to use Tailwind v4 style with `@import "tailwindcss";`.
- Whether responsive classes are already used.
- Whether the landing appears mobile-first.
- Whether there are fixed widths that may break mobile screens.
- Whether sections stack correctly on mobile.
- Whether forms or buttons may need mobile adjustments in future phases.

Report any risk related to responsiveness.

### 4.5 English technical naming status

Analyze whether the project contains non-English technical names in:

- Routes.
- URL paths.
- Anchor ids.
- File names.
- Folder names.
- Component names.
- Function names.
- Variable names.
- Constants.
- CSS class names created by the project.
- Code comments.
- Mock data keys.

Report any non-English technical names that should be migrated in later phases.

Do not rename anything in Phase 0.

### 4.6 Landing page

Analyze:

- Existing sections.
- Existing buttons.
- Current navigation menu.
- Which buttons are internal anchors.
- Which buttons should become React Router links.
- Which visual parts should not be touched in Phase 1.

### 4.7 Preparation for routing

Identify what is needed for Phase 1:

- Whether `react-router-dom` must be installed.
- Which file should remain or become `Home.jsx`.
- How `App.jsx` should be simplified later.
- Which pages should be created.
- What risks exist when moving the landing.
- Which routes should become canonical English routes.
- Which old non-English routes should become temporary redirects, if any.
- Which anchor ids should be migrated to English.

## 5. Expected output format

At the end of this phase, deliver the report using this structure:

### General diagnosis

Short summary of the current project state.

### Detected structure

Relevant folders and files.

### Detected dependencies

Important dependencies and missing dependencies.

### Official landing palette confirmation

Confirm the real colors found in the project.

### Additional colors detected

List any extra colors found outside the official palette.

### Tailwind and mobile-first status

Explain whether the project is already mobile-first and responsive.

### English technical naming status

List non-English technical names found and recommend migration priorities.

### Current navigation

Explain how buttons and anchors currently work.

### Problems or risks

List anything that could break if Phase 1 is done carelessly.

### Recommendation for Phase 1

Explain what should be done next.

### Files likely to be modified in Phase 1

List files that would probably be created or modified.

## 6. Forbidden in this phase

Do not:

- Modify `App.jsx`.
- Move files.
- Install dependencies.
- Create routes.
- Rename anchors.
- Rename files.
- Change styles.
- Change the landing.
- Implement login.
- Create dashboards.
- Add PWA files.
- Add backend code.
