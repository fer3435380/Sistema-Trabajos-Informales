type MetricProps = {
  label: string;
  value: string;
};

export function Metric({ label, value }: MetricProps) {
  return (
    <div className="metric">
      <span>{value}</span>
      <small>{label}</small>
    </div>
  );
}
