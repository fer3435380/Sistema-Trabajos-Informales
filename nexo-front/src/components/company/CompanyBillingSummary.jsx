function BillingRow({ label, value }) {
  return (
    <div className="rounded-[1.2rem] border border-[var(--color-primary-border)] bg-white p-4 shadow-[0_16px_26px_rgba(4,44,83,0.04)]">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-[var(--color-primary-strong)]">{value}</p>
    </div>
  )
}

function CompanyBillingSummary({ profile }) {
  return (
    <section className="space-y-4">
      <div className="rounded-[1.45rem] border border-[var(--color-primary-border)] bg-white p-5 shadow-[0_18px_32px_rgba(4,44,83,0.05)]">
        <p className="text-sm font-semibold text-[var(--color-primary)]">Facturación</p>
        <h2 className="mt-1 text-[1.55rem] font-extrabold tracking-[-0.05em] text-[var(--color-primary-strong)]">
          Consulta la información que se usará para facturación.
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <BillingRow
          label="Nombre completo o razón social para facturación"
          value={profile.billingName}
        />
        <BillingRow
          label="RUC o identificación de facturación"
          value={profile.billingIdentification}
        />
        <BillingRow label="Correo de facturación" value={profile.billingEmail} />
        <BillingRow label="Dirección fiscal" value={profile.billingAddress} />
        <BillingRow
          label="Método de pago preferido"
          value={profile.preferredPaymentMethod}
        />
      </div>
    </section>
  )
}

export default CompanyBillingSummary
