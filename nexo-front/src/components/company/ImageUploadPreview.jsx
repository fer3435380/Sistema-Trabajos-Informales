import { UploadIcon } from './CompanyIcons'

function ImageUploadPreview({
  id,
  label,
  helperText,
  previewSrc,
  fileName,
  onFileChange,
  accept = 'image/*',
}) {
  return (
    <div className="space-y-3">
      <label htmlFor={id} className="block text-sm font-semibold text-[var(--color-text)]">
        {label}
      </label>
      <label
        htmlFor={id}
        className="flex min-h-[176px] cursor-pointer flex-col items-center justify-center rounded-[1.3rem] border border-dashed border-[var(--color-primary-border)] bg-[var(--color-primary-softer)] px-5 py-6 text-center transition hover:border-[var(--color-primary)]"
      >
        {previewSrc ? (
          <img
            src={previewSrc}
            alt={fileName || label}
            className="h-28 w-full rounded-[1rem] object-cover"
          />
        ) : (
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
            <UploadIcon className="h-5 w-5" />
          </div>
        )}
        <p className="mt-4 text-sm font-semibold text-[var(--color-primary-strong)]">
          {fileName || 'Seleccionar archivo'}
        </p>
        <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
          {helperText}
        </p>
      </label>
      <input id={id} type="file" accept={accept} className="sr-only" onChange={onFileChange} />
    </div>
  )
}

export default ImageUploadPreview
