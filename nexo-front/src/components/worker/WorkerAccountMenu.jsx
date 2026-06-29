function WorkerAccountMenu({
  workerProfile,
  onViewProfile,
  onEditProfile,
  onOpenSettings,
  onSwitchAccount,
  onLogout,
  onClose,
}) {
  const menuItems = [
    { id: 'profile', label: 'Ver perfil', onClick: onViewProfile },
    { id: 'edit', label: 'Editar perfil', onClick: onEditProfile },
    { id: 'settings', label: 'Configuración', onClick: onOpenSettings },
    { id: 'switch', label: 'Iniciar sesión con otra cuenta', onClick: onSwitchAccount },
    { id: 'logout', label: 'Cerrar sesión', onClick: onLogout, isDanger: true },
  ]

  return (
    <div className="absolute right-0 top-[calc(100%+0.75rem)] z-20 w-[min(92vw,20rem)] overflow-hidden rounded-[1.3rem] border border-[var(--color-primary-border)] bg-white shadow-[0_24px_42px_rgba(4,44,83,0.14)]">
      <div className="border-b border-[var(--color-primary-border)] px-4 py-4">
        <div className="flex items-center gap-3">
          <img
            src={workerProfile.profileImageSrc}
            alt={workerProfile.profileImageAlt}
            className="h-12 w-12 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--color-primary-strong)]">
              {workerProfile.name}
            </p>
            <p className="mt-1 truncate text-xs text-[var(--color-text-muted)]">
              {workerProfile.email}
            </p>
          </div>
        </div>
      </div>

      <div className="p-2">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                item.onClick()
                onClose()
              }}
              className={`flex min-h-[42px] w-full items-center rounded-[0.95rem] px-3 py-2 text-left text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)] ${
                item.isDanger
                  ? 'text-[var(--color-danger)] hover:bg-[var(--color-danger-soft)]'
                  : 'text-[var(--color-primary-strong)] hover:bg-[var(--color-primary-softer)]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WorkerAccountMenu
