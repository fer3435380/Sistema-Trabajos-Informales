import { useState } from 'react'
import FormField from '../auth/FormField'
import { moduleTypeOptions } from '../../data/mockCompanyData'
import CompanyModalShell from './CompanyModalShell'
import VideoResourceForm from './VideoResourceForm'

function buildEmptyModule(order = 1) {
  return {
    id: '',
    title: '',
    moduleType: '',
    duration: '',
    durationMinutes: '',
    summary: '',
    order,
    status: 'Borrador',
    videoTitle: '',
    videoDescription: '',
    videoResource: '',
    videoDuration: '',
    videoFileName: '',
    supportMaterial: '',
  }
}

function sortModules(modules) {
  return [...modules].sort(
    (leftModule, rightModule) => Number(leftModule.order) - Number(rightModule.order)
  )
}

function ModuleBuilder({ modules, onChange }) {
  const [moduleDraft, setModuleDraft] = useState(buildEmptyModule(modules.length + 1))
  const [editingModuleId, setEditingModuleId] = useState(null)
  const [validationMessage, setValidationMessage] = useState('')

  function updateField(event) {
    const { name, value } = event.target
    setModuleDraft((currentDraft) => ({
      ...currentDraft,
      [name]: value,
    }))
  }

  function handleVideoFileChange(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setModuleDraft((currentDraft) => ({
      ...currentDraft,
      videoFileName: file.name,
      videoResource: currentDraft.videoResource || file.name,
    }))
  }

  function validateModule() {
    if (
      !moduleDraft.title.trim() ||
      !moduleDraft.moduleType ||
      !moduleDraft.duration.trim() ||
      !moduleDraft.summary.trim() ||
      !String(moduleDraft.order).trim()
    ) {
      return 'Completa los campos principales del módulo.'
    }

    if (
      moduleDraft.moduleType === 'Video' &&
      (!moduleDraft.videoTitle.trim() ||
        !moduleDraft.videoDescription.trim() ||
        !moduleDraft.videoDuration.trim() ||
        !moduleDraft.videoResource.trim())
    ) {
      return 'Completa todos los campos del módulo de video.'
    }

    return ''
  }

  function resetDraft() {
    setEditingModuleId(null)
    setValidationMessage('')
    setModuleDraft(buildEmptyModule(modules.length + 1))
  }

  function handleSaveModule() {
    const message = validateModule()

    if (message) {
      setValidationMessage(message)
      return
    }

    const normalizedModule = {
      ...moduleDraft,
      durationMinutes: Number(moduleDraft.durationMinutes) || 0,
      order: Number(moduleDraft.order),
    }

    const nextModules = editingModuleId
      ? modules.map((module) =>
          module.id === editingModuleId ? normalizedModule : module
        )
      : [...modules, { ...normalizedModule, id: `module-draft-${Date.now()}` }]

    onChange(sortModules(nextModules))
    resetDraft()
  }

  function handleEditModule(module) {
    setEditingModuleId(module.id)
    setValidationMessage('')
    setModuleDraft({ ...buildEmptyModule(module.order), ...module })
  }

  function handleRemoveModule(moduleId) {
    onChange(modules.filter((module) => module.id !== moduleId))

    if (editingModuleId === moduleId) {
      resetDraft()
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[1.3rem] border border-[var(--color-primary-border)] bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--color-primary)]">Módulos del curso</p>
              <h3 className="text-lg font-bold tracking-[-0.03em] text-[var(--color-primary-strong)]">
                {modules.length} módulos cargados
              </h3>
            </div>
            <button
              type="button"
              onClick={resetDraft}
              className="inline-flex min-h-[40px] items-center justify-center rounded-[0.9rem] border border-[var(--color-primary-border)] px-3 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)]"
            >
              Nuevo módulo
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {modules.map((module) => (
              <article
                key={module.id}
                className="rounded-[1rem] border border-[var(--color-primary-border)] bg-[var(--color-primary-softer)] p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-primary-strong)]">
                      {module.order}. {module.title}
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                      {module.moduleType} · {module.duration}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditModule(module)}
                      className="inline-flex min-h-[36px] items-center justify-center rounded-[0.8rem] border border-[var(--color-primary-border)] px-3 py-1.5 text-xs font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)]"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveModule(module.id)}
                      className="inline-flex min-h-[36px] items-center justify-center rounded-[0.8rem] border border-[var(--color-danger-border)] bg-[var(--color-danger-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--color-danger)] transition hover:border-[var(--color-danger)]"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
                  {module.summary}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[1.3rem] border border-[var(--color-primary-border)] bg-white p-4">
          <p className="text-sm font-semibold text-[var(--color-primary)]">
            {editingModuleId ? 'Editar módulo' : 'Agregar módulo'}
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              id="title"
              label="Título del módulo"
              value={moduleDraft.title}
              onChange={updateField}
              placeholder="Nombre del módulo"
              required
            />
            <FormField
              id="moduleType"
              label="Tipo de módulo"
              as="select"
              value={moduleDraft.moduleType}
              onChange={updateField}
              placeholder="Selecciona una opción"
              options={moduleTypeOptions}
              required
            />
            <FormField
              id="duration"
              label="Duración estimada"
              value={moduleDraft.duration}
              onChange={updateField}
              placeholder="Ejemplo: 15 min"
              required
            />
            <FormField
              id="durationMinutes"
              label="Duración en minutos"
              type="number"
              value={moduleDraft.durationMinutes}
              onChange={updateField}
              placeholder="15"
              required
            />
            <FormField
              id="order"
              label="Orden del módulo"
              type="number"
              value={moduleDraft.order}
              onChange={updateField}
              placeholder="1"
              required
            />
            <div className="md:col-span-2">
              <FormField
                id="summary"
                label="Contenido o resumen"
                value={moduleDraft.summary}
                onChange={updateField}
                placeholder="Resume el objetivo del módulo"
                required
              />
            </div>
          </div>

          {moduleDraft.moduleType === 'Video' ? (
            <div className="mt-4">
              <VideoResourceForm
                moduleDraft={moduleDraft}
                onFieldChange={updateField}
                onVideoFileChange={handleVideoFileChange}
              />
            </div>
          ) : null}

          {moduleDraft.moduleType === 'H5P' ? (
            <div className="mt-4 rounded-[1rem] border border-[var(--color-primary-border)] bg-[var(--color-primary-softer)] p-4">
              <p className="text-sm leading-6 text-[var(--color-text-muted)]">
                Las actividades H5P se conectarán en una fase posterior.
              </p>
            </div>
          ) : null}

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <div className="min-h-[24px]" aria-live="polite">
              {validationMessage ? (
                <p className="text-sm font-semibold text-[var(--color-danger)]">
                  {validationMessage}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={handleSaveModule}
              className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
            >
              {editingModuleId
                ? 'Guardar cambios del módulo'
                : 'Agregar módulo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ModuleEditorModal({ module, isOpen, onClose, onSave, onDelete }) {
  const [draft, setDraft] = useState(module || buildEmptyModule())
  const [validationMessage, setValidationMessage] = useState('')

  function updateField(event) {
    const { name, value } = event.target
    setDraft((currentDraft) => ({
      ...currentDraft,
      [name]: value,
    }))
  }

  function handleVideoFileChange(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setDraft((currentDraft) => ({
      ...currentDraft,
      videoFileName: file.name,
      videoResource: currentDraft.videoResource || file.name,
    }))
  }

  function handleSave() {
    if (
      !draft.title.trim() ||
      !draft.moduleType ||
      !String(draft.duration).trim() ||
      !draft.summary.trim() ||
      !String(draft.order).trim()
    ) {
      setValidationMessage('Completa los campos principales del módulo.')
      return
    }

    if (
      draft.moduleType === 'Video' &&
      (!draft.videoTitle?.trim() ||
        !draft.videoDescription?.trim() ||
        !draft.videoDuration?.trim() ||
        !draft.videoResource?.trim())
    ) {
      setValidationMessage('Completa todos los campos del módulo de video.')
      return
    }

    setValidationMessage('')
    onSave({ ...draft, order: Number(draft.order), durationMinutes: Number(draft.durationMinutes) || 0 })
  }

  return (
    <CompanyModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={draft?.title || 'Editar módulo'}
      description="Ajusta el contenido del módulo desde este editor mock."
      size="lg"
      footer={
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          {onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] border border-[var(--color-danger-border)] bg-[var(--color-danger-soft)] px-4 py-2.5 text-sm font-semibold text-[var(--color-danger)] transition hover:border-[var(--color-danger)]"
            >
              Eliminar módulo
            </button>
          ) : (
            <span />
          )}
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] border border-[var(--color-primary-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-muted)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-strong)]"
            >
              Guardar módulo
            </button>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          id="title"
          label="Título del módulo"
          value={draft.title}
          onChange={updateField}
          placeholder="Nombre del módulo"
          required
        />
        <FormField
          id="moduleType"
          label="Tipo de módulo"
          as="select"
          value={draft.moduleType}
          onChange={updateField}
          placeholder="Selecciona una opción"
          options={moduleTypeOptions}
          required
        />
        <FormField
          id="duration"
          label="Duración estimada"
          value={draft.duration}
          onChange={updateField}
          placeholder="Ejemplo: 15 min"
          required
        />
        <FormField
          id="order"
          label="Orden del módulo"
          type="number"
          value={draft.order}
          onChange={updateField}
          placeholder="1"
          required
        />
        <div className="md:col-span-2">
          <FormField
            id="summary"
            label="Contenido o resumen"
            value={draft.summary}
            onChange={updateField}
            placeholder="Resume el objetivo del módulo"
            required
          />
        </div>
      </div>

      {draft.moduleType === 'Video' ? (
        <div className="mt-4">
          <VideoResourceForm
            moduleDraft={draft}
            onFieldChange={updateField}
            onVideoFileChange={handleVideoFileChange}
          />
        </div>
      ) : null}

      {draft.moduleType === 'H5P' ? (
        <div className="mt-4 rounded-[1rem] border border-[var(--color-primary-border)] bg-[var(--color-primary-softer)] p-4">
          <p className="text-sm leading-6 text-[var(--color-text-muted)]">
            Las actividades H5P se conectarán en una fase posterior.
          </p>
        </div>
      ) : null}

      <div className="mt-3 min-h-[20px]" aria-live="polite">
        {validationMessage ? (
          <p className="text-sm font-semibold text-[var(--color-danger)]">{validationMessage}</p>
        ) : null}
      </div>
    </CompanyModalShell>
  )
}

export default ModuleBuilder
