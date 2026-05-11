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
    <div
      className={
        embedded
          ? "grid gap-4"
          : "grid gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)]"
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--orange)]">
            Busqueda
          </p>
          <h2 className="text-xl font-black text-slate-950">Filtros</h2>
        </div>
        <button
          aria-label="Actualizar trabajos"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-sm font-black text-slate-600 transition hover:bg-slate-200 disabled:opacity-60"
          disabled={isLoading}
          onClick={onRefresh}
          title="Actualizar trabajos"
          type="button"
        >
          R
        </button>
      </div>

      <label className="grid gap-2 text-sm font-extrabold text-slate-700">
        Texto
        <input
          className="min-h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:text-sm"
          onChange={(event) =>
            onChange({ ...filters, search: event.target.value })
          }
          placeholder="Ej. pintura"
          value={filters.search}
        />
      </label>
      <label className="grid gap-2 text-sm font-extrabold text-slate-700">
        Tipo
        <input
          className="min-h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:text-sm"
          onChange={(event) =>
            onChange({ ...filters, type: event.target.value })
          }
          placeholder="Limpieza, reparacion..."
          value={filters.type}
        />
      </label>
      <label className="grid gap-2 text-sm font-extrabold text-slate-700">
        Ubicacion
        <input
          className="min-h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:text-sm"
          onChange={(event) =>
            onChange({ ...filters, location: event.target.value })
          }
          placeholder="Quito, Guayaquil..."
          value={filters.location}
        />
      </label>
      <label className="grid gap-2 text-sm font-extrabold text-slate-700">
        Estado
        <select
          className="min-h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:text-sm"
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
