import supportIcon from '../../assets/landing/apoyo.png'
import ratingStarIcon from '../../assets/landing/estrella.png'
import filledStarIcon from '../../assets/landing/hero-rating-star.png'
import flexibilityIcon from '../../assets/landing/reloj.png'
import impactIcon from '../../assets/landing/responsabilidad.png'
import shieldIcon from '../../assets/landing/verificar.png'
import personaH1Image from '../../assets/landing/persona_h1.jpg'
import personaH2Image from '../../assets/landing/persona_h2.jpg'
import personaH3Image from '../../assets/landing/persona_h3.jpg'
import personaH4Image from '../../assets/landing/persona_h4.jpg'
import personaM1Image from '../../assets/landing/persona_m1.jpg'
import personaM2Image from '../../assets/landing/persona_m2.jpg'
import personaM3Image from '../../assets/landing/persona_m3.jpg'
import personaM4Image from '../../assets/landing/persona_m4.jpg'
import personaM5Image from '../../assets/landing/persona_m5.jpg'
import ReasonCard from '../ui/ReasonCard'
import StoryCarousel from '../ui/StoryCarousel'

const starSet = Array.from({ length: 5 }, () => filledStarIcon)

const reasons = [
  {
    icon: shieldIcon,
    title: 'Seguro y confiable',
    description: 'Pagos protegidos y un entorno justo para personas y negocios.',
    tone: 'blue',
    delayClass: 'section-delay-1',
  },
  {
    icon: ratingStarIcon,
    title: 'Reputación que abre puertas',
    description: 'Cada tarea bien hecha fortalece tu perfil y genera nuevas oportunidades.',
    tone: 'blue',
    delayClass: 'section-delay-2',
  },
  {
    icon: supportIcon,
    title: 'Acompañamiento cercano',
    description: 'La plataforma guía cada paso para que crecer se sienta posible.',
    tone: 'blue',
    delayClass: 'section-delay-3',
  },
  {
    icon: flexibilityIcon,
    title: 'Flexibilidad real',
    description: 'Puedes aprender, postular y trabajar según tu tiempo y contexto.',
    tone: 'blue',
    delayClass: 'section-delay-1',
  },
  {
    icon: impactIcon,
    title: 'Impacto en comunidad',
    description: 'Cada conexión impulsa ingresos, negocios locales y confianza compartida.',
    tone: 'blue',
    delayClass: 'section-delay-2',
  },
]

const stories = [
  {
    image: personaM1Image,
    name: 'Ana G.',
    city: 'Quito',
    role: 'Madre y trabajadora independiente',
    quote:
      'Con los cursos cortos empecé a ofrecer apoyo administrativo desde casa y ahora tengo ingresos estables para mi familia.',
    stars: starSet,
  },
  {
    image: personaH1Image,
    name: 'Luis M.',
    city: 'Guayaquil',
    role: 'Joven en búsqueda de experiencia',
    quote:
      'Encontré tareas cerca de mi barrio y pude ganar experiencia sin gastar en traslados largos todos los días.',
    stars: starSet,
  },
  {
    image: personaM2Image,
    name: 'Karla R.',
    city: 'Cuenca',
    role: 'Estudiante universitaria',
    quote:
      'NexoTrabajo me ayudó a aprender herramientas útiles y a construir un perfil que hoy sí muestra lo que sé hacer.',
    stars: starSet,
  },
  {
    image: personaH2Image,
    name: 'Miguel P.',
    city: 'Manta',
    role: 'Dueño de tienda de barrio',
    quote:
      'Publiqué una necesidad puntual y encontré apoyo confiable en poco tiempo para organizar pedidos y atención.',
    stars: starSet,
  },
  {
    image: personaM3Image,
    name: 'Daniela S.',
    city: 'Loja',
    role: 'Emprendedora local',
    quote:
      'Pude delegar tareas repetitivas y eso me dio más tiempo para enfocarme en vender y hacer crecer mi negocio.',
    stars: starSet,
  },
  {
    image: personaH3Image,
    name: 'Jorge T.',
    city: 'Ambato',
    role: 'Padre de familia',
    quote:
      'Las oportunidades por disponibilidad me permitieron trabajar por horas y equilibrar mejor mi tiempo en casa.',
    stars: starSet,
  },
  {
    image: personaM4Image,
    name: 'Pamela C.',
    city: 'Santo Domingo',
    role: 'Apoyo administrativo',
    quote:
      'Gracias a la reputación que fui construyendo, hoy me recomiendan más y consigo tareas con mayor frecuencia.',
    stars: starSet,
  },
  {
    image: personaH4Image,
    name: 'Roberto V.',
    city: 'Portoviejo',
    role: 'Microempresario',
    quote:
      'Encontré personas capacitadas para tareas operativas sin procesos complicados ni tiempos perdidos.',
    stars: starSet,
  },
  {
    image: personaM5Image,
    name: 'Valeria N.',
    city: 'Ibarra',
    role: 'Bachiller recién graduada',
    quote:
      'Comencé con tareas pequeñas, gané confianza y ahora siento que sí tengo una puerta real para empezar a trabajar.',
    stars: starSet,
  },
]

function WhyChooseSection() {
  return (
    <section
      id="stories"
      className="scroll-mt-24 px-4 pb-18 sm:px-6 lg:px-8 lg:pb-24"
    >
      <div className="mx-auto max-w-[1320px]">
        <div className="animate-section-rise rounded-[34px] border border-[var(--color-primary-border)] bg-white/92 px-4 py-6 shadow-[0_24px_60px_rgba(4,44,83,0.08)] backdrop-blur sm:px-6 sm:py-8 xl:px-8 xl:py-9">
          <div className="text-center">
            <h2 className="mx-auto max-w-[16ch] text-[2rem] font-extrabold leading-[1.02] tracking-[-0.06em] text-[var(--color-primary-strong)] sm:text-[2.6rem]">
              ¿Por qué elegir NexoTrabajo?
            </h2>
            <p className="mx-auto mt-3 max-w-3xl text-[15px] leading-7 text-[var(--color-text-muted)] sm:text-[17px]">
              Una plataforma pensada para conectar talento, confianza y oportunidades
              reales en cada etapa del camino.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {reasons.map((reason) => (
              <ReasonCard key={reason.title} {...reason} />
            ))}
          </div>

          <div className="mt-10 border-t border-[var(--color-primary-border)] pt-10">
            <div className="text-center">
              <h2 className="mx-auto max-w-[13ch] text-[2rem] font-extrabold leading-[1.02] tracking-[-0.06em] text-[var(--color-primary-strong)] sm:text-[2.55rem]">
                Historias que inspiran
              </h2>
              <p className="mx-auto mt-3 max-w-3xl text-[15px] leading-7 text-[var(--color-text-muted)] sm:text-[17px]">
                Nueve experiencias que muestran cómo aprender, trabajar y colaborar
                puede transformar la vida de personas y negocios.
              </p>
            </div>

            <StoryCarousel stories={stories} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyChooseSection
