import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Trash2, Users, Bell, BarChart3 } from "lucide-react";

const stats = [
  { icon: Trash2, value: 1240, suffix: "+", label: "Smart Bins Deployed" },
  { icon: Users, value: 58000, suffix: "+", label: "Active Users" },
  { icon: Bell, value: 12500, suffix: "+", label: "Issues Resolved" },
  { icon: BarChart3, value: 340, suffix: "+", label: "Cities Onboarded" },
];

const Counter = ({ to, suffix }: { to: number; suffix: string }) => {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.floor(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {n.toLocaleString()}
      {suffix}
    </span>
  );
};

export const Stats = () => {
  return (
    <section className="relative -mt-20 z-30 container">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.08, duration: 0.6 }}
            className="group relative rounded-2xl bg-card p-6 md:p-7 shadow-elevated gradient-border hover:-translate-y-1 transition-smooth border border-border/60"
          >
            <div className="h-11 w-11 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 shadow-glow group-hover:scale-110 transition-smooth">
              <s.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="text-3xl md:text-4xl font-display font-bold text-foreground">
              <Counter to={s.value} suffix={s.suffix} />
            </div>
            <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
