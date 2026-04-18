import { motion } from "framer-motion";
import { FileText, Activity, Send, CheckCircle2, Recycle } from "lucide-react";

const steps = [
  { icon: FileText, title: "Report Issues", desc: "Citizens report bin problems or submit complaints through the dashboard." },
  { icon: Activity, title: "Monitor Bins", desc: "IoT sensors track fill levels and auto-flag bins approaching capacity." },
  { icon: Send, title: "Dispatch Collectors", desc: "Admins assign optimal collection schedules to available collectors." },
  { icon: CheckCircle2, title: "Resolve & Track", desc: "Collectors complete pickups with full status tracking and transparency." },
  { icon: Recycle, title: "Recycling Plan", desc: "Collected waste is processed into recyclable materials and organic compost for future sustainability." },
];

export const HowItWorks = () => {
  return (
    <section id="how" className="container py-20 md:py-28">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4">
          Process
        </span>
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
          How It <span className="text-gradient">Works</span>
        </h2>
        <p className="text-lg text-muted-foreground">A simple five-step process to keep your city clean.</p>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Animated connecting line */}
        <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-border overflow-hidden">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="h-full bg-gradient-primary origin-left"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col items-center text-center"
            >
              <div className="relative mb-5">
                <div className="absolute -inset-2 bg-gradient-primary rounded-2xl blur-xl opacity-20 group-hover:opacity-50 transition-opacity duration-500" />
                <div className="relative h-20 w-20 rounded-2xl bg-card border border-border shadow-elevated flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                  <s.icon className="h-7 w-7 text-primary group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                  <div className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-gradient-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-glow">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
              </div>
              <h3 className="font-display font-bold text-base mb-1.5">{s.title}</h3>
              <p className="text-xs text-muted-foreground max-w-[200px] leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
