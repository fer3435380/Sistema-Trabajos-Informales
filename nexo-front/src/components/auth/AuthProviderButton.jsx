import googleIcon from '../../assets/landing/icon_google.png'

function AuthProviderButton({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex w-full items-center justify-center gap-3 rounded-[1.35rem] border border-[var(--color-primary-border)] bg-white px-4 py-3.5 text-base font-semibold text-[var(--color-text)] transition hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-softer)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
    >
      <img
        src={googleIcon}
        alt=""
        aria-hidden="true"
        className="h-5 w-5 object-contain"
      />
      {children}
    </button>
  )
}

export default AuthProviderButton
