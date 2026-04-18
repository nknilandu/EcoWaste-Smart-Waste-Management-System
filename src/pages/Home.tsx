// import { Navbar } from "@/components/eco/Navbar";
import { Hero } from "@/components/eco/Hero";
import { Stats } from "@/components/eco/Stats";
import { About } from "@/components/eco/About";
import { Features } from "@/components/eco/Features";
import { HowItWorks } from "@/components/eco/HowItWorks";
import { Testimonials } from "@/components/eco/Testimonials";
import { Vision } from "@/components/eco/Vision";
import { Contact } from "@/components/eco/Contact";
import { FinalCTA } from "@/components/eco/FinalCTA";

const Index = () => {
  return (
    <main className="min-h-screen overflow-hidden bg-background">

      {/* Content */}
      <div className="relative z-10">
        <Hero />
        <Stats />
        <About />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Vision />
        <Contact />
        <FinalCTA />
      </div>

    </main>
  );
};

export default Index;
