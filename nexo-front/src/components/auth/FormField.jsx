function FormField({
  id,
  label,
  as = 'input',
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  inputMode,
  options = [],
  helperText,
  required = false,
  ...rest
}) {
  const baseClassName =
    'w-full rounded-[1.1rem] border border-[var(--color-primary-border)] bg-white px-4 py-3 text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-muted)]/80 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary-soft)]'

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-[var(--color-text)]">
        {label}
        {required ? <span className="ml-1 text-[var(--color-primary)]">*</span> : null}
      </label>
      {as === 'select' ? (
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
          aria-required={required}
          className={baseClassName}
          {...rest}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          required={required}
          aria-required={required}
          className={baseClassName}
          {...rest}
        />
      )}
      {helperText ? (
        <p className="text-sm text-[var(--color-text-muted)]">
          {helperText}
        </p>
      ) : null}
    </div>
  )
}

export default FormField
