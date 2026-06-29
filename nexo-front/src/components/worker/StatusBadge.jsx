const badgeVariants = {
  'En revisión':
    'border-[var(--color-amber)]/25 bg-[var(--color-amber-soft)] text-[var(--color-text)]',
  Aceptada:
    'border-[var(--color-primary-border)] bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)]',
  Completada:
    'border-[var(--color-success-border)] bg-[var(--color-success-soft)] text-[var(--color-success)]',
  Rechazada:
    'border-[var(--color-danger-border)] bg-[var(--color-danger-soft)] text-[var(--color-danger)]',
  Recomendado:
    'border-[var(--color-amber)]/25 bg-[var(--color-amber-soft)] text-[var(--color-text)]',
  Desbloqueado:
    'border-[var(--color-primary-border)] bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)]',
  Bloqueado:
    'border-[var(--color-danger-border)] bg-[var(--color-danger-soft)] text-[var(--color-danger)]',
  Local: 'border-[var(--color-success-border)] bg-[var(--color-success-soft)] text-[var(--color-success)]',
  Empresarial:
    'border-[var(--color-primary-border)] bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)]',
  Remoto:
    'border-[var(--color-primary-border)] bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)]',
  Inicial:
    'border-[var(--color-primary-border)] bg-[var(--color-primary-softer)] text-[var(--color-primary-strong)]',
  Intermedio:
    'border-[var(--color-amber)]/25 bg-[var(--color-amber-soft)] text-[var(--color-text)]',
  Completo:
    'border-[var(--color-success-border)] bg-[var(--color-success-soft)] text-[var(--color-success)]',
  Pendiente:
    'border-[var(--color-primary-border)] bg-white text-[var(--color-text-muted)]',
  Revisar:
    'border-[var(--color-amber)]/25 bg-[var(--color-amber-soft)] text-[var(--color-text)]',
}

function StatusBadge({ label }) {
  const percentageBadge = label.endsWith('%')

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
        percentageBadge
          ? 'border-[var(--color-primary-border)] bg-[var(--color-primary-softer)] text-[var(--color-primary-strong)]'
          : badgeVariants[label] ||
            'border-[var(--color-primary-border)] bg-white text-[var(--color-text-muted)]'
      }`}
    >
      {label}
    </span>
  )
}

export default StatusBadge
