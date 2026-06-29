import ProgressBar from './ProgressBar'
import StatusBadge from './StatusBadge'

function CourseProgressCard({ course, onOpenDetail, onContinueCourse }) {
  return (
    <article className="overflow-hidden rounded-[1.5rem] border border-[var(--color-primary-border)] bg-white p-4 shadow-[0_18px_30px_rgba(4,44,83,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[var(--color-primary)]">{course.category}</p>
          <h3 className="mt-1 text-[1.08rem] font-bold tracking-[-0.04em] text-[var(--color-primary-strong)]">
            {course.title}
          </h3>
        </div>
        <StatusBadge label={`${course.progress}%`} />
      </div>

      <div className="mt-4">
        <ProgressBar label="Progreso" value={course.progress} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2.5 text-sm md:grid-cols-2">
        <div className="rounded-[1rem] bg-[var(--color-primary-softer)] px-3 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
            Módulos completados
          </p>
          <p className="mt-1 font-semibold text-[var(--color-primary-strong)]">
            {course.completedModules} de {course.totalModules}
          </p>
        </div>
        <div className="rounded-[1rem] bg-[var(--color-primary-softer)] px-3 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
            Siguiente actividad
          </p>
          <p className="mt-1 font-semibold text-[var(--color-primary-strong)]">
            {course.nextModuleTitle}
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm text-[var(--color-text-muted)]">{course.remainingTimeLabel}</p>

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
          onClick={() => onContinueCourse(course.id)}
          className="inline-flex min-h-[38px] items-center justify-center rounded-[0.9rem] bg-[var(--color-primary)] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
        >
          Continuar curso
        </button>
      </div>
    </article>
  )
}

export default CourseProgressCard
