import StatusBadge from './StatusBadge'

function CourseCard({ course, onOpenDetail, onStartCourse }) {
  return (
    <article className="overflow-hidden rounded-[1.5rem] border border-[var(--color-primary-border)] bg-white p-4 shadow-[0_18px_30px_rgba(4,44,83,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label={course.level} />
            <span className="rounded-full bg-[var(--color-amber-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-text)]">
              Disponible
            </span>
          </div>
          <h3 className="mt-3 text-[1.08rem] font-bold tracking-[-0.04em] text-[var(--color-primary-strong)]">
            {course.title}
          </h3>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">{course.category}</p>
        </div>

        <div className="rounded-[1rem] bg-[var(--color-primary-softer)] px-3 py-2 text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
            Duración
          </p>
          <p className="mt-1 text-sm font-bold text-[var(--color-primary-strong)]">
            {course.durationLabel}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2.5 text-sm">
        <div className="rounded-[1rem] bg-[var(--color-primary-softer)] px-3 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
            Habilidad que desbloquea
          </p>
          <p className="mt-1 font-semibold text-[var(--color-primary-strong)]">
            {course.skillUnlocked}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => onOpenDetail(course.id)}
          className="inline-flex min-h-[38px] items-center justify-center rounded-[0.9rem] border border-[var(--color-primary-border)] px-3.5 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
        >
          Ver detalle
        </button>
        <button
          type="button"
          onClick={() => onStartCourse(course.id)}
          className="inline-flex min-h-[38px] items-center justify-center rounded-[0.9rem] bg-[var(--color-primary)] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
        >
          Iniciar curso
        </button>
      </div>
    </article>
  )
}

export default CourseCard
