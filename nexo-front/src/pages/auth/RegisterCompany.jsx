import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthProviderButton from '../../components/auth/AuthProviderButton'
import AuthSeparator from '../../components/auth/AuthSeparator'
import FormField from '../../components/auth/FormField'
import RegisterShell from '../../components/auth/RegisterShell'
import SelectableChip from '../../components/auth/SelectableChip'
import { login, registerCompany } from '../../services/authRepository'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const companySteps = [
  'Empresa',
  'Responsable',
  'Operación',
  'Facturación',
  'Preferencias',
]

const googleMockProfile = {
  fullName: 'Usuario Nexo',
  email: 'usuario@nexojobs.com',
  avatarUrl: '',
  authProvider: 'google_mock',
}

const businessModelOptions = [
  'Economía local',
  'Frente empresarial',
  'Ambas modalidades',
]

const responsibleRoleOptions = [
  'Propietario',
  'Gerente',
  'Recursos humanos',
  'Operaciones',
  'Administración',
  'Otro',
]

const taskTypeOptions = [
  'Encuestas',
  'Etiquetado de datos',
  'Validación de información',
  'Eventos',
  'Promociones',
  'Tareas operativas',
  'Pruebas de producto',
]

const operationScaleOptions = [
  'Piloto',
  'Por ciudad',
  'Varias ciudades',
  'Nacional',
  'Flexible',
]

const operationModalityOptions = [
  'Presencial',
  'Remota',
  'Híbrida',
  'Por tarea',
  'Por campaña',
]

const billingPaymentMethodOptions = [
  'Transferencia',
  'Tarjeta',
  'Contrato empresarial',
  'Por definir',
]

const primaryObjectiveOptions = [
  'Contratar por tarea',
  'Validar información',
  'Realizar encuestas',
  'Apoyo operativo',
  'Campañas locales',
]

const estimatedFrequencyOptions = [
  'Una vez',
  'Semanal',
  'Mensual',
  'Por campaña',
  'Por definir',
]

const initialCompanyForm = {
  companyName: '',
  companyId: '',
  businessModel: '',
  city: '',
  address: '',
  corporateEmail: '',
  password: '',
  confirmPassword: '',
  contactName: '',
  responsibleRole: '',
  contactPhone: '',
  contactEmail: '',
  billingName: '',
  billingId: '',
  billingEmail: '',
  billingAddress: '',
  billingPaymentMethod: '',
  taskTypes: [],
  operationScale: [],
  operationModalities: [],
  primaryObjectives: [],
  estimatedFrequencies: [],
}

function RegisterCompany() {
  const navigate = useNavigate()
  const [authMethod, setAuthMethod] = useState('manual')
  const [currentStep, setCurrentStep] = useState(0)
  const [companyForm, setCompanyForm] = useState(initialCompanyForm)
  const [formMessage, setFormMessage] = useState('')

  const isGoogleMock = authMethod === 'google_mock'
  const isLastStep = currentStep === companySteps.length - 1
  const usesLocalNaturalPersonCopy = companyForm.businessModel === 'Economía local'
  const companyNameLabel = usesLocalNaturalPersonCopy
    ? 'Nombre completo o nombre comercial'
    : 'Nombre de la empresa o razón social'
  const companyNamePlaceholder = usesLocalNaturalPersonCopy
    ? 'Nombre de la persona o negocio local'
    : 'Nombre legal o comercial de la organización'
  const companyIdLabel = usesLocalNaturalPersonCopy
    ? 'Cédula, RUC o identificación'
    : 'RUC o identificación'
  const billingNameLabel = usesLocalNaturalPersonCopy
    ? 'Nombre completo o razón social para facturación'
    : 'Razón social para facturación'

  const updateField = (event) => {
    const { name, value } = event.target

    setCompanyForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  const toggleSelection = (field, value) => {
    setCompanyForm((currentForm) => ({
      ...currentForm,
      [field]: currentForm[field].includes(value)
        ? currentForm[field].filter((currentValue) => currentValue !== value)
        : [...currentForm[field], value],
    }))
  }

  const validateStep = (stepIndex) => {
    const hasEmptyField = (fields) => fields.some((field) => !companyForm[field].trim())
    const hasNoSelection = (field) => !companyForm[field].length

    if (stepIndex === 0) {
      const requiredFields = [
        'businessModel',
        'companyName',
        'companyId',
        'corporateEmail',
        'city',
        'address',
      ]

      if (!isGoogleMock) {
        requiredFields.push('password', 'confirmPassword')
      }

      if (hasEmptyField(requiredFields)) {
        return 'Completa los datos requeridos.'
      }

      if (!EMAIL_PATTERN.test(companyForm.corporateEmail.trim())) {
        return 'Ingresa un correo electrónico válido.'
      }

      if (!isGoogleMock && companyForm.password.length < 6) {
        return 'La contraseña debe tener al menos 6 caracteres.'
      }

      if (!isGoogleMock && companyForm.password !== companyForm.confirmPassword) {
        return 'Las contraseñas no coinciden.'
      }
    }

    if (stepIndex === 1) {
      if (
        hasEmptyField(['contactName', 'responsibleRole', 'contactPhone', 'contactEmail'])
      ) {
        return 'Completa los datos requeridos.'
      }

      if (!EMAIL_PATTERN.test(companyForm.contactEmail.trim())) {
        return 'Ingresa un correo de contacto válido.'
      }
    }

    if (stepIndex === 2) {
      if (
        hasNoSelection('taskTypes') ||
        hasNoSelection('operationScale') ||
        hasNoSelection('operationModalities')
      ) {
        return 'Selecciona al menos una opción.'
      }
    }

    if (stepIndex === 3) {
      if (
        hasEmptyField([
          'billingName',
          'billingId',
          'billingEmail',
          'billingAddress',
          'billingPaymentMethod',
        ])
      ) {
        return 'Completa los datos requeridos.'
      }

      if (!EMAIL_PATTERN.test(companyForm.billingEmail.trim())) {
        return 'Ingresa un correo de facturación válido.'
      }
    }

    if (stepIndex === 4) {
      if (hasNoSelection('primaryObjectives') || hasNoSelection('estimatedFrequencies')) {
        return 'Selecciona al menos una opción.'
      }
    }

    return ''
  }

  const isStepComplete = (stepIndex) => !validateStep(stepIndex)

  const getFurthestAccessibleStep = () => {
    const firstIncompleteStep = companySteps.findIndex((_, stepIndex) => !isStepComplete(stepIndex))
    return firstIncompleteStep === -1 ? companySteps.length - 1 : firstIncompleteStep
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

    setCurrentStep((currentValue) => Math.min(currentValue + 1, companySteps.length - 1))
    setFormMessage('')
  }

  const handleGoogleRegistration = () => {
    setAuthMethod('google_mock')
    setCompanyForm((currentForm) => ({
      ...currentForm,
      contactName: googleMockProfile.fullName,
      contactEmail: googleMockProfile.email,
      password: '',
      confirmPassword: '',
    }))
    setCurrentStep(0)
    setFormMessage('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    for (let stepIndex = 0; stepIndex < companySteps.length; stepIndex += 1) {
      const validationMessage = validateStep(stepIndex)

      if (validationMessage) {
        setCurrentStep(stepIndex)
        setFormMessage(validationMessage)
        return
      }
    }

    const registrationPayload = {
      role: 'company',
      authProvider: authMethod,
      password: isGoogleMock ? null : companyForm.password,
      company: {
        companyName: companyForm.companyName.trim(),
        companyId: companyForm.companyId.trim(),
        businessModel: companyForm.businessModel,
        city: companyForm.city.trim(),
        address: companyForm.address.trim(),
        corporateEmail: companyForm.corporateEmail.trim(),
      },
      responsiblePerson: {
        contactName: companyForm.contactName.trim(),
        responsibleRole: companyForm.responsibleRole,
        contactPhone: companyForm.contactPhone.trim(),
        contactEmail: companyForm.contactEmail.trim(),
      },
      operation: {
        taskTypes: companyForm.taskTypes,
        operationScale: companyForm.operationScale,
        operationModalities: companyForm.operationModalities,
      },
      billing: {
        billingName: companyForm.billingName.trim(),
        billingId: companyForm.billingId.trim(),
        billingEmail: companyForm.billingEmail.trim(),
        billingAddress: companyForm.billingAddress.trim(),
        billingPaymentMethod: companyForm.billingPaymentMethod,
      },
      preferences: {
        primaryObjectives: companyForm.primaryObjectives,
        estimatedFrequencies: companyForm.estimatedFrequencies,
      },
      createdAt: new Date().toISOString(),
      isMockRegistration: true,
    }

    const result = registerCompany(registrationPayload)

    if (!result.success) {
      setCurrentStep(0)
      setFormMessage(result.message)
      return
    }

    // Persist the raw registration payload too (useful for debugging / legacy reads).
    window.localStorage.setItem(
      'nexojobs_mock_company_registration',
      JSON.stringify(registrationPayload)
    )

    setFormMessage('')
    login(registrationPayload.company.corporateEmail, registrationPayload.password, { allowGoogleMock: isGoogleMock })
    navigate('/app/company')
  }

  const renderStepContent = () => {
    if (currentStep === 0) {
      return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            id="businessModel"
            label="Modalidad de trabajo"
            as="select"
            value={companyForm.businessModel}
            onChange={updateField}
            placeholder="Selecciona una opción"
            options={businessModelOptions}
            helperText="Define si publicarás tareas locales, empresariales o de ambos tipos."
            required
          />
          <FormField
            id="companyName"
            label={companyNameLabel}
            value={companyForm.companyName}
            onChange={updateField}
            placeholder={companyNamePlaceholder}
            autoComplete="organization"
            required
          />
          <FormField
            id="companyId"
            label={companyIdLabel}
            value={companyForm.companyId}
            onChange={updateField}
            placeholder="Número de identificación"
            autoComplete="off"
            required
          />
          <FormField
            id="corporateEmail"
            label="Correo de la cuenta"
            type="email"
            value={companyForm.corporateEmail}
            onChange={updateField}
            placeholder="cuenta@correo.com"
            autoComplete="email"
            required
          />
          <FormField
            id="city"
            label="Ciudad"
            value={companyForm.city}
            onChange={updateField}
            placeholder="Ciudad principal"
            autoComplete="address-level2"
            required
          />
          <FormField
            id="address"
            label="Dirección"
            value={companyForm.address}
            onChange={updateField}
            placeholder="Dirección principal"
            autoComplete="street-address"
            required
          />
          {!isGoogleMock ? (
            <>
              <FormField
                id="password"
                label="Contraseña"
                type="password"
                value={companyForm.password}
                onChange={updateField}
                placeholder="Crea una contraseña"
                autoComplete="new-password"
                required
              />
              <FormField
                id="confirmPassword"
                label="Confirmar contraseña"
                type="password"
                value={companyForm.confirmPassword}
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            id="contactName"
            label="Nombre del responsable"
            value={companyForm.contactName}
            onChange={updateField}
            placeholder="Nombre y apellido"
            autoComplete="name"
            required
          />
          <FormField
            id="contactEmail"
            label="Correo del responsable"
            type="email"
            value={companyForm.contactEmail}
            onChange={updateField}
            placeholder="responsable@correo.com"
            autoComplete="email"
            required
          />
          <FormField
            id="responsibleRole"
            label="Cargo"
            as="select"
            value={companyForm.responsibleRole}
            onChange={updateField}
            placeholder="Selecciona una opción"
            options={responsibleRoleOptions}
            required
          />
          <FormField
            id="contactPhone"
            label="Teléfono de contacto"
            type="tel"
            value={companyForm.contactPhone}
            onChange={updateField}
            placeholder="Número de contacto"
            autoComplete="tel"
            inputMode="tel"
            required
          />
        </div>
      )
    }

    if (currentStep === 2) {
      return (
        <div className="space-y-5">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-[var(--color-text)]">
              Tipo de tareas
            </p>
            <div className="flex flex-wrap gap-3">
              {taskTypeOptions.map((option) => (
                <SelectableChip
                  key={option}
                  label={option}
                  selected={companyForm.taskTypes.includes(option)}
                  onClick={() => toggleSelection('taskTypes', option)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-[var(--color-text)]">
              Escala de operación
            </p>
            <div className="flex flex-wrap gap-3">
              {operationScaleOptions.map((option) => (
                <SelectableChip
                  key={option}
                  label={option}
                  selected={companyForm.operationScale.includes(option)}
                  onClick={() => toggleSelection('operationScale', option)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-[var(--color-text)]">
              Modalidad
            </p>
            <div className="flex flex-wrap gap-3">
              {operationModalityOptions.map((option) => (
                <SelectableChip
                  key={option}
                  label={option}
                  selected={companyForm.operationModalities.includes(option)}
                  onClick={() => toggleSelection('operationModalities', option)}
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
            id="billingName"
            label={billingNameLabel}
            value={companyForm.billingName}
            onChange={updateField}
            placeholder="Nombre para facturación"
            autoComplete="organization"
            required
          />
          <FormField
            id="billingId"
            label="RUC o identificación de facturación"
            value={companyForm.billingId}
            onChange={updateField}
            placeholder="RUC o identificación"
            autoComplete="off"
            required
          />
          <FormField
            id="billingEmail"
            label="Correo de facturación"
            type="email"
            value={companyForm.billingEmail}
            onChange={updateField}
            placeholder="facturacion@correo.com"
            autoComplete="email"
            required
          />
          <FormField
            id="billingAddress"
            label="Dirección fiscal"
            value={companyForm.billingAddress}
            onChange={updateField}
            placeholder="Dirección fiscal"
            autoComplete="street-address"
            required
          />
          <div className="md:col-span-2">
            <FormField
              id="billingPaymentMethod"
              label="Método de pago preferido"
              as="select"
              value={companyForm.billingPaymentMethod}
              onChange={updateField}
              placeholder="Selecciona una opción"
              options={billingPaymentMethodOptions}
              required
              helperText="Estos datos se usarán para configurar facturación más adelante."
            />
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-5">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-[var(--color-text)]">
            Objetivo principal
          </p>
          <div className="flex flex-wrap gap-3">
            {primaryObjectiveOptions.map((option) => (
              <SelectableChip
                key={option}
                label={option}
                selected={companyForm.primaryObjectives.includes(option)}
                onClick={() => toggleSelection('primaryObjectives', option)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-[var(--color-text)]">
            Frecuencia estimada
          </p>
          <div className="flex flex-wrap gap-3">
            {estimatedFrequencyOptions.map((option) => (
              <SelectableChip
                key={option}
                label={option}
                selected={companyForm.estimatedFrequencies.includes(option)}
                onClick={() => toggleSelection('estimatedFrequencies', option)}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <RegisterShell
      title="Registro de empresa"
      subtitle="Completa los datos para crear tu cuenta."
      steps={companySteps}
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
              <AuthSeparator label="o completa los datos" />
            </div>
          )}
        </section>

        <section className="rounded-[1.75rem] border border-[var(--color-primary-border)] bg-[var(--color-primary-softer)] p-4 md:p-5">
          <h2 className="text-xl font-bold tracking-[-0.03em] text-[var(--color-text)]">
            {companySteps[currentStep]}
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

export default RegisterCompany
