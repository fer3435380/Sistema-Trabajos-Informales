function MapPreview({ latitude, longitude, locationName, address, mapsUrl }) {
  if (latitude === null || longitude === null) {
    return (
      <div className="rounded-[1.25rem] border border-dashed border-[var(--color-primary-border)] bg-[var(--color-primary-softer)] p-4">
        <p className="text-sm font-semibold text-[var(--color-primary-strong)]">
          Ubicación remota
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
          Esta tarea no requiere desplazamiento físico.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-[1.25rem] border border-[var(--color-primary-border)] bg-[var(--color-primary-softer)] p-4">
      <div className="rounded-[1rem] border border-[var(--color-primary-border)] bg-[linear-gradient(180deg,#ffffff_0%,#e7f0fa_100%)] p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--color-primary-strong)]">{locationName}</p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">{address}</p>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
            Vista mock
          </span>
        </div>

        <div className="mt-4 rounded-[1rem] border border-dashed border-[var(--color-primary-border)] bg-white px-4 py-8 text-center">
          <p className="text-sm font-semibold text-[var(--color-primary-strong)]">
            Latitud: {latitude}
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--color-primary-strong)]">
            Longitud: {longitude}
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
            El mapa real se conectará más adelante. En esta fase solo mostramos coordenadas y un enlace mock seguro.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
        >
          Abrir en Google Maps
        </a>
        <a
          href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] border border-[var(--color-primary-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
        >
          Abrir en mapa
        </a>
      </div>
    </div>
  )
}

export default MapPreview
