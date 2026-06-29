function StepIndicator({
  steps,
  currentStep,
  onStepChange,
  isStepComplete = () => false,
  canAccessStep = () => true,
}) {
  return (
    <ol className="flex gap-2 overflow-x-auto pb-2" aria-label="Pasos del registro">
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const isActive = index === currentStep
        const isCompleted = isStepComplete(index)
        const isLocked = !canAccessStep(index)

        return (
          <li key={step} className="shrink-0">
            <button
              type="button"
              onClick={() => onStepChange?.(index)}
              disabled={isLocked}
              aria-current={isActive ? 'step' : undefined}
              className={`inline-flex items-center gap-3 rounded-full border px-3 py-2 text-left text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)] disabled:cursor-not-allowed disabled:opacity-70 ${
                isActive
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)]'
                  : isCompleted
                    ? 'border-[var(--color-success-border)] bg-[var(--color-success-soft)] text-[var(--color-success)]'
                    : isLocked
                      ? 'border-[var(--color-primary-border)] bg-white text-[var(--color-text-muted)]'
                      : 'border-[var(--color-primary-border)] bg-white text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
              }`}
            >
              <span
                className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                  isActive
                    ? 'bg-[var(--color-primary)] text-white'
                    : isCompleted
                      ? 'bg-[var(--color-success)] text-white'
                      : 'bg-[var(--color-primary-softer)] text-[var(--color-text-muted)]'
                }`}
              >
                {stepNumber}
              </span>
              <span>{step}</span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}

export default StepIndicator
