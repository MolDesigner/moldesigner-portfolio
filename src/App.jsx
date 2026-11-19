import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import ProjectsBento from './components/ProjectsBento.jsx'
import TechStack from './components/TechStack.jsx'
import Education from './components/Education.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProjectsBento />
        <TechStack />
        <Education />
      </main>
      <Footer />
    </>
  )
}
