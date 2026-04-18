import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight, Zap, Wifi, Recycle, Activity } from "lucide-react";
import hero1 from "@/assets/hero-1-iot-bins.jpg";
import hero2 from "@/assets/hero-2-citizens.jpg";
import hero3 from "@/assets/hero-3-cleancity.jpg";

const slides = [
  {
    image: hero1,
    badge: "Smart IoT-Powered Platform",
    title: ["IoT-Powered ", "Bin Monitoring"],
    accent: 0,
    subtitle: "Real-time fill-level sensors, smart alerts, and predictive analytics — eliminate guesswork and overflow forever.",
    cta: { label: "Explore Features", href: "#features" },
    secondary: { label: "See How It Works", href: "#how" },
  },
  {
    image: hero2,
    badge: "Connected Communities",
    title: ["Connecting ", "Citizens & Collectors"],
    accent: 1,
    subtitle: "Report issues, track resolutions, and manage pickups seamlessly — one platform for every stakeholder.",
    cta: { label: "Join Now", href: "/register" },
    secondary: { label: "See How It Works", href: "#how" },
  },
  {
    image: hero3,
    badge: "A Greener Tomorrow",
    title: ["Smart Waste for ", "Cleaner Cities"],
    accent: 0,
    subtitle: "Optimize routes, recycle smarter, and build sustainable cities with data-driven decisions.",
    cta: { label: "Get Started Free", href: "#contact" },
    secondary: { label: "See How It Works", href: "#how" },
  },
];

const FloatingIcon = ({ Icon, className, delay = 0 }: { Icon: typeof Zap; className: string; delay?: number }) => (
  <motion.div
    className={`absolute glass-dark rounded-2xl p-3 hidden md:flex ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8 }}
  >
    <div className="relative">
      <Icon className="h-6 w-6 text-primary-glow animate-float" />
    </div>
  </motion.div>
);

export const Hero = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6500);
    return () => clearInterval(t);
  }, []);

  const next = () => setIndex((i) => (i + 1) % slides.length);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  const slide = slides[index];

  return (
    <section id="home" className="relative h-screen min-h-[640px] w-full overflow-hidden">
      {/* Slides */}
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={slide.image}
            alt={slide.title.join("")}
            className="absolute inset-0 h-full w-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Floating tech elements */}
      <FloatingIcon Icon={Wifi} className="top-32 right-12 lg:right-32" delay={0.4} />
      <FloatingIcon Icon={Activity} className="bottom-40 right-20 lg:right-1/4" delay={0.6} />
      <FloatingIcon Icon={Recycle} className="top-1/2 right-8 lg:right-16" delay={0.8} />

      {/* Content */}
      <div className="relative z-10 container h-full flex items-center">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-2 glass-dark rounded-full px-4 py-2 mb-6">
                <Zap className="h-3.5 w-3.5 text-primary-glow fill-primary-glow" />
                <span className="text-xs md:text-sm font-medium text-white/90">{slide.badge}</span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold text-white leading-[1.05] mb-6">
                {slide.accent === 0 ? (
                  <>
                    <span className="text-gradient">{slide.title[0]}</span>
                    <span>{slide.title[1]}</span>
                  </>
                ) : (
                  <>
                    <span>{slide.title[0]}</span>
                    <span className="text-gradient">{slide.title[1]}</span>
                  </>
                )}
              </h1>

              <p className="text-lg md:text-xl text-white/80 max-w-xl mb-8 leading-relaxed">
                {slide.subtitle}
              </p>

              <div className="flex flex-wrap gap-4">
                <Button size="xl" variant="hero" asChild>
                  <a href={slide.cta.href}>
                    {slide.cta.label}
                    <ArrowRight className="ml-1" />
                  </a>
                </Button>
                <Button size="xl" variant="outlineLight" asChild>
                  <a href={slide.secondary.href}>{slide.secondary.label}</a>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full glass-dark text-white hover:bg-white/20 transition-smooth"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full glass-dark text-white hover:bg-white/20 transition-smooth"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-smooth ${
              i === index ? "w-10 bg-gradient-primary" : "w-2 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
};
