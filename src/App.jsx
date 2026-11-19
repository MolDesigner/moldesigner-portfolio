import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import SobreMi from './components/SobreMi.jsx'
import Cita from './components/Cita.jsx'
import ProjectsBento from './components/ProjectsBento.jsx'
import TechStack from './components/TechStack.jsx'
import Education from './components/Education.jsx'
import Logros from './components/Logros.jsx'
import Carteles from './components/Carteles.jsx'
import Galeria from './components/Galeria.jsx'
import Divulgacion from './components/Divulgacion.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Cita />
        <SobreMi />
        <ProjectsBento />
        <Carteles />
        <TechStack />
        <Education />
        <Logros />
        <Divulgacion />
        <Galeria />
      </main>
      <Footer />
    </>
  )
}
