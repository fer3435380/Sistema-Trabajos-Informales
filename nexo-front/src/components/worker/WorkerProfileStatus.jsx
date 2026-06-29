import ProgressBar from './ProgressBar'
import StatusBadge from './StatusBadge'

function WorkerProfileStatus({
  profileStatus,
  workerProfile,
  onEditProfile,
  onOpenSettings,
}) {
  return (
    <div className="space-y-4">
      <section className="rounded-[1.45rem] border border-[var(--color-primary-border)] bg-white p-4 shadow-[0_18px_32px_rgba(4,44,83,0.05)] md:p-5">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="flex items-start gap-4">
            <img
              src={workerProfile.profileImageSrc}
              alt={workerProfile.profileImageAlt}
              className="h-20 w-20 rounded-[1.35rem] object-cover shadow-[0_16px_28px_rgba(4,44,83,0.08)]"
            />

            <div className="space-y-2">
              <p className="text-sm font-semibold text-[var(--color-primary)]">Cuenta</p>
              <h2 className="text-[1.55rem] font-extrabold tracking-[-0.05em] text-[var(--color-primary-strong)]">
                Estado del perfil
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
                Revisa qué datos ayudan a mejorar tus oportunidades.
              </p>
              <p className="text-sm font-semibold text-[var(--color-primary-strong)]">
                {workerProfile.name} · {workerProfile.city}
              </p>
            </div>
          </div>

          <div className="rounded-[1.35rem] border border-[var(--color-primary-border)] bg-[var(--color-primary-softer)] p-5">
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">Avance general</p>
            <p className="mt-2 text-3xl font-extrabold tracking-[-0.05em] text-[var(--color-primary-strong)]">
              {profileStatus.completionPercentage}% completo
            </p>
            <div className="mt-4">
              <ProgressBar label="Estado del perfil" value={profileStatus.completionPercentage} />
            </div>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={onEditProfile}
                className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
              >
                Editar perfil
              </button>
              <button
                type="button"
                onClick={onOpenSettings}
                className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] border border-[var(--color-primary-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
              >
                Configuración
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        <article className="rounded-[1.35rem] border border-[var(--color-primary-border)] bg-white p-4 shadow-[0_18px_30px_rgba(4,44,83,0.05)]">
          <p className="text-sm font-semibold text-[var(--color-primary)]">Perfil visible</p>
          <h3 className="mt-2 text-lg font-bold tracking-[-0.03em] text-[var(--color-primary-strong)]">
            {workerProfile.tagline}
          </h3>
          <div className="mt-4 space-y-2 text-sm text-[var(--color-text-muted)]">
            <p>{workerProfile.email}</p>
            <p>{workerProfile.phone}</p>
            <p>{workerProfile.availability}</p>
          </div>
        </article>

        <article className="rounded-[1.35rem] border border-[var(--color-primary-border)] bg-white p-4 shadow-[0_18px_30px_rgba(4,44,83,0.05)]">
          <p className="text-sm font-semibold text-[var(--color-primary)]">Ubicación base</p>
          <h3 className="mt-2 text-lg font-bold tracking-[-0.03em] text-[var(--color-primary-strong)]">
            {workerProfile.neighborhood}, {workerProfile.city}
          </h3>
          <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
            Esta referencia ayuda a priorizar microtrabajos más cercanos mientras la lógica aún está simulada en frontend.
          </p>
        </article>
      </section>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {profileStatus.sections.map((section) => (
          <article
            key={section.id}
            className="rounded-[1.35rem] border border-[var(--color-primary-border)] bg-white p-4 shadow-[0_18px_30px_rgba(4,44,83,0.05)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold tracking-[-0.03em] text-[var(--color-primary-strong)]">
                  {section.label}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                  {section.helperText}
                </p>
              </div>
              <StatusBadge label={section.status} />
            </div>

            <div className="mt-5">
              <ProgressBar label={section.label} value={section.progress} />
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default WorkerProfileStatus
