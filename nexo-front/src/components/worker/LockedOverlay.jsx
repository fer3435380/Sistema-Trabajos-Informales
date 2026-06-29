function LockedOverlay({ requiredCourseLabel, onOpenCourse }) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[1.5rem] bg-[rgba(4,44,83,0.7)] p-4 text-white">
      <div className="max-w-xs rounded-[1.25rem] border border-white/15 bg-[rgba(255,255,255,0.08)] p-4 text-center backdrop-blur-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/75">
          Microtrabajo bloqueado
        </p>
        <p className="mt-3 text-base font-bold leading-6">
          Completa el curso “{requiredCourseLabel}” para postular.
        </p>
        <button
          type="button"
          onClick={onOpenCourse}
          className="mt-4 inline-flex min-h-[40px] items-center justify-center rounded-[0.95rem] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-primary-strong)] transition hover:bg-[var(--color-primary-soft)] focus:outline-none focus:ring-4 focus:ring-white/30"
        >
          Ver curso requerido
        </button>
      </div>
    </div>
  )
}

export default LockedOverlay
