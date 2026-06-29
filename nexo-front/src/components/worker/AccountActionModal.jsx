import WorkerModalShell from './WorkerModalShell'

function AccountActionModal({ action, isOpen, onClose }) {
  return (
    <WorkerModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={action?.title || 'Acción de cuenta'}
      description={action?.description || 'Esta acción quedará conectada en una fase posterior.'}
      size="md"
      footer={
        action ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] border border-[var(--color-primary-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-muted)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
            >
              Volver
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
            >
              Entendido
            </button>
          </div>
        ) : null
      }
    >
      {action ? (
        <div className="space-y-4">
          <div className="rounded-[1.2rem] border border-[var(--color-primary-border)] bg-[var(--color-primary-softer)] p-4">
            <p className="text-sm font-semibold text-[var(--color-primary-strong)]">
              Estado actual
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)]">
              {action.helperText}
            </p>
          </div>

          <div className="rounded-[1.2rem] border border-[var(--color-primary-border)] p-4">
            <p className="text-sm font-semibold text-[var(--color-primary-strong)]">
              Qué pasará después
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)]">
              {action.nextStepText}
            </p>
          </div>
        </div>
      ) : null}
    </WorkerModalShell>
  )
}

export default AccountActionModal
