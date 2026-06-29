import { useState } from 'react'
import FormField from '../auth/FormField'
import SelectableChip from '../auth/SelectableChip'
import {
  estimatedFrequencyOptions,
  mainObjectiveOptions,
  modalityOptions,
  operationScaleOptions,
  paymentMethodOptions,
  responsibleRoleOptions,
  microjobTypeOptions,
  workModeLabels,
} from '../../data/mockCompanyData'
import CompanyModalShell from './CompanyModalShell'

const workModeOptionEntries = Object.entries(workModeLabels)

function CompanyProfileEditModal({ profile, isOpen, onClose, onSave }) {
  const [draft, setDraft] = useState(profile)

  if (!profile) {
    return null
  }

  function updateField(event) {
    const { name, value } = event.target

    setDraft((currentDraft) => ({
      ...currentDraft,
      [name]:
        name === 'workMode'
          ? workModeOptionEntries.find(([, label]) => label === value)?.[0] ?? value
          : value,
    }))
  }

  function toggleMultiValue(field, value) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [field]: currentDraft[field].includes(value)
        ? currentDraft[field].filter((item) => item !== value)
        : [...currentDraft[field], value],
    }))
  }

  function handleSave() {
    onSave(draft)
  }

  return (
    <CompanyModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Editar estado de la empresa"
      description="Actualiza la información clave del negocio, responsable, operación, facturación y preferencias."
      size="xl"
      footer={
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
            Guardar cambios
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <section className="rounded-[1.25rem] border border-[var(--color-primary-border)] bg-[var(--color-primary-softer)] p-4">
          <p className="text-sm font-semibold text-[var(--color-primary)]">Cuenta y negocio</p>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              id="workMode"
              label="Modalidad de trabajo"
              as="select"
              value={draft.workMode}
              onChange={updateField}
              placeholder="Selecciona una opción"
              options={Object.entries(workModeLabels).map(([, label]) => label)}
              required
            />
            <FormField
              id="commercialName"
              label="Nombre completo o nombre comercial"
              value={draft.commercialName}
              onChange={updateField}
              placeholder="Nombre visible del negocio o empresa"
              required
            />
            <FormField
              id="companyName"
              label="Nombre de la empresa o razón social"
              value={draft.companyName}
              onChange={updateField}
              placeholder="Razón social o nombre principal"
              required
            />
            <FormField
              id="identification"
              label="Cédula, RUC o identificación"
              value={draft.identification}
              onChange={updateField}
              placeholder="Número de identificación"
              required
            />
            <FormField
              id="accountEmail"
              label="Correo de la cuenta"
              type="email"
              value={draft.accountEmail}
              onChange={updateField}
              placeholder="cuenta@empresa.com"
              required
            />
            <FormField
              id="city"
              label="Ciudad"
              value={draft.city}
              onChange={updateField}
              placeholder="Ciudad principal"
              required
            />
            <div className="md:col-span-2">
              <FormField
                id="address"
                label="Dirección"
                value={draft.address}
                onChange={updateField}
                placeholder="Dirección principal"
                required
              />
            </div>
          </div>
        </section>

        <section className="rounded-[1.25rem] border border-[var(--color-primary-border)] bg-white p-4">
          <p className="text-sm font-semibold text-[var(--color-primary)]">Responsable</p>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              id="responsibleName"
              label="Nombre del responsable"
              value={draft.responsibleName}
              onChange={updateField}
              placeholder="Nombre completo"
              required
            />
            <FormField
              id="responsibleEmail"
              label="Correo del responsable"
              type="email"
              value={draft.responsibleEmail}
              onChange={updateField}
              placeholder="responsable@empresa.com"
              required
            />
            <FormField
              id="responsibleRole"
              label="Cargo"
              as="select"
              value={draft.responsibleRole}
              onChange={updateField}
              placeholder="Selecciona una opción"
              options={responsibleRoleOptions}
              required
            />
            <FormField
              id="responsiblePhone"
              label="Teléfono de contacto"
              value={draft.responsiblePhone}
              onChange={updateField}
              placeholder="+593..."
              required
            />
          </div>
        </section>

        <section className="rounded-[1.25rem] border border-[var(--color-primary-border)] bg-white p-4">
          <p className="text-sm font-semibold text-[var(--color-primary)]">Operación</p>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              id="operationScale"
              label="Escala de operación"
              as="select"
              value={draft.operationScale}
              onChange={updateField}
              placeholder="Selecciona una opción"
              options={operationScaleOptions}
              required
            />
          </div>
          <div className="mt-4 space-y-3">
            <p className="text-sm font-semibold text-[var(--color-text)]">Tipo de tareas</p>
            <div className="flex flex-wrap gap-3">
              {microjobTypeOptions.map((option) => (
                <SelectableChip
                  key={option}
                  label={option}
                  selected={draft.operationTaskTypes.includes(option)}
                  onClick={() => toggleMultiValue('operationTaskTypes', option)}
                />
              ))}
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <p className="text-sm font-semibold text-[var(--color-text)]">Modalidad</p>
            <div className="flex flex-wrap gap-3">
              {modalityOptions.map((option) => (
                <SelectableChip
                  key={option}
                  label={option}
                  selected={draft.operationModalities.includes(option)}
                  onClick={() => toggleMultiValue('operationModalities', option)}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[1.25rem] border border-[var(--color-primary-border)] bg-white p-4">
          <p className="text-sm font-semibold text-[var(--color-primary)]">Facturación</p>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              id="billingName"
              label="Nombre completo o razón social para facturación"
              value={draft.billingName}
              onChange={updateField}
              placeholder="Nombre para facturación"
              required
            />
            <FormField
              id="billingIdentification"
              label="RUC o identificación de facturación"
              value={draft.billingIdentification}
              onChange={updateField}
              placeholder="RUC o identificación"
              required
            />
            <FormField
              id="billingEmail"
              label="Correo de facturación"
              type="email"
              value={draft.billingEmail}
              onChange={updateField}
              placeholder="facturacion@empresa.com"
              required
            />
            <FormField
              id="preferredPaymentMethod"
              label="Método de pago preferido"
              as="select"
              value={draft.preferredPaymentMethod}
              onChange={updateField}
              placeholder="Selecciona una opción"
              options={paymentMethodOptions}
              required
            />
            <div className="md:col-span-2">
              <FormField
                id="billingAddress"
                label="Dirección fiscal"
                value={draft.billingAddress}
                onChange={updateField}
                placeholder="Dirección fiscal"
                required
              />
            </div>
          </div>
        </section>

        <section className="rounded-[1.25rem] border border-[var(--color-primary-border)] bg-white p-4">
          <p className="text-sm font-semibold text-[var(--color-primary)]">Preferencias</p>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              id="mainObjective"
              label="Objetivo principal"
              as="select"
              value={draft.mainObjective}
              onChange={updateField}
              placeholder="Selecciona una opción"
              options={mainObjectiveOptions}
              required
            />
            <FormField
              id="estimatedFrequency"
              label="Frecuencia estimada"
              as="select"
              value={draft.estimatedFrequency}
              onChange={updateField}
              placeholder="Selecciona una opción"
              options={estimatedFrequencyOptions}
              required
            />
            <div className="md:col-span-2">
              <FormField
                id="tagline"
                label="Resumen visible"
                value={draft.tagline}
                onChange={updateField}
                placeholder="Describe brevemente el enfoque de tu cuenta"
              />
            </div>
          </div>
        </section>
      </div>
    </CompanyModalShell>
  )
}

export default CompanyProfileEditModal
