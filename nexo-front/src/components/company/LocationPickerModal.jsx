import CompanyModalShell from './CompanyModalShell'
import { mockMapPoints } from '../../data/mockCompanyData'
import MapPreview from './MapPreview'

function LocationPickerModal({ isOpen, onClose, selectedPointId, onSelectPoint }) {
  const selectedPoint = mockMapPoints.find((point) => point.id === selectedPointId) ?? null

  return (
    <CompanyModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Elegir punto en mapa"
      description="Selecciona una ubicación mock para completar dirección, latitud y longitud."
      size="lg"
    >
      <div className="space-y-4">
        <MapPreview
          locationName={selectedPoint?.name}
          address={selectedPoint?.address}
          latitude={selectedPoint?.latitude}
          longitude={selectedPoint?.longitude}
        />

        <div className="space-y-3">
          {mockMapPoints.map((point) => {
            const isSelected = point.id === selectedPointId

            return (
              <button
                key={point.id}
                type="button"
                onClick={() => onSelectPoint(point)}
                className={`w-full rounded-[1.15rem] border p-4 text-left transition focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)] ${
                  isSelected
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)]'
                    : 'border-[var(--color-primary-border)] bg-white hover:border-[var(--color-primary)]'
                }`}
              >
                <p className="text-sm font-semibold text-[var(--color-primary-strong)]">
                  {point.name}
                </p>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">{point.address}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                  Lat {point.latitude} · Lng {point.longitude}
                </p>
              </button>
            )
          })}
        </div>
      </div>
    </CompanyModalShell>
  )
}

export default LocationPickerModal
