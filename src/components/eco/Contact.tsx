import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  MessageCircle,
  Recycle,
  Sprout,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import contactImg from "@/assets/contact-support.png";

export const Contact = () => {
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent successfully", {
        description: "We usually respond within 24 hours.",
      });
      (e.target as HTMLFormElement).reset();
    }, 800);
  };

  const contactCards = [
    { icon: Mail, label: "Email", value: "nknilandu@gmail.com" },
    { icon: Phone, label: "Phone", value: "+880 1700-900000" },
    { icon: MapPin, label: "Location", value: "Dhaka, Bangladesh" },
  ];

  return (
    <section
      id="contact"
      className="relative bg-gradient-to-b from-secondary/40 via-background to-secondary/30 py-24 md:py-32 overflow-hidden"
    >
      {/* Subtle dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="container relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4">
            Contact
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Get in <span className="text-gradient">Touch</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Have questions? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-5 lg:gap-16 items-center">
          {/* LEFT — Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-primary/10 via-white to-accent/10 shadow-elevated p-6 md:p-10 border border-white/60">
              {/* Inner glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none" />

              <img
                src={contactImg}
                alt="EcoWaste support team illustration"
                className="relative w-full h-auto"
                loading="lazy"
                width={1024}
                height={1024}
              />

              {/* Floating chat bubble */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-6 left-6 md:top-10 md:left-10 glass rounded-2xl px-3 py-2 shadow-elevated flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">
                  New message
                </span>
              </motion.div>

              {/* Floating recycle badge */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.4,
                }}
                className="absolute bottom-6 right-6 md:bottom-10 md:right-10 glass rounded-2xl px-3 py-2 shadow-elevated flex items-center gap-2"
              >
                <Recycle className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">
                  Eco-first
                </span>
              </motion.div>

              {/* Floating leaf */}
              <motion.div
                animate={{ y: [0, -6, 0], rotate: [0, 8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute top-1/2 right-4 md:right-8 h-10 w-10 rounded-full bg-gradient-primary shadow-glow flex items-center justify-center"
              >
                <Sprout className="h-5 w-5 text-primary-foreground" />
              </motion.div>
            </div>

            {/* Bottom cards */}
            <div className="grid sm:grid-cols-3 gap-2 mt-6">
              {contactCards.map((c) => (
                <motion.div
                  key={c.label}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex items-center gap-3 rounded-2xl bg-card border border-border/60 p-3.5 shadow-soft hover:shadow-glow hover:border-primary/40 transition-smooth"
                >
                  <div className="h-11 w-11 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 shadow-glow">
                    <c.icon className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                      {c.label}
                    </div>
                    <div className="text-sm font-semibold truncate text-foreground">
                      {c.value}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — Form */}
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl bg-card/95 backdrop-blur border border-border/60 shadow-elevated p-8 md:p-10 space-y-6"
          >
            <div>
              <span className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase mb-2">
                Contact
              </span>
              <h3 className="font-display font-bold text-2xl mb-2">
                Send us a message
              </h3>
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-primary" />
                We usually respond within 24 hours
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                  Your Name
                </label>
                <Input
                  required
                  placeholder="Jane Cooper"
                  className="h-12 rounded-xl border-border/60 focus-visible:ring-primary/40 focus-visible:border-primary transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                  Email Address
                </label>
                <Input
                  type="email"
                  required
                  placeholder="jane@city.gov"
                  className="h-12 rounded-xl border-border/60 focus-visible:ring-primary/40 focus-visible:border-primary transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                Subject
              </label>
              <Input
                required
                placeholder="How can we help?"
                className="h-12 rounded-xl border-border/60 focus-visible:ring-primary/40 focus-visible:border-primary transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                Your Message
              </label>
              <Textarea
                required
                rows={12}
                placeholder="Tell us about your project..."
                className="rounded-xl resize-none border-border/60 focus-visible:ring-primary/40 focus-visible:border-primary transition-all"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full py-3 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                "Sending..."
              ) : (
                <>
                  Send Message <Send className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};
