function WorkerDashboardShell({ sidebar, header, children }) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[var(--color-primary-softer)] text-[var(--color-text)] lg:h-screen lg:overflow-hidden">
      <div className="relative isolate min-h-screen lg:h-screen">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[linear-gradient(180deg,#ffffff_0%,#f4f7fb_100%)]" />
        <div className="pointer-events-none absolute left-[-90px] top-[80px] -z-10 h-[240px] w-[240px] rounded-full bg-[var(--color-primary-soft)] blur-3xl" />
        <div className="pointer-events-none absolute right-[-70px] top-[120px] -z-10 h-[220px] w-[220px] rounded-full bg-[var(--color-amber-soft)] blur-3xl" />

        <div className="mx-auto flex w-full max-w-[1600px] flex-col lg:h-screen lg:flex-row">
          {sidebar}

          <section className="flex-1 p-4 md:p-5 lg:h-screen lg:overflow-y-auto lg:p-6 xl:p-7">
            {header}
            <div className="mt-4">{children}</div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default WorkerDashboardShell
