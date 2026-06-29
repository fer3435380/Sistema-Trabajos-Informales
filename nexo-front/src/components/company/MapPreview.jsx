import { LocationPinIcon } from './CompanyIcons'

function MapPreview({ locationName, address, latitude, longitude }) {
  const hasCoordinates = latitude != null && longitude != null
  const mapsUrl = hasCoordinates
    ? `https://www.google.com/maps?q=${latitude},${longitude}`
    : null
  const osmUrl = hasCoordinates
    ? `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`
    : null

  return (
    <div className="rounded-[1.35rem] border border-[var(--color-primary-border)] bg-[linear-gradient(180deg,#ffffff_0%,#f4f7fb_100%)] p-4">
      <div className="flex items-start gap-3">
        <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
          <LocationPinIcon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--color-primary-strong)]">
            {locationName || 'Selecciona un punto en mapa'}
          </p>
          <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
            {address || 'Aún no hay dirección cargada para este microtrabajo.'}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-[1.1rem] bg-[var(--color-primary-strong)]/95 p-4 text-white">
        <p className="text-sm font-semibold">Mapa mock</p>
        <p className="mt-2 text-sm text-white/75">
          {hasCoordinates
            ? 'El punto seleccionado ya quedó asociado internamente a esta ubicación.'
            : 'Cuando selecciones un punto mock, la ubicación quedará guardada para referencia interna.'}
        </p>
        {mapsUrl ? (
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[40px] items-center justify-center rounded-[0.95rem] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-primary-strong)] transition hover:bg-[var(--color-primary-soft)]"
            >
              Abrir en Google Maps
            </a>
            <a
              href={osmUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[40px] items-center justify-center rounded-[0.95rem] border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Abrir en mapa
            </a>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default MapPreview
