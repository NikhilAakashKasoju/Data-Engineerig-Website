import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Curriculum from "@/components/Curriculum";
import Phases from "@/components/Phases";
import Resources from "@/components/Resources";
import LiveClass from "@/components/LiveClass";
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
        <Phases />
        <Resources />
        <LiveClass />
        <Pricing />
        <Instructor />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
