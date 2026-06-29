import ProgressBar from './ProgressBar'
import WorkerModalShell from './WorkerModalShell'

function CoursePlayerModal({ course, isOpen, onClose, onMarkCompleted }) {
  const currentModule = course?.modules.find((module) => !module.isCompleted) ?? course?.modules.at(-1)

  return (
    <WorkerModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={course?.title || 'Curso en progreso'}
      description="Continúa tu curso con una estructura mock de video, contenido y actividad."
      size="xl"
      footer={
        course ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] border border-[var(--color-primary-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-muted)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={() => onMarkCompleted(course.id)}
              className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] border border-[var(--color-primary-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
            >
              Marcar como completado
            </button>
            <button
              type="button"
              onClick={() => onMarkCompleted(course.id)}
              className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
            >
              Siguiente
            </button>
          </div>
        ) : null
      }
    >
      {course && currentModule ? (
        <div className="space-y-5">
          <ProgressBar label="Progreso del curso" value={course.progress} />

          <div className="rounded-[1.25rem] border border-[var(--color-primary-border)] bg-[var(--color-primary-softer)] p-4">
            <p className="text-sm font-semibold text-[var(--color-primary)]">Módulo actual</p>
            <h3 className="mt-1 text-xl font-bold tracking-[-0.04em] text-[var(--color-primary-strong)]">
              {currentModule.title}
            </h3>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Tipo: {currentModule.type} · {currentModule.durationMinutes} min
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[1.25rem] border border-[var(--color-primary-border)] bg-white p-4">
              <div className="relative overflow-hidden rounded-[1rem]">
                <img
                  src={course.imageSrc}
                  alt={course.imageAlt || course.title}
                  className="aspect-video w-full object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,44,83,0.1)_0%,rgba(4,44,83,0.72)_100%)]" />
                <div className="absolute inset-x-4 bottom-4 text-white">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/75">
                    Video mock
                  </p>
                  <p className="mt-2 text-lg font-bold">{currentModule.title}</p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-7 text-[var(--color-text-muted)]">
                Este reproductor es mock. Aquí verás video, lectura o guía paso a paso cuando la integración académica y de contenidos esté conectada.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-[1.25rem] border border-[var(--color-primary-border)] bg-white p-4">
                <p className="text-sm font-semibold text-[var(--color-primary-strong)]">
                  Actividad o pregunta
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">
                  Responde una pregunta breve o completa una actividad guiada para avanzar al siguiente módulo.
                </p>
              </div>

              <div className="rounded-[1.25rem] border border-[var(--color-primary-border)] bg-[var(--color-amber-soft)] p-4">
                <p className="text-sm font-semibold text-[var(--color-primary-strong)]">
                  Integración futura
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)]">
                  Las actividades interactivas se conectarán con H5P en una fase posterior.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </WorkerModalShell>
  )
}

export default CoursePlayerModal
