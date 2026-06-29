function ExternalLinkIcon({ className = 'h-3.5 w-3.5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5h5v5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14 19 5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 13v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" />
    </svg>
  )
}

function SidebarSupportCard({ isCollapsed, iconSrc }) {
  if (isCollapsed) {
    return (
      <a
        href="mailto:soporte@nexojobs.ec?subject=Centro%20de%20soporte%20NexoJobs"
        className="dashboard-sidebar-support mt-4 inline-flex min-h-[52px] items-center justify-center rounded-[1rem] border border-white/12 bg-white/6 text-white/82 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/20"
        aria-label="Centro de soporte"
        title="Centro de soporte"
      >
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(24,95,165,0.32)] text-white">
          <img src={iconSrc} alt="" aria-hidden="true" className="h-4.5 w-4.5 object-contain" />
        </span>
      </a>
    )
  }

  return (
    <a
      href="mailto:soporte@nexojobs.ec?subject=Centro%20de%20soporte%20NexoJobs"
      className="dashboard-sidebar-support mt-4 flex items-center gap-3 rounded-[1rem] border border-white/12 bg-[rgba(10,41,78,0.45)] px-4 py-3 text-white transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/20"
    >
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(24,95,165,0.38)] text-white shadow-[0_8px_18px_rgba(4,44,83,0.18)]">
        <img src={iconSrc} alt="" aria-hidden="true" className="h-4.5 w-4.5 object-contain" />
      </span>
      <span className="dashboard-sidebar-support-copy min-w-0 flex-1">
        <span className="dashboard-sidebar-support-label block text-xs font-semibold text-white/76">¿Necesitas ayuda?</span>
        <span className="dashboard-sidebar-support-link mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-white">
          Centro de soporte
          <ExternalLinkIcon />
        </span>
      </span>
    </a>
  )
}

export default SidebarSupportCard
