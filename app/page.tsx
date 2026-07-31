import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Curriculum from "@/components/Curriculum";

export default function Home() {
  return (
    <main className="relative z-10">
      <Hero />
      <Marquee />
      <Curriculum />
    </main>
  );
}
