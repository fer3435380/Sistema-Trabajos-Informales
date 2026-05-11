type MetricProps = {
  label: string;
  value: string;
};

export function Metric({ label, value }: MetricProps) {
  return (
    <div className="h-full rounded-[24px] border border-white/70 bg-white/90 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur">
      <span className="block text-3xl font-black leading-none text-[var(--blue)] sm:text-[2rem]">
        {value}
      </span>
      <small className="mt-2 block text-[11px] font-black uppercase tracking-[0.12em] text-slate-500 sm:text-xs sm:tracking-[0.16em]">
        {label}
      </small>
    </div>
  );
}
