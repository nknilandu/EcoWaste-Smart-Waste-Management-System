import { motion } from "framer-motion";
import { Activity, Bell, Shield, Recycle, TrendingDown } from "lucide-react";
import collector from "@/assets/about-collector.jpg";
import citizen from "@/assets/about-citizen.jpg";
import stakeholder from "@/assets/about-stakeholder.jpg";
import recycling from "@/assets/about-recycling.jpg";

const points = [
  { icon: Activity, text: "Real-time bin monitoring" },
  { icon: Bell, text: "Smart notifications & dispatch" },
  { icon: Shield, text: "Role-based access" },
  { icon: Recycle, text: "Future-ready recycling ecosystem" },
];

const tags = ["Live Monitoring", "Citizen Participation", "Smart Recycling"];

export const About = () => {
  return (
    <section id="about" className="container py-24 md:py-32">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4">
            About EcoWaste
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight mb-6">
            Revolutionizing Urban
            <br />
            <span className="text-gradient">Waste Management</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            EcoWaste is a comprehensive smart waste platform connecting cities, citizens, and collectors through one intelligent ecosystem. We blend IoT sensors, real-time analytics and automated scheduling to cut operational costs by up to 40%.
          </p>

          <ul className="space-y-3 mb-8">
            {points.map((p) => (
              <li
                key={p.text}
                className="flex items-center gap-3 group"
              >
                <span className="h-10 w-10 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors flex-shrink-0">
                  <p.icon className="h-5 w-5 text-primary" />
                </span>
                <span className="text-foreground/90 font-medium">{p.text}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground border border-border/60"
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* RIGHT — Bento collage */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="absolute -inset-6 bg-gradient-glow rounded-[2rem] blur-3xl opacity-70" />

          <div className="relative grid grid-cols-6 grid-rows-6 gap-3 sm:gap-4 h-[520px] sm:h-[580px]">
            {/* Large image — Collector */}
            <motion.div
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="col-span-4 row-span-4 rounded-3xl overflow-hidden shadow-elevated relative group"
            >
              <img
                src={collector}
                alt="Waste collector using EcoWaste platform"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                width={1024}
                height={1280}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-block text-[10px] font-bold tracking-widest text-white/90 uppercase">
                  Step 01 — Collect
                </span>
              </div>
            </motion.div>

            {/* Medium — Citizen */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="col-span-2 row-span-3 rounded-3xl overflow-hidden shadow-elevated relative group"
            >
              <img
                src={citizen}
                alt="Citizen using a smart bin"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                width={1024}
                height={1024}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="inline-block text-[10px] font-bold tracking-widest text-white/90 uppercase">
                  02 — Use
                </span>
              </div>
            </motion.div>

            {/* Medium — Stakeholder */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="col-span-2 row-span-3 rounded-3xl overflow-hidden shadow-elevated relative group"
            >
              <img
                src={stakeholder}
                alt="Stakeholder reviewing dashboard"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                width={1024}
                height={1024}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="inline-block text-[10px] font-bold tracking-widest text-white/90 uppercase">
                  03 — Satisfy
                </span>
              </div>
            </motion.div>

            {/* Small — Recycling */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="col-span-4 row-span-2 rounded-3xl overflow-hidden shadow-elevated relative group"
            >
              <img
                src={recycling}
                alt="Recycling and sorting process"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                width={1024}
                height={1024}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-foreground/50 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-widest text-white/90 uppercase">
                  04 — Recycle
                </span>
                <Recycle className="h-4 w-4 text-white/90" />
              </div>
            </motion.div>
          </div>

          {/* Highlight badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="absolute -bottom-6 -left-4 md:-bottom-8 md:-left-8 glass shadow-elevated rounded-2xl p-4 flex items-center gap-3 max-w-[220px] z-10"
          >
            <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
              <TrendingDown className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <div className="text-2xl font-display font-bold text-foreground">40%</div>
              <div className="text-xs text-muted-foreground leading-tight">Cost Reduction</div>
            </div>
          </motion.div>

          {/* Live monitoring chip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="absolute -top-4 -right-2 md:-top-6 md:-right-6 glass shadow-elevated rounded-2xl px-4 py-3 z-10"
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
              </span>
              <span className="text-xs font-semibold text-foreground">Live monitoring</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
