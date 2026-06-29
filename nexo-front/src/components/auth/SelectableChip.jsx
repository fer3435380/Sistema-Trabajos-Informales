function SelectableChip({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`inline-flex items-center gap-3 rounded-full border px-4 py-3 text-left text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)] ${
        selected
          ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)] shadow-[0_10px_24px_rgba(24,95,165,0.14)]'
          : 'border-[var(--color-primary-border)] bg-white text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-softer)]'
      }`}
    >
      <span
        aria-hidden="true"
        className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
          selected
            ? 'border-[var(--color-primary)] bg-[var(--color-primary)] shadow-[inset_0_0_0_3px_white]'
            : 'border-[var(--color-primary-border)] bg-[var(--color-primary-softer)]'
        }`}
      />
      <span>{label}</span>
    </button>
  )
}

export default SelectableChip
