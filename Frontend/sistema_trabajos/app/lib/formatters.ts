export function formatMoney(value: string) {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
  }).format(Number(value));
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
