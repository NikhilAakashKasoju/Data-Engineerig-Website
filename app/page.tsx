import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Curriculum from "@/components/Curriculum";
import Pricing from "@/components/Pricing";
import Instructor from "@/components/Instructor";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Marquee />
        <Curriculum />
        <Pricing />
        <Instructor />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
