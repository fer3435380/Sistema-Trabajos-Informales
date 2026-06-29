import { useMemo } from 'react'
import { workModeLabels } from '../../data/mockCompanyData'
import notificationIcon from '../../assets/CompanyDashboard/notificacion.png'
import { ChevronLeftDoubleIcon, ChevronRightDoubleIcon, MenuIcon } from './CompanyIcons'
import CompanyAccountMenu from './CompanyAccountMenu'
import CompanyNotificationsPanel from './CompanyNotificationsPanel'

function CompanyHeader({
  companyProfile,
  workMode,
  unreadNotifications,
  notifications,
  isNotificationPanelOpen,
  isAccountMenuOpen,
  isSidebarCollapsed,
  onToggleDesktopSidebar,
  onOpenMobileSidebar,
  onToggleNotifications,
  onCloseNotifications,
  onToggleAccountMenu,
  onCloseAccountMenu,
  onViewCompanyStatus,
  onEditProfile,
  onOpenSettings,
  onSwitchAccount,
  onLogout,
}) {
  const companyName = useMemo(
    () => companyProfile.commercialName || companyProfile.companyName,
    [companyProfile]
  )

  return (
    <header className="rounded-[1.45rem] border border-[var(--color-primary-border)] bg-white px-4 py-4 shadow-[0_18px_32px_rgba(4,44,83,0.05)] md:px-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            aria-label="Abrir menú lateral"
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] border border-[var(--color-primary-border)] bg-white text-[var(--color-primary)] shadow-[0_14px_24px_rgba(4,44,83,0.06)] transition hover:border-[var(--color-primary)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)] lg:hidden"
          >
            <MenuIcon className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={onToggleDesktopSidebar}
            aria-label={isSidebarCollapsed ? 'Expandir menú lateral' : 'Colapsar menú lateral'}
            className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] border border-[var(--color-primary-border)] bg-white text-[var(--color-primary)] shadow-[0_14px_24px_rgba(4,44,83,0.06)] transition hover:border-[var(--color-primary)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)] lg:inline-flex"
          >
            {isSidebarCollapsed ? (
              <ChevronRightDoubleIcon className="h-5 w-5" />
            ) : (
              <ChevronLeftDoubleIcon className="h-5 w-5" />
            )}
          </button>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[1.8rem] font-extrabold tracking-[-0.06em] text-[var(--color-primary-strong)] sm:text-[2.1rem]">
                Hola, {companyName}
              </h1>
              <span className="inline-flex rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
                {workModeLabels[workMode]}
              </span>
            </div>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
              Gestiona microtrabajos, cursos y postulantes desde un solo lugar.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2.5 sm:justify-start">
          <div className="relative">
              <button
                type="button"
                aria-label={`Notificaciones pendientes: ${unreadNotifications}`}
                onClick={onToggleNotifications}
                className="relative inline-flex h-12 w-12 items-center justify-center rounded-[1rem] border border-[var(--color-primary-border)] bg-white text-[var(--color-primary)] shadow-[0_14px_24px_rgba(4,44,83,0.06)] transition hover:border-[var(--color-primary)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
              >
                <img
                  src={notificationIcon}
                  alt=""
                  aria-hidden="true"
                  className="icon-primary h-5 w-5 object-contain"
                />
                {unreadNotifications > 0 ? (
                  <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-[var(--color-amber)]" />
                ) : null}
              </button>

              {isNotificationPanelOpen ? (
                <CompanyNotificationsPanel
                  notifications={notifications}
                  onClose={onCloseNotifications}
                />
              ) : null}
            </div>

          <div className="relative">
            <button
              type="button"
              onClick={onToggleAccountMenu}
              className="flex h-12 w-12 overflow-hidden rounded-full border border-[var(--color-primary-border)] bg-white shadow-[0_14px_24px_rgba(4,44,83,0.1)] transition hover:border-[var(--color-primary)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
              aria-label="Abrir menú de cuenta"
            >
              <img
                src={companyProfile.profileImageSrc}
                alt={companyProfile.profileImageAlt}
                className="h-full w-full object-cover"
              />
            </button>

            {isAccountMenuOpen ? (
              <CompanyAccountMenu
                profile={companyProfile}
                onViewCompanyStatus={onViewCompanyStatus}
                onEditProfile={onEditProfile}
                onOpenSettings={onOpenSettings}
                onSwitchAccount={onSwitchAccount}
                onLogout={onLogout}
                onClose={onCloseAccountMenu}
              />
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}

export default CompanyHeader
