import { motion } from "framer-motion";
import { Cpu, BarChart3, Bell, MapPin, ShieldCheck, Route, Brain, Recycle } from "lucide-react";

const features = [
  { icon: Cpu, title: "IoT Smart Bins", desc: "Real-time fill-level monitoring with sensors and automatic alerts." },
  { icon: BarChart3, title: "Live Analytics", desc: "Data-driven insights for collection optimization and route planning." },
  { icon: Bell, title: "Instant Alerts", desc: "Push notifications when bins reach capacity or need attention." },
  { icon: MapPin, title: "Area Tracking", desc: "Area-wise bin management across cities, zones, and districts." },
  { icon: ShieldCheck, title: "Role Security", desc: "Strict role-based access for admins, collectors, and citizens." },
  { icon: Route, title: "Route Optimization", desc: "AI-powered routing slashes fuel costs and collection time." },
  { icon: Brain, title: "Waste Prediction", desc: "ML models forecast fill rates so you act before bins overflow." },
  { icon: Recycle, title: "Recycling Insights", desc: "Track recycling rates and material flows to hit sustainability goals." },
];

export const Features = () => {
  return (
    <section id="features" className="bg-secondary/40 py-24 md:py-32">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Everything You <span className="text-gradient">Need</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful tools for every stakeholder in the waste management chain.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (i % 4) * 0.08, duration: 0.5 }}
              className="group relative rounded-2xl bg-card p-6 border border-border/60 shadow-soft hover:shadow-glow hover:-translate-y-1 transition-smooth gradient-border"
            >
              <div className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center mb-4 group-hover:from-primary group-hover:to-accent transition-smooth">
                <f.icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-smooth" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
