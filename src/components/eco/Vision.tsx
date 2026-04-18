import { motion } from "framer-motion";
import { Sprout, Recycle, Building2, ArrowRight } from "lucide-react";
import recyclingImg from "@/assets/vision-recycling.jpg";
import compostImg from "@/assets/vision-compost.jpg";
import hubImg from "@/assets/vision-hub.jpg";

const pillars = [
  { icon: Sprout, title: "Organic → Fertilizer", desc: "Convert food and garden waste into rich compost for urban farms.", year: "2026" },
  { icon: Recycle, title: "Plastic Recycling Hub", desc: "Closed-loop plastic processing turning bottles into new products.", year: "2027" },
  { icon: Building2, title: "Smart Waste Hubs", desc: "AI-powered neighborhood centers for sorting and resource recovery.", year: "2028" },
];

export const Vision = () => {
  return (
    <section id="vision" className="relative container py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 opacity-60 pointer-events-none" />

      <div className="relative grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* LEFT — Bento collage */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="absolute -inset-6 bg-gradient-primary opacity-10 blur-3xl rounded-full " />
          

          <div className="relative grid grid-cols-6 grid-rows-6 gap-3 md:gap-4 h-[460px] md:h-[560px]">
            {/* Large recycling image */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="col-span-4 row-span-6 relative rounded-3xl overflow-hidden shadow-elevated group"
            >
              <img
                src={recyclingImg}
                alt="Modern plastic recycling facility"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
                width={1024}
                height={1280}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-[10px] font-bold tracking-widest uppercase opacity-80 mb-1">Phase 02</div>
                <div className="font-display font-bold text-lg">Plastic Recycling</div>
              </div>
            </motion.div>

            {/* Compost top right */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.4 }}
              className="col-span-2 row-span-3 relative rounded-3xl overflow-hidden shadow-elevated group"
            >
              <img
                src={compostImg}
                alt="Organic compost with growing sprouts"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
                width={1024}
                height={768}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-3 text-white">
                <div className="font-display font-bold text-sm">Compost</div>
              </div>
            </motion.div>

            {/* Hub bottom right */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.4 }}
              className="col-span-2 row-span-3 relative rounded-3xl overflow-hidden shadow-elevated group"
            >
              <img
                src={hubImg}
                alt="Futuristic smart waste hub"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
                width={1024}
                height={768}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-3 text-white">
                <div className="font-display font-bold text-sm">Smart Hubs</div>
              </div>
            </motion.div>
          </div>

          {/* Floating badge */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-4 -left-2 md:-left-4 glass rounded-2xl px-4 py-3 shadow-elevated flex items-center gap-2 z-10"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Recycle className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Goal</div>
              <div className="text-sm font-bold">Zero Landfill 2030</div>
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT — Roadmap */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4">
              Future Vision
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight mb-6">
              Closing the loop on <span className="text-gradient">urban waste</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              EcoWaste isn't just smart bins. It's a roadmap to circular cities — where every banana peel and plastic bottle becomes the next useful resource.
            </p>
          </motion.div>

          <div className="space-y-4">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="group relative flex gap-4 rounded-2xl bg-card border border-border/60 p-5 shadow-soft hover:shadow-glow hover:-translate-y-0.5 transition-smooth"
              >
                <div className="relative">
                  <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow flex-shrink-0">
                    <p.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  {i < pillars.length - 1 && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-12 h-[calc(100%+1rem)] w-px bg-gradient-to-b from-primary/40 to-transparent" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-display font-bold">{p.title}</h3>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{p.year}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-smooth self-center" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
