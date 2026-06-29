import ProgressBar from './ProgressBar'
import { ArrowRightIcon } from './WorkerIcons'
import postulacionesIcon from '../../assets/WorkerDashboard/postulaciones.png'
import progresoIcon from '../../assets/WorkerDashboard/progreso.png'
import trabajosIcon from '../../assets/WorkerDashboard/trabajos.png'

function SummaryAction({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 inline-flex min-h-[38px] items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] transition hover:text-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
    >
      {label}
      <ArrowRightIcon className="h-4 w-4" />
    </button>
  )
}

function WorkerSummaryCards({
  summary,
  onNavigate,
  sectionIds,
}) {
  return (
    <section className="grid grid-cols-1 gap-3 xl:grid-cols-3">
      <article className="rounded-[1.45rem] border border-[var(--color-primary-border)] bg-white p-4 shadow-[0_18px_32px_rgba(4,44,83,0.05)] md:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[0.95rem] bg-[var(--color-primary-soft)]">
            <img src={postulacionesIcon} alt="" aria-hidden="true" className="icon-primary h-5 w-5 object-contain" />
          </div>
          <h2 className="text-[1.1rem] font-bold tracking-[-0.04em] text-[var(--color-primary-strong)]">
            Postulaciones activas
          </h2>
        </div>
        <p className="mt-5 text-3xl font-extrabold tracking-[-0.05em] text-[var(--color-primary-strong)]">
          {summary.totalApplications}
        </p>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          {summary.acceptedApplications} aceptada(s) para continuar.
        </p>
        <SummaryAction
          label="Ver postulaciones"
          onClick={() => onNavigate(sectionIds.applications)}
        />
      </article>

      <article className="rounded-[1.45rem] border border-[var(--color-primary-border)] bg-white p-4 shadow-[0_18px_32px_rgba(4,44,83,0.05)] md:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[0.95rem] bg-[var(--color-primary-soft)]">
            <img src={progresoIcon} alt="" aria-hidden="true" className="icon-primary h-5 w-5 object-contain" />
          </div>
          <h2 className="text-[1.1rem] font-bold tracking-[-0.04em] text-[var(--color-primary-strong)]">
            Cursos en progreso
          </h2>
        </div>

        <div className="mt-5 space-y-4">
          {summary.inProgressCourses.slice(0, 2).map((course) => (
            <ProgressBar key={course.id} label={course.title} value={course.progress} />
          ))}
        </div>

        <SummaryAction
          label="Ver mis cursos"
          onClick={() => onNavigate(sectionIds.coursesInProgress)}
        />
      </article>

      <article className="rounded-[1.45rem] border border-[var(--color-primary-border)] bg-white p-4 shadow-[0_18px_32px_rgba(4,44,83,0.05)] md:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[0.95rem] bg-[var(--color-primary-soft)]">
            <img src={trabajosIcon} alt="" aria-hidden="true" className="icon-primary h-5 w-5 object-contain" />
          </div>
          <h2 className="text-[1.1rem] font-bold tracking-[-0.04em] text-[var(--color-primary-strong)]">
            Microtrabajos cercanos
          </h2>
        </div>

        <div className="mt-5 space-y-3">
          {summary.nearbyMicrojobs.map((microjob) => (
            <div
              key={microjob.id}
              className="flex items-center justify-between gap-3 border-b border-[var(--color-primary-border)] pb-3 last:border-b-0 last:pb-0"
            >
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                <p className="text-sm font-medium text-[var(--color-primary-strong)]">
                  {microjob.title}
                </p>
              </div>
              <span className="rounded-full bg-[var(--color-primary-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--color-primary)]">
                {microjob.locationType === 'remote' ? 'Remoto' : `${microjob.distanceKm} km`}
              </span>
            </div>
          ))}
        </div>

        <SummaryAction label="Ver todos" onClick={() => onNavigate(sectionIds.microjobs)} />
      </article>
    </section>
  )
}

export default WorkerSummaryCards
