import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthProviderButton from '../../components/auth/AuthProviderButton'
import AuthSeparator from '../../components/auth/AuthSeparator'
import FormField from '../../components/auth/FormField'
import RegisterShell from '../../components/auth/RegisterShell'
import SelectableChip from '../../components/auth/SelectableChip'
import { login, registerWorker } from '../../services/authRepository'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const workerSteps = [
  'Datos personales',
  'Educación',
  'Trabajo',
  'Finanzas',
  'Preferencias',
]

const googleMockProfile = {
  fullName: 'Usuario Nexo',
  email: 'usuario@nexojobs.com',
  avatarUrl: '',
  authProvider: 'google_mock',
}

const educationLevelOptions = [
  'Básica',
  'Bachillerato',
  'Técnico',
  'Universidad',
  'Cursos cortos',
  'Sin estudios formales',
]

const studyAreaOptions = [
  'Administración',
  'Tecnología',
  'Servicios',
  'Alimentos',
  'Electricidad',
  'Ventas',
  'Otro',
]

const currentlyStudyingOptions = ['Sí', 'No']

const previousExperienceOptions = [
  'Sin experiencia',
  'Menos de 1 año',
  '1 a 2 años',
  'Más de 2 años',
]

const experienceAreaOptions = [
  'Atención al cliente',
  'Manejo de alimentos',
  'Reparaciones',
  'Encuestas',
  'Datos',
  'Ventas',
  'Limpieza',
  'Eventos',
]

const availabilityOptions = [
  'Mañana',
  'Tarde',
  'Noche',
  'Fines de semana',
  'Flexible',
]

const preferredModeOptions = [
  'Cerca de mi zona',
  'Remota',
  'Por horas',
  'Por tarea',
]

const paymentMethodOptions = [
  'Cuenta bancaria',
  'Billetera móvil',
  'Pago en efectivo',
  'Por definir',
]

const accountTypeOptions = ['Ahorros', 'Corriente', 'No aplica']

const interestOptions = [
  'Atención al cliente',
  'Alimentos',
  'Reparaciones',
  'Encuestas',
  'Datos',
  'Ventas',
  'Eventos',
]

const opportunityTypeOptions = [
  'Aprender primero',
  'Trabajar pronto',
  'Cerca de mi zona',
  'Remoto',
  'Flexible',
]

const initialWorkerForm = {
  fullName: '',
  email: '',
  phone: '',
  identification: '',
  birthDate: '',
  city: '',
  zone: '',
  password: '',
  confirmPassword: '',
  educationLevel: '',
  institution: '',
  currentlyStudying: '',
  previousExperience: '',
  paymentMethod: '',
  financialEntity: '',
  accountReference: '',
  accountType: '',
  studyAreas: [],
  experienceAreas: [],
  availability: [],
  preferredModes: [],
  interests: [],
  opportunityTypes: [],
}

function RegisterWorker() {
  const navigate = useNavigate()
  const [authMethod, setAuthMethod] = useState('manual')
  const [currentStep, setCurrentStep] = useState(0)
  const [workerForm, setWorkerForm] = useState(initialWorkerForm)
  const [formMessage, setFormMessage] = useState('')

  const isGoogleMock = authMethod === 'google_mock'
  const isLastStep = currentStep === workerSteps.length - 1

  const updateField = (event) => {
    const { name, value } = event.target

    setWorkerForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  const toggleSelection = (field, value) => {
    setWorkerForm((currentForm) => ({
      ...currentForm,
      [field]: currentForm[field].includes(value)
        ? currentForm[field].filter((currentValue) => currentValue !== value)
        : [...currentForm[field], value],
    }))
  }

  const validateStep = (stepIndex) => {
    const hasEmptyField = (fields) => fields.some((field) => !workerForm[field].trim())
    const hasNoSelection = (field) => !workerForm[field].length

    if (stepIndex === 0) {
      const requiredFields = [
        'fullName',
        'email',
        'identification',
        'phone',
        'city',
        'zone',
        'birthDate',
      ]

      if (!isGoogleMock) {
        requiredFields.push('password', 'confirmPassword')
      }

      if (hasEmptyField(requiredFields)) {
        return 'Completa los datos requeridos.'
      }

      if (!EMAIL_PATTERN.test(workerForm.email.trim())) {
        return 'Ingresa un correo electrónico válido.'
      }

      if (!isGoogleMock && workerForm.password.length < 6) {
        return 'La contraseña debe tener al menos 6 caracteres.'
      }

      if (!isGoogleMock && workerForm.password !== workerForm.confirmPassword) {
        return 'Las contraseñas no coinciden.'
      }
    }

    if (stepIndex === 1) {
      if (
        hasEmptyField(['educationLevel', 'institution', 'currentlyStudying']) ||
        hasNoSelection('studyAreas')
      ) {
        return hasNoSelection('studyAreas')
          ? 'Selecciona al menos una opción.'
          : 'Completa los datos requeridos.'
      }
    }

    if (stepIndex === 2) {
      if (
        hasEmptyField(['previousExperience']) ||
        hasNoSelection('experienceAreas') ||
        hasNoSelection('availability') ||
        hasNoSelection('preferredModes')
      ) {
        return hasNoSelection('experienceAreas') ||
          hasNoSelection('availability') ||
          hasNoSelection('preferredModes')
          ? 'Selecciona al menos una opción.'
          : 'Completa los datos requeridos.'
      }
    }

    if (stepIndex === 3) {
      if (
        hasEmptyField(['paymentMethod', 'financialEntity', 'accountReference', 'accountType'])
      ) {
        return 'Completa los datos requeridos.'
      }
    }

    if (stepIndex === 4) {
      if (hasNoSelection('interests') || hasNoSelection('opportunityTypes')) {
        return 'Selecciona al menos una opción.'
      }
    }

    return ''
  }

  const isStepComplete = (stepIndex) => !validateStep(stepIndex)

  const getFurthestAccessibleStep = () => {
    const firstIncompleteStep = workerSteps.findIndex((_, stepIndex) => !isStepComplete(stepIndex))
    return firstIncompleteStep === -1 ? workerSteps.length - 1 : firstIncompleteStep
  }

  const handleStepChange = (stepIndex) => {
    const furthestAccessibleStep = getFurthestAccessibleStep()

    if (stepIndex > furthestAccessibleStep) {
      setCurrentStep(furthestAccessibleStep)
      setFormMessage(validateStep(furthestAccessibleStep))
      return
    }

    setCurrentStep(stepIndex)
    setFormMessage('')
  }

  const handlePreviousStep = () => {
    setCurrentStep((currentValue) => Math.max(currentValue - 1, 0))
    setFormMessage('')
  }

  const handleNextStep = () => {
    const validationMessage = validateStep(currentStep)

    if (validationMessage) {
      setFormMessage(validationMessage)
      return
    }

    setCurrentStep((currentValue) => Math.min(currentValue + 1, workerSteps.length - 1))
    setFormMessage('')
  }

  const handleGoogleRegistration = () => {
    setAuthMethod('google_mock')
    setWorkerForm((currentForm) => ({
      ...currentForm,
      fullName: googleMockProfile.fullName,
      email: googleMockProfile.email,
      password: '',
      confirmPassword: '',
    }))
    setCurrentStep(0)
    setFormMessage('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    for (let stepIndex = 0; stepIndex < workerSteps.length; stepIndex += 1) {
      const validationMessage = validateStep(stepIndex)

      if (validationMessage) {
        setCurrentStep(stepIndex)
        setFormMessage(validationMessage)
        return
      }
    }

    const registrationPayload = {
      role: 'worker',
      authProvider: authMethod,
      password: isGoogleMock ? null : workerForm.password,
      personalData: {
        fullName: workerForm.fullName.trim(),
        email: workerForm.email.trim(),
        phone: workerForm.phone.trim(),
        identification: workerForm.identification.trim(),
        birthDate: workerForm.birthDate,
        city: workerForm.city.trim(),
        zone: workerForm.zone.trim(),
      },
      education: {
        educationLevel: workerForm.educationLevel,
        studyAreas: workerForm.studyAreas,
        institution: workerForm.institution.trim(),
        currentlyStudying: workerForm.currentlyStudying,
      },
      work: {
        previousExperience: workerForm.previousExperience,
        experienceAreas: workerForm.experienceAreas,
        availability: workerForm.availability,
        preferredModes: workerForm.preferredModes,
      },
      finance: {
        paymentMethod: workerForm.paymentMethod,
        financialEntity: workerForm.financialEntity.trim(),
        accountType: workerForm.accountType,
      },
      preferences: {
        interests: workerForm.interests,
        opportunityTypes: workerForm.opportunityTypes,
      },
      createdAt: new Date().toISOString(),
      isMockRegistration: true,
    }

    const result = registerWorker(registrationPayload)

    if (!result.success) {
      setCurrentStep(0)
      setFormMessage(result.message)
      return
    }

    // Persist the raw registration payload too (useful for debugging / legacy reads).
    window.localStorage.setItem(
      'nexojobs_mock_worker_registration',
      JSON.stringify(registrationPayload)
    )

    setFormMessage('')
    login(registrationPayload.personalData.email, registrationPayload.password, { allowGoogleMock: isGoogleMock })
    navigate('/app/worker')
  }

  const renderStepContent = () => {
    if (currentStep === 0) {
      return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            id="fullName"
            label="Nombre completo"
            value={workerForm.fullName}
            onChange={updateField}
            placeholder="Escribe tu nombre y apellido"
            autoComplete="name"
            required
          />
          <FormField
            id="email"
            label="Correo electrónico"
            type="email"
            value={workerForm.email}
            onChange={updateField}
            placeholder="tu@correo.com"
            autoComplete="email"
            required
          />
          <FormField
            id="identification"
            label="Cédula o identificación"
            value={workerForm.identification}
            onChange={updateField}
            placeholder="Número de identificación"
            autoComplete="off"
            required
          />
          <FormField
            id="phone"
            label="Teléfono"
            type="tel"
            value={workerForm.phone}
            onChange={updateField}
            placeholder="Número de contacto"
            autoComplete="tel"
            inputMode="tel"
            required
          />
          <FormField
            id="city"
            label="Ciudad"
            value={workerForm.city}
            onChange={updateField}
            placeholder="Ejemplo: Quito"
            autoComplete="address-level2"
            required
          />
          <FormField
            id="zone"
            label="Sector o zona"
            value={workerForm.zone}
            onChange={updateField}
            placeholder="Tu barrio o sector"
            autoComplete="off"
            required
          />
          <FormField
            id="birthDate"
            label="Fecha de nacimiento"
            type="date"
            value={workerForm.birthDate}
            onChange={updateField}
            autoComplete="bday"
            required
          />
          {!isGoogleMock ? (
            <>
              <FormField
                id="password"
                label="Contraseña"
                type="password"
                value={workerForm.password}
                onChange={updateField}
                placeholder="Crea una contraseña"
                autoComplete="new-password"
                required
              />
              <FormField
                id="confirmPassword"
                label="Confirmar contraseña"
                type="password"
                value={workerForm.confirmPassword}
                onChange={updateField}
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
                required
              />
            </>
          ) : null}
        </div>
      )
    }

    if (currentStep === 1) {
      return (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              id="educationLevel"
              label="Nivel educativo"
              as="select"
              value={workerForm.educationLevel}
              onChange={updateField}
              placeholder="Selecciona una opción"
              options={educationLevelOptions}
              required
            />
            <FormField
              id="institution"
              label="Institución"
              value={workerForm.institution}
              onChange={updateField}
              placeholder="Nombre de la institución"
              autoComplete="organization"
              required
            />
            <div className="md:col-span-2">
              <FormField
                id="currentlyStudying"
                label="Actualmente estudias"
                as="select"
                value={workerForm.currentlyStudying}
                onChange={updateField}
                placeholder="Selecciona una opción"
                options={currentlyStudyingOptions}
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-[var(--color-text)]">
              Área de formación
            </p>
            <div className="flex flex-wrap gap-3">
              {studyAreaOptions.map((option) => (
                <SelectableChip
                  key={option}
                  label={option}
                  selected={workerForm.studyAreas.includes(option)}
                  onClick={() => toggleSelection('studyAreas', option)}
                />
              ))}
            </div>
          </div>
        </div>
      )
    }

    if (currentStep === 2) {
      return (
        <div className="space-y-5">
          <FormField
            id="previousExperience"
            label="Experiencia previa"
            as="select"
            value={workerForm.previousExperience}
            onChange={updateField}
            placeholder="Selecciona una opción"
            options={previousExperienceOptions}
            required
          />

          <div className="space-y-3">
            <p className="text-sm font-semibold text-[var(--color-text)]">
              Área de experiencia
            </p>
            <div className="flex flex-wrap gap-3">
              {experienceAreaOptions.map((option) => (
                <SelectableChip
                  key={option}
                  label={option}
                  selected={workerForm.experienceAreas.includes(option)}
                  onClick={() => toggleSelection('experienceAreas', option)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-[var(--color-text)]">
              Disponibilidad
            </p>
            <div className="flex flex-wrap gap-3">
              {availabilityOptions.map((option) => (
                <SelectableChip
                  key={option}
                  label={option}
                  selected={workerForm.availability.includes(option)}
                  onClick={() => toggleSelection('availability', option)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-[var(--color-text)]">
              Modalidad preferida
            </p>
            <div className="flex flex-wrap gap-3">
              {preferredModeOptions.map((option) => (
                <SelectableChip
                  key={option}
                  label={option}
                  selected={workerForm.preferredModes.includes(option)}
                  onClick={() => toggleSelection('preferredModes', option)}
                />
              ))}
            </div>
          </div>
        </div>
      )
    }

    if (currentStep === 3) {
      return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            id="paymentMethod"
            label="Método de pago preferido"
            as="select"
            value={workerForm.paymentMethod}
            onChange={updateField}
            placeholder="Selecciona una opción"
            options={paymentMethodOptions}
            required
          />
          <FormField
            id="accountType"
            label="Tipo de cuenta"
            as="select"
            value={workerForm.accountType}
            onChange={updateField}
            placeholder="Selecciona una opción"
            options={accountTypeOptions}
            required
            helperText="Esta información se usará más adelante para configurar pagos."
          />
          <FormField
            id="financialEntity"
            label="Entidad financiera o billetera"
            value={workerForm.financialEntity}
            onChange={updateField}
            placeholder="Nombre de la entidad o billetera"
            autoComplete="off"
            required
          />
          <FormField
            id="accountReference"
            label="Número de cuenta o referencia"
            value={workerForm.accountReference}
            onChange={updateField}
            placeholder="Ingresa una referencia"
            autoComplete="off"
            inputMode="numeric"
            required
          />
        </div>
      )
    }

    return (
      <div className="space-y-5">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-[var(--color-text)]">
            Intereses
          </p>
          <div className="flex flex-wrap gap-3">
            {interestOptions.map((option) => (
              <SelectableChip
                key={option}
                label={option}
                selected={workerForm.interests.includes(option)}
                onClick={() => toggleSelection('interests', option)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-[var(--color-text)]">
            Tipo de oportunidades
          </p>
          <div className="flex flex-wrap gap-3">
            {opportunityTypeOptions.map((option) => (
              <SelectableChip
                key={option}
                label={option}
                selected={workerForm.opportunityTypes.includes(option)}
                onClick={() => toggleSelection('opportunityTypes', option)}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <RegisterShell
      title="Registro de trabajador"
      subtitle="Completa tus datos para crear tu perfil."
      steps={workerSteps}
      currentStep={currentStep}
      onStepChange={handleStepChange}
      isStepComplete={isStepComplete}
      canAccessStep={(stepIndex) => stepIndex <= getFurthestAccessibleStep()}
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <section className="rounded-[1.5rem] border border-[var(--color-primary-border)] bg-white p-4 shadow-sm md:p-5">
          {isGoogleMock ? (
            <div className="space-y-2">
              <span className="inline-flex rounded-full border border-[var(--color-primary-border)] bg-[var(--color-primary-soft)] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-primary-strong)]">
                Google conectado
              </span>
              <p className="text-sm leading-6 text-[var(--color-text-muted)]">
                Completa los datos restantes para finalizar tu registro.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <AuthProviderButton onClick={handleGoogleRegistration}>
                Registrarme con Google
              </AuthProviderButton>
              <AuthSeparator label="o completa tus datos" />
            </div>
          )}
        </section>

        <section className="rounded-[1.75rem] border border-[var(--color-primary-border)] bg-[var(--color-primary-softer)] p-4 md:p-5">
          <h2 className="text-xl font-bold tracking-[-0.03em] text-[var(--color-text)]">
            {workerSteps[currentStep]}
          </h2>
          <div className="mt-4">{renderStepContent()}</div>
        </section>

        <div className="min-h-[48px]" aria-live="polite">
          {formMessage ? (
            <p className="rounded-[1rem] border border-[var(--color-danger-border)] bg-[var(--color-danger-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-danger)]">
              {formMessage}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 border-t border-[var(--color-primary-border)] pt-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-full border border-[var(--color-primary-border)] px-4 py-3 text-sm font-semibold text-[var(--color-text-muted)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              Cambiar tipo de cuenta
            </Link>
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={handlePreviousStep}
                className="inline-flex items-center justify-center rounded-full border border-[var(--color-primary-border)] px-4 py-3 text-sm font-semibold text-[var(--color-text)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
              >
                Anterior
              </button>
            ) : null}
          </div>

          {isLastStep ? (
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(24,95,165,0.24)] transition hover:bg-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
            >
              Finalizar registro
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(24,95,165,0.24)] transition hover:bg-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
            >
              Siguiente
            </button>
          )}
        </div>

        <p className="text-center text-sm text-[var(--color-text-muted)]">
          ¿Ya tienes cuenta?{' '}
          <Link
            to="/login"
            className="font-semibold text-[var(--color-primary)] transition hover:text-[var(--color-primary-strong)]"
          >
            Iniciar sesión
          </Link>
        </p>
      </form>
    </RegisterShell>
  )
}

export default RegisterWorker
