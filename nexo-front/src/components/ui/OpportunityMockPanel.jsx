import { Link } from 'react-router-dom'
import businessIllustration from '../../assets/landing/nexotrabajo_ilustracion_empresa.png'
import businessCheckIcon from '../../assets/landing/marca-de-verificacion-empresa.png'
import workerCheckIcon from '../../assets/landing/marca-de-verificacion-trabajador.png'
import workerIllustration from '../../assets/landing/nexotrabajo_ilustracion_trabajadora.png'

function OpportunityMockPanel({
  sectionId,
  title,
  description,
  features,
  actionLabel,
  imageSide = 'left',
  accent = 'amber',
}) {
  const isWorker = accent === 'amber'
  const isLeft = imageSide === 'left'

  const panelBorderClass = isWorker
    ? 'border-[#f2d9ab]'
    : 'border-[#cfe0f2]'

  const imageBackdropClass = isWorker
    ? 'bg-[radial-gradient(circle_at_top_left,rgba(235,169,47,0.12),transparent_58%)]'
    : 'bg-[radial-gradient(circle_at_top_left,rgba(24,95,165,0.10),transparent_58%)]'

  const titleWidthClass = isWorker ? 'max-w-[14ch]' : 'max-w-none'
  const titleLayoutClass = isWorker ? '' : 'xl:whitespace-nowrap xl:text-[2rem]'
  const descriptionWidthClass = isWorker ? 'max-w-[33ch]' : 'max-w-[38ch]'
  const textColumnClass = isLeft ? 'xl:col-start-2' : 'xl:col-start-1'
  const mediaColumnClass = isLeft ? 'xl:col-start-1' : 'xl:col-start-2'
  const illustrationImage = isWorker ? workerIllustration : businessIllustration
  const featureIconImage = isWorker ? workerCheckIcon : businessCheckIcon
  const actionHref = isWorker ? '/register/worker' : '/register/company'

  return (
    <article
      id={sectionId}
      className={`relative h-full overflow-hidden rounded-[26px] border bg-white/98 px-4 py-5 sm:px-5 sm:py-6 xl:px-6 xl:py-6 ${panelBorderClass}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.82),transparent_48%)]" />
      <div className="pointer-events-none absolute right-7 top-14 h-16 w-16 bg-[radial-gradient(rgba(235,169,47,0.16)_1.2px,transparent_1.2px)] bg-[length:12px_12px] opacity-60" />

      <div
        className={`relative flex h-full flex-col gap-5 xl:grid xl:h-full xl:grid-rows-[auto_1fr] xl:gap-x-8 xl:gap-y-4 ${
          isLeft
            ? 'xl:grid-cols-[240px_minmax(0,1fr)]'
            : 'xl:grid-cols-[minmax(0,1fr)_240px]'
        }`}
      >
        <div className={`${textColumnClass} order-1 xl:row-start-1`}>
          <h3 className={`${titleWidthClass} ${titleLayoutClass} text-[1.85rem] font-extrabold leading-[1.02] tracking-[-0.055em] text-[var(--color-primary-strong)] sm:text-[2.05rem] xl:text-[2.18rem]`}>
            {title}
          </h3>

          <p className={`${descriptionWidthClass} mt-2 text-[14px] leading-6 text-[var(--color-text-muted)] sm:text-[15px]`}>
            {description}
          </p>
        </div>

        <div
          className={`${mediaColumnClass} order-2 flex items-start justify-center xl:row-start-2 xl:pt-1`}
        >
          <div
            className={`mx-auto flex h-[230px] w-full max-w-[230px] items-center justify-center rounded-[24px] ${imageBackdropClass}`}
          >
            <div className="overflow-hidden rounded-[28px] bg-white/40 shadow-[0_14px_32px_rgba(24,95,165,0.06)] ring-1 ring-white/35 backdrop-blur-[1px]">
              <img
                src={illustrationImage}
                alt=""
                className="h-auto max-h-[208px] w-auto max-w-[208px] rounded-[28px] object-contain"
              />
            </div>
          </div>
        </div>

        <div
          className={`${textColumnClass} order-3 flex min-w-0 flex-col xl:row-start-2 xl:min-h-[318px]`}
        >
          <div className="grid content-start gap-3 xl:flex-1">
            {features.map((feature) => (
              <div
                key={feature}
                className="flex min-h-[54px] items-center gap-3.5 rounded-[13px] border border-[var(--color-primary-border)] bg-white px-4 py-2.5 shadow-[0_8px_18px_rgba(4,44,83,0.04)]"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                  <img
                    src={featureIconImage}
                    alt=""
                    className="h-6 w-6 object-contain"
                  />
                </div>
                <p className="text-[14px] font-semibold leading-5 text-[var(--color-primary-strong)] sm:text-[15px]">
                  {feature}
                </p>
              </div>
            ))}
          </div>

          <Link
            to={actionHref}
            className="mt-5 inline-flex min-h-[54px] w-full items-center justify-center gap-3 self-start rounded-[14px] bg-[var(--color-primary)] px-5 py-3.5 text-[15px] font-semibold text-white shadow-[0_16px_28px_rgba(24,95,165,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--color-primary-strong)] sm:w-[252px]"
          >
            {actionLabel}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </article>
  )
}

export default OpportunityMockPanel
