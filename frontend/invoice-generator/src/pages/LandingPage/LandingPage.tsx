import Header from "../../components/landing/Header"
import Hero from "../../components/landing/Hero"

const LandingPage = () => {
  return (
    <div className="text-gray-600 bg-[#ffffff]">
      <Header />
      <main>
        <Hero />
      </main>
    </div>
  )
}

export default LandingPage