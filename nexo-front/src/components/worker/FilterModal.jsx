import { useState } from 'react'
import WorkerModalShell from './WorkerModalShell'

function FilterOptionGroup({ label, options, selectedValue, onChange }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-[var(--color-primary-strong)]">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selectedValue === option.value

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`inline-flex min-h-[40px] items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)] ${
                isSelected
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                  : 'border-[var(--color-primary-border)] bg-white text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function FilterModal({
  isOpen,
  title,
  description,
  sections,
  initialValues,
  onApply,
  onClear,
  onClose,
}) {
  const [draftValues, setDraftValues] = useState(initialValues)

  return (
    <WorkerModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      size="lg"
      footer={
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => {
              setDraftValues(initialValues)
              onClose()
            }}
            className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] border border-[var(--color-primary-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-muted)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              const clearedValues = Object.keys(initialValues).reduce((accumulator, key) => {
                accumulator[key] = 'all'
                return accumulator
              }, {})

              setDraftValues(clearedValues)
              onClear(clearedValues)
            }}
            className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] border border-[var(--color-primary-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
          >
            Limpiar
          </button>
          <button
            type="button"
            onClick={() => onApply(draftValues)}
            className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
          >
            Aplicar filtros
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {sections.map((section) => (
          <FilterOptionGroup
            key={section.key}
            label={section.label}
            options={section.options}
            selectedValue={draftValues[section.key]}
            onChange={(nextValue) =>
              setDraftValues((currentValues) => ({
                ...currentValues,
                [section.key]: nextValue,
              }))
            }
          />
        ))}
      </div>
    </WorkerModalShell>
  )
}

export default FilterModal
