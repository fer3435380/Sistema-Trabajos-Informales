export function MissionVision() {
  return (
    <section className="border-y border-slate-200 bg-white/70">
      <div className="mx-auto grid w-full max-w-7xl gap-4 px-5 py-8 md:grid-cols-2 md:px-8 lg:px-10">
        <article className="grid gap-3 rounded-[28px] border border-slate-200 bg-slate-50 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--orange)]">
            Mision
          </p>
          <h2 className="text-2xl font-black text-slate-950">
            Conectar trabajo local con confianza
          </h2>
          <p className="text-sm leading-7 text-slate-600">
            Facilitar que personas y negocios encuentren apoyo informal de
            forma clara, rapida y organizada, manteniendo postulaciones y
            estados visibles desde una plataforma simple.
          </p>
        </article>
        <article className="grid gap-3 rounded-[28px] border border-amber-200 bg-amber-50 p-5 shadow-[0_18px_40px_rgba(251,114,22,0.1)]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--orange)]">
            Vision
          </p>
          <h2 className="text-2xl font-black text-slate-950">
            Una red laboral cercana y verificable
          </h2>
          <p className="text-sm leading-7 text-slate-600">
            Impulsar una comunidad donde publicar oportunidades, postular y
            gestionar decisiones sea accesible desde cualquier dispositivo,
            especialmente desde el telefono.
          </p>
        </article>
      </div>
    </section>
  );
}
