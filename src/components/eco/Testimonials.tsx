import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const testimonials = [
  { quote: "EcoWaste reduced our waste collection costs by 35% in just six months. The real-time monitoring is incredible.", name: "Sarah Johnson", role: "City Manager, Dhaka North", avatar: "https://i.pravatar.cc/120?img=47" },
  { quote: "The IoT simulation gives us actionable data. We can predict when bins will be full before it becomes a problem.", name: "Mike Rahman", role: "Environmental Officer", avatar: "https://i.pravatar.cc/120?img=12" },
  { quote: "Reporting bin issues is now effortless. I love the transparency and getting notified when complaints are resolved.", name: "Lisa Ahmed", role: "Citizen, Gulshan", avatar: "https://i.pravatar.cc/120?img=49" },
  { quote: "The collector dashboard makes my job so much easier. I know exactly where to go and what needs attention.", name: "Karim Hassan", role: "Waste Collector", avatar: "https://i.pravatar.cc/120?img=15" },
  { quote: "Finally, a platform that takes recycling seriously. Our neighborhood feels cleaner every single week.", name: "Priya Sharma", role: "Community Leader", avatar: "https://i.pravatar.cc/120?img=32" },
  { quote: "The analytics dashboard is gorgeous and actually useful. We base every route decision on EcoWaste data now.", name: "David Chen", role: "Operations Director", avatar: "https://i.pravatar.cc/120?img=33" },
  { quote: "Citizen engagement jumped 60% after we rolled this out. People love seeing their reports get fixed in real time.", name: "Aisha Khan", role: "Mayor's Office Advisor", avatar: "https://i.pravatar.cc/120?img=44" },
  { quote: "Setup was painless and the team is responsive. Our smart bins were live within a week of signing up.", name: "Tomás Rivera", role: "IT Lead, Municipality", avatar: "https://i.pravatar.cc/120?img=53" },
  { quote: "We cut overflow incidents by 80%. The predictive alerts are a game changer for waste planning.", name: "Nadia Iqbal", role: "Sustainability Lead", avatar: "https://i.pravatar.cc/120?img=45" },
  { quote: "Love how the app feels — clean, fast, and built for people who actually do the work on the ground.", name: "Marco Bianchi", role: "Field Supervisor", avatar: "https://i.pravatar.cc/120?img=68" },
];

export const Testimonials = () => {
  const isMobile = useIsMobile();
  const [perView, setPerView] = useState(4);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setPerView(w < 640 ? 1 : w < 1024 ? 2 : 4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const totalPages = Math.ceil(testimonials.length / perView);

  useEffect(() => {
    setPage(0);
  }, [perView]);

  useEffect(() => {
    const id = setInterval(() => setPage((p) => (p + 1) % totalPages), 5000);
    return () => clearInterval(id);
  }, [totalPages]);

  const visible = testimonials.slice(page * perView, page * perView + perView);
  // Pad last page if needed
  while (visible.length < perView && testimonials.length >= perView) {
    visible.push(testimonials[visible.length % testimonials.length]);
  }

  return (
    <section className="bg-secondary/40 py-24 md:py-32 overflow-hidden">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Loved by <span className="text-gradient">Communities</span>
          </h2>
          <p className="text-lg text-muted-foreground">Real stories from real people building cleaner cities.</p>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`grid gap-5 ${perView === 1 ? "grid-cols-1" : perView === 2 ? "grid-cols-2" : "grid-cols-4"}`}
            >
              {visible.map((t, i) => (
                <div
                  key={`${page}-${i}`}
                  className="glass rounded-2xl p-6 shadow-soft hover:shadow-elevated hover:-translate-y-1.5 transition-smooth flex flex-col"
                >
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, n) => (
                      <Star key={n} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/85 leading-relaxed mb-6 flex-1">"{t.quote}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border/60">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      loading="lazy"
                      width={48}
                      height={48}
                      className="h-11 w-11 rounded-full object-cover ring-2 ring-primary/20"
                    />
                    <div>
                      <div className="font-semibold text-sm">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={() => setPage((p) => (p - 1 + totalPages) % totalPages)}
              className="h-10 w-10 rounded-full bg-card border border-border shadow-soft hover:shadow-glow hover:border-primary transition-smooth flex items-center justify-center"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  aria-label={`Go to page ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === page ? "w-8 bg-gradient-primary" : "w-2 bg-border hover:bg-primary/40"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setPage((p) => (p + 1) % totalPages)}
              className="h-10 w-10 rounded-full bg-card border border-border shadow-soft hover:shadow-glow hover:border-primary transition-smooth flex items-center justify-center"
              aria-label="Next testimonials"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
