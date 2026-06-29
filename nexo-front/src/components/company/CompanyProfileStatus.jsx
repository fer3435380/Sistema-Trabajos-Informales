import StatusBadge from './StatusBadge'

function CompanyProfileStatus({ profile, statusBlocks, onEditProfile, onOpenSettings }) {
  return (
    <section className="space-y-4">
      <section className="rounded-[1.45rem] border border-[var(--color-primary-border)] bg-white p-4 shadow-[0_18px_32px_rgba(4,44,83,0.05)] md:p-5">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="flex items-start gap-4">
            <img
              src={profile.profileImageSrc}
              alt={profile.profileImageAlt}
              className="h-20 w-20 rounded-[1.35rem] object-cover shadow-[0_16px_28px_rgba(4,44,83,0.08)]"
            />

            <div className="space-y-2">
              <p className="text-sm font-semibold text-[var(--color-primary)]">Negocio</p>
              <h2 className="text-[1.55rem] font-extrabold tracking-[-0.05em] text-[var(--color-primary-strong)]">
                Estado de la empresa
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
                Revisa y actualiza la información necesaria para operar en NexoJobs.
              </p>
              <p className="text-sm font-semibold text-[var(--color-primary-strong)]">
                {profile.commercialName} · {profile.city}
              </p>
            </div>
          </div>

          <div className="rounded-[1.35rem] border border-[var(--color-primary-border)] bg-[var(--color-primary-softer)] p-5">
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">Avance general</p>
            <p className="mt-2 text-3xl font-extrabold tracking-[-0.05em] text-[var(--color-primary-strong)]">
              {profile.completionPercentage}% completo
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={onEditProfile}
                className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
              >
                Editar información
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
            {profile.tagline}
          </h3>
          <div className="mt-4 space-y-2 text-sm text-[var(--color-text-muted)]">
            <p>{profile.accountEmail}</p>
            <p>{profile.responsiblePhone}</p>
            <p>{profile.address}</p>
          </div>
        </article>

        <article className="rounded-[1.35rem] border border-[var(--color-primary-border)] bg-white p-4 shadow-[0_18px_30px_rgba(4,44,83,0.05)]">
          <p className="text-sm font-semibold text-[var(--color-primary)]">Responsable actual</p>
          <h3 className="mt-2 text-lg font-bold tracking-[-0.03em] text-[var(--color-primary-strong)]">
            {profile.responsibleName}
          </h3>
          <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
            {profile.responsibleRole} · {profile.responsibleEmail}
          </p>
        </article>
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {statusBlocks.map((block) => (
          <article
            key={block.id}
            className="rounded-[1.35rem] border border-[var(--color-primary-border)] bg-white p-4 shadow-[0_16px_26px_rgba(4,44,83,0.04)]"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold tracking-[-0.03em] text-[var(--color-primary-strong)]">
                {block.title}
              </h3>
              <StatusBadge status={block.status} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {block.fields.map((field) => (
                <span
                  key={`${block.id}-${field}`}
                  className="inline-flex rounded-full border border-[var(--color-primary-border)] bg-[var(--color-primary-softer)] px-3 py-1 text-xs font-semibold text-[var(--color-primary-strong)]"
                >
                  {field}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default CompanyProfileStatus
