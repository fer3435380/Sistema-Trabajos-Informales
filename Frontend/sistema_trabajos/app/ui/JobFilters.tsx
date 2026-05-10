import type { Filters } from "../types/job";

type JobFiltersProps = {
  embedded?: boolean;
  filters: Filters;
  isLoading: boolean;
  onChange: (filters: Filters) => void;
  onRefresh: () => void;
};

export function JobFilters({
  embedded = false,
  filters,
  isLoading,
  onChange,
  onRefresh,
}: JobFiltersProps) {
  return (
    <div className={embedded ? "filter-panel-embedded" : "panel"}>
      <div className="panel-title">
        <div>
          <p className="eyebrow">Busqueda</p>
          <h2>Filtros</h2>
        </div>
        <button
          aria-label="Actualizar trabajos"
          className="icon-button"
          disabled={isLoading}
          onClick={onRefresh}
          title="Actualizar trabajos"
          type="button"
        >
          R
        </button>
      </div>

      <label>
        Texto
        <input
          onChange={(event) =>
            onChange({ ...filters, search: event.target.value })
          }
          placeholder="Ej. pintura"
          value={filters.search}
        />
      </label>
      <label>
        Tipo
        <input
          onChange={(event) =>
            onChange({ ...filters, type: event.target.value })
          }
          placeholder="Limpieza, reparacion..."
          value={filters.type}
        />
      </label>
      <label>
        Ubicacion
        <input
          onChange={(event) =>
            onChange({ ...filters, location: event.target.value })
          }
          placeholder="Quito, Guayaquil..."
          value={filters.location}
        />
      </label>
      <label>
        Estado
        <select
          onChange={(event) =>
            onChange({ ...filters, status: event.target.value })
          }
          value={filters.status}
        >
          <option value="">Todos</option>
          <option value="open">Abiertos</option>
          <option value="assigned">Asignados</option>
          <option value="closed">Cerrados</option>
        </select>
      </label>
    </div>
  );
}
