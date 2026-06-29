function WorkerJourneyCard({ items, reputationNote, starIcon, delayClass = '' }) {
  return (
    <article
      className={`animate-section-rise rounded-[28px] border border-white/90 bg-white/96 p-4 shadow-[0_20px_50px_rgba(4,44,83,0.10)] sm:p-5 ${delayClass}`}
    >
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item.title}
            className="flex gap-4 rounded-[22px] border border-[var(--color-primary-border)] bg-[var(--color-primary-softer)] px-4 py-4"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-bold text-white">
              {index + 1}
            </div>

            <div>
              <h4 className="text-[15px] font-bold text-[var(--color-primary-strong)]">
                {item.title}
              </h4>
              <p className="mt-1 text-[14px] leading-6 text-[var(--color-text-muted)]">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[22px] border border-[var(--color-primary-border)] bg-white px-4 py-4 text-center shadow-[0_10px_24px_rgba(4,44,83,0.04)]">
          <p className="text-[1.45rem] font-bold tracking-[-0.04em] text-[var(--color-primary)]">
            Cursos
          </p>
          <p className="mt-1 text-[13px] text-[var(--color-text-muted)]">
            Aprendizaje corto y aplicado.
          </p>
        </div>

        <div className="rounded-[22px] border border-[var(--color-primary-border)] bg-white px-4 py-4 text-center shadow-[0_10px_24px_rgba(4,44,83,0.04)]">
          <p className="text-[1.45rem] font-bold tracking-[-0.04em] text-[var(--color-amber)]">
            Reputación
          </p>
          <p className="mt-1 text-[13px] text-[var(--color-text-muted)]">
            Valoraciones que generan confianza.
          </p>
        </div>

        <div className="rounded-[22px] border border-[var(--color-primary-border)] bg-white px-4 py-4 text-center shadow-[0_10px_24px_rgba(4,44,83,0.04)]">
          <p className="text-[1.45rem] font-bold tracking-[-0.04em] text-[var(--color-primary-strong)]">
            Tareas
          </p>
          <p className="mt-1 text-[13px] text-[var(--color-text-muted)]">
            Oportunidades según tu contexto.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[22px] border border-[var(--color-primary-border)] bg-white px-4 py-4 shadow-[0_10px_24px_rgba(4,44,83,0.04)]">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-amber-soft)]">
            <img src={starIcon} alt="" className="icon-amber h-5 w-5 object-contain" />
          </div>

          <div>
            <p className="text-[15px] font-bold text-[var(--color-primary-strong)]">
              La reputación es tu señal de confianza
            </p>
            <p className="mt-1 text-[14px] leading-6 text-[var(--color-text-muted)]">
              {reputationNote}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}

export default WorkerJourneyCard
