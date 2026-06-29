import { useState } from 'react'
import FormField from '../auth/FormField'
import SelectableChip from '../auth/SelectableChip'
import {
  microjobTypeOptions,
  modalityOptions,
  requirementOptions,
  scheduleOptions,
  workModeLabels,
} from '../../data/mockCompanyData'
import CompanyModalShell from './CompanyModalShell'
import ImageUploadPreview from './ImageUploadPreview'
import LocationPickerModal from './LocationPickerModal'
import MapPreview from './MapPreview'

const wizardSteps = [
  'Información',
  'Ubicación',
  'Requisitos',
  'Fechas y cupos',
  'Imagen',
  'Revisión',
]

function countWords(text = '') {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}

function buildInitialDraft(workMode, initialData = null) {
  if (initialData) {
    return {
      title: initialData.title || '',
      shortDescription: initialData.shortDescription || initialData.description || '',
      microjobType: initialData.microjobType || '',
      modality: initialData.modality || '',
      estimatedPay: initialData.estimatedPay || '',
      estimatedDuration: initialData.estimatedDuration || '',
      requiredSkill: initialData.requiredSkill || '',
      requiredCourseId: initialData.requiredCourseId || '',
      originMode: initialData.originMode || (workMode === 'both' ? '' : workMode),
      mapPointId: initialData.mapPointId || '',
      locationName: initialData.locationName || '',
      referenceName: initialData.referenceName || '',
      address: initialData.address || '',
      latitude: initialData.latitude ?? '',
      longitude: initialData.longitude ?? '',
      documents: initialData.documents ? [...initialData.documents] : [],
      supervisorName: initialData.supervisorName || '',
      scheduleWindows: initialData.scheduleWindows ? [...initialData.scheduleWindows] : [],
      availableDates: initialData.availableDates ? [...initialData.availableDates] : [],
      pendingDate: '',
      capacity: initialData.capacity ?? '',
      imagePreview: initialData.imageSrc || '',
      imageName: '',
      imageAlt: initialData.imageAlt || '',
    }
  }

  return {
    title: '',
    shortDescription: '',
    microjobType: '',
    modality: '',
    estimatedPay: '',
    estimatedDuration: '',
    requiredSkill: '',
    requiredCourseId: '',
    originMode: workMode === 'both' ? '' : workMode,
    mapPointId: '',
    locationName: '',
    referenceName: '',
    address: '',
    latitude: '',
    longitude: '',
    documents: [],
    supervisorName: '',
    scheduleWindows: [],
    availableDates: [],
    pendingDate: '',
    capacity: '',
    imagePreview: '',
    imageName: '',
    imageAlt: '',
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

function SelectField({ id, label, value, onChange, placeholder, options, required = false }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-[var(--color-text)]">
        {label}
        {required ? <span className="ml-1 text-[var(--color-primary)]">*</span> : null}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="w-full rounded-[1.1rem] border border-[var(--color-primary-border)] bg-white px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary-soft)]"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function MicrojobFormWizard({
  isOpen,
  onClose,
  onSubmit,
  workMode,
  availableCourses,
  initialData = null,
}) {
  const isEditing = Boolean(initialData)
  const [currentStep, setCurrentStep] = useState(0)
  const [draft, setDraft] = useState(buildInitialDraft(workMode, initialData))
  const [validationMessage, setValidationMessage] = useState('')
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false)

  function updateField(event) {
    const { name, value } = event.target
    setDraft((currentDraft) => ({
      ...currentDraft,
      [name]: value,
    }))
  }

  function toggleRequirement(value) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      documents: currentDraft.documents.includes(value)
        ? currentDraft.documents.filter((item) => item !== value)
        : [...currentDraft.documents, value],
    }))
  }

  function toggleScheduleWindow(value) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      scheduleWindows: currentDraft.scheduleWindows.includes(value)
        ? currentDraft.scheduleWindows.filter((item) => item !== value)
        : [...currentDraft.scheduleWindows, value],
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

  function handleSelectPoint(point) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      mapPointId: point.id,
      locationName: point.name,
      address: point.address,
      latitude: point.latitude,
      longitude: point.longitude,
    }))
    setIsLocationPickerOpen(false)
  }

  function addDate() {
    if (!draft.pendingDate || draft.availableDates.includes(draft.pendingDate)) {
      return
    }

    setDraft((currentDraft) => ({
      ...currentDraft,
      availableDates: [...currentDraft.availableDates, currentDraft.pendingDate].sort(),
      pendingDate: '',
    }))
  }

  function removeDate(date) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      availableDates: currentDraft.availableDates.filter((item) => item !== date),
    }))
  }

  function validateStep(stepIndex) {
    if (stepIndex === 0) {
      if (
        !draft.title.trim() ||
        !draft.shortDescription.trim() ||
        !draft.microjobType ||
        !draft.modality ||
        !draft.estimatedPay.trim() ||
        !draft.estimatedDuration.trim() ||
        !draft.requiredSkill.trim()
      ) {
        return 'Completa la información principal del microtrabajo.'
      }

      if (workMode === 'both' && !draft.originMode) {
        return 'Selecciona la modalidad de origen para este microtrabajo.'
      }

      if (countWords(draft.shortDescription) > 150) {
        return 'La descripción del microtrabajo debe tener como máximo 150 palabras.'
      }
    }

    if (stepIndex === 1) {
      const needsLocation = draft.modality !== 'Remota'

      if (
        !draft.referenceName.trim() ||
        (needsLocation &&
          (!draft.locationName.trim() ||
            !draft.address.trim() ||
            draft.latitude === '' ||
            draft.longitude === ''))
      ) {
        return 'Completa la ubicación y selecciona un punto en el mapa mock.'
      }
    }

    if (stepIndex === 2) {
      if (!draft.supervisorName.trim() || !draft.documents.length) {
        return 'Agrega supervisor y al menos un requisito.'
      }
    }

    if (stepIndex === 3) {
      if (!draft.scheduleWindows.length || !draft.availableDates.length || !draft.capacity) {
        return 'Completa horario, fechas disponibles y cupos.'
      }
    }

    if (stepIndex === 4) {
      if (!draft.imagePreview || !draft.imageAlt.trim()) {
        return 'Carga una imagen mock y completa el texto alternativo.'
      }
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
          {workMode === 'both' ? (
            <SelectField
              id="originMode"
              label="Modalidad de origen"
              value={draft.originMode}
              onChange={updateField}
              placeholder="Selecciona una opción"
              options={[
                { value: 'local_economy', label: workModeLabels.local_economy },
                { value: 'enterprise_front', label: workModeLabels.enterprise_front },
              ]}
              required
            />
          ) : null}
          <FormField
            id="title"
            label="Título del microtrabajo"
            value={draft.title}
            onChange={updateField}
            placeholder="Ejemplo: Apoyo en feria local"
            required
          />
          <div className="md:col-span-2">
            <FormField
              id="shortDescription"
              label="Descripción breve"
              value={draft.shortDescription}
              onChange={updateField}
              placeholder="Resume la oportunidad en menos de 150 palabras"
              required
            />
          </div>
          <FormField
            id="microjobType"
            label="Tipo de microtrabajo"
            as="select"
            value={draft.microjobType}
            onChange={updateField}
            placeholder="Selecciona una opción"
            options={microjobTypeOptions}
            required
          />
          <FormField
            id="modality"
            label="Modalidad"
            as="select"
            value={draft.modality}
            onChange={updateField}
            placeholder="Selecciona una opción"
            options={modalityOptions}
            required
          />
          <FormField
            id="estimatedPay"
            label="Pago estimado"
            value={draft.estimatedPay}
            onChange={updateField}
            placeholder="Ejemplo: $18"
            required
          />
          <FormField
            id="estimatedDuration"
            label="Duración estimada"
            value={draft.estimatedDuration}
            onChange={updateField}
            placeholder="Ejemplo: 4 horas"
            required
          />
          <FormField
            id="requiredSkill"
            label="Habilidad requerida"
            value={draft.requiredSkill}
            onChange={updateField}
            placeholder="Ejemplo: Atención al cliente"
            required
          />
          <SelectField
            id="requiredCourseId"
            label="Curso requerido si aplica"
            value={draft.requiredCourseId}
            onChange={updateField}
            placeholder="Selecciona una opción"
            options={availableCourses.map((course) => ({
              value: course.id,
              label: course.title,
            }))}
          />
        </div>
      )
    }

    if (currentStep === 1) {
      return (
        <div className="space-y-4">
          <MapPreview
            locationName={draft.locationName}
            address={draft.address}
            latitude={draft.latitude}
            longitude={draft.longitude}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <button
                type="button"
                onClick={() => setIsLocationPickerOpen(true)}
                className="inline-flex min-h-[44px] items-center justify-center rounded-[0.95rem] border border-[var(--color-primary-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
              >
                Elegir punto en mapa
              </button>
            </div>
            <FormField
              id="referenceName"
              label="Nombre de ubicación o referencia corta"
              value={draft.referenceName}
              onChange={updateField}
              placeholder="Ejemplo: Stand principal o hall de ingreso"
              required
            />
            <FormField
              id="locationName"
              label="Ubicación en mapa"
              value={draft.locationName}
              onChange={updateField}
              placeholder="Ubicación seleccionada"
              required
            />
            <FormField
              id="address"
              label="Dirección"
              value={draft.address}
              onChange={updateField}
              placeholder="Dirección generada desde el punto mock"
              required
            />
            <FormField
              id="latitude"
              label="Latitud"
              value={draft.latitude}
              onChange={updateField}
              placeholder="Latitud"
              required
            />
            <FormField
              id="longitude"
              label="Longitud"
              value={draft.longitude}
              onChange={updateField}
              placeholder="Longitud"
              required
            />
          </div>
        </div>
      )
    }

    if (currentStep === 2) {
      return (
        <div className="space-y-4">
          <FormField
            id="supervisorName"
            label="Supervisor o responsable"
            value={draft.supervisorName}
            onChange={updateField}
            placeholder="Nombre del responsable en campo o remoto"
            required
          />
          <div className="space-y-3">
            <p className="text-sm font-semibold text-[var(--color-text)]">
              Documentos o requisitos
            </p>
            <div className="flex flex-wrap gap-3">
              {requirementOptions.map((option) => (
                <SelectableChip
                  key={option}
                  label={option}
                  selected={draft.documents.includes(option)}
                  onClick={() => toggleRequirement(option)}
                />
              ))}
            </div>
          </div>
        </div>
      )
    }

    if (currentStep === 3) {
      return (
        <div className="space-y-4">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-[var(--color-text)]">
              Horario o franja disponible
            </p>
            <div className="flex flex-wrap gap-3">
              {scheduleOptions.map((option) => (
                <SelectableChip
                  key={option}
                  label={option}
                  selected={draft.scheduleWindows.includes(option)}
                  onClick={() => toggleScheduleWindow(option)}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
            <FormField
              id="pendingDate"
              label="Fechas disponibles"
              type="date"
              value={draft.pendingDate}
              onChange={updateField}
              required
            />
            <button
              type="button"
              onClick={addDate}
              className="mt-[1.9rem] inline-flex min-h-[48px] items-center justify-center rounded-[0.95rem] border border-[var(--color-primary-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary-strong)]"
            >
              Agregar fecha
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {draft.availableDates.map((date) => (
              <button
                key={date}
                type="button"
                onClick={() => removeDate(date)}
                className="inline-flex min-h-[38px] items-center rounded-full border border-[var(--color-primary-border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--color-primary-strong)]"
              >
                {date} ×
              </button>
            ))}
          </div>

          <FormField
            id="capacity"
            label="Cupos disponibles"
            type="number"
            value={draft.capacity}
            onChange={updateField}
            placeholder="Ejemplo: 6"
            required
          />
        </div>
      )
    }

    if (currentStep === 4) {
      return (
        <div className="grid grid-cols-1 gap-4">
          <ImageUploadPreview
            id="microjobCover"
            label="Imagen o portada del microtrabajo"
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
            placeholder="Describe la imagen para accesibilidad"
            required
          />
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="rounded-[1.25rem] border border-[var(--color-primary-border)] bg-[var(--color-primary-softer)] p-4">
          <h3 className="text-lg font-bold tracking-[-0.03em] text-[var(--color-primary-strong)]">
            {draft.title}
          </h3>
          <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)]">
            {draft.shortDescription}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-[1rem] border border-[var(--color-primary-border)] bg-white p-3">
            <p className="text-sm font-semibold text-[var(--color-primary-strong)]">Tipo y modalidad</p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              {draft.microjobType} · {draft.modality}
            </p>
          </div>
          <div className="rounded-[1rem] border border-[var(--color-primary-border)] bg-white p-3">
            <p className="text-sm font-semibold text-[var(--color-primary-strong)]">Ubicación</p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              {draft.locationName} · {draft.referenceName}
            </p>
          </div>
          <div className="rounded-[1rem] border border-[var(--color-primary-border)] bg-white p-3">
            <p className="text-sm font-semibold text-[var(--color-primary-strong)]">Pago y duración</p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              {draft.estimatedPay} · {draft.estimatedDuration}
            </p>
          </div>
          <div className="rounded-[1rem] border border-[var(--color-primary-border)] bg-white p-3">
            <p className="text-sm font-semibold text-[var(--color-primary-strong)]">Fechas y cupos</p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              {draft.availableDates.join(', ')} · {draft.capacity} cupos
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
              onClick={() => handleSubmit('Activo')}
              className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-strong)]"
            >
              {isEditing ? 'Actualizar microtrabajo' : 'Publicar microtrabajo'}
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
    <>
      <CompanyModalShell
        isOpen={isOpen}
        onClose={onClose}
        title={isEditing ? 'Editar microtrabajo' : 'Publicar microtrabajo'}
        description={
          isEditing
            ? 'Actualiza la oportunidad, su ubicación mock, requisitos e imagen.'
            : 'Usa un flujo guiado para crear una oportunidad clara y ordenada.'
        }
        size="xl"
        footer={footer}
      >
        <div className="space-y-5">
          <WizardSteps currentStep={currentStep} />
          {renderStepContent()}
        </div>
      </CompanyModalShell>

      <LocationPickerModal
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        selectedPointId={draft.mapPointId}
        onSelectPoint={handleSelectPoint}
      />
    </>
  )
}

export default MicrojobFormWizard
