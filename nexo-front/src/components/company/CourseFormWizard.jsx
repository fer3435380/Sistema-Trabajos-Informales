import { useState } from 'react'
import FormField from '../auth/FormField'
import {
  assessmentTypeOptions,
  courseCategoryOptions,
  courseLevelOptions,
} from '../../data/mockCompanyData'
import CompanyModalShell from './CompanyModalShell'
import ImageUploadPreview from './ImageUploadPreview'
import ModuleBuilder from './ModuleBuilder'

const wizardSteps = [
  'Información',
  'Evaluación',
  'Portada',
  'Relaciones',
  'Módulos',
  'Revisión',
]

function countWords(text = '') {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}

function buildInitialDraft(initialData = null) {
  if (initialData) {
    return {
      title: initialData.title || '',
      description: initialData.description || '',
      category: initialData.category || '',
      level: initialData.level || '',
      durationMinutes: initialData.durationMinutes || '',
      skillUnlocked: initialData.skillUnlocked || '',
      assessmentType: initialData.assessmentType || '',
      imagePreview: initialData.imageSrc || '',
      imageName: '',
      imageAlt: initialData.imageAlt || '',
      relatedMicrojobIds:
        initialData.relatedMicrojobIds ||
        initialData.relatedMicrojobs?.map((microjob) => microjob.id) ||
        [],
      modules: initialData.modules ? JSON.parse(JSON.stringify(initialData.modules)) : [],
    }
  }

  return {
    title: '',
    description: '',
    category: '',
    level: '',
    durationMinutes: '',
    skillUnlocked: '',
    assessmentType: '',
    imagePreview: '',
    imageName: '',
    imageAlt: '',
    relatedMicrojobIds: [],
    modules: [],
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function WizardSteps({ currentStep }) {
  return (
    <div className="flex flex-wrap gap-2">
      {wizardSteps.map((step, index) => (
        <span
          key={step}
          className={`inline-flex min-h-[36px] items-center rounded-full px-3 py-2 text-xs font-semibold ${
            index === currentStep
              ? 'bg-[var(--color-primary)] text-white'
              : index < currentStep
                ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
                : 'bg-[var(--color-primary-softer)] text-[var(--color-text-muted)]'
          }`}
        >
          {index + 1}. {step}
        </span>
      ))}
    </div>
  )
}

function CourseFormWizard({ isOpen, onClose, onSubmit, microjobs, initialData = null }) {
  const isEditing = Boolean(initialData)
  const [currentStep, setCurrentStep] = useState(0)
  const [draft, setDraft] = useState(buildInitialDraft(initialData))
  const [validationMessage, setValidationMessage] = useState('')

  function updateField(event) {
    const { name, value } = event.target
    setDraft((currentDraft) => ({
      ...currentDraft,
      [name]: value,
    }))
  }

  function toggleRelatedMicrojob(microjobId) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      relatedMicrojobIds: currentDraft.relatedMicrojobIds.includes(microjobId)
        ? currentDraft.relatedMicrojobIds.filter((item) => item !== microjobId)
        : [...currentDraft.relatedMicrojobIds, microjobId],
    }))
  }

  async function handleImageChange(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const preview = await readFileAsDataUrl(file)

    setDraft((currentDraft) => ({
      ...currentDraft,
      imagePreview: preview,
      imageName: file.name,
    }))
  }

  function validateStep(stepIndex) {
    if (stepIndex === 0) {
      if (
        !draft.title.trim() ||
        !draft.description.trim() ||
        !draft.category ||
        !draft.level ||
        !draft.durationMinutes ||
        !draft.skillUnlocked.trim()
      ) {
        return 'Completa la información principal del curso.'
      }

      if (countWords(draft.description) > 150) {
        return 'La descripción del curso debe tener como máximo 150 palabras.'
      }
    }

    if (stepIndex === 1 && !draft.assessmentType) {
      return 'Selecciona el tipo de evaluación.'
    }

    if (stepIndex === 2 && (!draft.imagePreview || !draft.imageAlt.trim())) {
      return 'Carga una portada mock y su texto alternativo.'
    }

    if (stepIndex === 4 && !draft.modules.length) {
      return 'Agrega al menos un módulo al curso.'
    }

    return ''
  }

  function handleNext() {
    const message = validateStep(currentStep)

    if (message) {
      setValidationMessage(message)
      return
    }

    setValidationMessage('')
    setCurrentStep((currentValue) => Math.min(currentValue + 1, wizardSteps.length - 1))
  }

  function handlePrevious() {
    setValidationMessage('')
    setCurrentStep((currentValue) => Math.max(currentValue - 1, 0))
  }

  async function handleSubmit(status) {
    for (let stepIndex = 0; stepIndex < wizardSteps.length - 1; stepIndex += 1) {
      const message = validateStep(stepIndex)

      if (message) {
        setCurrentStep(stepIndex)
        setValidationMessage(message)
        return
      }
    }

    setValidationMessage('')
    await onSubmit({
      ...draft,
      status,
    })
  }

  function renderStepContent() {
    if (currentStep === 0) {
      return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            id="title"
            label="Nombre del curso"
            value={draft.title}
            onChange={updateField}
            placeholder="Ejemplo: Atención al cliente básica"
            required
          />
          <FormField
            id="category"
            label="Categoría"
            as="select"
            value={draft.category}
            onChange={updateField}
            placeholder="Selecciona una opción"
            options={courseCategoryOptions}
            required
          />
          <div className="md:col-span-2">
            <FormField
              id="description"
              label="Descripción breve"
              value={draft.description}
              onChange={updateField}
              placeholder="Resume el curso en menos de 150 palabras"
              required
            />
          </div>
          <FormField
            id="level"
            label="Nivel"
            as="select"
            value={draft.level}
            onChange={updateField}
            placeholder="Selecciona una opción"
            options={courseLevelOptions}
            required
          />
          <FormField
            id="durationMinutes"
            label="Duración estimada"
            type="number"
            value={draft.durationMinutes}
            onChange={updateField}
            placeholder="Minutos estimados"
            required
          />
          <div className="md:col-span-2">
            <FormField
              id="skillUnlocked"
              label="Habilidad que desbloquea"
              value={draft.skillUnlocked}
              onChange={updateField}
              placeholder="Ejemplo: Recolección de datos"
              required
            />
          </div>
        </div>
      )
    }

    if (currentStep === 1) {
      return (
        <div className="space-y-4">
          <FormField
            id="assessmentType"
            label="Tipo de evaluación"
            as="select"
            value={draft.assessmentType}
            onChange={updateField}
            placeholder="Selecciona una opción"
            options={assessmentTypeOptions}
            required
          />
          {draft.assessmentType === 'H5P' ? (
            <div className="rounded-[1rem] border border-[var(--color-primary-border)] bg-[var(--color-primary-softer)] p-4">
              <p className="text-sm leading-6 text-[var(--color-text-muted)]">
                Las actividades H5P se conectarán en una fase posterior.
              </p>
            </div>
          ) : null}
        </div>
      )
    }

    if (currentStep === 2) {
      return (
        <div className="grid grid-cols-1 gap-4">
          <ImageUploadPreview
            id="courseCover"
            label="Imagen o portada del curso"
            helperText="Vista previa local solamente. No se sube a servidor."
            previewSrc={draft.imagePreview}
            fileName={draft.imageName}
            onFileChange={handleImageChange}
          />
          <FormField
            id="imageAlt"
            label="Texto alternativo de la imagen"
            value={draft.imageAlt}
            onChange={updateField}
            placeholder="Describe la portada para accesibilidad"
            required
          />
        </div>
      )
    }

    if (currentStep === 3) {
      return (
        <div className="space-y-4">
          <p className="text-sm leading-6 text-[var(--color-text-muted)]">
            Selecciona los microtrabajos que este curso ayudará a desbloquear más adelante.
          </p>
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
            {microjobs.map((microjob) => (
              <button
                key={microjob.id}
                type="button"
                onClick={() => toggleRelatedMicrojob(microjob.id)}
                className={`rounded-[1.15rem] border p-4 text-left transition focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)] ${
                  draft.relatedMicrojobIds.includes(microjob.id)
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)]'
                    : 'border-[var(--color-primary-border)] bg-white hover:border-[var(--color-primary)]'
                }`}
              >
                <p className="text-sm font-semibold text-[var(--color-primary-strong)]">
                  {microjob.title}
                </p>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  {microjob.microjobType} · {microjob.modality}
                </p>
              </button>
            ))}
          </div>
        </div>
      )
    }

    if (currentStep === 4) {
      return (
        <ModuleBuilder
          modules={draft.modules}
          onChange={(nextModules) =>
            setDraft((currentDraft) => ({
              ...currentDraft,
              modules: nextModules,
            }))
          }
        />
      )
    }

    return (
      <div className="space-y-4">
        <div className="rounded-[1.25rem] border border-[var(--color-primary-border)] bg-[var(--color-primary-softer)] p-4">
          <h3 className="text-lg font-bold tracking-[-0.03em] text-[var(--color-primary-strong)]">
            {draft.title}
          </h3>
          <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)]">
            {draft.description}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-[1rem] border border-[var(--color-primary-border)] bg-white p-3">
            <p className="text-sm font-semibold text-[var(--color-primary-strong)]">Categoría y nivel</p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              {draft.category} · {draft.level}
            </p>
          </div>
          <div className="rounded-[1rem] border border-[var(--color-primary-border)] bg-white p-3">
            <p className="text-sm font-semibold text-[var(--color-primary-strong)]">Evaluación</p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              {draft.assessmentType}
            </p>
          </div>
          <div className="rounded-[1rem] border border-[var(--color-primary-border)] bg-white p-3">
            <p className="text-sm font-semibold text-[var(--color-primary-strong)]">Duración</p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              {draft.durationMinutes} min
            </p>
          </div>
          <div className="rounded-[1rem] border border-[var(--color-primary-border)] bg-white p-3">
            <p className="text-sm font-semibold text-[var(--color-primary-strong)]">Módulos</p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              {draft.modules.length} módulos configurados
            </p>
          </div>
        </div>
      </div>
    )
  }

  const footer = (
    <div className="space-y-3">
      <div className="min-h-[24px]" aria-live="polite">
        {validationMessage ? (
          <p className="text-sm font-semibold text-[var(--color-danger)]">{validationMessage}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] border border-[var(--color-primary-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-muted)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            Cancelar
          </button>
          {currentStep > 0 ? (
            <button
              type="button"
              onClick={handlePrevious}
              className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] border border-[var(--color-primary-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary-strong)]"
            >
              Anterior
            </button>
          ) : null}
        </div>
        {currentStep === wizardSteps.length - 1 ? (
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => handleSubmit(isEditing ? initialData.status || 'Borrador' : 'Borrador')}
              className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] border border-[var(--color-primary-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary-strong)]"
            >
              {isEditing ? 'Guardar cambios' : 'Guardar borrador'}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('Publicado')}
              className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-strong)]"
            >
              {isEditing ? 'Actualizar curso' : 'Crear curso'}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-strong)]"
          >
            Siguiente
          </button>
        )}
      </div>
    </div>
  )

  return (
    <CompanyModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar curso' : 'Crear curso'}
      description={
        isEditing
          ? 'Actualiza la información del curso, su portada, relaciones y módulos.'
          : 'Configura un curso completo con evaluación, portada, relaciones y módulos.'
      }
      size="xl"
      footer={footer}
    >
      <div className="space-y-5">
        <WizardSteps currentStep={currentStep} />
        {renderStepContent()}
      </div>
    </CompanyModalShell>
  )
}

export default CourseFormWizard
