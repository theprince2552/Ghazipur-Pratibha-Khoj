import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Chairman from "../components/Chairman";
import About from "../components/About";
import Features from "../components/Features";
import Scholarship from "../components/Scholarship";
import PrizeSection from "../components/PrizeSection";
import Gallery from "../components/Gallery";
import RegistrationProcess from "../components/RegistrationProcess";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="bg-[#020617]">
      <Navbar />
      <Hero />
      <Chairman />
      <About />
      <Features />
      <Scholarship />
      <PrizeSection />
      <Gallery />
      <RegistrationProcess />
      <Contact />
      <Footer />
    </div> 
  );
}

export default Home;