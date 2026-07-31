import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Curriculum from "@/components/Curriculum";
import Pricing from "@/components/Pricing";

export default function Home() {
  return (
    <main className="relative z-10">
      <Hero />
      <Marquee />
      <Curriculum />
      <Pricing />
    </main>
  );
}
