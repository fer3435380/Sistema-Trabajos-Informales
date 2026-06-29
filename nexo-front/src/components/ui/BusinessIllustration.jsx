function BusinessIllustration({ businessIcon }) {
  return (
    <div className="relative mx-auto h-[260px] w-[220px]">
      <div className="absolute right-[6px] top-[18px] h-[180px] w-[180px] rounded-full bg-[radial-gradient(circle_at_center,rgba(24,95,165,0.14),rgba(24,95,165,0.04)_60%,transparent_60%)]" />

      <div className="absolute left-[18px] top-[98px] h-[124px] w-[118px] rounded-[28px] border border-[var(--color-primary-border)] bg-[linear-gradient(180deg,#fefefe_0%,#f2f7fd_100%)] shadow-[0_16px_30px_rgba(4,44,83,0.08)]">
        <div className="space-y-3 px-4 py-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[10px] font-bold text-[var(--color-primary)]">
                ✓
              </span>
              <span className="h-2.5 flex-1 rounded-full bg-[#dbe7f4]" />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-[18px] right-[8px] h-[118px] w-[110px] rounded-t-[34px] rounded-bl-[26px] border border-[#9fc1ea] bg-[linear-gradient(180deg,#a8ccf6_0%,#7eb0e8_100%)] shadow-[0_18px_34px_rgba(24,95,165,0.12)]" />
      <div className="absolute bottom-[38px] right-[92px] h-[96px] w-[54px] rounded-t-[18px] border border-[#9fc1ea] bg-[linear-gradient(180deg,#dbeafe_0%,#bdd7f3_100%)]" />

      <div className="absolute bottom-[18px] right-[52px] flex h-[138px] w-[118px] items-center justify-center rounded-[34px] border border-white/80 bg-[linear-gradient(180deg,#f8fbff_0%,#eef5fd_100%)] shadow-[0_18px_36px_rgba(4,44,83,0.12)]">
        <img src={businessIcon} alt="Empresa" className="icon-primary h-14 w-14 object-contain" />
      </div>

      <div className="absolute bottom-[8px] left-[26px] h-[3px] w-[170px] rounded-full bg-[#5d7ea6]" />
    </div>
  )
}

export default BusinessIllustration
