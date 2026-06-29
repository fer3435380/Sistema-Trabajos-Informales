const toneByStatus = {
  Activo: 'border-[var(--color-success-border)] bg-[var(--color-success-soft)] text-[var(--color-success)]',
  Publicado:
    'border-[var(--color-success-border)] bg-[var(--color-success-soft)] text-[var(--color-success)]',
  Completo:
    'border-[var(--color-success-border)] bg-[var(--color-success-soft)] text-[var(--color-success)]',
  Nueva: 'border-[var(--color-primary-border)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]',
  Aceptada:
    'border-[var(--color-primary-border)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]',
  Completada:
    'border-[var(--color-success-border)] bg-[var(--color-success-soft)] text-[var(--color-success)]',
  'En revisión': 'border-[#f3d28c] bg-[var(--color-amber-soft)] text-[#ac7a13]',
  Revisar: 'border-[#f3d28c] bg-[var(--color-amber-soft)] text-[#ac7a13]',
  Pendiente: 'border-[#f3d28c] bg-[var(--color-amber-soft)] text-[#ac7a13]',
  Borrador: 'border-[var(--color-primary-border)] bg-[var(--color-primary-softer)] text-[var(--color-text-muted)]',
  Rechazada:
    'border-[var(--color-danger-border)] bg-[var(--color-danger-soft)] text-[var(--color-danger)]',
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${toneByStatus[status] ?? toneByStatus.Borrador}`}
    >
      {status}
    </span>
  )
}

export default StatusBadge
