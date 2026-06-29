import FormField from '../auth/FormField'

function VideoResourceForm({ moduleDraft, onFieldChange, onVideoFileChange }) {
  return (
    <div className="space-y-4 rounded-[1.2rem] border border-[var(--color-primary-border)] bg-[var(--color-primary-softer)] p-4">
      <p className="text-sm font-semibold text-[var(--color-primary-strong)]">
        Campos del módulo de video
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          id="videoTitle"
          label="Título del video"
          value={moduleDraft.videoTitle}
          onChange={onFieldChange}
          placeholder="Nombre visible del video"
          required
        />
        <FormField
          id="videoDuration"
          label="Duración"
          value={moduleDraft.videoDuration}
          onChange={onFieldChange}
          placeholder="Ejemplo: 12 min"
          required
        />
        <div className="md:col-span-2">
          <FormField
            id="videoDescription"
            label="Descripción corta"
            value={moduleDraft.videoDescription}
            onChange={onFieldChange}
            placeholder="Qué verá o aprenderá la persona en este video"
            required
          />
        </div>
        <div className="md:col-span-2">
          <FormField
            id="videoResource"
            label="Archivo de video o URL del video"
            value={moduleDraft.videoResource}
            onChange={onFieldChange}
            placeholder="Pega una URL o sube un archivo mock"
            required
          />
          <label
            htmlFor="videoFile"
            className="mt-3 flex cursor-pointer items-center justify-center rounded-[1rem] border border-dashed border-[var(--color-primary-border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)]"
          >
            {moduleDraft.videoFileName || 'Seleccionar archivo de video mock'}
          </label>
          <input
            id="videoFile"
            type="file"
            accept="video/*"
            className="sr-only"
            onChange={onVideoFileChange}
          />
        </div>
        <div className="md:col-span-2">
          <FormField
            id="supportMaterial"
            label="Transcripción o material de apoyo opcional"
            value={moduleDraft.supportMaterial}
            onChange={onFieldChange}
            placeholder="Puedes dejar un resumen, texto guía o recurso opcional"
          />
        </div>
      </div>
    </div>
  )
}

export default VideoResourceForm
