import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const FinalCTA = () => {
  return (
    <section className="container py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-gradient-primary p-10 md:p-16 lg:p-20 text-center shadow-elevated"
      >
        {/* Decorative pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 2px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Glow particles */}
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-accent-glow/40 blur-3xl" />

        {/* Floating circles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: 8 + (i % 3) * 4,
              height: 8 + (i % 3) * 4,
              top: `${15 + i * 12}%`,
              left: `${10 + i * 14}%`,
            }}
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}

        <div className="relative max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-display font-extrabold text-white leading-tight mb-6">
            Ready to Transform
            <br />
            Waste Management?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-xl mx-auto">
            Join thousands of citizens and collectors making cities cleaner with EcoWaste.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              size="xl"
              className="bg-white text-primary hover:bg-white/90 shadow-2xl hover:scale-[1.03]"
              asChild
            >
              <a href="#contact">
                Send Message <ArrowRight className="ml-1" />
              </a>
            </Button>
            <Button size="xl" variant="outlineLight" asChild>
              <a href="#vision">Future Vision</a>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-8 text-sm text-white/80">
            <ShieldCheck className="h-4 w-4" />
            <span>No credit card required · 14-day free trial · Cancel anytime</span>
          </div>
        </div>
      </motion.div>
    </section>
   
  );
};
