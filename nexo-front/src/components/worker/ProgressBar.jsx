function ProgressBar({ value, label }) {
  return (
    <div className="space-y-2" aria-label={label}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-[var(--color-text-muted)]">{label}</span>
        <span className="text-sm font-semibold text-[var(--color-primary-strong)]">{value}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[var(--color-primary-soft)]">
        <div
          className="h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-300"
          style={{ width: `${value}%` }}
          role="progressbar"
          aria-label={label}
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}

export default ProgressBar
