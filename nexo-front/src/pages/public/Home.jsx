import Header from '../../components/layout/Header'
import Hero from '../../components/sections/Hero'
import HowItWorks from '../../components/sections/HowItWorks'
import WhyChooseSection from '../../components/sections/WhyChooseSection'
import Footer from '../../components/layout/Footer'

function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--color-primary-softer)] text-[var(--color-text)]">
      <div className="relative isolate">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] bg-white" />
        <div className="pointer-events-none absolute left-[-80px] top-[70px] -z-10 h-[260px] w-[260px] rounded-full bg-[#d7e8f8]/75 blur-3xl" />
        <div className="pointer-events-none absolute right-[-120px] top-[90px] -z-10 h-[340px] w-[340px] rounded-full bg-[#f5e8cf]/80 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[760px] bg-[linear-gradient(180deg,#ffffff_0%,#f4f7fb_72%,#f4f7fb_100%)]" />

        <Header />

        <main className="pt-[84px]">
          <Hero />
          <HowItWorks />
          <WhyChooseSection />
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default Home