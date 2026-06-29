function iconClassName(className) {
  return className || 'h-5 w-5'
}

export function MenuIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={iconClassName(className)}>
      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

export function ChevronLeftDoubleIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={iconClassName(className)}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m13.5 6-6 6 6 6M19.5 6l-6 6 6 6" />
    </svg>
  )
}

export function ChevronRightDoubleIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={iconClassName(className)}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 6 6 6-6 6M4.5 6l6 6-6 6" />
    </svg>
  )
}

export function BellIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={iconClassName(className)}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 20a2.5 2.5 0 0 0 5 0M6 16.5h12l-1.1-1.3c-.7-.9-1.1-2-1.1-3.1v-1a3.8 3.8 0 1 0-7.6 0v1c0 1.1-.4 2.2-1.1 3.1L6 16.5Z" />
    </svg>
  )
}

export function HomeIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={iconClassName(className)}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 10.5 7.5-6 7.5 6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 9.8v8.2h4.9V13h1.2v5h4.9V9.8" />
    </svg>
  )
}

export function MicrojobsIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={iconClassName(className)}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6h4m-8 4h12M7.5 18.5h9a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-9a2 2 0 0 0-2 2v6.5a2 2 0 0 0 2 2Zm1-10V6.8A2.8 2.8 0 0 1 11.3 4h1.4a2.8 2.8 0 0 1 2.8 2.8v1.7" />
    </svg>
  )
}

export function ApplicantsIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={iconClassName(className)}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM16.2 12.2a2.7 2.7 0 1 0 0-5.4M4.8 19a5 5 0 0 1 6.4-4.8m2.2 4.8a4.2 4.2 0 0 1 6.4-3.4" />
    </svg>
  )
}

export function CoursesIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={iconClassName(className)}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 7.5 12 4l6.5 3.5L12 11 5.5 7.5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 12 12 15.5 18.5 12M5.5 16.5 12 20l6.5-3.5" />
    </svg>
  )
}

export function ModulesIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={iconClassName(className)}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.5h5.5V12H6V6.5Zm6.5 0H18v5.5h-5.5V6.5ZM6 13.5h5.5V19H6v-5.5Zm6.5 2.7H18" />
    </svg>
  )
}

export function ProfileStatusIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={iconClassName(className)}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 19.5h13M6.5 16V7.8a1.8 1.8 0 0 1 1.8-1.8h7.4a1.8 1.8 0 0 1 1.8 1.8V16M9 10.5h6M9 13.8h4.2" />
    </svg>
  )
}

export function BillingIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={iconClassName(className)}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 5.5h9A2.5 2.5 0 0 1 19 8v8A2.5 2.5 0 0 1 16.5 18.5h-9A2.5 2.5 0 0 1 5 16V8A2.5 2.5 0 0 1 7.5 5.5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.7 12a1.7 1.7 0 1 1-3.4 0 1.7 1.7 0 0 1 3.4 0ZM7.8 9.5h1.7M14.5 14.5h1.7" />
    </svg>
  )
}

export function SettingsIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={iconClassName(className)}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 12a7.8 7.8 0 0 0-.1-1.3l1.8-1.4-1.8-3.1-2.2.9a8 8 0 0 0-2.2-1.3l-.3-2.3h-3.6l-.3 2.3a8 8 0 0 0-2.2 1.3l-2.2-.9-1.8 3.1 1.8 1.4A7.8 7.8 0 0 0 5 12c0 .4 0 .9.1 1.3l-1.8 1.4 1.8 3.1 2.2-.9a8 8 0 0 0 2.2 1.3l.3 2.3h3.6l.3-2.3a8 8 0 0 0 2.2-1.3l2.2.9 1.8-3.1-1.8-1.4c.1-.4.1-.9.1-1.3Z" />
    </svg>
  )
}

export function LocationPinIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={iconClassName(className)}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20s6-4.6 6-10a6 6 0 1 0-12 0c0 5.4 6 10 6 10Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z" />
    </svg>
  )
}

export function CalendarTaskIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={iconClassName(className)}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 4.5v3M16.5 4.5v3M5.5 8h13M6.8 20h10.4A1.8 1.8 0 0 0 19 18.2V7.8A1.8 1.8 0 0 0 17.2 6H6.8A1.8 1.8 0 0 0 5 7.8v10.4A1.8 1.8 0 0 0 6.8 20Z" />
    </svg>
  )
}

export function ChartIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={iconClassName(className)}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 18.5V12M11.5 18.5V8M17.5 18.5V5.5M4 18.5h15.5" />
    </svg>
  )
}

export function CheckCircleIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={iconClassName(className)}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.8 12.2 2.1 2.1 4.3-4.8" />
    </svg>
  )
}

export function CloseCircleIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={iconClassName(className)}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m9.5 9.5 5 5m0-5-5 5" />
    </svg>
  )
}

export function ArrowRightIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={iconClassName(className)}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function UploadIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={iconClassName(className)}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v10M8.5 8 12 4.5 15.5 8M6.5 18.5h11" />
    </svg>
  )
}
