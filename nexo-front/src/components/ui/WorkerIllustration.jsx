import profileMariaImage from '../../assets/landing/maria-profile.png'

function WorkerIllustration({ courseIcon, badgeIcon, locationIcon, starIcon }) {
  return (
    <div className="relative mx-auto h-[260px] w-[220px]">
      <div className="absolute bottom-0 left-0 right-0 h-[110px] rounded-[26px] border border-[var(--color-primary-border)] bg-[linear-gradient(180deg,#d8e9fb_0%,#c7dcf3_100%)] shadow-[0_16px_30px_rgba(24,95,165,0.12)]" />
      <div className="absolute bottom-[86px] left-1/2 h-[118px] w-[118px] -translate-x-1/2 overflow-hidden rounded-[34px] border-4 border-white bg-[#fff7eb] shadow-[0_18px_36px_rgba(4,44,83,0.12)]">
        <img
          src={profileMariaImage}
          alt="Trabajadora"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="absolute bottom-[26px] left-1/2 h-[18px] w-[170px] -translate-x-1/2 rounded-full bg-[#7aa7d4]" />

      <div className="absolute left-0 top-[54px] flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-primary-border)] bg-white shadow-sm">
        <img src={courseIcon} alt="" className="icon-primary h-5 w-5 object-contain" />
      </div>
      <div className="absolute left-[18px] top-[122px] flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-primary-border)] bg-white shadow-sm">
        <img src={locationIcon} alt="" className="icon-amber h-5 w-5 object-contain" />
      </div>
      <div className="absolute right-[12px] top-[34px] flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-primary-border)] bg-white shadow-sm">
        <img src={badgeIcon} alt="" className="icon-amber h-5 w-5 object-contain" />
      </div>
      <div className="absolute right-[30px] top-[112px] flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-primary-border)] bg-white shadow-sm">
        <img src={starIcon} alt="" className="icon-amber h-4 w-4 object-contain" />
      </div>
    </div>
  )
}

export default WorkerIllustration
