function AuthSeparator({ label = 'o continúa con' }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-[var(--color-primary-border)]" />
      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
        {label}
      </span>
      <span className="h-px flex-1 bg-[var(--color-primary-border)]" />
    </div>
  )
}

export default AuthSeparator
