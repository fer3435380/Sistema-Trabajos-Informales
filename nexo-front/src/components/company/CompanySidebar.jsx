import brandIcon from '../../assets/landing/nexotrabajo_icono.png'
import panelIcon from '../../assets/CompanyDashboard/panel.png'
import trabajosIcon from '../../assets/CompanyDashboard/trabajos.png'
import cursosIcon from '../../assets/CompanyDashboard/cursos.png'
import modulosIcon from '../../assets/CompanyDashboard/modulos.png'
import empresaIcon from '../../assets/CompanyDashboard/empresa.png'
import facturaIcon from '../../assets/CompanyDashboard/factura.png'
import configuracionIcon from '../../assets/CompanyDashboard/configuracion.png'
import soporteIcon from '../../assets/CompanyDashboard/soporte.png'
import postulacionesIcon from '../../assets/WorkerDashboard/postulaciones.png'
import SidebarSupportCard from '../layout/SidebarSupportCard'

const iconMap = {
  panel: { src: panelIcon },
  microjobs: { src: trabajosIcon },
  applicants: { src: postulacionesIcon, size: 'h-[19px] w-[19px]' },
  courses: { src: cursosIcon },
  modules: { src: modulosIcon, size: 'h-[19px] w-[19px]' },
  companyStatus: { src: empresaIcon, size: 'h-[19px] w-[19px]' },
  billing: { src: facturaIcon },
  configuration: { src: configuracionIcon, size: 'h-[19px] w-[19px]' },
}

function CompanySidebar({
  activeSection,
  navigationGroups,
  isCollapsed,
  isMobileOpen,
  onCloseMobileSidebar,
  onSelectSection,
}) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-[#041f3d]/45 transition lg:hidden ${
          isMobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden="true"
        onClick={onCloseMobileSidebar}
      />

      <aside
        className={`dashboard-sidebar fixed inset-y-0 left-0 z-50 flex w-[280px] max-w-[86vw] flex-col overflow-hidden bg-[var(--color-primary-strong)] px-3 py-4 text-white transition-transform duration-300 lg:relative lg:h-screen lg:shrink-0 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'lg:w-[96px]' : 'lg:w-[280px]'}`}
      >
        <div className="dashboard-sidebar-header flex items-center gap-3 border-b border-white/10 pb-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.1rem]">
            <img src={brandIcon} alt="NexoJobs" className="icon-light h-9 w-9 object-contain" />
          </div>
          {!isCollapsed ? (
            <div className="min-w-0">
              <p className="text-[1.8rem] font-bold tracking-[-0.06em] text-white">NexoJobs</p>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                Empresarial
              </p>
            </div>
          ) : null}
        </div>

        <div className="dashboard-sidebar-content mt-5 flex flex-1 flex-col justify-between">
          <nav
            className="dashboard-sidebar-nav space-y-6 pr-1"
            aria-label="Navegación de empresa"
          >
            {navigationGroups.map((group) => (
              <div key={group.label} className="dashboard-sidebar-group space-y-2.5">
                {!isCollapsed ? (
                  <p className="dashboard-sidebar-group-label px-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/52">
                    {group.label}
                  </p>
                ) : null}

                <div className="space-y-1.5">
                  {group.items.map((item) => {
                    const iconEntry = iconMap[item.icon]
                    const isActive = activeSection === item.id

                    return (
                      <button
                        key={item.id}
                        type="button"
                        title={item.label}
                        aria-current={isActive ? 'page' : undefined}
                        onClick={() => onSelectSection(item.id)}
                        className={`dashboard-sidebar-item flex min-h-[48px] w-full items-center rounded-[1rem] px-3.5 py-2.5 text-[13px] font-semibold transition focus:outline-none focus:ring-4 focus:ring-white/20 ${
                          isCollapsed ? 'justify-center' : 'gap-3'
                        } ${
                          isActive
                            ? 'bg-[linear-gradient(180deg,#1e6fd7_0%,#185fa5_100%)] text-white shadow-[0_16px_30px_rgba(6,18,42,0.28)]'
                            : 'text-white/76 hover:bg-white/8 hover:text-white'
                        }`}
                      >
                        {iconEntry ? (
                          <img
                            src={iconEntry.src}
                            alt=""
                            aria-hidden="true"
                            className={`${iconEntry.size ?? 'h-[18px] w-[18px]'} shrink-0 object-contain ${
                              isActive ? 'opacity-100' : 'opacity-75'
                            }`}
                          />
                        ) : null}
                        {!isCollapsed ? <span>{item.label}</span> : null}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          <SidebarSupportCard isCollapsed={isCollapsed} iconSrc={soporteIcon} />
        </div>

        <button
          type="button"
          onClick={onCloseMobileSidebar}
          className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-[1rem] border border-white/14 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/20 lg:hidden"
        >
          Cerrar menú
        </button>
      </aside>
    </>
  )
}

export default CompanySidebar
